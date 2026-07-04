import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../services/api";
import StarRating from "./StarRating";

const fallbackCover = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=75";

const BookCard = ({ book, onAddToCart }) => (
  <article className="book-card">
    <Link to={`/books/${book.id}`} className="book-cover-link">
      <img src={book.imageUrl || fallbackCover} alt={book.title} />
      <span className="condition-pill">{book.conditionLabel}</span>
    </Link>

    <div className="book-card-body">
      <div className="book-category">{book.categoryName}</div>
      <Link to={`/books/${book.id}`} className="book-title">{book.title}</Link>
      <p className="book-author">{book.author || "Chưa cập nhật tác giả"}</p>
      <StarRating value={book.rating || 4.7} count={book.reviewCount || 12} />
      <div className="book-card-footer">
        <strong>{formatCurrency(book.price)}</strong>
        <button className="btn btn-sm btn-primary" type="button" onClick={() => onAddToCart?.(book)}>
          Thêm
        </button>
      </div>
    </div>
  </article>
);

export default BookCard;
