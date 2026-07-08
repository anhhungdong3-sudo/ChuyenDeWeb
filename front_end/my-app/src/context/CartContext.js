import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const normalizeItems = (cart) => {
  if (!cart) return [];
  if (Array.isArray(cart)) return cart;
  if (cart.items && Array.isArray(cart.items)) return cart.items;
  if (cart.cartItems && Array.isArray(cart.cartItems)) return cart.cartItems;
  return [];
};

const extractServerErrorMessage = (error, fallbackMessage) => {
  const data = error?.response?.data;
  return data?.message || data?.error || fallbackMessage;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setSelectedIds([]);
      return null;
    }
    setCartLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
      return data;
    } catch (error) {
      console.error("Lỗi khi đồng bộ dữ liệu giỏ hàng:", error);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (bookId) => {
    try {
      const result = await cartService.addToCart(bookId);
      const updatedCart = result?.cart ? result.cart : result;
      setCart(updatedCart);
      return { success: true, message: result?.message || "Thêm thành công!" };
    } catch (error) {
      const serverError = extractServerErrorMessage(
        error,
        "Không thể thêm sản phẩm vào giỏ!",
      );
      return { success: false, message: serverError };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const result = await cartService.updateQuantity(cartItemId, quantity);
      const updatedCart = result?.cart ? result.cart : result;
      setCart(updatedCart);
      return { success: true };
    } catch (error) {
      const serverError = extractServerErrorMessage(
        error,
        "Không thể cập nhật số lượng!",
      );
      return { success: false, message: serverError };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const result = await cartService.removeFromCart(cartItemId);
      const updatedCart = result?.cart ? result.cart : result;
      setCart(updatedCart);
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== cartItemId));
      return {
        success: true,
        message: result?.message || "Đã xóa sản phẩm khỏi giỏ hàng!",
      };
    } catch (error) {
      const serverError = extractServerErrorMessage(
        error,
        "Không thể xóa sản phẩm!",
      );
      return { success: false, message: serverError };
    }
  };

  const clearCart = async () => {
    try {
      const result = await cartService.clearCart();
      const updatedCart = result?.cart ? result.cart : result;
      setCart(updatedCart);
      setSelectedIds([]);
      return {
        success: true,
        message: result?.message || "Đã xóa sạch giỏ hàng!",
      };
    } catch (error) {
      const serverError = extractServerErrorMessage(
        error,
        "Không thể xóa sạch giỏ hàng!",
      );
      return { success: false, message: serverError };
    }
  };

  // Trích xuất danh sách items an toàn
  const items = useMemo(() => normalizeItems(cart), [cart]);

  // SỬA LỖI TẠI ĐÂY: Sử dụng chuỗi JSON của các ID để so sánh, tránh re-render lặp vô hạn
  const itemIdsString = useMemo(() => {
    return JSON.stringify(items.map((item) => item.id));
  }, [items]);

  useEffect(() => {
    const validIds = items.map((item) => item.id);
    setSelectedIds((prevIds) => {
      const filtered = prevIds.filter((id) => validIds.includes(id));
      // Chỉ cập nhật state nếu số lượng ID thực sự thay đổi (có hàng rác bị xóa)
      if (filtered.length !== prevIds.length) {
        return filtered;
      }
      return prevIds;
    });
  }, [itemIdsString]); // Chỉ chạy khi danh sách ID thực sự bị thay đổi từ server

  const toggleSelectItem = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((itemId) => itemId !== id)
        : [...prevIds, id],
    );
  };

  const toggleSelectAll = () => {
    if (items && selectedIds.length === items.length) {
      setSelectedIds([]);
    } else if (items) {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const removeMultipleFromCart = async (idsToRemove) => {
    const targetIds =
      Array.isArray(idsToRemove) && idsToRemove.length > 0
        ? idsToRemove
        : selectedIds;
    if (!targetIds || targetIds.length === 0) {
      return { success: false, message: "Bạn chưa chọn mục nào để xóa!" };
    }
    setCartLoading(true);
    try {
      const result = await cartService.removeMultiple(targetIds);
      const updatedCart = result?.cart ? result.cart : result;
      setCart(updatedCart);
      setSelectedIds([]);
      return {
        success: true,
        message: result?.message || "Đã xóa các mục đã chọn!",
      };
    } catch (error) {
      const serverError = extractServerErrorMessage(
        error,
        "Không thể xóa các mục đã chọn!",
      );
      return { success: false, message: serverError };
    } finally {
      setCartLoading(false);
    }
  };

  const count = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.quantity || 1), 0);
  }, [items]);

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const book = item.book || item.product || item;
      return total + Number(book.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [selectedItems]);

  const value = useMemo(
    () => ({
      cart,
      items,
      selectedIds,
      selectedItems,
      count,
      subtotal,
      cartLoading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleSelectItem,
      toggleSelectAll,
      removeMultipleFromCart,
    }),
    [
      cart,
      items,
      selectedIds,
      selectedItems,
      count,
      subtotal,
      cartLoading,
      refreshCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart phải được đặt trong cấu trúc thẻ bao bọc của CartProvider",
    );
  }
  return context;
};
