import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu ngắn */}
        <div className="footer-column">
          <h3>ReWear - Thời Trang Cũ, Sức Sống Mới</h3>
          <p>
            Nền tảng mua bán, ký gửi quần áo cũ uy tín hàng đầu Việt Nam. Giúp
            bạn thanh lý tủ đồ và tìm kiếm những món đồ vintage độc chất với giá
            hạt dẻ.
          </p>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Cột 2: Hỗ trợ khách mua hàng */}
        <div className="footer-column">
          <h3>Hỗ Trợ Mua Hàng</h3>
          <ul>
            <li>
              <Link to="/help/buying-guide">Hướng dẫn mua hàng</Link>
            </li>
            <li>
              <Link to="/help/size-guide">Bảng quy đổi kích cỡ</Link>
            </li>
            <li>
              <Link to="/help/return-policy">
                Chính sách hoàn tiền & đổi trả
              </Link>
            </li>
            <li>
              <Link to="/help/shipping">Quy trình giao nhận kiểm hàng</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ người bán/thanh lý */}
        <div className="footer-column">
          <h3>Dành Cho Người Bán</h3>
          <ul>
            <li>
              <Link to="/help/selling-guide">Cách chụp ảnh & đăng bán</Link>
            </li>
            <li>
              <Link to="/help/consignment">Quy trình ký gửi quần áo</Link>
            </li>
            <li>
              <Link to="/help/fees">Biểu phí nền tảng</Link>
            </li>
            <li>
              <Link to="/help/safety">Mẹo mua bán an toàn</Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div className="footer-column">
          <h3>Thông Tin Liên Hệ</h3>
          <p>
            <i className="fas fa-map-marker-alt"></i> Linh Trung, Thủ Đức, TP.
            Hồ Chí Minh
          </p>
          <p>
            <i className="fas fa-phone-alt"></i> HotLine: 1900 xxxx (8h - 21h)
          </p>
          <p>
            <i className="fas fa-envelope"></i> Email: support@rewear.vn
          </p>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} ReWear Project. Được thiết kế bởi
          CNTT K22.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
