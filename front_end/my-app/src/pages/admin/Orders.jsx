import React, { useEffect, useState } from "react";
import "../../styles/admin/Orders.css";
import { formatCurrency, orderService } from "../../services/api";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const STATUS_LABEL = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const STATUS_BADGE_CLASS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPING: "shipping",
  COMPLETED: "delivered",
  CANCELLED: "cancelled",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    orderService
      .getAllOrders()
      .then(setOrders)
      .catch(() => setError("Không thể tải danh sách đơn hàng."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const previousOrders = orders;
    setUpdatingId(orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, orderStatus: newStatus } : prev
    );
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setOrders(previousOrders);
      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? previousOrders.find((o) => o.id === orderId) || prev
          : prev
      );
      alert(
        err.response?.data?.message || "Cập nhật trạng thái đơn hàng thất bại!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      String(order.id).toLowerCase().includes(term) ||
      (order.fullName || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="admin-header-panel">
        <div className="admin-header-title">
          <h1>Quản Lý Đơn Hàng</h1>
          <p>
            Theo dõi tình trạng đơn hàng và giao dịch trên hệ thống ReBook
          </p>
        </div>
      </div>

      <div className="orders-summary-grid">
        <div className="summary-card">
          <h3>Tổng đơn hàng</h3>
          <span>{orders.length}</span>
        </div>

        <div className="summary-card">
          <h3>Đang giao</h3>
          <span>{orders.filter((o) => o.orderStatus === "SHIPPING").length}</span>
        </div>

        <div className="summary-card">
          <h3>Đã giao</h3>
          <span>{orders.filter((o) => o.orderStatus === "COMPLETED").length}</span>
        </div>
      </div>

      <div className="orders-card">
        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ padding: 16 }}>Đang tải đơn hàng...</p>
        ) : error ? (
          <p style={{ padding: 16, color: "#dc3545" }}>{error}</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Cập nhật trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.fullName}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        STATUS_BADGE_CLASS[order.orderStatus] || "pending"
                      }`}
                    >
                        {STATUS_LABEL[order.orderStatus] || order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus || "PENDING"}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-view-detail"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Thông tin đơn hàng
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-content order-detail-modal"
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "24px",
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-detail-header">
              <h2>Đơn hàng #{selectedOrder.id}</h2>
              <span
                className={`status-badge ${
                  STATUS_BADGE_CLASS[selectedOrder.orderStatus] || "pending"
                }`}
              >
                {STATUS_LABEL[selectedOrder.orderStatus] ||
                  selectedOrder.orderStatus}
              </span>
            </div>

            <div className="order-detail-section">
              <h4>Thông tin khách hàng</h4>
              <p>
                <strong>Họ tên:</strong> {selectedOrder.fullName}
              </p>
              <p>
                <strong>Điện thoại:</strong> {selectedOrder.phone}
              </p>
              {selectedOrder.email && (
                <p>
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
              )}
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.address},{" "}
                {selectedOrder.city}
              </p>
              {selectedOrder.note && (
                <p>
                  <strong>Ghi chú:</strong> {selectedOrder.note}
                </p>
              )}
            </div>

            <div className="order-detail-section">
              <h4>Thanh toán</h4>
              <p>
                <strong>Phương thức:</strong>{" "}
                {selectedOrder.paymentMethod === "vnpay"
                  ? "VNPay"
                  : "Thanh toán khi nhận hàng (COD)"}
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                {selectedOrder.paymentStatus === "PAID"
                  ? "Đã thanh toán"
                  : selectedOrder.paymentStatus === "FAILED"
                  ? "Thất bại"
                  : "Chưa thanh toán"}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                  : "-"}
              </p>
            </div>

            <div className="order-detail-section">
              <h4>Sản phẩm</h4>
              <table className="order-detail-items-table">
                <thead>
                  <tr>
                    <th>Sách</th>
                    <th>SL</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.book?.title || "Sách không xác định"}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="order-detail-total">
                <strong>Tổng cộng:</strong>{" "}
                {formatCurrency(selectedOrder.totalAmount)}
              </p>
            </div>

            <div className="order-detail-section">
              <h4>Cập nhật trạng thái</h4>
              <select
                value={selectedOrder.orderStatus || "PENDING"}
                disabled={updatingId === selectedOrder.id}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
