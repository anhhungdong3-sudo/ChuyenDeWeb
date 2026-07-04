import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { bookService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const conditionOptions = [
  { value: "", label: "Tất cả tình trạng" },
  { value: "NEW", label: "Sách mới" },
  { value: "LIKE_NEW", label: "Như mới" },
  { value: "GOOD", label: "Tốt" },
  { value: "FAIR", label: "Khá" },
  { value: "POOR", label: "Cần phục hồi" },
];

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    condition: searchParams.get("condition") || "",
    maxPrice: Number(searchParams.get("maxPrice") || 1000000),
    sort: searchParams.get("sort") || "newest",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([bookService.getAll(filters.condition ? { condition: filters.condition } : {}), bookService.getCategories()])
      .then(([bookData, categoryData]) => {
        setBooks(bookData);
        setCategories(categoryData);
      })
      .finally(() => setLoading(false));
  }, [filters.condition]);

  useEffect(() => {
    const next = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) next[key] = String(value);
    });
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);

  const filteredBooks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const result = books.filter((book) => {
      const matchSearch =
        !search ||
        [book.title, book.author, book.publisher].some((field) =>
          String(field || "").toLowerCase().includes(search),
        );
      const matchCategory = !filters.categoryId || String(book.category?.id) === String(filters.categoryId);
      const matchPrice = Number(book.price || 0) <= Number(filters.maxPrice);
      return matchSearch && matchCategory && matchPrice;
    });

    return result.sort((a, b) => {
      if (filters.sort === "price-asc") return Number(a.price) - Number(b.price);
      if (filters.sort === "price-desc") return Number(b.price) - Number(a.price);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [books, filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const handleAdd = async (book) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    await addToCart(book.id);
  };

  return (
    <div className="container page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Kho sách cũ</span>
          <h1>Tìm cuốn sách tiếp theo của bạn</h1>
        </div>
        <span className="result-count">{filteredBooks.length} kết quả</span>
      </div>

      <div className="catalog-layout">
        <aside className="filter-panel">
          <label className="form-label">Từ khóa</label>
          <input className="form-control" value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} placeholder="Tên sách, tác giả..." />

          <label className="form-label mt-3">Danh mục</label>
          <select className="form-select" value={filters.categoryId} onChange={(e) => updateFilter("categoryId", e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <label className="form-label mt-3">Tình trạng</label>
          <select className="form-select" value={filters.condition} onChange={(e) => updateFilter("condition", e.target.value)}>
            {conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <label className="form-label mt-3">Giá tối đa: {Number(filters.maxPrice).toLocaleString("vi-VN")}đ</label>
          <input className="form-range" type="range" min="20000" max="1000000" step="10000" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", Number(e.target.value))} />

          <label className="form-label mt-3">Sắp xếp</label>
          <select className="form-select" value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}>
            <option value="newest">Mới đăng</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
          </select>

          <button className="btn btn-outline-primary w-100 mt-4" type="button" onClick={() => setFilters({ search: "", categoryId: "", condition: "", maxPrice: 1000000, sort: "newest" })}>
            Xóa bộ lọc
          </button>
        </aside>

        <main>
          {loading ? (
            <div className="state-box">Đang tải sách...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="state-box">Không có sách phù hợp với bộ lọc hiện tại.</div>
          ) : (
            <div className="book-grid">
              {filteredBooks.map((book) => <BookCard key={book.id} book={book} onAddToCart={handleAdd} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export { BooksPage };
export default BooksPage;
