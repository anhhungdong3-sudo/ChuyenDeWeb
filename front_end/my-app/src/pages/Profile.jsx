import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency, orderService } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Ánh xạ trạng thái ĐƠN HÀNG sang nhãn tiếng Việt + class CSS badge tương ứng
// (Backend chỉ trả về orderStatus dạng mã, không có statusLabel -> map ở Frontend)
const ORDER_STATUS_META = {
  PENDING: { label: "Chờ xác nhận", css: "order-status-pending" },
  PROCESSING: { label: "Đang xử lý", css: "order-status-processing" },
  SHIPPING: { label: "Đang giao hàng", css: "order-status-shipping" },
  COMPLETED: { label: "Đã hoàn thành", css: "order-status-completed" },
  CANCELLED: { label: "Đã hủy", css: "order-status-cancelled" },
};

// Ánh xạ trạng thái THANH TOÁN sang nhãn tiếng Việt + class CSS badge riêng
const PAYMENT_STATUS_META = {
  PENDING: { label: "Chưa thanh toán", css: "payment-status-pending" },
  PAID: { label: "Đã thanh toán", css: "payment-status-paid" },
  FAILED: { label: "Thanh toán thất bại", css: "payment-status-failed" },
};

const getOrderStatusMeta = (status) =>
  ORDER_STATUS_META[(status || "PENDING").toUpperCase()] ||
  ORDER_STATUS_META.PENDING;

const getPaymentStatusMeta = (status) =>
  PAYMENT_STATUS_META[(status || "PENDING").toUpperCase()] ||
  PAYMENT_STATUS_META.PENDING;

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

// Lấy chữ cái đầu của tên hiển thị để hiển thị lên Avatar
const getInitial = (name) => (name?.trim()?.charAt(0) || "?").toUpperCase();

const Profile = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError(false);
    orderService
      .getMyOrders()
      .then((data) => {
        if (mounted) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) {
          setOrders([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Thống kê nhanh: tổng số đơn & tổng chi tiêu (chỉ tính đơn đã thanh toán để tránh sai lệch)
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter((o) => (o.paymentStatus || "").toUpperCase() === "PAID")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { totalOrders, totalSpent };
  }, [orders]);

  return (
    <div className="container page-section profile-page">
      {location.state?.orderMessage && (
        <div className="alert alert-success profile-order-toast" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {location.state.orderMessage}
        </div>
      )}

      {/* ===== HEADER: Avatar + thông tin nhanh + hành động ===== */}
      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar">
            {getInitial(user?.fullName || user?.username)}
          </div>
          <div>
            <span className="eyebrow">Tài khoản của tôi</span>
            <h1 className="profile-name">{user?.fullName || user?.username}</h1>
            <span className="profile-username">@{user?.username}</span>
          </div>
        </div>
        <Link
          className="btn btn-primary rounded-pill px-4 fw-semibold"
          to="/sell"
        >
          <i className="bi bi-plus-circle me-2"></i>Đăng bán sách
        </Link>
      </div>

      {/* ===== THẺ THỐNG KÊ NHANH ===== */}
      <div className="profile-stat-row">
        <div className="profile-stat-card">
          <span className="profile-stat-label">Tổng số đơn hàng</span>
          <strong className="profile-stat-value">{stats.totalOrders}</strong>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-label">
            Tổng chi tiêu (đã thanh toán)
          </span>
          <strong className="profile-stat-value">
            {formatCurrency(stats.totalSpent)}
          </strong>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-label">Vai trò tài khoản</span>
          <strong className="profile-stat-value profile-role-badge">
            {user?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
          </strong>
        </div>
      </div>

      <section className="profile-grid">
        {/* ===== CỘT TRÁI: THÔNG TIN CÁ NHÂN ===== */}
        <div className="form-card profile-info-card">
          <h2>Thông tin cá nhân</h2>
          <div className="profile-info-row">
            <span className="profile-info-label">Tên đăng nhập</span>
            <span className="profile-info-value">{user?.username}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Họ và tên</span>
            <span className="profile-info-value">
              {user?.fullName || "Chưa cập nhật"}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Mã người dùng</span>
            <span className="profile-info-value">#{user?.id}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Vai trò</span>
            <span className="profile-info-value">{user?.role}</span>
          </div>
        </div>

        {/* ===== CỘT PHẢI: LỊCH SỬ ĐƠN HÀNG ===== */}
        <div className="form-card profile-orders-card">
          <h2>Lịch sử đơn hàng</h2>

          {loading ? (
            <div className="profile-orders-loading">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Đang tải đơn hàng...
            </div>
          ) : loadError ? (
            <p className="text-danger small">
              Không thể tải lịch sử đơn hàng lúc này. Vui lòng thử lại sau.
            </p>
          ) : orders.length === 0 ? (
            <div className="profile-orders-empty">
              <i className="bi bi-bag-x fs-1 text-secondary mb-2 d-block"></i>
              <p className="mb-3">Bạn chưa có đơn hàng nào.</p>
              <Link
                className="btn btn-outline-primary rounded-pill px-4"
                to="/books"
              >
                Khám phá sách cũ ngay
              </Link>
            </div>
          ) : (
            <div className="order-card-list">
              {orders.map((order) => {
                const orderMeta = getOrderStatusMeta(order.orderStatus);
                const paymentMeta = getPaymentStatusMeta(order.paymentStatus);
                const itemsPreview = (order.items || []).slice(0, 4);
                const extraCount =
                  (order.items || []).length - itemsPreview.length;

                return (
                  <article key={order.id} className="order-card">
                    <div className="order-card-top">
                      <div>
                        <span className="order-card-id">
                          Đơn hàng #{order.id}
                        </span>
                        <span className="order-card-date">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="order-card-badges">
                        <small
                          className={`order-status-badge ${orderMeta.css}`}
                        >
                          {orderMeta.label}
                        </small>
                        <small
                          className={`payment-status-badge ${paymentMeta.css}`}
                        >
                          {paymentMeta.label}
                        </small>
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-card-thumbs">
                        {itemsPreview.map((item) => (
                          <img
                            key={item.id}
                            src={
                              item.book?.imageUrl ||
                              "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&auto=format&fit=crop&q=60"
                            }
                            alt={item.book?.title || "Sách"}
                            title={item.book?.title}
                            className="order-card-thumb"
                          />
                        ))}
                        {extraCount > 0 && (
                          <span className="order-card-thumb-more">
                            +{extraCount}
                          </span>
                        )}
                      </div>
                      <div className="order-card-summary">
                        <span className="order-card-item-count">
                          {(order.items || []).length} sản phẩm
                        </span>
                        <strong className="order-card-total">
                          {formatCurrency(order.totalAmount)}
                        </strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { Profile };
export default Profile;
