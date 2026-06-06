import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ isLoggedIn = false, onOpenAuth }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/">
            <h2>
              ReBook<span>.vn</span>
            </h2>
          </Link>
        </div>

        {/* Thanh tìm kiếm sách */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả, thể loại, ISBN..."
          />
          <button type="submit">
            <i className="fas fa-search"></i> Tìm kiếm
          </button>
        </div>

        {/* Hành động người dùng */}
        <div className="header-actions">
          {/* XỬ LÝ LOGIC ĐĂNG NHẬP / ĐĂNG KÝ TẠI ĐÂY */}
          {!isLoggedIn ? (
            <div className="auth-guest-buttons">
              {/* Bấm nút nào truyền chính xác tab đó vào hàm onOpenAuth */}
              <button
                type="button"
                className="btn-header-auth login"
                onClick={() => onOpenAuth("login")}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="btn-header-auth register"
                onClick={() => onOpenAuth("register")}
              >
                Đăng ký
              </button>
            </div>
          ) : (
            /* Khi đã đăng nhập thành công thì đổi thành icon User */
            <Link to="/profile" className="action-item">
              <i className="far fa-user"></i>
              <span>Tài khoản</span>
            </Link>
          )}

          {/* Giỏ hàng */}
          <Link to="/cart" className="action-item cart-icon">
            <i className="fas fa-shopping-bag"></i>
            <span>Giỏ hàng</span>
            <span className="cart-count">0</span>
          </Link>

          {/* Nút ký gửi sách */}
          <Link to="/sell" className="btn-sell">
            <i className="fas fa-plus-circle"></i> Ký gửi sách cũ
          </Link>
        </div>
      </div>

      {/* Thanh điều hướng danh mục sản phẩm bên dưới */}
      <nav className="header-navigation">
        <ul>
          <li>
            <Link to="/products?cate=van-hoc">Sách Văn Học</Link>
          </li>
          <li>
            <Link to="/products?cate=kinh-te">Kinh Tế - Kinh Doanh</Link>
          </li>
          <li>
            <Link to="/products?cate=ky-nang-song">Kỹ Năng Sống</Link>
          </li>
          <li>
            <Link to="/products?cate=thieu-nhi">Sách Thiếu Nhi</Link>
          </li>
          <li>
            <Link to="/products?cate=ngoai-van">Sách Ngoại Văn</Link>
          </li>
          <li>
            <Link to="/blog">Góc Yêu Sách</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
