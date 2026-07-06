import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { bookService, formatCurrency } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    bookService
      .getById(id)
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/books/${id}` } });
      return;
    }
    await addToCart(book.id);
    setMessage("Đã thêm sách vào giỏ hàng.");
  };

  if (loading) return <div className="container page-section"><div className="state-box">Đang tải chi tiết sách...</div></div>;

  if (!book) {
    return (
      <div className="container page-section">
        <div className="state-box">
          Không tìm thấy sách.
          <Link className="btn btn-primary ms-3" to="/books">Quay lại kho sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="breadcrumb-line">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/books">Kho sách</Link>
        <span>/</span>
        <span>{book.title}</span>
      </div>

      <section className="detail-grid">
        <div className="detail-cover">
          <img src={book.imageUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80"} alt={book.title} />
        </div>
        <div className="detail-info">
          <span className="condition-pill inline">{book.conditionLabel}</span>
          <h1>{book.title}</h1>
          <p className="book-author">Tác giả: <strong>{book.author || "Chưa rõ"}</strong></p>
          <StarRating value={book.rating || 4.8} count={book.reviewCount || 18} />
          <div className="detail-price">{formatCurrency(book.price)}</div>

          <dl className="book-specs">
            <div><dt>Danh mục</dt><dd>{book.categoryName}</dd></div>
            <div><dt>Nhà xuất bản</dt><dd>{book.publisher || "Chưa cập nhật"}</dd></div>
            <div><dt>Năm xuất bản</dt><dd>{book.publishYear || "Chưa rõ"}</dd></div>
            <div><dt>Số trang</dt><dd>{book.pages || "Chưa rõ"}</dd></div>
            <div><dt>Số lượng</dt><dd>{book.quantity ?? 0}</dd></div>
            <div><dt>Người bán</dt><dd>Shop #{book.shopId}</dd></div>
            <div><dt>Trạng thái</dt><dd>{book.statusLabel}</dd></div>
          </dl>

          {message && <div className="alert alert-success">{message}</div>}
          <div className="detail-actions">
            <button className="btn btn-primary btn-lg" type="button" onClick={handleAdd} disabled={book.status === "SOLD"}>
              Thêm vào giỏ hàng
            </button>
            <Link className="btn btn-outline-primary btn-lg" to="/checkout">Thanh toán</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { BookDetail };
export default BookDetail;
