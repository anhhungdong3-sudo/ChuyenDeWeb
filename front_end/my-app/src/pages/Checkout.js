import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Checkout.css"; // Đảm bảo tạo và import đúng file CSS bên dưới

export const Checkout = () => {
  // Mock dữ liệu các sản phẩm được chọn mua từ giỏ hàng để hiển thị tóm tắt
  const checkoutItems = [
    {
      id: 1,
      title: "Áo khoác Varsity Jacket Vintage",
      price: 249000,
      size: "L",
      condition: "Mới 95%",
      img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
      seller: "Đồng Trần",
    },
    {
      id: 2,
      title: "Quần Jean Baggy Retro Levi's",
      price: 189000,
      size: "M",
      condition: "Mới 90%",
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
      seller: "Minh Thư",
    },
  ];

  // State quản lý thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Hồ Chí Minh",
    address: "",
    note: "",
  });

  // State quản lý phương thức thanh toán được chọn (Mặc định là COD)
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Tính toán số tiền
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);
  const shippingFee = subtotal > 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const orderData = {
      customer: shippingInfo,
      items: checkoutItems,
      payment: paymentMethod,
      totalAmount: total,
    };

    console.log("Dữ liệu đơn hàng chuẩn bị gửi lên hệ thống API:", orderData);

    if (paymentMethod === "qr") {
      alert(
        `Đơn hàng đã được ghi nhận thành công!\nSố tiền: ${total.toLocaleString()}đ\nHệ thống đang hiển thị mã QR chuyển khoản của ngân hàng...`,
      );
    } else {
      alert(
        "Chúc mừng! Đơn hàng của bạn đã được đặt thành công thành công trên ReWear.",
      );
    }
  };

  return (
    <div className="checkout-page-container">
      {/* Thanh breadcrumb nhỏ hướng dẫn luồng */}
      <div className="checkout-breadcrumb">
        <Link to="/cart">Giỏ hàng</Link> &gt; <span>Thanh toán đơn hàng</span>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        {/* ================= KHỐI BÊN TRÁI: THÔNG TIN & PHƯƠNG THỨC ================= */}
        <div className="checkout-left-form">
          {/* Section 1: Thông tin giao hàng */}
          <div className="checkout-section-card">
            <h3>
              <i className="fas fa-map-marker-alt"></i> Thông tin nhận hàng
            </h3>
            <div className="checkout-form-grid">
              <div className="checkout-group full-width">
                <label>Họ và tên người nhận *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ví dụ: Trần Văn Đồng"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ví dụ: 0987xxxxxx"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-group">
                <label>Địa chỉ Email (Nhận hóa đơn)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="dongtran@example.com"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-group full-width">
                <label>Tỉnh / Thành phố *</label>
                <select
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                >
                  <option value="Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>

              <div className="checkout-group full-width">
                <label>Địa chỉ số nhà, tên đường, phường/xã *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Ví dụ: 25 Đường số 4, Linh Trung, Thủ Đức"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-group full-width">
                <label>Ghi chú đơn hàng (Không bắt buộc)</label>
                <textarea
                  name="note"
                  rows="3"
                  placeholder="Ví dụ: Giao vào giờ hành chính, gọi điện trước khi giao..."
                  value={shippingInfo.note}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Phương thức thanh toán */}
          <div className="checkout-section-card" style={{ marginTop: "25px" }}>
            <h3>
              <i className="fas fa-credit-card"></i> Phương thức thanh toán
            </h3>
            <p className="payment-security-note">
              <i className="fas fa-shield-alt"></i>{" "}
              <b>Bảo vệ người mua ReWear:</b> Tiền của bạn sẽ được sàn tạm giữ
              trong 3 ngày để kiểm tra độ chính xác của đồ cũ trước khi quyết
              định chuyển cho người bán.
            </p>

            <div className="payment-methods-list">
              {/* Lựa chọn 1: COD */}
              <label
                className={`payment-method-item ${paymentMethod === "cod" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="payment-method-details">
                  <span className="method-title">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="method-desc">
                    Bạn sẽ thanh toán bằng tiền mặt cho shipper khi nhận và đồng
                    kiểm gói hàng.
                  </span>
                </div>
              </label>

              {/* Lựa chọn 2: QR Code Ngân hàng */}
              <label
                className={`payment-method-item ${paymentMethod === "qr" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="qr"
                  checked={paymentMethod === "qr"}
                  onChange={() => setPaymentMethod("qr")}
                />
                <div className="payment-method-details">
                  <span className="method-title">
                    Chuyển khoản nhanh qua mã VietQR
                  </span>
                  <span className="method-desc">
                    Quét mã QR để chuyển khoản tự động qua ứng dụng ngân hàng di
                    động (mã đơn được cấu hình sẵn).
                  </span>
                </div>
              </label>

              {/* Lựa chọn 3: Ví điện tử MoMo */}
              <label
                className={`payment-method-item ${paymentMethod === "momo" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                />
                <div className="payment-method-details">
                  <span className="method-title">Ví điện tử MoMo</span>
                  <span className="method-desc">
                    Thanh toán tiện lợi qua cổng liên kết ví điện tử MoMo trên
                    điện thoại.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ================= KHỐI BÊN PHẢI: TÓM TẮT ĐƠN HÀNG ================= */}
        <div className="checkout-right-summary">
          <div className="checkout-summary-box">
            <h3>Đơn hàng của bạn ({checkoutItems.length})</h3>

            {/* Danh sách cuộn các sản phẩm đang mua nhanh */}
            <div className="checkout-items-preview-list">
              {checkoutItems.map((item) => (
                <div key={item.id} className="checkout-item-mini-card">
                  <div className="item-mini-img">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="item-mini-info">
                    <h4 className="item-mini-title">{item.title}</h4>
                    <p className="item-mini-meta">
                      Size: <b>{item.size}</b> | Độ mới:{" "}
                      <span className="text-green">{item.condition}</span>
                    </p>
                    <p className="item-mini-seller">Người bán: {item.seller}</p>
                  </div>
                  <div className="item-mini-price">
                    {item.price.toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-calc-divider"></div>

            {/* Khối tính toán hóa đơn */}
            <div className="calc-row">
              <span>Tổng tiền hàng</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="calc-row">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0 ? (
                  <b className="text-green">Miễn phí</b>
                ) : (
                  `${shippingFee.toLocaleString()}đ`
                )}
              </span>
            </div>

            <div className="summary-calc-divider"></div>

            <div className="calc-row total-calc-row">
              <span>Tổng thanh toán</span>
              <span className="checkout-final-price">
                {total.toLocaleString()}đ
              </span>
            </div>

            <button type="submit" className="btn-confirm-place-order">
              <i className="fas fa-lock"></i> Đặt hàng an toàn
            </button>
            <p className="secure-checkout-text">
              * Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý với các Điều khoản
              hoạt động của ReWear.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Checkout;
