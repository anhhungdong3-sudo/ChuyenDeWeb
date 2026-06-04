import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/api"; // Đường dẫn gọi Axios/Fetch API của dự án
import "../styles/Sell.css";

export const Sell = () => {
  const navigate = useNavigate();

  // Khởi tạo state từ localStorage để kiểm tra ngay khi component vừa mount
  const [currentUser, setCurrentUser] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  // State quản lý việc đăng nhập ngay tại trang (nếu dự án của bạn dùng form đăng nhập tại chỗ)
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Quản lý trạng thái dữ liệu form đăng bán
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    size: "",
    condition: "95",
    brand: "",
    originalPrice: "",
    sellPrice: "",
    description: "",
    location: "Hồ Chí Minh",
  });

  // Quản lý danh sách ảnh xem trước (Preview) dạng Blob URL
  const [images, setImages] = useState([]);

  // Xử lý thay đổi dữ liệu text/select trong form đăng bán
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý đăng nhập ngay tại trang nếu chưa có tài khoản
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleInlineLogin = (e) => {
    e.preventDefault();
    // Giả lập hoặc gọi API đăng nhập của bạn ở đây. Sau khi thành công:
    // Giả sử backend trả về object user có id và name
    const mockUser = { id: 1, name: "Người dùng ReWear" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    alert("Đăng nhập thành công! Hãy tiếp tục đăng tin bán sản phẩm của bạn.");
  };

  // Xử lý khi người dùng chọn ảnh tải lên
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));

    if (images.length + filePreviews.length > 4) {
      alert("Bạn chỉ được tải lên tối đa 4 hình ảnh thực tế!");
      return;
    }
    setImages([...images, ...filePreviews]);
  };

  // Xóa một ảnh đã chọn ra khỏi danh sách preview
  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // ================= ĐỒNG BỘ VÀ GỬI PAYLOAD LÊN BACKEND SPRING BOOT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại!");
      return;
    }

    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 hình ảnh thực tế của sản phẩm!");
      return;
    }

    const productPayload = {
      title: formData.title,
      price: parseFloat(formData.sellPrice),
      description: `[Độ mới: ${formData.condition}%] - Thương hiệu: ${formData.brand || "Không rõ"}. ${formData.description}. Địa điểm xem đồ: ${formData.location}`,
      category: formData.category,
      size: formData.size,
      status: "AVAILABLE",
      shopId: currentUser.id, // Gắn định danh ID người dùng thực tế
      imageUrl: images[0] || "",
    };

    try {
      await productService.createProduct(productPayload);
      alert(
        "Chúc mừng! Sản phẩm của bạn đã được đăng thanh lý thành công trên ReWear.",
      );

      // Reset form
      setFormData({
        title: "",
        category: "",
        size: "",
        condition: "95",
        brand: "",
        originalPrice: "",
        sellPrice: "",
        description: "",
        location: "Hồ Chí Minh",
      });
      setImages([]);
    } catch (err) {
      console.error("Lỗi đăng bán:", err);
      alert(
        err.response?.data ||
          "Đã xảy ra lỗi hệ thống khi đăng bán, vui lòng kiểm tra lại!",
      );
    }
  };

  // ================= THẢO LUẬN LUỒNG: NẾU CHƯA ĐĂNG NHẬP, HIỂN THỊ TRANG ĐĂNG NHẬP TẠI CHỖ =================
  if (!currentUser) {
    return (
      <div
        className="sell-page-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "75vh",
        }}
      >
        <div
          className="sell-form-card"
          style={{
            maxWidth: "450px",
            width: "100%",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "50px", color: "#3b82f6", marginBottom: "15px" }}
          >
            <i className="fas fa-user-lock"></i>
          </div>
          <h2>Yêu cầu đăng nhập</h2>
          <p style={{ color: "#666", marginBottom: "25px", fontSize: "14px" }}>
            Vui lòng đăng nhập tài khoản ReWear để có quyền đăng bài và quản lý
            sản phẩm thanh lý của bạn.
          </p>

          {/* Bạn có thể thay khối form này thành component <Login /> riêng biệt nếu có sẵn */}
          <form
            onSubmit={handleInlineLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              textAlign: "left",
            }}
          >
            <div className="form-group">
              <label>
                Tài khoản / Email <span className="required">*</span>
              </label>
              <input
                type="text"
                name="email"
                required
                placeholder="Nhập email của bạn..."
                value={loginData.email}
                onChange={handleLoginInputChange}
              />
            </div>
            <div className="form-group">
              <label>
                Mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Nhập mật khẩu..."
                value={loginData.password}
                onChange={handleLoginInputChange}
              />
            </div>
            <button
              type="submit"
              className="btn-submit-sell-form"
              style={{ marginTop: "10px", width: "100%" }}
            >
              <i className="fas fa-sign-in-alt"></i> Đăng nhập ngay
            </button>
          </form>

          <div style={{ marginTop: "20px", fontSize: "13px", color: "#888" }}>
            Chưa có tài khoản?{" "}
            <span
              style={{ color: "#3b82f6", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Đăng ký ngay
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ================= NẾU ĐÃ ĐĂNG NHẬP: HIỂN THỊ GIAO DIỆN FORM ĐĂNG BÁN NHƯ CŨ =================
  return (
    <div className="sell-page-container">
      <div className="sell-form-card">
        <div className="sell-form-header">
          <h2>Đăng thanh lý quần áo cũ</h2>
          <p>
            Tủ đồ của bạn quá đầy? Hãy chia sẻ và tái sinh chúng cùng cộng đồng
            ReWear nhé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sell-main-form">
          {/* ================= KHỐI 1: TẢI ẢNH THỰC TẾ ================= */}
          <div className="form-section">
            <h3>
              1. Hình ảnh thực tế sản phẩm <span className="required">*</span>
            </h3>
            <p className="section-subtitle">
              Nên chụp rõ form áo/quần, mác thương hiệu và các góc bị xước/lỗi
              nếu có (Tối đa 4 ảnh).
            </p>

            <div className="image-upload-wrapper">
              {images.map((imgUrl, index) => (
                <div key={index} className="uploaded-image-box">
                  <img src={imgUrl} alt="Preview sản phẩm" />
                  <button
                    type="button"
                    className="btn-remove-img"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="upload-trigger-box">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <div className="upload-box-content">
                    <i className="fas fa-camera-retro"></i>
                    <span>Thêm ảnh ({images.length}/4)</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* ================= KHỐI 2: THÔNG TIN CHI TIẾT ================= */}
          <div className="form-section">
            <h3>2. Thông tin mô tả sản phẩm</h3>

            <div className="form-grid-2">
              <div className="form-group full-width">
                <label>
                  Tiêu đề tin đăng <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ví dụ: Áo khoác Varsity Jacket Vintage Local Brand"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Danh mục đồ <span className="required">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="nam">Đồ Nam</option>
                  <option value="nu">Đồ Nữ</option>
                  <option value="tre-em">Trẻ Em</option>
                  <option value="phu-kien">Phụ kiện / Giày dép</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Kích cỡ (Size) <span className="required">*</span>
                </label>
                <select
                  name="size"
                  required
                  value={formData.size}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn Size --</option>
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                  <option value="XXL">Size XXL</option>
                  <option value="freesize">Freesize</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Độ mới thực tế (Condition) <span className="required">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="99">
                    Mới 99% (Hàng lướt mua về chưa mặc)
                  </option>
                  <option value="95">
                    Mới 95% (Còn rất tốt, vải chưa sờn)
                  </option>
                  <option value="90">
                    Mới 90% (Đã mặc vài lần, ngoại quan đẹp)
                  </option>
                  <option value="85">
                    Mới 85% (Có dấu hiệu sử dụng, không rách)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Thương hiệu / Xuất xứ</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="Ví dụ: Zara, Uniqlo, Local Brand, không rõ..."
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div
              className="form-group full-width"
              style={{ marginTop: "15px" }}
            >
              <label>
                Mô tả chi tiết tình trạng đồ <span className="required">*</span>
              </label>
              <textarea
                name="description"
                rows="5"
                required
                placeholder="Hãy chia sẻ lý do thanh lý, số đo chiều cao/cân nặng vừa vặn, và mô tả chân thực các lỗi nhỏ..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* ================= KHỐI 3: ĐỊNH GIÁ & ĐỊA ĐIỂM ================= */}
          <div className="form-section">
            <h3>3. Định giá & Khu vực giao nhận</h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Giá mua gốc lúc trước (đ)</label>
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="Ví dụ: 500000"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Giá bạn muốn thanh lý (đ) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="sellPrice"
                  required
                  placeholder="Ví dụ: 150000"
                  value={formData.sellPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Khu vực xem đồ / Gửi hàng <span className="required">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Khác">Các tỉnh thành khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nút gửi form */}
          <div className="sell-submit-box">
            <button type="submit" className="btn-submit-sell-form">
              <i className="fas fa-check-circle"></i> Đăng bán ngay lập tức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
