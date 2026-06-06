import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu ngắn */}
        <div className="footer-column">
          <h3>ReBook - Sách Cũ, Giá Trị Mới</h3>
          <p>
            Nền tảng mua bán, ký gửi sách cũ uy tín hàng đầu Việt Nam. Giúp
            bạn thanh lý tủ sách cá nhân và tìm kiếm những tựa sách hay chất lượng
            với giá cả hợp lý nhất.
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
              <Link to="/help/buying-guide">Hướng dẫn tìm & mua sách</Link>
            </li>
            <li>
              <Link to="/help/book-quality">Quy chuẩn đánh giá chất lượng sách</Link>
            </li>
            <li>
              <Link to="/help/return-policy">
                Chính sách đổi trả & hoàn tiền
              </Link>
            </li>
            <li>
              <Link to="/help/shipping">Quy trình đóng gói & vận chuyển</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ người ký gửi */}
        <div className="footer-column">
          <h3>Dành Cho Người Ký Gửi</h3>
          <ul>
            <li>
              <Link to="/help/selling-guide">Cách chụp ảnh & định giá sách</Link>
            </li>
            <li>
              <Link to="/help/consignment">Quy trình ký gửi sách cũ</Link>
            </li>
            <li>
              <Link to="/help/fees">Biểu phí chiết khấu ký gửi</Link>
            </li>
            <li>
              <Link to="/help/safety">Mẹo bảo quản sách khi vận chuyển</Link>
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
            <i className="fas fa-envelope"></i> Email: support@rebook.vn
          </p>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} ReBook Project. Được thiết kế bởi
          CNTT K22.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
