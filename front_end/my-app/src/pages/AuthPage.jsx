import React, { useState } from "react";

const AuthPage = () => {
  // "login" hoặc "forgot-password"
  const [viewMode, setViewMode] = useState("login");

  // State quản lý Form
  const [emailInput, setEmailInput] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // State xử lý lỗi và thông báo
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Xử lý gửi yêu cầu quên mật khẩu
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!emailInput.trim()) {
      setError("Vui lòng điền địa chỉ email đã đăng ký tài khoản.");
      return;
    }

    if (!validateEmail(emailInput)) {
      setError("Định dạng email không hợp lệ (Ví dụ: tòa_soạn@gmail.com).");
      return;
    }

    // Mô phỏng gửi API lên hệ thống
    setSuccessMessage(
      `✓ Yêu cầu hợp lệ. Ban quản trị đã gửi một liên kết thiết lập lại mật khẩu đến hòm thư ${emailInput}. Vui lòng kiểm tra hộp thư đến hoặc thư rác trong vòng 10 phút.`,
    );
    setEmailInput("");
  };

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div
        className="card rounded-0 border-dark p-4 bg-white shadow-sm"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        {/* CHẾ ĐỘ 1: FORM ĐĂNG NHẬP THÔNG THƯỜNG */}
        {viewMode === "login" && (
          <div>
            <div className="text-center border-bottom border-dark pb-3 mb-4">
              <h4
                className="fw-bold text-uppercase m-0"
                style={{ fontFamily: "Georgia, serif", letterSpacing: "1px" }}
              >
                Độc Giả Đăng Nhập
              </h4>
              <small className="text-muted fst-italic">
                Truy cập vào hệ thống lưu trữ sách
              </small>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control rounded-0 border-dark bg-transparent small"
                  placeholder="Địa chỉ Email *"
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  className="form-control rounded-0 border-dark bg-transparent small"
                  placeholder="Mật khẩu mật mã *"
                  required
                />
              </div>

              {/* LIÊN KẾT KÍCH HOẠT CHỨC NĂNG QUÊN MẬT KHẨU */}
              <div className="text-end mb-4">
                <button
                  type="button"
                  className="btn btn-link p-0 text-secondary small text-decoration-none border-bottom border-secondary"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => {
                    setViewMode("forgot-password");
                    setError("");
                    setSuccessMessage("");
                  }}
                >
                  Quên mật khẩu bản quyền?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-dark rounded-0 w-100 text-uppercase fw-bold small py-2"
                style={{ backgroundColor: "#000" }}
              >
                Đăng Nhập Hệ Thống
              </button>
            </form>
          </div>
        )}

        {/* CHẾ ĐỘ 2: FORM QUÊN MẬT KHẨU (FORGOT PASSWORD VIEW) */}
        {viewMode === "forgot-password" && (
          <div>
            <div className="text-center border-bottom border-dark pb-3 mb-4">
              <h4
                className="fw-bold text-uppercase m-0"
                style={{
                  fontFamily: "Georgia, serif",
                  letterSpacing: "1px",
                  color: "#8B5A2B",
                }}
              >
                Khôi Phục Mật Mã
              </h4>
              <small className="text-muted fst-italic">
                Xác minh danh tính độc giả qua bưu cục điện tử
              </small>
            </div>

            <p
              className="text-secondary small lh-base mb-4"
              style={{ textAlign: "justify" }}
            >
              Nhập địa chỉ thư điện tử ông/bà đã dùng để thiết lập tài khoản tại
              Old Bookstore. Hệ thống sẽ tự động đối chiếu và gửi một mật mã tạm
              thời hoặc đường dẫn bảo mật để cấu hình lại.
            </p>

            {/* Hiển thị lỗi Validation */}
            {error && (
              <div className="alert alert-danger rounded-0 border-danger small py-2 mb-3 fw-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Hiển thị thông báo thành công */}
            {successMessage && (
              <div
                className="alert alert-dark border-dark rounded-0 small py-3 mb-4"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                {successMessage}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} noValidate>
              <div className="mb-4">
                <input
                  type="email"
                  className={`form-control rounded-0 border-dark bg-transparent small ${error ? "is-invalid shadow-none" : ""}`}
                  placeholder="Nhập chính xác Email của bạn *"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (error) setError(""); // Xóa lỗi ngay khi người dùng gõ lại
                  }}
                  disabled={!!successMessage} // Khóa ô nhập khi đã gửi thành công
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  type="submit"
                  className="btn btn-dark rounded-0 w-100 text-uppercase fw-bold small py-2"
                  style={{ backgroundColor: "#000" }}
                  disabled={!!successMessage}
                >
                  Phát Phát Lệnh Khôi Phục
                </button>

                {/* NÚT QUAY LẠI ĐĂNG NHẬP */}
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-0 w-100 text-uppercase fw-bold small py-2 mt-1"
                  onClick={() => {
                    setViewMode("login");
                    setError("");
                    setSuccessMessage("");
                  }}
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
