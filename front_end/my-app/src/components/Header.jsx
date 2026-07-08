import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { bookService, formatCurrency } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const query = keyword.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await bookService.search(query);
        setSuggestions(results.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = keyword.trim();
    if (query) {
      navigate(`/books?search=${encodeURIComponent(query)}`);
      setSuggestions([]);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header
      className="site-header shadow-sm position-sticky top-0 bg-white"
      style={{ zIndex: 1050 }}
    >
      {" "}
      <nav className="navbar navbar-expand-xl bg-white py-3 border-bottom">
        <div className="container">
          {/* Logo */}
          <Link
            className="navbar-brand fs-3 fw-extrabold d-flex align-items-center m-0 text-decoration-none"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <span style={{ color: "#5C3A21" }}>Old</span>
            <span
              className="text-white px-2 py-1 rounded ms-1 shadow-sm"
              style={{ fontSize: "0.85em", backgroundColor: "#8B5A2B" }}
            >
              Bookstore
            </span>
          </Link>
          {/* Nút Toggle Menu */}
          <button
            className="navbar-toggler border-0 p-2 focus-none"
            type="button"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Vùng Content Menu thu gọn */}
          <div
            className={`collapse navbar-collapse justify-content-between ${menuOpen ? "show animate fadeIn" : ""}`}
          >
            {/* THANH TÌM KIẾM */}
            <form
              className="position-relative mx-xl-4 my-3 my-xl-0 flex-grow-1"
              style={{ maxWidth: "550px" }}
              onSubmit={handleSubmit}
              ref={searchBoxRef}
            >
              <div className="input-group">
                <input
                  className="form-control border-end-0 rounded-start-pill ps-4 bg-light focus-none"
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm tên sách, tác giả, nhà xuất bản..."
                  aria-label="Tìm sách"
                  style={{ height: "46px" }}
                />
                <button
                  className="btn text-white rounded-end-pill px-4 fw-medium"
                  type="submit"
                  style={{ backgroundColor: "#8B5A2B" }}
                >
                  🔍 Tìm
                </button>
              </div>

              {/* Box Gợi ý */}
              {(searching ||
                suggestions.length > 0 ||
                (keyword.trim().length >= 2 &&
                  suggestions.length === 0 &&
                  !searching)) && (
                <div className="position-absolute w-100 bg-white shadow-lg border rounded-4 mt-2 p-2 z-3 search-suggest-box">
                  {searching && (
                    <div className="p-3 text-center text-muted small">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        style={{ color: "#8B5A2B" }}
                        role="status"
                      ></span>
                      Đang tìm sách phù hợp...
                    </div>
                  )}
                  {!searching &&
                    suggestions.map((book) => (
                      <Link
                        key={book.id}
                        to={`/books/${book.id}`}
                        className="d-flex align-items-center gap-3 p-2 text-decoration-none text-dark rounded-3 hover-bg-light"
                        onClick={() => {
                          setKeyword("");
                          setSuggestions([]);
                          setMenuOpen(false);
                        }}
                      >
                        <img
                          className="rounded-2 object-fit-cover shadow-sm"
                          src={
                            book.imageUrl ||
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120"
                          }
                          alt={book.title}
                          style={{ width: "42px", height: "56px" }}
                        />
                        <div className="d-flex flex-column overflow-hidden">
                          <span className="fw-semibold text-truncate small">
                            {book.title}
                          </span>
                          <small
                            className="text-muted text-truncate"
                            style={{ fontSize: "0.78rem" }}
                          >
                            {book.author || "Chưa rõ tác giả"} ·{" "}
                            <span className="text-danger fw-medium">
                              {formatCurrency(book.price)}
                            </span>
                          </small>
                        </div>
                      </Link>
                    ))}
                  {!searching &&
                    suggestions.length === 0 &&
                    keyword.trim().length >= 2 && (
                      <div className="p-3 text-center text-muted small">
                        😔 Không tìm thấy đầu sách phù hợp.
                      </div>
                    )}
                </div>
              )}
            </form>

            {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
            <ul className="navbar-nav align-items-xl-center gap-xl-1">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 fw-medium ${isActive ? "fw-bold" : "text-secondary"}`
                  }
                  style={({ isActive }) =>
                    isActive ? { color: "#8B5A2B" } : {}
                  }
                  to="/books"
                  onClick={() => setMenuOpen(false)}
                >
                  Kho sách
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 fw-medium ${isActive ? "fw-bold" : "text-secondary"}`
                  }
                  style={({ isActive }) =>
                    isActive ? { color: "#8B5A2B" } : {}
                  }
                  to="/sell"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng bán
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 fw-medium ${isActive ? "fw-bold" : "text-secondary"}`
                  }
                  style={({ isActive }) =>
                    isActive ? { color: "#8B5A2B" } : {}
                  }
                  to="/news"
                  onClick={() => setMenuOpen(false)}
                >
                  Tin tức
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 fw-medium ${isActive ? "fw-bold" : "text-secondary"}`
                  }
                  style={({ isActive }) =>
                    isActive ? { color: "#8B5A2B" } : {}
                  }
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Liên hệ
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link px-3 fw-semibold text-danger"
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                  >
                    🛡️ Admin
                  </NavLink>
                </li>
              )}
            </ul>

            {/* KHỐI GIỎ HÀNG & THÀNH VIÊN */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-xl-0 pt-3 pt-xl-0 border-top border-xl-0">
              <NavLink
                className="btn btn-light position-relative p-2 rounded-circle border d-flex align-items-center justify-content-center"
                to="/cart"
                onClick={() => setMenuOpen(false)}
                style={{ width: "42px", height: "42px" }}
              >
                🛒
                {count > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">
                    {count}
                  </span>
                )}
              </NavLink>

              {!isAuthenticated ? (
                <div className="d-flex gap-2">
                  <Link
                    className="btn btn-outline-secondary px-3 rounded-pill fw-medium btn-sm"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    className="btn text-white px-3 rounded-pill fw-medium btn-sm shadow-sm"
                    style={{ backgroundColor: "#8B5A2B" }}
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle px-3 rounded-pill btn-sm fw-medium"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {user?.fullName || user?.username || "Thành viên"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3 p-2">
                    <li>
                      <Link
                        className="dropdown-item rounded-2 py-2"
                        to="/profile"
                      >
                        Hồ sơ cá nhân
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger rounded-2 py-2"
                        type="button"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>{" "}
          {/* Đóng thẻ collapse chuẩn */}
        </div>{" "}
        {/* Đóng thẻ container chuẩn */}
      </nav>
      {/* THANH THÔNG BÁO TRÊN CÙNG (TOPBAR) */}
      <div className="bg-dark text-white py-2 px-3 small d-none d-md-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark fw-bold">HOT</span>
          <span>Mua sách cũ, giữ lại tri thức, giảm lãng phí giấy!</span>
        </div>
        <div className="d-flex gap-4">
          <span className="text-white-50">📞 Hotline: 1900.xxxx</span>
          <span className="text-white-50">📍 Ho Chi Minh City, VN</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
