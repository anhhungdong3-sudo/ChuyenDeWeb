import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Trạng thái lưu trữ lỗi validation và trạng thái gửi thành công
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Hàm kiểm tra tính hợp lệ của dữ liệu trước khi gửi
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Vui lòng nhập họ và tên của độc giả.";
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = "Họ và tên phải có ít nhất 2 ký tự.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Vui lòng nhập địa chỉ email để tòa soạn phản hồi.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email =
        "Định dạng email không hợp lệ (Ví dụ: name@gmail.com).";
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = "Vui lòng nhập chủ đề đơn thư liên hệ.";
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Nội dung chi tiết không được để trống.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Nội dung phản hồi quá ngắn (tối thiểu 10 ký tự).";
    }

    setErrors(tempErrors);
    // Nếu không có lỗi nào, trả về true
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      setErrors({});
      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Tự động ẩn thông báo thành công sau 5 giây
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* PHẦN 1: BANNER ĐẦU TRANG THEO PHONG CÁCH TẠP CHÍ */}
      <header className="text-center mb-5 border-bottom pb-4 border-dark">
        <p
          className="text-uppercase tracking-wider small fw-bold text-muted mb-2"
          style={{ letterSpacing: "2px" }}
        >
          Về Chúng Tôi & Cổng Thông Tin Trực Tuyến
        </p>
        <h1
          className="display-4 fw-serif text-dark my-2"
          style={{ fontFamily: "Georgia, serif", fontWeight: "800" }}
        >
          LIÊN HỆ VỚI TÒA SOẠN SÁCH CŨ
        </h1>
        <div className="d-flex justify-content-center align-items-center gap-3 text-muted small mt-3">
          <span>Xuất bản: 2026</span>
          <span className="text-dark">•</span>
          <span>Cập nhật: Mới nhất</span>
          <span className="text-dark">•</span>
          <span>Chuyên mục: Kết nối cộng đồng</span>
        </div>
      </header>

      {/* PHẦN 2: BÀI XÃ LUẬN GIỚI THIỆU (EDITORIAL INTRODUCTION) */}
      <div className="row g-5 mb-5 align-items-center">
        <div className="col-lg-7 border-end border-md-none border-secondary pe-lg-5">
          <h3
            className="fw-bold mb-3"
            style={{ fontFamily: "Georgia, serif", color: "#111" }}
          >
            Hành trình kết nối những vòng đời mới cho tri thức cũ.
          </h3>
          <p
            className="fs-5 text-dark lh-base"
            style={{ textAlign: "justify" }}
          >
            <span
              className="fw-bold display-6 float-start me-2 lh-1"
              style={{ color: "#8B5A2B", fontFamily: "Georgia" }}
            >
              O
            </span>
            ld Bookstore không thuần túy là một điểm mua bán thương mại. Chúng
            tôi định vị mình như một thực thể lưu trữ, một nền tảng văn hóa xã
            hội nhằm kết nối những tâm hồn yêu sách tại Việt Nam. Ra đời giữa kỷ
            nguyên số, chúng tôi tin rằng giá trị của một cuốn sách in nằm ở
            những vết sờn, những trang giấy ngả màu và cả hành trình nó được
            truyền tay qua nhiều thế hệ.
          </p>
          <p className="text-secondary small font-sans mt-3">
            Hệ thống vận hành dựa trên sự minh bạch, tử tế và tôn trọng tuyệt
            đối quyền lợi người đọc. Mọi phản hồi, đóng góp từ quý độc giả là
            kim chỉ nam để ban biên tập hoàn thiện hệ sinh thái mỗi ngày.
          </p>
        </div>

        {/* Khối trích dẫn nổi bật (Pull-quote) phong cách báo chí */}
        <div className="col-lg-5 ps-lg-5">
          <div className="p-4 border-start border-end border-dark text-center my-3 bg-light">
            <span
              className="display-4 text-muted d-block lh-1"
              style={{ fontFamily: "Georgia" }}
            >
              “
            </span>
            <p
              className="fst-italic fs-5 text-dark px-3"
              style={{ fontFamily: "Georgia, serif" }}
            >
              "Mua một cuốn sách cũ không chỉ là tiết kiệm một khoản chi phí, đó
              là việc bạn đang tiếp quản lại một số phận tri thức."
            </p>
            <small className="text-uppercase fw-bold text-muted">
              — Ban quản trị Old Bookstore
            </small>
          </div>
        </div>
      </div>

      {/* PHẦN 3: BỐ CỤC 3 CỘT ĐỊA CHỈ & HỆ THỐNG CƠ SỞ */}
      <section className="border-top border-bottom border-dark py-4 my-5 bg-white">
        <h4
          className="text-uppercase fw-bold text-dark mb-4 text-center"
          style={{ letterSpacing: "1px", fontSize: "1.1rem" }}
        >
          Hệ Thống Mạng Lưới & Điểm Tiếp Nhận Sách
        </h4>
        <div className="row g-4">
          <div className="col-md-4 border-end border-sm-none">
            <h6 className="fw-bold text-uppercase" style={{ color: "#8B5A2B" }}>
              📍 01. Văn phòng điều hành
            </h6>
            <p className="text-dark small lh-base mb-2">
              Khu Đô Thị Đại Học Quốc Gia, P. Linh Trung, TP. Thủ Đức, TP. Hồ
              Chí Minh.
            </p>
            <small className="text-muted d-block">
              Phòng Biên tập & Xử lý Dữ liệu mạng.
            </small>
          </div>

          <div className="col-md-4 border-end border-sm-none">
            <h6 className="fw-bold text-uppercase" style={{ color: "#8B5A2B" }}>
              📍 02. Trạm Đọc Trung Tâm
            </h6>
            <p className="text-dark small lh-base mb-2">
              Hẻm Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh.
            </p>
            <small className="text-muted d-block">
              Không gian trưng bày, ký gửi và đọc sách 0đ.
            </small>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase" style={{ color: "#8B5A2B" }}>
              📍 03. Tổng kho Phân Loại
            </h6>
            <p className="text-dark small lh-base mb-2">
              Đường Điện Biên Phủ (Gần Ngã tư Hàng Xanh), Q. Bình Thạnh, TP. Hồ
              Chí Minh.
            </p>
            <small className="text-muted d-block">
              Điểm tập kết, khử khuẩn và đóng gói sách.
            </small>
          </div>
        </div>
      </section>

      {/* PHẦN 4: THÔNG TIN ĐƯỜNG DÂY NÓNG & FORM LIÊN HỆ ĐÃ ĐƯỢC NÂNG CẤP ĐẸP HƠN */}
      <div className="row g-5 pt-3">
        {/* Khối đường dây nóng cách điệu kiểu Box Thống kê Báo chí */}
        <div className="col-lg-4">
          <div
            className="border border-dark p-4 bg-light"
            style={{ borderLeft: "8px solid #000 !important" }}
          >
            <h4
              className="fw-bold text-dark mb-4 text-uppercase border-bottom border-dark pb-2"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                letterSpacing: "0.5px",
              }}
            >
              Đường Dây Nóng
            </h4>

            <div className="mb-4">
              <span className="text-uppercase text-muted d-block small fw-bold mb-1">
                📞 Tổng đài khẩn cấp
              </span>
              <a
                href="tel:1900xxxx"
                className="fs-3 fw-bold text-dark text-decoration-none d-block border-bottom border-secondary pb-1"
                style={{ fontFamily: "Georgia" }}
              >
                1900.xxxx
              </a>
              <small className="text-secondary d-block mt-1">
                Hỗ trợ tra cứu đơn hàng, khiếu nại dịch vụ 24/7.
              </small>
            </div>

            <div className="mb-4">
              <span className="text-uppercase text-muted d-block small fw-bold mb-1">
                ✉️ Thư ký tòa soạn
              </span>
              <a
                href="mailto:support@oldbookstore.vn"
                className="fs-6 fw-bold text-dark text-decoration-none border-bottom border-dark"
              >
                support@oldbookstore.vn
              </a>
              <small className="text-secondary d-block mt-1">
                Nơi tiếp nhận hồ sơ hợp tác đại lý và các dự án tài trợ văn hóa
                đọc.
              </small>
            </div>

            <div className="pt-2">
              <span className="text-uppercase text-muted d-block small fw-bold mb-1">
                🕒 Chu kỳ làm việc
              </span>
              <p className="small text-dark m-0 lh-base">
                Ban tiếp nhận làm việc không ngày nghỉ, bao gồm cả các dịp Lễ,
                Tết quốc gia.
              </p>
            </div>
          </div>
        </div>

        {/* Khối Hòm thư góp ý và Form xử lý lỗi */}
        <div className="col-lg-8">
          <div className="border border-dark p-4">
            <h4
              className="fw-bold text-dark mb-4 text-uppercase border-bottom border-dark pb-2"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                letterSpacing: "0.5px",
              }}
            >
              Hòm Thư Góp Ý & Đơn Thư Độc Giả
            </h4>

            {submitted && (
              <div
                className="alert alert-dark border-dark rounded-0 mb-4 py-3 shadow-sm"
                role="alert"
                style={{ backgroundColor: "#e9ecef" }}
              >
                🔑 <strong>Gửi thành công!</strong> Hệ thống tòa soạn đã tiếp
                nhận bưu thiếp điện tử của ông/bà. Hội đồng quản trị sẽ tiến
                hành xử lý và phản hồi chi tiết trong vòng 24 giờ làm việc.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Trường Họ và Tên */}
                <div className="col-md-6">
                  <input
                    type="text"
                    className={`form-control rounded-0 border-dark bg-transparent small ${errors.name ? "is-invalid shadow-none" : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Họ và tên của độc giả *"
                  />
                  {errors.name && (
                    <div className="invalid-feedback font-sans small fw-bold mt-1">
                      ⚠️ {errors.name}
                    </div>
                  )}
                </div>

                {/* Trường Email */}
                <div className="col-md-6">
                  <input
                    type="email"
                    className={`form-control rounded-0 border-dark bg-transparent small ${errors.email ? "is-invalid shadow-none" : ""}`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Địa chỉ Email phản hồi *"
                  />
                  {errors.email && (
                    <div className="invalid-feedback font-sans small fw-bold mt-1">
                      ⚠️ {errors.email}
                    </div>
                  )}
                </div>

                {/* Trường Tiêu đề */}
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control rounded-0 border-dark bg-transparent small ${errors.subject ? "is-invalid shadow-none" : ""}`}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Chủ đề / Mục đích đơn thư *"
                  />
                  {errors.subject && (
                    <div className="invalid-feedback font-sans small fw-bold mt-1">
                      ⚠️ {errors.subject}
                    </div>
                  )}
                </div>

                {/* Trường Tin nhắn */}
                <div className="col-12">
                  <textarea
                    className={`form-control rounded-0 border-dark bg-transparent small ${errors.message ? "is-invalid shadow-none" : ""}`}
                    rows="5"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Nội dung chi tiết câu hỏi hoặc ý kiến đóng góp... (Tối thiểu 10 ký tự) *"
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback font-sans small fw-bold mt-1">
                      ⚠️ {errors.message}
                    </div>
                  )}
                </div>

                {/* Nút gửi */}
                <div className="col-12 text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark rounded-0 px-5 py-2.5 text-uppercase fw-bold small text-white border-0"
                    style={{
                      letterSpacing: "1.5px",
                      backgroundColor: "#000",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#8B5A2B")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#000")
                    }
                  >
                    Chuyển Đơn Thư Đi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Contact };
export default Contact;
