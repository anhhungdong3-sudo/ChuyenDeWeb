import React, { useEffect, useState } from "react";
import { bookService, formatCurrency } from "../services/api";

const AdminApproval = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await bookService.getPending();
      setPendingBooks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    const result = await bookService.approve(id);
    setMessage(result.message || "Đã duyệt sách.");
    await loadPending();
  };

  const handleReject = async (id) => {
    const result = await bookService.reject(id);
    setMessage(result.message || "Đã từ chối sách.");
    await loadPending();
  };

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Quản trị</span>
          <h1>Duyệt bài đăng sách cũ</h1>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {loading ? (
        <div className="state-box">Đang tải danh sách chờ duyệt...</div>
      ) : pendingBooks.length === 0 ? (
        <div className="state-box">Không còn sách nào chờ duyệt.</div>
      ) : (
        <div className="approval-list">
          {pendingBooks.map((book) => (
            <article className="approval-card" key={book.id}>
              <img src={book.imageUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=220&auto=format&fit=crop&q=70"} alt={book.title} />
              <div>
                <h2>{book.title}</h2>
                <p>{book.author} · {book.publisher} · {book.publishYear}</p>
                <p>{book.categoryName} · {book.conditionLabel} · Shop #{book.shopId}</p>
                <strong>{formatCurrency(book.price)}</strong>
              </div>
              <div className="approval-actions">
                <button className="btn btn-primary" type="button" onClick={() => handleApprove(book.id)}>Duyệt</button>
                <button className="btn btn-outline-danger" type="button" onClick={() => handleReject(book.id)}>Từ chối</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export { AdminApproval };
export default AdminApproval;
