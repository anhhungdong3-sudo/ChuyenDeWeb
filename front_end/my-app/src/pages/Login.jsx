import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();

  // Trạng thái chuyển đổi: "login" hoặc "forgot"
  const [viewMode, setViewMode] = useState("login");

  const [form, setForm] = useState({ username: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Logic Đăng nhập cũ giữ nguyên
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản.",
      );
    }
  };

  // Logic xử lý gửi Email quên mật khẩu
  const handleForgotSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!forgotEmail.trim()) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }

    // Giả lập gửi thành công
    setSuccessMessage(
      `Liên kết đặt lại mật khẩu đã được gửi tới email: ${forgotEmail}`,
    );
    setForgotEmail("");
  };

  return (
    <div className="auth-page">
      {/* CHẾ ĐỘ 1: FORM ĐĂNG NHẬP (GIỮ NGUYÊN GIAO DIỆN CỦA BẠN) */}
      {viewMode === "login" && (
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Chào mừng trở lại</span>
          <h1>Đăng nhập</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <label className="form-label">Tên đăng nhập</label>
          <input
            className="form-control"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <label className="form-label mt-3">Mật khẩu</label>
          <input
            className="form-control"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {/* NÚT BẤM CHUYỂN SANG PHẦN QUÊN MẬT KHẨU */}
          <div className="text-end mt-2">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small text-secondary"
              onClick={() => {
                setViewMode("forgot");
                setError("");
                setSuccessMessage("");
              }}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={authLoading}
            type="submit"
          >
            {authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="mt-3">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </form>
      )}

      {/* CHẾ ĐỘ 2: FORM QUÊN MẬT KHẨU (SỬ DỤNG LẠI HOÀN TOÀN CLASS CSS CŨ) */}
      {viewMode === "forgot" && (
        <form className="auth-card" onSubmit={handleForgotSubmit} noValidate>
          <span className="eyebrow">Khôi phục quyền truy cập</span>
          <h1>Quên mật khẩu</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <label className="form-label">Địa chỉ Email đã đăng ký</label>
          <input
            type="email"
            className="form-control"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={!!successMessage}
          />

          <button
            className="btn btn-primary w-100 mt-4"
            type="submit"
            disabled={!!successMessage}
          >
            Gửi yêu cầu khôi phục
          </button>

          {/* NÚT QUAY LẠI ĐĂNG NHẬP */}
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
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
      )}
    </div>
  );
};

export { Login };
export default Login;
