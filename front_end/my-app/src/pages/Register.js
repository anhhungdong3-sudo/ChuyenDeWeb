import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import axios from "axios";
import "../styles/Register.css";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi tải danh sách Tỉnh/Thành: ", err));
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }
    axios
      .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((res) => {
        setDistricts(res.data.districts);
        setWards([]);
      })
      .catch((err) => console.error("Lỗi tải danh sách Quận/Huyện: ", err));
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }
    axios
      .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((res) => setWards(res.data.wards))
      .catch((err) => console.error("Lỗi tải danh sách Phường/Xã: ", err));
  }, [selectedDistrict]);

  useEffect(() => {
    const provinceObj = provinces.find(
      (p) => p.code === parseInt(selectedProvince),
    );
    const districtObj = districts.find(
      (d) => d.code === parseInt(selectedDistrict),
    );
    const wardObj = wards.find((w) => w.code === parseInt(selectedWard));

    let fullAddress = specificAddress.trim();
    if (wardObj) fullAddress += `, ${wardObj.name}`;
    if (districtObj) fullAddress += `, ${districtObj.name}`;
    if (provinceObj) fullAddress += `, ${provinceObj.name}`;

    setFormData((prev) => ({ ...prev, address: fullAddress }));
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    specificAddress,
    provinces,
    districts,
    wards,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    setBackendError("");
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Tên đăng nhập không được trống";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng điền họ tên";
    if (!formData.dob) newErrors.dob = "Vui lòng chọn ngày sinh";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Email không đúng định dạng";

    const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone.trim()))
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !specificAddress.trim()
    ) {
      newErrors.address = "Vui lòng hoàn thành chọn địa chỉ chi tiết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setBackendError("");
    try {
      const res = await authService.registerPending(formData);
      alert(res.message || "Mã xác thực đã được gửi!");
      setShowOtpStep(true);
    } catch (err) {
      setBackendError(
        err.response?.data || "Đăng ký thất bại, hãy kiểm tra kết nối Server!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otpCode.trim()) {
      setBackendError("Vui lòng nhập mã OTP!");
      return;
    }
    setLoading(true);
    setBackendError("");
    try {
      const res = await authService.registerConfirm(formData.email, otpCode);
      alert(res.message || "Đăng ký tài khoản ReWear thành công!");
      navigate("/"); // Chuyển hướng về trang chủ/đăng nhập
    } catch (err) {
      setBackendError(err.response?.data || "Mã xác thực sai hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rw-register-page">
      <div className="rw-register-card">
        <div className="rw-register-header">
          <h2>Đăng Ký Thành Viên ReWear</h2>
          <p>Điền thông tin và xác thực mã OTP để kích hoạt tài khoản</p>
        </div>

        {backendError && (
          <div className="rw-backend-error">
            <i className="fas fa-exclamation-circle"></i> {backendError}
          </div>
        )}

        <form onSubmit={handleSubmitRegistration} className="rw-register-form">
          <div className="rw-form-grid">
            {/* THÔNG TIN TÀI KHOẢN */}
            <div className="rw-form-section">
              <h3 className="section-title">
                <i className="fas fa-lock"></i> 1. Thông tin đăng nhập
              </h3>

              <div className="rw-input-group">
                <label>
                  Tên đăng nhập <span>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  readOnly={showOtpStep}
                  className={showOtpStep ? "readonly-input" : ""}
                />
                {errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>

              <div className="rw-input-group">
                <label>
                  Mật khẩu <span>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  readOnly={showOtpStep}
                  className={showOtpStep ? "readonly-input" : ""}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="rw-input-group">
                <label>
                  Địa chỉ Email <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={showOtpStep}
                  className={showOtpStep ? "readonly-input" : ""}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="rw-input-row">
                <div className="rw-input-group width-50">
                  <label>
                    Ngày sinh <span>*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    readOnly={showOtpStep}
                    className={showOtpStep ? "readonly-input" : ""}
                  />
                  {errors.dob && (
                    <span className="error-text">{errors.dob}</span>
                  )}
                </div>
                <div className="rw-input-group width-50">
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={showOtpStep}
                    className={showOtpStep ? "readonly-input" : ""}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* THÔNG TIN CÁ NHÂN & ĐỊA CHỈ */}
            <div className="rw-form-section">
              <h3 className="section-title">
                <i className="fas fa-id-card"></i> 2. Thông tin cá nhân & Địa
                chỉ
              </h3>

              <div className="rw-input-group">
                <label>
                  Họ và tên <span>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  readOnly={showOtpStep}
                  className={showOtpStep ? "readonly-input" : ""}
                />
                {errors.fullName && (
                  <span className="error-text">{errors.fullName}</span>
                )}
              </div>

              <div className="rw-input-group">
                <label>
                  Số điện thoại <span>*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={showOtpStep}
                  className={showOtpStep ? "readonly-input" : ""}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>

              <div className="rw-address-cascading-selects">
                <div className="rw-input-row">
                  <div className="rw-input-group width-50">
                    <label>
                      Tỉnh / Thành phố <span>*</span>
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      disabled={showOtpStep}
                    >
                      <option value="">-- Chọn Tỉnh/Thành --</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rw-input-group width-50">
                    <label>
                      Quận / Huyện <span>*</span>
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedProvince || showOtpStep}
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rw-input-row" style={{ marginTop: "12px" }}>
                  <div className="rw-input-group width-50">
                    <label>
                      Phường / Xã <span>*</span>
                    </label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      disabled={!selectedDistrict || showOtpStep}
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rw-input-group width-50">
                    <label>
                      Số nhà, tên đường <span>*</span>
                    </label>
                    <input
                      type="text"
                      value={specificAddress}
                      onChange={(e) => setSpecificAddress(e.target.value)}
                      readOnly={showOtpStep}
                      className={showOtpStep ? "readonly-input" : ""}
                      placeholder="Ví dụ: 123 Đường số 4"
                    />
                  </div>
                </div>
                {errors.address && (
                  <span
                    className="error-text"
                    style={{ display: "block", marginTop: "5px" }}
                  >
                    {errors.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* KHU VỰC XÁC THỰC OTP */}
          {showOtpStep && (
            <div className="otp-container-verify-wrapper">
              <div className="rw-input-group otp-verify-box">
                <label className="otp-label">
                  Nhập 6 số OTP gửi tới Gmail của bạn <span>*</span>
                </label>
                <div className="otp-input-row-flex">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    placeholder="X X X X X X"
                    className="otp-input-field"
                  />
                  <button
                    type="button"
                    className="btn-confirm-otp-submit"
                    onClick={handleConfirmOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Xác Nhận Kích Hoạt"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rw-register-footer">
            {!showOtpStep && (
              <button
                type="submit"
                className="rw-btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}{" "}
                Đăng Ký & Gửi Mã Xác Thực
              </button>
            )}
            <p>
              Đã có tài khoản?{" "}
              <span className="login-link" onClick={() => navigate("/")}>
                Quay lại trang chủ
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
