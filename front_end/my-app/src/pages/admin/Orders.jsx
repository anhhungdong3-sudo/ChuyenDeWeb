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
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setOrders(previousOrders);
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
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Orders;
