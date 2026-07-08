import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Đảm bảo dự án đã cài axios (hoặc sử dụng fetch thay thế)

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();

  // viewMode quản lý các giao diện: "login", "forgot-request" (nhập email), "forgot-reset" (nhập OTP & pass mới)
  const [viewMode, setViewMode] = useState("login");

  const [form, setForm] = useState({ username: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý Đăng nhập thông thường
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

  // Nhánh 1: Gửi yêu cầu lấy OTP khôi phục
  const handleForgotRequest = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!forgotEmail.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password/request",
        { email: forgotEmail },
      );
      setSuccessMessage(res.data.message);
      // Chuyển sang bước nhập OTP và đổi mật khẩu mới
      setViewMode("forgot-reset");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể gửi mã OTP. Vui lòng kiểm tra lại email.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Nhánh 2: Xác nhận OTP và đặt lại mật mã mới hoàn tất quy trình
  const handleForgotReset = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password/reset",
        {
          email: forgotEmail,
          otpCode: otpCode,
          newPassword: newPassword,
        },
      );
      setSuccessMessage(res.data.message);
      // Reset sạch form và tự động quay về màn hình đăng nhập sau khi đổi thành công
      setTimeout(() => {
        setViewMode("login");
        setForgotEmail("");
        setOtpCode("");
        setNewPassword("");
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Xác thực lỗi. Vui lòng kiểm tra mã OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* 1. MÀN HÌNH ĐĂNG NHẬP CHUẨN */}
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

          <div className="text-end mt-2">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small text-secondary"
              onClick={() => {
                setViewMode("forgot-request");
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

      {/* 2. MÀN HÌNH BƯỚC 1: NHẬP EMAIL CỦA QUÊN MẬT KHẨU */}
      {viewMode === "forgot-request" && (
        <form className="auth-card" onSubmit={handleForgotRequest}>
          <span className="eyebrow">Khôi phục quyền truy cập</span>
          <h1>Quên mật khẩu</h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <label className="form-label">Địa chỉ Email đã đăng ký</label>
          <input
            type="email"
            className="form-control"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />

          <button
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
            type="submit"
          >
            {loading ? "Đang gửi mã..." : "Gửi yêu cầu khôi phục"}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
              onClick={() => {
                setViewMode("login");
                setError("");
              }}
            >
              Quay lại Đăng nhập
            </button>
          </div>
        </form>
      )}

      {/* 3. MÀN HÌNH BƯỚC 2: NHẬP MÃ OTP VÀ MẬT KHẨU MỚI */}
      {viewMode === "forgot-reset" && (
        <form className="auth-card" onSubmit={handleForgotReset}>
          <span className="eyebrow">Xác thực hệ thống</span>
          <h1>Đặt mật khẩu mới</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <label className="form-label">Mã OTP (Đã gửi tới email)</label>
          <input
            className="form-control"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Nhập 6 số..."
            required
          />

          <label className="form-label mt-3">Mật khẩu mới</label>
          <input
            className="form-control"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới..."
            required
          />

          <button
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
            type="submit"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
              onClick={() => {
                setViewMode("forgot-request");
                setError("");
                setSuccessMessage("");
              }}
            >
              Quay lại bước trước
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export { Login };
export default Login;
