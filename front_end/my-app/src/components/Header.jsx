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
      return undefined;
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
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
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
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Old Bookstore</span>
        <span>Mua sách cũ, giữ lại tri thức, giảm lãng phí giấy.</span>
      </div>

      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand brand-mark" to="/" onClick={() => setMenuOpen(false)}>
            Old<span>Bookstore</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <form className="header-search mx-lg-4 my-3 my-lg-0" onSubmit={handleSubmit} ref={searchBoxRef}>
              <input
                className="form-control"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm tên sách, tác giả, nhà xuất bản..."
                aria-label="Tìm sách"
              />
              <button className="btn btn-primary" type="submit">Tìm</button>
              {(searching || suggestions.length > 0) && (
                <div className="search-suggest shadow-sm">
                  {searching && <div className="suggest-empty">Đang tìm sách phù hợp...</div>}
                  {!searching &&
                    suggestions.map((book) => (
                      <Link
                        key={book.id}
                        to={`/books/${book.id}`}
                        className="suggest-item"
                        onClick={() => {
                          setKeyword("");
                          setSuggestions([]);
                          setMenuOpen(false);
                        }}
                      >
                        <img src={book.imageUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&auto=format&fit=crop&q=60"} alt={book.title} />
                        <span>
                          <strong>{book.title}</strong>
                          <small>{book.author || "Chưa rõ tác giả"} · {formatCurrency(book.price)}</small>
                        </span>
                      </Link>
                    ))}
                  {!searching && suggestions.length === 0 && <div className="suggest-empty">Không tìm thấy sách.</div>}
                </div>
              )}
            </form>

            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/books" onClick={() => setMenuOpen(false)}>Kho sách</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/sell" onClick={() => setMenuOpen(false)}>Đăng bán</NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item dropdown-hover">
                  <NavLink className="nav-link" to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link cart-link" to="/cart" onClick={() => setMenuOpen(false)}>
                  Giỏ hàng <span>{count}</span>
                </NavLink>
              </li>
              {!isAuthenticated ? (
                <li className="nav-item d-flex gap-2 mt-2 mt-lg-0">
                  <Link className="btn btn-outline-primary btn-sm" to="/login" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
                  <Link className="btn btn-primary btn-sm" to="/register" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <button className="btn btn-soft btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    {user.fullName || user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end show-on-static">
                    <li><Link className="dropdown-item" to="/profile">Hồ sơ</Link></li>
                    <li><button className="dropdown-item" type="button" onClick={handleLogout}>Đăng xuất</button></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
