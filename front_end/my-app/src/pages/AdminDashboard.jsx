import React, { useEffect, useMemo, useState } from "react";
import { bookService, formatCurrency, orderService } from "../services/api";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    Promise.allSettled([bookService.getAll(), bookService.getPending(), orderService.getMyOrders()]).then((results) => {
      if (results[0].status === "fulfilled") setBooks(results[0].value);
      if (results[1].status === "fulfilled") setPending(results[1].value);
      if (results[2].status === "fulfilled") setOrders(results[2].value);
    });
  }, []);

  const revenue = useMemo(
    () => orders.reduce((total, order) => total + Number(order.totalAmount || 0), 0),
    [orders],
  );

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Tổng quan Old Bookstore</h1>
        </div>
      </div>

      <section className="admin-stat-grid">
        <div><span>Sách đang bán</span><strong>{books.length}</strong></div>
        <div><span>Chờ duyệt</span><strong>{pending.length}</strong></div>
        <div><span>Đơn hàng đọc được</span><strong>{orders.length}</strong></div>
        <div><span>Doanh thu ghi nhận</span><strong>{formatCurrency(revenue)}</strong></div>
      </section>

      <section className="form-card mt-4">
        <h2>Gợi ý vận hành</h2>
        <p>Ưu tiên duyệt nhanh sách có ảnh bìa rõ, giá hợp lý và đủ thông tin tác giả, nhà xuất bản, năm xuất bản.</p>
      </section>
    </div>
  );
};

export { AdminDashboard };
export default AdminDashboard;
