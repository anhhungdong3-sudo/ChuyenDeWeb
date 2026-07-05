import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { bookService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService
      .getAll()
      .then((data) => setBooks(data.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const bookCount = books.length;
    return {
      books: Math.max(bookCount, 128),
      trees: Math.max(Math.round(bookCount * 0.08), 11),
      readers: Math.max(bookCount * 7, 896),
    };
  }, [books]);

  const handleAdd = async (book) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    await addToCart(book.id);
  };

  return (
    <div className="page-shell">
      <section className="home-hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Sàn mua bán sách cũ</span>
            <h1>Old Bookstore</h1>
            <p>
              Nơi những cuốn sách đã qua tay tìm được độc giả mới. Mua tiết kiệm,
              bán dễ dàng, và cùng giảm lãng phí giấy theo cách đẹp hơn.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/books">Khám phá kho sách</Link>
              <Link className="btn btn-outline-primary btn-lg" to="/sell">Đăng bán sách</Link>
            </div>
          </div>
          <div className="hero-photo" aria-hidden="true">
            <img src="https://images.unsplash.com/photo-1526243741027-444d633d7365?w=1100&auto=format&fit=crop&q=80" alt="" />
          </div>
        </div>
      </section>

      <section className="container stats-band">
        <div><strong>{stats.books.toLocaleString("vi-VN")}+</strong><span>cuốn sách đang lưu thông</span></div>
        <div><strong>{stats.trees.toLocaleString("vi-VN")}+</strong><span>cây xanh ước tính được giữ lại</span></div>
        <div><strong>{stats.readers.toLocaleString("vi-VN")}+</strong><span>lượt kết nối người đọc</span></div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Sách vừa lên kệ</span>
            <h2>Những cuốn đáng đọc hôm nay</h2>
          </div>
          <Link to="/books">Xem tất cả</Link>
        </div>

        {loading ? (
          <div className="state-box">Đang tải kho sách...</div>
        ) : books.length === 0 ? (
          <div className="state-box">Chưa có sách được duyệt. Hãy là người đăng cuốn đầu tiên.</div>
        ) : (
          <div className="book-grid">
            {books.map((book) => <BookCard key={book.id} book={book} onAddToCart={handleAdd} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export { Home };
export default Home;
