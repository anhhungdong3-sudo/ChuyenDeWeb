import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api"; // Đảm bảo đường dẫn import chuẩn xác
import "../styles/Auth.css";

const Auth = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setBackendError("");
      setLoginData({ username: "", password: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setBackendError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      setBackendError("Vui lòng điền đầy đủ tài khoản và mật khẩu");
      return;
    }

    try {
      const data = await authService.login({
        username: loginData.username,
        password: loginData.password,
      });
      alert(data.message || "Đăng nhập thành công!");
      onClose();
      window.location.reload(); // Đồng bộ trạng thái user toàn hệ thống
    } catch (err) {
      setBackendError(
        err.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng!",
      );
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="login-modal-body">
          <div className="login-modal-header">
            <h3>Chào mừng trở lại!</h3>
            <p>Đăng nhập tài khoản ReWear của bạn</p>
          </div>

          {backendError && (
            <div className="login-backend-err-banner">
              <i className="fas fa-exclamation-circle"></i> {backendError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="login-modal-form">
            <div className="login-form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên tài khoản"
                required
              />
            </div>
            <div className="login-form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="login-modal-options">
              <label>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#forgot" className="forgot-pass-link">
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="btn-login-submit">
              Đăng Nhập
            </button>
          </form>

          <div className="login-modal-divider">
            <span>Hoặc sử dụng</span>
          </div>

          <div className="login-social-box">
            <button type="button" className="btn-login-social google">
              <i className="fab fa-google"></i> Google
            </button>
            <button type="button" className="btn-login-social facebook">
              <i className="fab fa-facebook-f"></i> Facebook
            </button>
          </div>

          <div className="login-modal-footer">
            Chưa có tài khoản?{" "}
            <span
              className="redirect-register-link"
              onClick={() => {
                onClose();
                navigate("/register");
              }}
            >
              Đăng ký thành viên mới
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
