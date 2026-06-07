import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ isLoggedIn = false, onOpenAuth }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi đọc thông tin user từ localStorage", e);
      }
    }
  }, []);

  const isUserLoggedIn = isLoggedIn || !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

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
          {/* Nút Admin nếu là tài khoản quản trị */}
          {user && user.role === "ADMIN" && (
            <Link to="/admin/revenue" className="admin-badge-link">
              <i className="fas fa-crown"></i> Admin Panel
            </Link>
          )}

          {/* XỬ LÝ LOGIC ĐĂNG NHẬP / ĐĂNG KÝ TẠI ĐÂY */}
          {!isUserLoggedIn ? (
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/profile" className="action-item">
                <i className="far fa-user"></i>
                <span>{user?.fullName || "Tài khoản"}</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#e11d48",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                Đăng xuất
              </button>
            </div>
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
