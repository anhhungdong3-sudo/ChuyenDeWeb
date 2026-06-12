import React, { useState } from "react";
import "../../styles/admin/Orders.css";

function Orders() {
  const [searchTerm, setSearchTerm] = useState("");

  const orders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      total: 250000,
      date: "12/06/2026",
      status: "Đã giao",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      total: 180000,
      date: "11/06/2026",
      status: "Đang giao",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      total: 320000,
      date: "10/06/2026",
      status: "Đã hủy",
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Summary Cards */}
      <div className="orders-summary-grid">

        <div className="summary-card">
          <h3>Tổng đơn hàng</h3>
          <span>{orders.length}</span>
        </div>

        <div className="summary-card">
          <h3>Đang giao</h3>
          <span>
            {orders.filter(
              (o) => o.status === "Đang giao"
            ).length}
          </span>
        </div>

        <div className="summary-card">
          <h3>Đã giao</h3>
          <span>
            {orders.filter(
              (o) => o.status === "Đã giao"
            ).length}
          </span>
        </div>

      </div>

      {/* Orders Table */}

      <div className="orders-card">

        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc khách hàng..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <table className="orders-table">

          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>
                  {order.total.toLocaleString()}đ
                </td>

                <td>{order.date}</td>

                <td>
                  <span
                    className={`status-badge ${
                      order.status === "Đã giao"
                        ? "delivered"
                        : order.status === "Đang giao"
                        ? "shipping"
                        : "cancelled"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <button className="btn-action view">
                    <i className="fas fa-eye"></i>
                  </button>

                  <button className="btn-action edit">
                    <i className="fas fa-edit"></i>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Orders;