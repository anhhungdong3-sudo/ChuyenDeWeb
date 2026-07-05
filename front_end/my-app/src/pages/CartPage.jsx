import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../services/api";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, cartLoading, updateQuantity, removeFromCart } = useCart();
  const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  if (cartLoading) {
    return <div className="container page-section"><div className="state-box">Đang đồng bộ giỏ hàng...</div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <div className="state-box">
          <h2>Giỏ hàng đang trống</h2>
          <p>Chọn vài cuốn sách cũ hợp gu rồi quay lại thanh toán nhé.</p>
          <Link className="btn btn-primary" to="/books">Khám phá kho sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Giỏ hàng</span>
          <h1>{items.length} đầu sách đã chọn</h1>
        </div>
      </div>

      <div className="cart-layout-new">
        <div className="cart-list">
          {items.map((item) => {
            const book = item.book || item.product || item;
            const quantity = Number(item.quantity || 1);
            return (
              <article className="cart-row" key={item.id}>
                <img src={book.imageUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=70"} alt={book.title} />
                <div>
                  <Link to={`/books/${book.id}`} className="cart-title">{book.title}</Link>
                  <p>{book.author || "Chưa rõ tác giả"} · {book.conditionLabel || book.bookCondition || "Tốt"}</p>
                  <strong>{formatCurrency(book.price)}</strong>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, quantity + 1)}>+</button>
                </div>
                <button className="btn btn-link text-danger" type="button" onClick={() => removeFromCart(item.id)}>Xóa</button>
              </article>
            );
          })}
        </div>

        <aside className="summary-card">
          <h2>Tóm tắt đơn hàng</h2>
          <div><span>Tạm tính</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Vận chuyển</span><strong>{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}</strong></div>
          <div className="summary-total"><span>Tổng cộng</span><strong>{formatCurrency(total)}</strong></div>
          <button className="btn btn-primary w-100" type="button" onClick={() => navigate("/checkout")}>Thanh toán</button>
        </aside>
      </div>
    </div>
  );
};

export { CartPage };
export default CartPage;
