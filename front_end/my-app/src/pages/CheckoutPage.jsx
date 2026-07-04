import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, orderService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, refreshCart } = useCart();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: "",
    email: "",
    city: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await orderService.placeOrder(form);
      await refreshCart();
      if (result.payUrl) {
        window.location.href = result.payUrl;
        return;
      }
      navigate("/profile", { state: { orderMessage: result.message || "Đặt hàng thành công." } });
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Thanh toán</span>
          <h1>Thông tin nhận sách</h1>
        </div>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <section className="form-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Họ và tên</label>
              <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số điện thoại</label>
              <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tỉnh/Thành phố</label>
              <input className="form-control" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Địa chỉ chi tiết</label>
              <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Ghi chú</label>
              <textarea className="form-control" rows="3" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Phương thức thanh toán</label>
              <select className="form-select" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="vnpay">Thanh toán VNPAY</option>
              </select>
            </div>
          </div>
        </section>

        <aside className="summary-card">
          <h2>Đơn hàng</h2>
          <div><span>{items.length} sản phẩm</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Vận chuyển</span><strong>{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}</strong></div>
          <div className="summary-total"><span>Tổng thanh toán</span><strong>{formatCurrency(subtotal + shipping)}</strong></div>
          <button className="btn btn-primary w-100" disabled={submitting} type="submit">
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export { CheckoutPage };
export default CheckoutPage;
