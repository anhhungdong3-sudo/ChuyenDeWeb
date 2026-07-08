import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-white pt-5 pb-3 border-top border-secondary"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="container">
        <div className="row g-4">
          {/* CỘT 1: GIỚI THIỆU THƯƠNG HIỆU */}
          <div className="col-12 col-md-4">
            <Link
              className="fs-4 fw-extrabold d-flex align-items-center mb-3 text-decoration-none"
              to="/"
            >
              <span style={{ color: "#D2B48C" }}>Old</span>
              <span
                className="text-white px-2 py-1 rounded ms-1 shadow-sm fs-6"
                style={{ backgroundColor: "#8B5A2B" }}
              >
                Bookstore
              </span>
            </Link>
            <p
              className="text-white-50 small lh-base"
              style={{ maxWidth: "300px" }}
            >
              Không gian trao đổi, mua bán sách cũ tử tế và tiện lợi dành riêng
              cho cộng đồng người đọc Việt Nam.
            </p>
          </div>

          {/* CỘT 2: ĐIỀU HƯỚNG NHANH */}
          <div className="col-6 col-md-4">
            <h5
              className="text-white mb-3 position-relative pb-2"
              style={{ fontSize: "1.1rem" }}
            >
              Khám phá
              <span
                className="position-absolute bottom-0 start-0"
                style={{
                  width: "30px",
                  height: "2px",
                  backgroundColor: "#8B5A2B",
                }}
              ></span>
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link
                  to="/books"
                  className="text-white text-decoration-none hover-link"
                >
                  📖 Kho sách cũ
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="text-white text-decoration-none hover-link"
                >
                  💰 Đăng bán sách
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-white text-decoration-none hover-link"
                >
                  📰 Tin tức & Sự kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: HỖ TRỢ & LIÊN HỆ */}
          <div className="col-6 col-md-4">
            <h5
              className="text-white mb-3 position-relative pb-2"
              style={{ fontSize: "1.1rem" }}
            >
              Hỗ trợ khách hàng
              <span
                className="position-absolute bottom-0 start-0"
                style={{
                  width: "30px",
                  height: "2px",
                  backgroundColor: "#8B5A2B",
                }}
              ></span>
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-white">
              <li>
                <Link
                  to="/contact"
                  className="text-white text-decoration-none hover-link"
                >
                  ✉️ Trang liên hệ
                </Link>
              </li>
              <li>
                📧 Email:{" "}
                <a
                  href="mailto:hello@oldbookstore.vn"
                  className="text-white text-decoration-none hover-link"
                >
                  hello@oldbookstore.vn
                </a>
              </li>
              <li>
                📞 Hotline:{" "}
                <a
                  href="tel:1900xxxx"
                  className="text-white text-decoration-none hover-link"
                >
                  1900.xxxx
                </a>{" "}
                (08:00 - 21:00)
              </li>
              <li className="text-white-50 text-truncate">
                📍 TP. Hồ Chí Minh, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        {/* ĐƯỜNG PHÂN CÁCH VÀ COPYRIGHT */}
        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-white-50 text-center">
          <div>© 2026 Old Bookstore. Tất cả các quyền được bảo lưu.</div>
          <div
            className="fst-italic"
            style={{ fontSize: "0.85rem", color: "#D2B48C" }}
          >
            "Mỗi cuốn sách cũ là một khởi đầu của một vòng đời mới"
          </div>
        </div>
      </div>

      {/* CSS xử lý màu chữ trắng, hover sang màu nâu trầm ấm ổn định */}
      <style>{`
        .hover-link { color: #ffffff !important; transition: color 0.2s ease-in-out; }
        .hover-link:hover { color: #D2B48C !important; text-decoration: underline !important; }
      `}</style>
    </footer>
  );
};

export default Footer;
