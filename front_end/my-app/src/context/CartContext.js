import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const normalizeItems = (cart) => cart?.items || cart?.cartItems || [];

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return null;
    }
    setCartLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
      return data;
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (bookId) => {
    const result = await cartService.addToCart(bookId);
    setCart(result.cart || result);
    return result;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const updated = await cartService.updateQuantity(cartItemId, quantity);
    setCart(updated);
    return updated;
  };

  const removeFromCart = async (cartItemId) => {
    const result = await cartService.removeFromCart(cartItemId);
    setCart(result.cart || result);
    return result;
  };

  const items = normalizeItems(cart);
  const count = items.reduce((total, item) => total + Number(item.quantity || 1), 0);
  const subtotal = items.reduce((total, item) => {
    const book = item.book || item.product || item;
    return total + Number(book.price || 0) * Number(item.quantity || 1);
  }, 0);

  const value = useMemo(
    () => ({
      cart,
      items,
      count,
      subtotal,
      cartLoading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [cart, items, count, subtotal, cartLoading, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
