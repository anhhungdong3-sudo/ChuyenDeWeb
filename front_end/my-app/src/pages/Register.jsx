import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("info");
  const [form, setForm] = useState({ username: "", fullName: "", email: "", password: "", phone: "" });
  const [otpCode, setOtpCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInfoSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await authService.registerPending(form);
      setMessage(result.message || "OTP đã được gửi về email.");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi OTP đăng ký.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await authService.registerConfirm(form.email, otpCode);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={step === "info" ? handleInfoSubmit : handleOtpSubmit}>
        <span className="eyebrow">Tham gia cộng đồng đọc</span>
        <h1>Đăng ký</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === "info" ? (
          <>
            <label className="form-label">Tên đăng nhập</label>
            <input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            <label className="form-label mt-3">Họ và tên</label>
            <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <label className="form-label mt-3">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <label className="form-label mt-3">Số điện thoại</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <label className="form-label mt-3">Mật khẩu</label>
            <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </>
        ) : (
          <>
            <p>Nhập mã OTP đã gửi đến <strong>{form.email}</strong>.</p>
            <label className="form-label">Mã OTP</label>
            <input className="form-control" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
          </>
        )}

        <button className="btn btn-primary w-100 mt-4" disabled={submitting} type="submit">
          {submitting ? "Đang xử lý..." : step === "info" ? "Gửi OTP" : "Xác nhận đăng ký"}
        </button>
        <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </form>
    </div>
  );
};

export { Register };
export default Register;
