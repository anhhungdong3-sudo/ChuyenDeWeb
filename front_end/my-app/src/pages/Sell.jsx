import React, { useEffect, useState } from "react";
import { bookService } from "../services/api";

const currentYear = new Date().getFullYear();

const Sell = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    publishYear: currentYear,
    pages: "",
    price: "",
    quantity: 1,
    imageUrl: "",
    bookCondition: "GOOD",
    categoryId: "",
    description: "", // <-- THÊM DÒNG NÀY
  });

  // State quản lý lỗi hiển thị chữ đỏ
  const [fieldErrors, setFieldErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Khởi tạo danh sách danh mục (Bất đồng bộ)
  useEffect(() => {
    bookService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // 2. Hàm kiểm tra định dạng từng trường dữ liệu (Real-time & Submit Validation)
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "title":
        if (!value.trim())
          errorMsg = "Tên sách không được để trống hoặc chỉ chứa khoảng trắng.";
        break;
      case "author":
        if (!value.trim()) errorMsg = "Tên tác giả không được để trống.";
        break;
      case "publisher":
        if (!value.trim()) errorMsg = "Nhà xuất bản không được để trống.";
        break;
      case "price":
        if (!value || Number(value) <= 0)
          errorMsg = "Giá bán phải là số nguyên dương lớn hơn 0.";
        break;
      case "pages":
        if (!value || Number(value) <= 0)
          errorMsg = "Số trang của sách phải lớn hơn 0.";
        break;
      case "quantity":
        if (!value || Number(value) <= 0)
          errorMsg = "Số lượng đăng bán phải lớn hơn 0.";
        break;
      case "publishYear":
        const year = Number(value);
        if (!value || year < 1000 || year > currentYear) {
          errorMsg = `Năm xuất bản hợp lệ nằm trong khoảng từ năm 1000 đến năm ${currentYear}.`;
        }
        break;
      case "categoryId":
        if (!value)
          errorMsg = "Vui lòng lựa chọn một danh mục cụ thể cho sách.";
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  // 3. Hàm bắt sự kiện thay đổi dữ liệu trong ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // Kiểm tra lỗi trực tiếp ngay khi người dùng đang gõ
  };

  // 4. Xử lý khi chọn tệp tin hình ảnh
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Kích thước ảnh quá lớn (Tối đa 5MB).",
      }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 5. Kiểm tra toàn bộ form trước khi gửi dữ liệu lên server
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Quét qua các trường để kiểm tra tổng thể
    Object.keys(form).forEach((key) => {
      if (key !== "imageUrl" && key !== "bookCondition") {
        const msg = validateField(key, form[key]);
        if (msg) isValid = false;
      }
    });

    if (!imageFile && !form.imageUrl) {
      errors.image =
        "Vui lòng đăng tải hình ảnh bìa sách để người mua dễ tham khảo.";
      isValid = false;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  // 6. Gửi dữ liệu (Xử lý bất đồng bộ tuần tự)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) {
      setError(
        "Thông tin điền chưa đúng định dạng. Vui lòng kiểm tra lại các vùng thông báo màu đỏ.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      // Đợi tải ảnh lên hoàn tất trước khi tạo bài đăng sách
      if (imageFile) {
        setUploading(true);
        const uploadResult = await bookService.uploadImage(imageFile);
        imageUrl = uploadResult.imageUrl;
        setUploading(false);
      }

      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim(),
        publishYear: Number(form.publishYear),
        pages: Number(form.pages),
        price: Number(form.price),
        quantity: Number(form.quantity),
        imageUrl,
        bookCondition: form.bookCondition,
        categoryId: Number(form.categoryId),
      };

      const result = await bookService.create(payload);
      setMessage(
        result.message ||
          "Đăng sách thành công! Bài viết của bạn đang chờ Admin phê duyệt.",
      );

      // Khôi phục lại trạng thái form ban đầu
      setForm({
        title: "",
        author: "",
        publisher: "",
        publishYear: currentYear,
        pages: "",
        price: "",
        quantity: 1,
        imageUrl: "",
        bookCondition: "GOOD",
        categoryId: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview("");
      setFieldErrors({});
    } catch (err) {
      setUploading(false);
      setError(
        err.response?.data?.message ||
          "Đã xảy ra lỗi hệ thống khi đăng sách. Vui lòng thử lại sau.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      {/* Tiêu đề trang */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2">
          Thương mại sách cũ
        </span>
        <h1 className="fw-bold">Đăng Sách Lên Kệ Bán</h1>
        <p className="text-muted">
          Điền đầy đủ thông tin chi tiết dưới đây để cuốn sách của bạn nhanh
          chóng được duyệt công khai.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {message && (
          <div className="alert alert-success shadow-sm p-3 mb-4 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger shadow-sm p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="row g-4">
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT SÁCH */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="card-title fw-semibold mb-4 text-primary pb-2 border-bottom">
                1. Thông tin nội dung
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium">Tên cuốn sách</label>
                  <input
                    name="title"
                    className={`form-control form-control-lg ${fieldErrors.title ? "is-invalid border-danger" : ""}`}
                    placeholder="Ví dụ: Đắc Nhân Tâm"
                    value={form.title}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.title && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.title}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Tác giả</label>
                  <input
                    name="author"
                    className={`form-control ${fieldErrors.author ? "is-invalid border-danger" : ""}`}
                    placeholder="Tên người sáng tác"
                    value={form.author}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.author && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.author}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Nhà xuất bản</label>
                  <input
                    name="publisher"
                    className={`form-control ${fieldErrors.publisher ? "is-invalid border-danger" : ""}`}
                    placeholder="Ví dụ: NXB Trẻ"
                    value={form.publisher}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.publisher && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.publisher}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Năm xuất bản</label>
                  <input
                    name="publishYear"
                    type="number"
                    className={`form-control ${fieldErrors.publishYear ? "is-invalid border-danger" : ""}`}
                    value={form.publishYear}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.publishYear && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.publishYear}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Số trang</label>
                  <input
                    name="pages"
                    type="number"
                    className={`form-control ${fieldErrors.pages ? "is-invalid border-danger" : ""}`}
                    placeholder="Nhập số trang"
                    value={form.pages}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.pages && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.pages}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium">Danh mục</label>
                  <select
                    name="categoryId"
                    className={`form-select ${fieldErrors.categoryId ? "is-invalid border-danger" : ""}`}
                    value={form.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.categoryId && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.categoryId}
                    </div>
                  )}
                </div>

                {/* ================= THÊM TRƯỜNG MÔ TẢ VÀO ĐÂY ================= */}
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Mô tả chi tiết bài đăng
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    className={`form-control ${fieldErrors.description ? "is-invalid border-danger" : ""}`}
                    placeholder="Nhập thông tin mô tả cuốn sách (Ví dụ: Sách có ghi chép bút chì nhẹ, nội dung còn đầy đủ, bọc plastic cẩn thận...)"
                    value={form.description}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.description && (
                    <div
                      className="text-danger small mt-1 fw-medium"
                      style={{ color: "red" }}
                    >
                      {fieldErrors.description}
                    </div>
                  )}
                </div>
                {/* ============================================================= */}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: GIÁ CẢ, SỐ LƯỢNG & ẢNH BÌA */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="card-title fw-semibold mb-4 text-primary pb-2 border-bottom">
                2. Thương mại & Hình ảnh
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Giá bán mong muốn (VND)
                  </label>
                  <div className="input-group">
                    <input
                      name="price"
                      type="number"
                      className={`form-control form-control-lg ${fieldErrors.price ? "is-invalid border-danger" : ""}`}
                      placeholder="0"
                      value={form.price}
                      onChange={handleInputChange}
                    />
                    <span className="input-group-text bg-light fw-medium">
                      đ
                    </span>
                  </div>
                  {fieldErrors.price && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.price}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium">Số lượng hàng</label>
                  <input
                    name="quantity"
                    type="number"
                    className={`form-control ${fieldErrors.quantity ? "is-invalid border-danger" : ""}`}
                    value={form.quantity}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.quantity && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.quantity}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium">
                    Tình trạng thực tế
                  </label>
                  <select
                    name="bookCondition"
                    className="form-select"
                    value={form.bookCondition}
                    onChange={handleInputChange}
                  >
                    <option value="NEW">Mới hoàn toàn (100%)</option>
                    <option value="LIKE_NEW">Như mới (&gt; 95%)</option>
                    <option value="GOOD">Tình trạng tốt, rõ chữ</option>
                    <option value="FAIR">Hơi cũ, gáy sờn nhẹ</option>
                    <option value="POOR">Rách nhẹ / Cần phục hồi</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium">
                    Tải lên ảnh bìa sách
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`form-control ${fieldErrors.image ? "is-invalid border-danger" : ""}`}
                    onChange={handleImageChange}
                  />
                  {uploading && (
                    <small className="text-primary d-block mt-1 animate-pulse">
                      ⚙️ Đang đồng bộ hóa tải hình ảnh...
                    </small>
                  )}
                  {fieldErrors.image && (
                    <div className="text-danger small mt-1 fw-medium">
                      {fieldErrors.image}
                    </div>
                  )}
                </div>

                {/* Khung hiển thị xem trước ảnh (Preview) */}
                {imagePreview && (
                  <div className="col-12 text-center mt-3 position-relative">
                    <div className="p-2 border rounded bg-light inline-block">
                      <img
                        className="img-thumbnail shadow-sm"
                        src={imagePreview}
                        alt="Xem trước bìa sách"
                        style={{ maxHeight: "160px", objectFit: "contain" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NÚT THỰC THI CHÍNH */}
        <div className="text-center mt-5">
          <button
            className="btn btn-primary btn-lg px-5 py-3 shadow fw-bold"
            disabled={submitting || uploading}
            type="submit"
            style={{ minWidth: "250px", borderRadius: "10px" }}
          >
            {uploading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Đang xử lý ảnh...
              </>
            ) : submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Đang gửi kiểm duyệt...
              </>
            ) : (
              "🚀 Gửi Yêu Cầu Duyệt Sách"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { Sell };
export default Sell;
