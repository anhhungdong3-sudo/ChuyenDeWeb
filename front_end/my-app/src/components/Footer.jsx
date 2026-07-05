import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <Link className="brand-mark footer-brand" to="/">Old<span>Bookstore</span></Link>
        <p>Không gian trao đổi sách cũ tử tế cho người đọc Việt Nam.</p>
      </div>
      <div>
        <h3>Khám phá</h3>
        <Link to="/books">Kho sách</Link>
        <Link to="/sell">Đăng bán sách</Link>
        <Link to="/cart">Giỏ hàng</Link>
      </div>
      <div>
        <h3>Hỗ trợ</h3>
        <span>hello@oldbookstore.vn</span>
        <span>08:00 - 21:00 hằng ngày</span>
        <span>TP. Hồ Chí Minh, Việt Nam</span>
      </div>
    </div>
    <div className="footer-bottom">© 2026 Old Bookstore. Mỗi cuốn sách cũ là một vòng đời mới.</div>
  </footer>
);

export default Footer;
