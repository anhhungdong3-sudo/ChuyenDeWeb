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
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    bookService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      let imageUrl = form.imageUrl;

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
      setMessage(result.message || "Đăng sách thành công. Bài đăng đang chờ admin duyệt.");
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
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || "Không thể đăng sách. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Bán sách cũ</span>
          <h1>Đăng một cuốn sách lên kệ</h1>
        </div>
      </div>

      <form className="form-card sell-form" onSubmit={handleSubmit}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Tên sách</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Giá bán</label>
            <input className="form-control" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tác giả</label>
            <input className="form-control" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nhà xuất bản</label>
            <input className="form-control" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Năm xuất bản</label>
            <input className="form-control" type="number" min="1000" max={currentYear} value={form.publishYear} onChange={(e) => setForm({ ...form, publishYear: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Số trang</label>
            <input className="form-control" type="number" min="1" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Số lượng</label>
            <input className="form-control" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Tình trạng</label>
            <select className="form-select" value={form.bookCondition} onChange={(e) => setForm({ ...form, bookCondition: e.target.value })}>
              <option value="NEW">Mới</option>
              <option value="LIKE_NEW">Như mới</option>
              <option value="GOOD">Tốt</option>
              <option value="FAIR">Khá</option>
              <option value="POOR">Cần phục hồi</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Danh mục</label>
            <select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ảnh bìa sách</label>
            <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
            {uploading && <small className="text-muted">Đang tải ảnh lên...</small>}
          </div>
        </div>

        {imagePreview && <img className="sell-preview" src={imagePreview} alt="Xem trước bìa sách" />}

        <button className="btn btn-primary btn-lg mt-4" disabled={submitting || uploading} type="submit">
          {uploading ? "Đang tải ảnh lên..." : submitting ? "Đang gửi duyệt..." : "Gửi admin duyệt"}
        </button>
      </form>
    </div>
  );
};

export { Sell };
export default Sell;
