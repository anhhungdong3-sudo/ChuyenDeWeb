import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Chào mừng trở lại</span>
        <h1>Đăng nhập</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <label className="form-label">Tên đăng nhập</label>
        <input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <label className="form-label mt-3">Mật khẩu</label>
        <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-primary w-100 mt-4" disabled={authLoading} type="submit">
          {authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
      </form>
    </div>
  );
};

export { Login };
export default Login;
