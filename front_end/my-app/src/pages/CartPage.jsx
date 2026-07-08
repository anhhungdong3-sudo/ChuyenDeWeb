import React, { useState, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../services/api";
import { useCart } from "../context/CartContext";

// ================== HỆ THỐNG TOAST THÔNG BÁO ==================
// Toast tự xây dựng bằng React state, không phụ thuộc thư viện ngoài.
// Mục đích: đảm bảo MỌI hành động (xóa, cập nhật số lượng...) đều có phản hồi trực quan.
let toastIdCounter = 0;

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div
      className="position-fixed d-flex flex-column gap-2"
      style={{ top: "20px", right: "20px", zIndex: 2000, maxWidth: "360px" }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`d-flex align-items-start gap-2 p-3 rounded-3 shadow-lg text-white ${
            toast.type === "error" ? "bg-danger" : "bg-success"
          }`}
          style={{
            animation: "cart-toast-in 0.25s ease-out",
          }}
          role="alert"
        >
          <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>
            {toast.type === "error" ? "⚠️" : "✅"}
          </span>
          <div className="flex-grow-1 small fw-semibold">{toast.message}</div>
          <button
            type="button"
            className="btn-close btn-close-white"
            style={{ fontSize: "0.7rem" }}
            onClick={() => onDismiss(toast.id)}
            aria-label="Đóng thông báo"
          />
        </div>
      ))}
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    removeMultipleFromCart,
  } = useCart();

  // Trạng thái lưu trữ danh sách các id của CartItem đang được người dùng tích chọn
  const [selectedIds, setSelectedIds] = useState([]);

  // Khóa (disable) đúng nút bấm của dòng đó khi đang gọi API, tránh click spam liên tục
  const [processingItemId, setProcessingItemId] = useState(null);

  // Trạng thái xử lý cho các hành động toàn giỏ hàng (Clear all / Xóa hàng loạt)
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Danh sách các Toast đang hiển thị trên màn hình
  const [toasts, setToasts] = useState([]);
  const dismissTimers = useRef({});

  // Hiển thị 1 Toast mới và tự động ẩn sau 3 giây
  const showToast = useCallback((type, message) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    dismissTimers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete dismissTimers.current[id];
    }, 3000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (dismissTimers.current[id]) {
      clearTimeout(dismissTimers.current[id]);
      delete dismissTimers.current[id];
    }
  }, []);

  // Kiểm tra xem tất cả các mục sách hiện tại đã được lựa chọn hay chưa
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  // Xử lý sự kiện nhấn nút chọn hoặc bỏ chọn toàn bộ sản phẩm
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  // Xử lý việc bật/tắt tích chọn của riêng biệt từng dòng hàng hóa
  const handleSelectRow = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  // Làm trống toàn bộ sản phẩm bên trong giỏ hàng hiện tại
  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng không?",
      )
    ) {
      return;
    }
    setBulkProcessing(true);
    try {
      const result = await clearCart();
      if (result && result.success) {
        setSelectedIds([]);
        showToast("success", result.message || "Đã xóa sạch giỏ hàng!");
      } else {
        showToast("error", result?.message || "Lỗi khi dọn dẹp giỏ hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi làm trống giỏ hàng:", error);
      showToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Giảm số lượng mục hàng, nếu số lượng đang bằng 1 mà giảm tiếp thì tiến hành xóa
  const handleDecreaseQuantity = async (itemId, currentQuantity) => {
    setProcessingItemId(itemId);
    try {
      if (currentQuantity === 1) {
        const result = await removeFromCart(itemId);
        if (result && result.success) {
          setSelectedIds((prevSelected) =>
            prevSelected.filter((id) => id !== itemId),
          );
          showToast(
            "success",
            result.message || "Đã xóa sản phẩm khỏi giỏ hàng!",
          );
        } else {
          showToast("error", result?.message || "Không thể xóa sản phẩm.");
        }
      } else {
        const result = await updateQuantity(itemId, currentQuantity - 1);
        if (result && !result.success) {
          showToast("error", result.message);
        }
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện giảm số lượng sản phẩm:", error);
      showToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setProcessingItemId(null);
    }
  };

  // Tăng số lượng mục hàng lên thêm 1 đơn vị
  const handleIncreaseQuantity = async (itemId, currentQuantity) => {
    setProcessingItemId(itemId);
    try {
      const result = await updateQuantity(itemId, currentQuantity + 1);
      if (result && !result.success) {
        showToast("error", result.message);
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện tăng số lượng sản phẩm:", error);
      showToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setProcessingItemId(null);
    }
  };

  // Xóa một sản phẩm đơn lẻ bằng nút Thùng rác
  const handleRemoveSingle = async (itemId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    if (processingItemId === itemId) {
      return;
    }

    setProcessingItemId(itemId);
    try {
      const result = await removeFromCart(itemId);
      if (result && result.success) {
        setSelectedIds((prevSelected) =>
          prevSelected.filter((id) => id !== itemId),
        );
        showToast(
          "success",
          result.message || "Đã xóa sản phẩm khỏi giỏ hàng!",
        );
      } else {
        showToast("error", result?.message || "Không thể xóa sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa một sản phẩm:", error);
      showToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setProcessingItemId(null);
    }
  };

  // Xóa đồng loạt toàn bộ các mục đang được người dùng tích chọn
  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
      )
    ) {
      return;
    }

    setBulkProcessing(true);
    try {
      let result;
      if (typeof removeMultipleFromCart === "function") {
        result = await removeMultipleFromCart(selectedIds);
      } else {
        const promises = selectedIds.map((id) => removeFromCart(id));
        await Promise.all(promises);
        result = { success: true };
      }

      if (result && result.success) {
        setSelectedIds([]);
        showToast("success", result.message || "Đã xóa các mục đã chọn!");
      } else {
        showToast(
          "error",
          result?.message || "Có lỗi xảy ra trong quá trình xóa hàng loạt.",
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa hàng loạt các mục chọn:", error);
      showToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Sử dụng useMemo tính toán tài chính dựa trên mảng chọn lọc sản phẩm
  const { subtotal, total, shipping } = useMemo(() => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));

    const sub = selectedItems.reduce((acc, item) => {
      const book = item.book || item.product || item;
      const qty = Number(item.quantity || 1);
      return acc + Number(book.price || 0) * qty;
    }, 0);

    const ship = sub >= 300000 || sub === 0 ? 0 : 30000;

    return {
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
    };
  }, [items, selectedIds]);

  // Điều hướng sang màn hình thanh toán hóa đơn cùng mảng ID được chọn
  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      showToast(
        "error",
        "Vui lòng tích chọn ít nhất một mặt hàng để tiếp tục quy trình thanh toán!",
      );
      return;
    }
    navigate("/checkout", { state: { selectedCartItemIds: selectedIds } });
  };

  // ================== GIAO DIỆN: STYLE HIỆU ỨNG DÙNG CHUNG ==================
  const cartPageStyles = (
    <style>{`
      @keyframes cart-toast-in {
        from { opacity: 0; transform: translateX(24px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes cart-skeleton-pulse {
        0% { opacity: 0.55; }
        50% { opacity: 1; }
        100% { opacity: 0.55; }
      }
      .cart-row-card {
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      }
      .cart-row-card:hover {
        box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.08) !important;
      }
      .cart-icon-btn {
        transition: background-color 0.15s ease, transform 0.15s ease, color 0.15s ease;
      }
      .cart-icon-btn:hover:not(:disabled) {
        transform: scale(1.05);
      }
      .cart-icon-btn:active:not(:disabled) {
        transform: scale(0.95);
      }
      .cart-qty-btn:hover:not(:disabled) {
        background-color: #e9ecef !important;
      }
      .cart-checkout-btn {
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      }
      .cart-checkout-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.05);
        box-shadow: 0 0.6rem 1.2rem rgba(24, 110, 240, 0.25);
      }
      .cart-skeleton-block {
        background: linear-gradient(90deg, #eceff1, #f5f6f7, #eceff1);
        border-radius: 0.75rem;
        animation: cart-skeleton-pulse 1.4s ease-in-out infinite;
      }
      .delete-bin-btn {
        color: #dc3545;
        background: none;
        border: none;
        padding: 8px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, color 0.2s;
      }
      .delete-bin-btn:hover:not(:disabled) {
        background-color: #fff5f5;
        color: #bd2130;
      }
    `}</style>
  );

  // ================== TRẠNG THÁI LOADING (SKELETON) ==================
  if (cartLoading) {
    return (
      <div
        className="container py-5"
        style={{ backgroundColor: "#f8f9fa", minHeight: "80.5vh" }}
      >
        {cartPageStyles}
        <div
          className="cart-skeleton-block mb-4"
          style={{ height: "36px", width: "260px" }}
        />
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="cart-skeleton-block d-flex"
                  style={{ height: "130px" }}
                />
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="cart-skeleton-block" style={{ height: "320px" }} />
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái màn hình hiển thị khi giỏ hàng trống hoàn toàn không có dữ liệu
  if (items.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        {cartPageStyles}
        <div
          className="p-5 rounded-4 bg-white border shadow-sm mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="display-1 text-muted mb-4">🛒</div>
          <h2 className="fw-bold text-dark mb-2">Giỏ hàng trống</h2>
          <p className="text-muted mb-4">
            Có vẻ như bạn chưa chọn được cuốn sách cũ nào ưng ý. Hãy ghé qua kho
            sách của chúng tôi nhé!
          </p>
          <Link
            className="btn btn-primary btn-lg rounded-pill px-4 fw-semibold"
            to="/books"
          >
            Khám phá kho sách ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "80.5vh" }}
    >
      {cartPageStyles}

      {/* Khu vực hiển thị toàn bộ Toast thông báo, luôn nổi trên cùng góc phải */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Tiêu đề trang chính */}
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Giỏ hàng
              </li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-dark m-0 d-flex align-items-center gap-2">
            Giỏ hàng của bạn
            <span className="badge bg-secondary rounded-pill fs-6 fw-normal">
              {items.length} mặt hàng
            </span>
          </h1>
        </div>
      </div>

      <div className="row g-4">
        {/* CỘT BÊN TRÁI: DANH SÁCH SẢN PHẨM & THANH HÀNH ĐỘNG HÀNG LOẠT */}
        <div className="col-lg-8">
          {/* Thanh công cụ chọn tất cả & Xóa các mục đã tích chọn */}
          <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm border mb-3">
            <div className="form-check d-flex align-items-center mb-0">
              <input
                type="checkbox"
                className="form-check-input border-secondary"
                id="selectAll"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  cursor: "pointer",
                }}
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
              <label
                className="form-check-label ms-2 fw-semibold text-dark mb-0"
                htmlFor="selectAll"
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Chọn tất cả các cuốn sách ({items.length})
              </label>
            </div>
            <div>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold cart-icon-btn"
                  onClick={handleRemoveSelected}
                  disabled={bulkProcessing}
                >
                  {bulkProcessing ? (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                    />
                  ) : (
                    "🗑️ "
                  )}
                  Xóa mục đã chọn ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Danh sách các sản phẩm chi tiết */}
          <div className="d-flex flex-column gap-3">
            {items.map((item) => {
              const book = item.book || item.product || item;
              const quantity = Number(item.quantity || 1);
              const isSelected = selectedIds.includes(item.id);
              const maxStock =
                book.quantity !== undefined && book.quantity !== null
                  ? Number(book.quantity)
                  : Infinity;
              const isRowProcessing = processingItemId === item.id;

              return (
                <article
                  className={`cart-row-card rounded-4 border bg-white p-3 shadow-sm ${
                    isSelected
                      ? "border-primary bg-primary-subtle bg-opacity-10"
                      : "border-light"
                  }`}
                  key={item.id}
                  style={{
                    opacity: isRowProcessing ? 0.65 : 1,
                  }}
                >
                  {/* Sử dụng cấu trúc Grid phân chia tỷ lệ đều nhau, cân đối theo chiều ngang */}
                  <div className="row align-items-center g-3">
                    {/* Cột 1: Checkbox & Hình ảnh bìa sách */}
                    <div className="col-12 col-sm-6 d-flex align-items-center">
                      <div className="me-3">
                        <input
                          type="checkbox"
                          className="form-check-input border-secondary"
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            cursor: "pointer",
                          }}
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          disabled={isRowProcessing}
                        />
                      </div>
                      <div className="me-3 flex-shrink-0">
                        <img
                          src={
                            book.imageUrl ||
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=70"
                          }
                          alt={book.title}
                          className="rounded-3 border object-fit-cover shadow-sm"
                          style={{ width: "70px", height: "95px" }}
                        />
                      </div>
                      {/* Tiêu đề và tác giả */}
                      <div className="min-w-0">
                        <Link
                          to={`/books/${book.id}`}
                          className="text-decoration-none text-dark fw-bold h6 d-block text-truncate mb-1"
                        >
                          {book.title}
                        </Link>
                        <div className="text-muted small text-truncate mb-1">
                          Tác giả:{" "}
                          <strong className="text-secondary">
                            {book.author || "Chưa rõ"}
                          </strong>
                        </div>
                        <span
                          className="badge bg-light text-dark border rounded-pill px-2 py-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Độ mới:{" "}
                          {book.conditionLabel || book.bookCondition || "Tốt"}
                        </span>
                      </div>
                    </div>

                    {/* Cột 2: Đơn giá sản phẩm */}
                    <div className="col-4 col-sm-2 text-sm-center">
                      <div className="text-primary fw-bold">
                        {formatCurrency(book.price)}
                      </div>
                      {Number.isFinite(maxStock) && (
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Kho: {maxStock}
                        </div>
                      )}
                    </div>

                    {/* Cột 3: Bộ điều khiển tăng giảm số lượng số */}
                    <div className="col-5 col-sm-3 d-flex justify-content-center">
                      <div className="d-flex align-items-center border border-secondary border-opacity-20 rounded-pill bg-white p-1 shadow-sm">
                        <button
                          type="button"
                          className="btn btn-sm btn-light cart-qty-btn rounded-circle fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() =>
                            handleDecreaseQuantity(item.id, quantity)
                          }
                          disabled={isRowProcessing || quantity <= 1}
                        >
                          -
                        </button>
                        <span
                          className="px-2 fw-bold text-center text-dark"
                          style={{ minWidth: "35px", fontSize: "0.95rem" }}
                        >
                          {isRowProcessing ? (
                            <span
                              className="spinner-border spinner-border-sm text-secondary"
                              role="status"
                            />
                          ) : (
                            quantity
                          )}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-light cart-qty-btn rounded-circle fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() =>
                            handleIncreaseQuantity(item.id, quantity)
                          }
                          disabled={isRowProcessing || quantity >= maxStock}
                          title={
                            quantity >= maxStock
                              ? "Đã đạt giới hạn tồn kho"
                              : undefined
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* FIX VỊ TRÍ NÚT: Chuyển nút Xóa toàn bộ giỏ hàng xuống dưới cùng danh sách sản phẩm */}
          <div className="d-flex justify-content-start mt-3">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm rounded-pill px-4 py-2 fw-semibold cart-icon-btn"
              onClick={handleClearAll}
              disabled={bulkProcessing}
            >
              {bulkProcessing && (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                />
              )}
              🗑️ Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>

        {/* CỘT BÊN PHẢI: HÓA ĐƠN TÓM TẮT & TIẾN HÀNH MUA HÀNG */}
        <div className="col-lg-4">
          <aside
            className="bg-white p-4 rounded-4 shadow-sm border sticky-top"
            style={{ top: "30px" }}
          >
            <h3 className="h5 fw-bold text-dark mb-3 pb-2 border-bottom">
              Tóm tắt đơn hàng
            </h3>
            <div className="d-flex justify-content-between mb-3 text-secondary small">
              <span>Đang chọn mua:</span>
              <strong className="text-dark fs-6">
                {selectedIds.length} mặt hàng
              </strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tạm tính:</span>
              <strong className="text-dark">{formatCurrency(subtotal)}</strong>
            </div>

            {/* Đổi thành Phí vận chuyển dự tính vì chưa có địa chỉ cụ thể */}
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Phí vận chuyển dự tính:</span>
              <strong
                className={
                  subtotal >= 300000 && selectedIds.length > 0
                    ? "text-success"
                    : "text-dark"
                }
              >
                {selectedIds.length === 0
                  ? formatCurrency(0)
                  : subtotal >= 300000
                    ? "Miễn phí"
                    : formatCurrency(30000)}
              </strong>
            </div>

            {/* Bổ sung điều kiện subtotal > 0 để tránh hiển thị sai khi chưa chọn sản phẩm */}
            {subtotal > 0 && subtotal < 300000 && (
              <div className="alert alert-warning py-2 px-3 rounded-3 small mb-3 text-start">
                💡 Mua thêm <strong>{formatCurrency(300000 - subtotal)}</strong>{" "}
                để được hưởng chính sách <strong>Miễn phí vận chuyển</strong>.
              </div>
            )}
            <hr className="my-3" />

            {/* Khung hiển thị tổng tiền hóa đơn dự tính */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3"
              style={{
                background: "linear-gradient(135deg, #f0f7ff 0%, #e1f0ff 100%)",
                border: "1px solid #b8dbff",
              }}
            >
              <span className="fw-bold text-dark h6 mb-0">
                Tổng tiền dự tính
              </span>
              <strong className="text-primary h3 mb-0 fw-bolder">
                {formatCurrency(
                  selectedIds.length === 0
                    ? 0
                    : subtotal >= 300000
                      ? subtotal
                      : subtotal + 30000,
                )}
              </strong>
            </div>

            <button
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm text-uppercase fs-6 cart-checkout-btn"
              type="button"
              onClick={handleCheckout}
              disabled={selectedIds.length === 0}
              style={{ letterSpacing: "0.5px" }}
            >
              Tiến hành mua hàng ({selectedIds.length})
            </button>
            <div className="text-center mt-3">
              <Link
                to="/books"
                className="text-decoration-none small fw-semibold text-primary"
              >
                ← Tiếp tục tìm kiếm sách cũ khác
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
