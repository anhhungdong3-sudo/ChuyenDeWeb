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
    imageUrl: "",
    bookCondition: "GOOD",
    categoryId: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    bookService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      publisher: form.publisher.trim(),
      publishYear: Number(form.publishYear),
      pages: Number(form.pages),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      bookCondition: form.bookCondition,
      categoryId: Number(form.categoryId),
    };

    try {
      const result = await bookService.create(payload);
      setMessage(result.message || "Đăng sách thành công. Bài đăng đang chờ admin duyệt.");
      setForm({
        title: "",
        author: "",
        publisher: "",
        publishYear: currentYear,
        pages: "",
        price: "",
        imageUrl: "",
        bookCondition: "GOOD",
        categoryId: "",
      });
    } catch (err) {
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
            <label className="form-label">Ảnh bìa URL</label>
            <input className="form-control" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        {form.imageUrl && <img className="sell-preview" src={form.imageUrl} alt="Xem trước bìa sách" />}

        <button className="btn btn-primary btn-lg mt-4" disabled={submitting} type="submit">
          {submitting ? "Đang gửi duyệt..." : "Gửi admin duyệt"}
        </button>
      </form>
    </div>
  );
};

export { Sell };
export default Sell;
