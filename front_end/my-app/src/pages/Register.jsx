import React, { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("info");
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Đối tượng quản lý thông báo lỗi cho riêng từng trường nhập liệu công khai trên giao diện
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  // Sử dụng useRef để lưu trữ ID của bộ đếm thời gian Debounce, tránh bị khởi tạo lại khi re-render
  const debounceTimers = useRef({});

  /**
   * Bước 1: Kiểm tra đồng bộ tính hợp lệ về mặt định dạng chữ nghĩa bề nổi (Client-side)
   */
  const validateFieldSync = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "username":
        if (value.trim().length < 3) {
          errorMsg = "Tên đăng nhập phải có ít nhất 3 ký tự.";
        } else if (/\s/.test(value)) {
          errorMsg = "Tên đăng nhập không được chứa khoảng trắng.";
        }
        break;
      case "fullName":
        if (value.trim().length < 2) {
          errorMsg = "Họ và tên không hợp lệ (Quá ngắn).";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Định dạng email không đúng chuẩn.";
        }
        break;
      case "phone":
        if (value && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
          errorMsg = "Số điện thoại Việt Nam không chính xác (Yêu cầu 10 số).";
        }
        break;
      case "password":
        if (value.length < 6) {
          errorMsg = "Mật khẩu bảo mật phải chứa ít nhất 6 ký tự.";
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  /**
   * Bước 2: Kiểm tra bất đồng bộ ngầm dưới Database (Server-side) kèm cấu hình Debounce nâng cao
   */
  const validateFieldAsync = useCallback((name, value) => {
    // Nếu kiểm tra định dạng bề nổi đã có lỗi thì ưu tiên hiển thị lỗi đó luôn, không gọi API nữa
    const syncError = validateFieldSync(name, value);
    if (syncError) {
      setFieldErrors((prev) => ({ ...prev, [name]: syncError }));
      return;
    }

    // Xóa bộ hẹn giờ cũ của trường này nếu người dùng vẫn đang liên tục nhấn phím gõ chữ
    if (debounceTimers.current[name]) {
      clearTimeout(debounceTimers.current[name]);
    }

    // Nếu người dùng xóa trống ô thông tin thì không cần check trùng lặp nữa
    if (!value.trim()) return;

    // Xử lý kiểm tra trùng lặp cho Tên đăng nhập
    if (name === "username") {
      debounceTimers.current[name] = setTimeout(async () => {
        try {
          const res = await authService.checkUsername(value.trim());
          setFieldErrors((prev) => ({
            ...prev,
            username: res.exists
              ? "Tên đăng nhập này đã được người khác sử dụng."
              : "",
          }));
        } catch (err) {
          console.error("Lỗi khi kiểm tra tên đăng nhập bất đồng bộ:", err);
        }
      }, 500); // Trễ 500ms sau khi người dùng dừng thao tác gõ bàn phím mới kích hoạt gửi API
    }

    // Xử lý kiểm tra trùng lặp cho Địa chỉ Email
    if (name === "email") {
      debounceTimers.current[name] = setTimeout(async () => {
        try {
          const res = await authService.checkEmail(value.trim());
          setFieldErrors((prev) => ({
            ...prev,
            email: res.exists
              ? "Địa chỉ email này đã được đăng ký tài khoản trước đó."
              : "",
          }));
        } catch (err) {
          console.error("Lỗi khi kiểm tra email bất đồng bộ:", err);
        }
      }, 500);
    }
  }, []);

  /**
   * Hàm lắng nghe sự thay đổi giá trị trên các ô Input nhập liệu
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật dữ liệu Form ngay lập tức để giữ độ mượt mà cho UI hiển thị chữ
    setForm((prev) => ({ ...prev, [name]: value }));

    // Hiển thị lỗi định dạng cú pháp thô ngay lập tức nếu có
    const syncError = validateFieldSync(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: syncError }));

    // Nếu rơi vào ô username hoặc email thì kích hoạt thêm luồng kiểm tra bất đồng bộ ngầm
    if (name === "username" || name === "email") {
      validateFieldAsync(name, value);
    }
  };

  /**
   * Luồng xử lý khi submit bước nhập thông tin ban đầu công khai
   */
  const handleInfoSubmit = async (event) => {
    event.preventDefault();

    // Để tránh lỗi State bất đồng bộ chưa cập nhật kịp của React khi bấm submit nhanh,
    // ta tính toán trực tiếp danh sách lỗi hiện tại của tất cả các trường
    const freshErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateFieldSync(key, form[key]);
      if (err) freshErrors[key] = err;
    });

    // Gom gộp chung lỗi định dạng vừa quét với tập lỗi bất đồng bộ đang lưu trữ trên giao diện
    const finalErrors = { ...fieldErrors, ...freshErrors };
    const hasAnyError = Object.values(finalErrors).some((err) => err !== "");

    if (hasAnyError) {
      setFieldErrors(finalErrors); // Đổ toàn bộ tập lỗi phát hiện ra màn hình để thông báo cho khách hàng
      setError(
        "Vui lòng chỉnh sửa chính xác các trường thông tin bị báo đỏ trước khi tiếp tục.",
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const result = await authService.registerPending(form);
      setMessage(
        result.message ||
          "Mã xác thực OTP đã được gửi về hòm thư email của bạn.",
      );
      setStep("otp");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể gửi OTP đăng ký, vui lòng kiểm tra lại đường truyền.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Luồng xử lý khi submit xác nhận mã OTP gửi về máy
   */
  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await authService.registerConfirm(form.email, otpCode);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Mã xác thực OTP không chính xác hoặc đã quá hạn.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={step === "info" ? handleInfoSubmit : handleOtpSubmit}
      >
        <span className="eyebrow">Tham gia cộng đồng đọc</span>
        <h1>Đăng ký</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === "info" ? (
          <>
            <label className="form-label">Tên đăng nhập</label>
            <input
              name="username"
              className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
              value={form.username}
              onChange={handleChange}
              required
            />
            {fieldErrors.username && (
              <div className="text-danger small mt-1">
                {fieldErrors.username}
              </div>
            )}

            <label className="form-label mt-3">Họ và tên</label>
            <input
              name="fullName"
              className={`form-control ${fieldErrors.fullName ? "is-invalid" : ""}`}
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {fieldErrors.fullName && (
              <div className="text-danger small mt-1">
                {fieldErrors.fullName}
              </div>
            )}

            <label className="form-label mt-3">Email</label>
            <input
              name="email"
              type="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <div className="text-danger small mt-1">{fieldErrors.email}</div>
            )}

            <label className="form-label mt-3">Số điện thoại</label>
            <input
              name="phone"
              className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
              value={form.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && (
              <div className="text-danger small mt-1">{fieldErrors.phone}</div>
            )}

            <label className="form-label mt-3">Mật khẩu</label>
            <input
              name="password"
              type="password"
              className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <div className="text-danger small mt-1">
                {fieldErrors.password}
              </div>
            )}
          </>
        ) : (
          <>
            <p>
              Nhập mã OTP đã gửi đến <strong>{form.email}</strong>.
            </p>
            <label className="form-label">Mã OTP</label>
            <input
              className="form-control"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
          </>
        )}

        <button
          className="btn btn-primary w-100 mt-4"
          disabled={
            submitting || Object.values(fieldErrors).some((err) => err !== "")
          }
          type="submit"
        >
          {submitting
            ? "Đang xử lý..."
            : step === "info"
              ? "Gửi OTP"
              : "Xác nhận đăng ký"}
        </button>
        <p className="mt-3">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export { Register };
export default Register;
