import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate vào đây
import "../styles/Cart.css"; // Đảm bảo import đúng file CSS bên dưới

export const Cart = () => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  // Mock data danh sách sản phẩm nằm trong giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Áo khoác Varsity Jacket Vintage",
      price: 249000,
      size: "L",
      condition: "Mới 95%",
      img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
      seller: "Đồng Trần",
      quantity: 1,
    },
    {
      id: 2,
      title: "Quần Jean Baggy Retro Levi's",
      price: 189000,
      size: "M",
      condition: "Mới 90%",
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
      seller: "Minh Thư",
      quantity: 1,
    },
  ]);

  // Hàm thay đổi số lượng sản phẩm
  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng?")
    ) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };

  // Tính toán các chi phí tổng
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 300000 || cartItems.length === 0 ? 0 : 30000; // Freeship đơn từ 300k
  const total = subtotal + shippingFee;

  // Hàm xử lý khi người dùng ấn nút thanh toán công nghệ
  const handleProceedCheckout = () => {
    // Điều hướng trực tiếp sang trang cấu hình checkout
    navigate("/checkout");
  };

  // Trường hợp giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-box">
          <i className="fas fa-shopping-bag empty-icon"></i>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>
            Hãy bổ sung vào tủ đồ của mình những bộ trang phục secondhand thật
            chất nhé!
          </p>
          <Link to="/products" className="btn-back-to-shop">
            Khám phá sản phẩm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2 className="cart-page-title">
        Giỏ hàng của bạn ({cartItems.length} sản phẩm)
      </h2>

      <div className="cart-layout">
        {/* ================= DANH SÁCH SẢN PHẨM (LEFT) ================= */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="item-img-box">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="item-details">
                <div className="item-seller-tag">
                  <i className="far fa-user"></i> Người bán:{" "}
                  <b>{item.seller}</b>
                </div>
                <h3 className="item-title">{item.title}</h3>
                <div className="item-specs">
                  <span>
                    Size: <b>{item.size}</b>
                  </span>
                  <span className="spec-divider">|</span>
                  <span>
                    Độ mới: <b className="text-green">{item.condition}</b>
                  </span>
                </div>
              </div>

              <div className="item-quantity-controls">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>

              <div className="item-price-box">
                <div className="item-total-price">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
                {item.quantity > 1 && (
                  <div className="item-unit-price">
                    {item.price.toLocaleString()}đ/cái
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-delete-item"
                onClick={() => removeItem(item.id)}
                title="Xóa khỏi giỏ hàng"
              >
                &times;
              </button>
            </div>
          ))}

          <div className="cart-footer-nav">
            <Link to="/products" className="btn-continue-shopping">
              <i className="fas fa-arrow-left"></i> Tiếp tục chọn đồ cũ
            </Link>
          </div>
        </div>

        {/* ================= TÓM TẮT ĐƠN HÀNG (RIGHT) ================= */}
        <aside className="cart-summary-sidebar">
          <div className="summary-box">
            <h3>Tóm tắt đơn hàng</h3>

            <div className="summary-row">
              <span>Tạm tính ({cartItems.length} sản phẩm)</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển dự kiến</span>
              <span>
                {shippingFee === 0 ? (
                  <b className="text-green">Miễn phí</b>
                ) : (
                  `${shippingFee.toLocaleString()}đ`
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="shipping-note">
                * Mua thêm <b>{(300000 - subtotal).toLocaleString()}đ</b> để
                được <b>Miễn phí vận chuyển</b>.
              </p>
            )}

            {/* Khung nhập mã giảm giá Vouchers */}
            <div className="coupon-box">
              <input type="text" placeholder="Nhập mã giảm giá (ReWear...)" />
              <button type="button">Áp dụng</button>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Tổng cộng</span>
              <span className="final-total-price">
                {total.toLocaleString()}đ
              </span>
            </div>

            {/* Đã cập nhật hàm xử lý tại đây để chuyển hướng mượt mà */}
            <button
              type="button"
              className="btn-proceed-checkout"
              onClick={handleProceedCheckout}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
