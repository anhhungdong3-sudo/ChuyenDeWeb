import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import thêm useLocation để nhận state truyền từ giỏ hàng
import { formatCurrency, orderService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "sub-vn";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Khởi tạo hook useLocation để đọc dữ liệu từ router
  const { user } = useAuth();
  // FIX: CartContext chỉ export "items" (không có "allItems") -> alias lại để không phải đổi tên các dòng bên dưới
  const { items: allItems, refreshCart } = useCart();

  // Lấy danh sách ID các sản phẩm được chọn để thanh toán từ trang giỏ hàng truyền sang
  const selectedCartItemIds = location.state?.selectedCartItemIds || [];

  // Lọc lấy các mặt hàng thực sự được chọn để xử lý thanh toán trên giao diện người dùng
  const checkoutItems = allItems.filter((item) =>
    selectedCartItemIds.includes(item.id),
  );

  // Tính toán lại tạm tính (subtotal) theo đúng các sản phẩm đã được tích chọn
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  );

  // Khởi tạo state cho form chứa thông tin giao hàng và phương thức thanh toán
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    city: "", // Tỉnh hoặc Thành phố
    district: "", // Quận hoặc Huyện
    ward: "", // Phường hoặc Xã
    address: "", // Số nhà và tên đường cụ thể
    note: "", // Ghi chú thêm
    paymentMethod: "cod", // Mặc định là thanh toán khi nhận hàng
  });

  // Khởi tạo state để quản lý các thông báo lỗi cho từng trường nhập liệu riêng biệt
  const [fieldErrors, setFieldErrors] = useState({
    phone: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    address: "",
  });

  const [error, setError] = useState(""); // Lỗi tổng quát từ hệ thống hoặc API
  const [submitting, setSubmitting] = useState(false); // Trạng thái đang gửi form để chặn nhấn liên tục

  // Chi phí vận chuyển: Miễn phí cho đơn hàng từ 300,000 VND trở lên hoặc giỏ hàng trống, ngược lại là 30,000 VND
  const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;

  // Tổng số tiền cuối cùng người dùng cần phải thanh toán
  const totalPayment = subtotal + shipping;

  // Hàm xử lý sự kiện khi người dùng nhấn nút xác nhận đặt hàng
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra nếu không có sản phẩm nào được chọn để thanh toán
    if (checkoutItems.length === 0) {
      setError("Bạn chưa chọn sản phẩm nào để tiến hành đặt hàng!");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Chuẩn bị dữ liệu gửi lên server, kết hợp thông tin form và danh sách ID sản phẩm được chọn
      const orderData = {
        ...form,
        cartItemIds: selectedCartItemIds, // Đảm bảo backend nhận đúng các sản phẩm được thanh toán
      };

      const result = await orderService.placeOrder(orderData);
      await refreshCart(); // Cập nhật lại trạng thái giỏ hàng mới sau khi đặt thành công

      // Nếu có đường dẫn thanh toán điện tử (ví dụ: VNPAY), thực hiện chuyển hướng trang
      if (result.payUrl) {
        window.location.href = result.payUrl;
        return;
      }

      // Nếu là COD, điều hướng người dùng về trang hồ sơ cá nhân kèm thông báo thành công
      navigate("/profile", {
        state: { orderMessage: result.message || "Đặt hàng thành công!" },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình tạo đơn hàng.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row g-4">
        {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} id="checkout-form">
            {/* Khối thông tin khách hàng */}
            <div
              className="card border-0 shadow-sm rounded-4 p-4 mb-4"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-truck fs-5"></i>
                </div>
                <h4 className="m-0 fw-bold text-dark">Thông tin nhận hàng</h4>
              </div>

              {/* Hiển thị thông báo lỗi tổng quát nếu có */}
              {error && (
                <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Họ và tên người nhận
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2 rounded-3 fs-6"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ================= TRƯỜNG NHẬP SỐ ĐIỆN THOẠI ================= */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Số điện thoại nhận hàng
                  </label>
                  <input
                    type="tel"
                    className={`form-control form-control-lg border-2 rounded-3 fs-6 ${fieldErrors.phone ? "is-invalid" : ""}`}
                    placeholder="Ví dụ: 0912345678"
                    value={form.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, phone: val });

                      // Kiểm tra biểu thức chính quy đầu số nhà mạng Việt Nam và độ dài 10 số
                      const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/;
                      if (val && !phoneRegex.test(val)) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          phone:
                            "Số điện thoại không hợp lệ (Phải gồm 10 chữ số và thuộc các đầu số nhà mạng Việt Nam).",
                        }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                    required
                  />
                  {fieldErrors.phone && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.phone}
                    </div>
                  )}
                </div>

                {/* ================= TRƯỜNG NHẬP EMAIL ================= */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Địa chỉ Email (Nhận thông tin đơn hàng)
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg border-2 rounded-3 fs-6 ${fieldErrors.email ? "is-invalid" : ""}`}
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, email: val });

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (val && !emailRegex.test(val)) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email:
                            "Định dạng email không chính xác (Ví dụ: nguyenvan@gmail.com).",
                        }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                  />
                  {fieldErrors.email && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                {/* ================= SELECT BOX: TỈNH / THÀNH PHỐ ================= */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    className={`form-select form-select-lg border-2 rounded-3 fs-6 ${fieldErrors.city ? "is-invalid" : ""}`}
                    value={
                      getProvinces().find((p) => p.name === form.city)?.code ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      const selectedProvince = getProvinces().find(
                        (p) => p.code === selectedCode,
                      );

                      // Reset lại toàn bộ Quận/Huyện và Phường/Xã cấp dưới khi đổi Tỉnh mới
                      setForm({
                        ...form,
                        city: selectedProvince ? selectedProvince.name : "",
                        district: "",
                        ward: "",
                      });

                      setFieldErrors((prev) => ({
                        ...prev,
                        city: selectedCode
                          ? ""
                          : "Vui lòng chọn một Tỉnh hoặc Thành phố.",
                      }));
                    }}
                    required
                  >
                    <option value="">-- Chọn Tỉnh / Thành --</option>
                    {getProvinces().map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.city && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.city}
                    </div>
                  )}
                </div>

                {/* ================= SELECT BOX: QUẬN / HUYỆN ================= */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Quận / Huyện
                  </label>
                  <select
                    className={`form-select form-select-lg border-2 rounded-3 fs-6 ${fieldErrors.district ? "is-invalid" : ""}`}
                    value={
                      form.city
                        ? getDistrictsByProvinceCode(
                            getProvinces().find((p) => p.name === form.city)
                              ?.code,
                          ).find((d) => d.name === form.district)?.code || ""
                        : ""
                    }
                    disabled={!form.city} // Chỉ mở khóa khi người dùng đã chọn Tỉnh/Thành phố thành công
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      const provinceCode = getProvinces().find(
                        (p) => p.name === form.city,
                      )?.code;
                      const selectedDistrict = getDistrictsByProvinceCode(
                        provinceCode,
                      ).find((d) => d.code === selectedCode);

                      // Reset Phường/Xã khi đổi Quận/Huyện mới
                      setForm({
                        ...form,
                        district: selectedDistrict ? selectedDistrict.name : "",
                        ward: "",
                      });

                      setFieldErrors((prev) => ({
                        ...prev,
                        district: selectedCode
                          ? ""
                          : "Vui lòng chọn một Quận hoặc Huyện.",
                      }));
                    }}
                    required
                  >
                    <option value="">-- Chọn Quận / Huyện --</option>
                    {form.city &&
                      getDistrictsByProvinceCode(
                        getProvinces().find((p) => p.name === form.city)?.code,
                      ).map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.district && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.district}
                    </div>
                  )}
                </div>

                {/* ================= SELECT BOX: PHƯỜNG / XÃ ================= */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Phường / Xã
                  </label>
                  <select
                    className={`form-select form-select-lg border-2 rounded-3 fs-6 ${fieldErrors.ward ? "is-invalid" : ""}`}
                    value={
                      form.district
                        ? getWardsByDistrictCode(
                            getDistrictsByProvinceCode(
                              getProvinces().find((p) => p.name === form.city)
                                ?.code,
                            ).find((d) => d.name === form.district)?.code,
                          ).find((w) => w.name === form.ward)?.code || ""
                        : ""
                    }
                    disabled={!form.district} // Chỉ mở khóa khi người dùng đã chọn Quận/Huyện thành công
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      const provinceCode = getProvinces().find(
                        (p) => p.name === form.city,
                      )?.code;
                      const districtCode = getDistrictsByProvinceCode(
                        provinceCode,
                      ).find((d) => d.name === form.district)?.code;
                      const selectedWard = getWardsByDistrictCode(
                        districtCode,
                      ).find((w) => w.code === selectedCode);

                      setForm({
                        ...form,
                        ward: selectedWard ? selectedWard.name : "",
                      });
                      setFieldErrors((prev) => ({
                        ...prev,
                        ward: selectedCode
                          ? ""
                          : "Vui lòng chọn một Phường hoặc Xã.",
                      }));
                    }}
                    required
                  >
                    <option value="">-- Chọn Phường / Xã --</option>
                    {form.district &&
                      getWardsByDistrictCode(
                        getDistrictsByProvinceCode(
                          getProvinces().find((p) => p.name === form.city)
                            ?.code,
                        ).find((d) => d.name === form.district)?.code,
                      ).map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.ward && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.ward}
                    </div>
                  )}
                </div>

                {/* ================= TRƯỜNG NHẬP ĐỊA CHỈ CHI TIẾT ================= */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg border-2 rounded-3 fs-6 ${fieldErrors.address ? "is-invalid" : ""}`}
                    placeholder="Ví dụ: Số nhà 25, Đường số 7"
                    value={form.address}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, address: val });

                      if (val.trim().length < 5) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          address:
                            "Địa chỉ cụ thể quá ngắn (Yêu cầu nhập từ 5 ký tự trở lên để tiện giao hàng).",
                        }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, address: "" }));
                      }
                    }}
                    required
                  />
                  {fieldErrors.address && (
                    <div className="text-danger small mt-1 fw-medium">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.address}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 mt-3">
                <label className="form-label fw-semibold small text-secondary">
                  Ghi chú đơn hàng (Tùy chọn)
                </label>
                <textarea
                  className="form-control border-2 rounded-3 fs-6"
                  rows="3"
                  placeholder="Lưu ý cho người giao hàng, thời gian nhận hàng mong muốn..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            {/* Khối chọn phương thức thanh toán */}
            <div
              className="card border-0 shadow-sm rounded-4 p-4 mb-4"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-credit-card fs-5"></i>
                </div>
                <h4 className="m-0 fw-bold text-dark">
                  Phương thức thanh toán
                </h4>
              </div>

              <div className="d-flex flex-column gap-3">
                <label
                  className={`p-3 border rounded-3 d-flex align-items-center justify-content-between style-payment-option ${form.paymentMethod === "cod" ? "border-primary bg-light bg-opacity-25" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      className="form-check-input me-3 border-2"
                      checked={form.paymentMethod === "cod"}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                    />
                    <div>
                      <span className="d-block fw-bold text-dark">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <small className="text-muted">
                        Nhận hàng rồi mới trả tiền cho người giao hàng
                      </small>
                    </div>
                  </div>
                  <i className="bi bi-cash-coin fs-3 text-success"></i>
                </label>

                <label
                  className={`p-3 border rounded-3 d-flex align-items-center justify-content-between style-payment-option ${form.paymentMethod === "vnpay" ? "border-primary bg-light bg-opacity-25" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      className="form-check-input me-3 border-2"
                      checked={form.paymentMethod === "vnpay"}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                    />
                    <div>
                      <span className="d-block fw-bold text-dark">
                        Ứng dụng điện tử VNPAY
                      </span>
                      <small className="text-muted">
                        Thanh toán an toàn qua thẻ ATM, Thẻ quốc tế hoặc mã QR
                        Code
                      </small>
                    </div>
                  </div>
                  <strong
                    className="text-primary fs-5"
                    style={{ letterSpacing: "-1px" }}
                  >
                    VN<span className="text-danger">PAY</span>
                  </strong>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (SỬ DỤNG CHECKOUTITEMS ĐÃ LỌC) */}
        <div className="col-lg-5">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 sticky-top"
            style={{ top: "24px", backgroundColor: "#ffffff" }}
          >
            <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">
              Đơn hàng của bạn
            </h4>

            {/* Danh sách sản phẩm rút gọn - Đã sửa thành hiển thị checkoutItems */}
            <div
              className="overflow-auto mb-4 style-scroll-mini"
              style={{ maxHeight: "240px" }}
            >
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3 justify-content-between pe-1"
                >
                  <div className="d-flex align-items-center style-item-box">
                    <div
                      className="bg-light rounded p-1 me-3 border"
                      style={{
                        width: "50px",
                        height: "65px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          item.book.imageUrl ||
                          "https://via.placeholder.com/50x65"
                        }
                        alt={item.book.title}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <span
                        className="d-block fw-bold text-dark text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {item.book.title}
                      </span>
                      <small className="text-muted">
                        Số lượng: {item.quantity}
                      </small>
                    </div>
                  </div>
                  <span className="fw-semibold text-dark">
                    {formatCurrency(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Chi tiết hóa đơn tính toán */}
            <div className="d-flex flex-column gap-3 mb-4 pb-3 border-bottom">
              <div className="d-flex justify-content-between text-secondary fs-6">
                <span>Tạm tính ({checkoutItems.length} sản phẩm)</span>
                <span className="text-dark fw-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="d-flex justify-content-between text-secondary fs-6">
                <span>Phí vận chuyển</span>
                <span className="text-dark fw-medium">
                  {shipping === 0 ? (
                    <span className="text-success fw-bold">Miễn phí</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold text-dark fs-5">Tổng thanh toán:</span>
              <span className="fw-extrabold text-danger fs-3">
                {formatCurrency(totalPayment)}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="btn btn-danger btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center"
              disabled={submitting || checkoutItems.length === 0}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  ĐANG XỬ LÝ ĐƠN HÀNG...
                </>
              ) : (
                <>
                  <i className="bi bi-bag-check-fill me-2"></i>
                  XÁC NHẬN ĐẶT HÀNG
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CheckoutPage };
export default CheckoutPage;
