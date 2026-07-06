import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency, orderService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Tài khoản</span>
          <h1>{user?.fullName || user?.username}</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/sell">Đăng bán sách</Link>
      </div>

      {location.state?.orderMessage && <div className="alert alert-success">{location.state.orderMessage}</div>}

      <section className="profile-grid">
        <div className="form-card">
          <h2>Thông tin cá nhân</h2>
          <p><strong>Tên đăng nhập:</strong> {user?.username}</p>
          <p><strong>Vai trò:</strong> {user?.role}</p>
          <p><strong>Mã người dùng:</strong> #{user?.id}</p>
        </div>
        <div className="form-card">
          <h2>Lịch sử đơn hàng</h2>
          {loading ? (
            <p>Đang tải đơn hàng...</p>
          ) : orders.length === 0 ? (
            <p>Bạn chưa có đơn hàng nào.</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article key={order.id} className="order-row">
                  <span>Đơn #{order.id}</span>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                  <small className={`order-status-badge order-status-${(order.orderStatus || "PENDING").toLowerCase()}`}>
                    {order.statusLabel}
                  </small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { Profile };
export default Profile;
