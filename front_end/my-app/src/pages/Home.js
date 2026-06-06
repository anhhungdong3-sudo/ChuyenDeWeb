import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
import "../styles/Home.css";

// Danh sách sách mẫu nổi bật (Featured Books) để giao diện luôn đầy đặn và đẹp mắt
const staticBooks = [
  {
    id: "f1",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "van-hoc",
    categoryName: "Văn Học",
    price: 65000,
    oldPrice: 89000,
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    tag: "Bán chạy"
  },
  {
    id: "f2",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "ky-nang-song",
    categoryName: "Kỹ Năng Sống",
    price: 76000,
    oldPrice: 110000,
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
    tag: "Khuyên đọc"
  },
  {
    id: "f3",
    title: "Cha Giàu Cha Nghèo",
    author: "Robert Kiyosaki",
    category: "kinh-te",
    categoryName: "Kinh Tế",
    price: 95000,
    oldPrice: 135000,
    rating: 4,
    imageUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
    tag: "Ưa chuộng"
  },
  {
    id: "f4",
    title: "Harry Potter & Hòn Đá Phù Thủy",
    author: "J.K. Rowling",
    category: "thieu-nhi",
    categoryName: "Thiếu Nhi",
    price: 119000,
    oldPrice: 180000,
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=600&auto=format&fit=crop&q=80",
    tag: "Mới về"
  },
  {
    id: "f5",
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    category: "van-hoc",
    categoryName: "Văn Học",
    price: 82000,
    oldPrice: 125000,
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600&auto=format&fit=crop&q=80",
    tag: "Bán chạy"
  },
  {
    id: "f6",
    title: "Tư Duy Nhanh Và Chậm",
    author: "Daniel Kahneman",
    category: "ky-nang-song",
    categoryName: "Kỹ Năng Sống",
    price: 145000,
    oldPrice: 210000,
    rating: 4,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    tag: "Kinh điển"
  }
];

// Sách tiêu điểm tháng (Spotlight Book)
const spotlightBook = {
  title: "Sapiens: Lược Sử Loài Người",
  author: "Yuval Noah Harari",
  category: "Khoa Học / Lịch Sử",
  rating: 5,
  reviewCount: 1540,
  price: 139000,
  oldPrice: 198000,
  description: "Cuốn sách vẽ nên một bức tranh toàn cảnh vĩ đại về lịch sử nhân loại, từ những bước tiến hóa đầu tiên của giống loài Homo Sapiens trong kỷ đồ đá cho đến các bước đột phá cách mạng của khoa học, công nghệ hiện đại ở thế kỷ 21. Sapiens giải mã nguồn gốc của xã hội, văn hóa và tôn giáo.",
  imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
  tag: "ĐỌC NHIỀU NHẤT THÁNG"
};

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Gọi API lấy danh sách sách ký gửi trực tuyến
  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi kết nối API danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProducts();
  }, []);

  const formatPrice = (value) => {
    if (!value) return "0đ";
    return value.toLocaleString("vi-VN") + "đ";
  };

  // Lọc sách theo thể loại được chọn trên UI
  const filteredStaticBooks = selectedCategory === "all"
    ? staticBooks
    : staticBooks.filter(book => book.category === selectedCategory);

  return (
    <div className="home-page">
      {/* 1. HERO BANNER SECTION */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="badge-amber">📖 Trạm Sách Cũ - Tiếp Nối Tri Thức</span>
          <h1>Tiếp tục hành trình của những cuốn sách cùng ReBook</h1>
          <p>
            Mua bán, trao đổi và ký gửi sách cũ uy tín số 1 Việt Nam. Khám phá kho sách
            phong phú nhiều thể loại với mức giá tiết kiệm lên tới 70%. Bảo vệ môi trường giấy.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="btn-hero-primary">
              <i className="fas fa-book-open"></i> Khám Phá Tủ Sách
            </Link>
            <Link to="/sell" className="btn-hero-secondary">
              <i className="fas fa-arrow-alt-circle-up"></i> Ký Gửi Sách Cũ
            </Link>
          </div>
        </div>
        <div className="hero-image-box">
          <div className="cozy-books-wrapper">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80"
              alt="Không gian đọc sách ấm cúng"
              className="main-hero-img"
            />
            <div className="quote-overlay">
              <p>"Một cuốn sách hay là một người bạn tốt."</p>
              <span>— Khuyết danh</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="home-stats-wrapper">
        <div className="home-stats">
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Mộc bản & Tín đồ mê đọc</p>
          </div>
          <div className="stat-item">
            <h3>120K+</h3>
            <p>Cuốn sách được trao đổi</p>
          </div>
          <div className="stat-item">
            <h3>10 Tấn</h3>
            <p>Lượng giấy vụn tránh lãng phí</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="home-section categories-section">
        <div className="section-header">
          <h2>Tìm Sách Theo Thể Loại</h2>
          <p>Lựa chọn thể loại phù hợp với tâm hồn và nhu cầu học hỏi của bạn</p>
        </div>
        <div className="categories-grid">
          <Link to="/products?cate=van-hoc" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60"
              alt="Sách Văn Học"
            />
            <div className="category-overlay">
              <span>Sách Văn Học</span>
            </div>
          </Link>
          <Link to="/products?cate=kinh-te" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1444653389962-8149286c578a?w=400&auto=format&fit=crop&q=60"
              alt="Kinh Tế"
            />
            <div className="category-overlay">
              <span>Kinh Tế - Kinh Doanh</span>
            </div>
          </Link>
          <Link to="/products?cate=ky-nang-song" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60"
              alt="Kỹ năng sống"
            />
            <div className="category-overlay">
              <span>Kỹ Năng Sống</span>
            </div>
          </Link>
          <Link to="/products?cate=thieu-nhi" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=60"
              alt="Thiếu nhi"
            />
            <div className="category-overlay">
              <span>Sách Thiếu Nhi</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED BOOKS WITH TABS */}
      <section className="home-section featured-books-section">
        <div className="container-inner">
          <div className="section-header">
            <h2>Tác Phẩm Được Yêu Thích</h2>
            <p>Tuyển tập những cuốn sách kinh điển có chất lượng và nội dung vượt thời gian</p>
          </div>

          {/* Bộ lọc Tab điều hướng */}
          <div className="category-tabs">
            <button
              className={selectedCategory === "all" ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedCategory("all")}
            >
              Tất Cả Sách
            </button>
            <button
              className={selectedCategory === "van-hoc" ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedCategory("van-hoc")}
            >
              Văn Học
            </button>
            <button
              className={selectedCategory === "kinh-te" ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedCategory("kinh-te")}
            >
              Kinh Tế
            </button>
            <button
              className={selectedCategory === "ky-nang-song" ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedCategory("ky-nang-song")}
            >
              Kỹ Năng Sống
            </button>
            <button
              className={selectedCategory === "thieu-nhi" ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedCategory("thieu-nhi")}
            >
              Thiếu Nhi
            </button>
          </div>

          {/* Lưới sách nổi bật */}
          <div className="books-grid">
            {filteredStaticBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover-wrapper">
                  <img src={book.imageUrl} alt={book.title} className="book-cover" />
                  {book.tag && <span className="book-tag">{book.tag}</span>}
                  <div className="book-spine"></div>
                </div>
                <div className="book-info">
                  <span className="book-category-label">{book.categoryName}</span>
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={i < book.rating ? "fas fa-star" : "far fa-star"}
                      ></i>
                    ))}
                  </div>
                  <div className="book-price-row">
                    <span className="book-price">{formatPrice(book.price)}</span>
                    {book.oldPrice && (
                      <span className="book-old-price">{formatPrice(book.oldPrice)}</span>
                    )}
                  </div>
                  <div className="book-action">
                    <button className="btn-add-to-cart">
                      <i className="fas fa-shopping-cart"></i> Mua Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOOK SPOTLIGHT SECTION */}
      <section className="book-spotlight-section">
        <div className="spotlight-container">
          <div className="spotlight-cover">
            <img src={spotlightBook.imageUrl} alt={spotlightBook.title} />
            <div className="book-spine-gold"></div>
          </div>
          <div className="spotlight-info">
            <span className="spotlight-tag">{spotlightBook.tag}</span>
            <h2>{spotlightBook.title}</h2>
            <p className="spotlight-author">Tác giả: <strong>{spotlightBook.author}</strong> | Thể loại: <strong>{spotlightBook.category}</strong></p>
            <div className="spotlight-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={i < spotlightBook.rating ? "fas fa-star" : "far fa-star"}
                ></i>
              ))}
              <span>({spotlightBook.reviewCount} đánh giá khách hàng)</span>
            </div>
            <p className="spotlight-desc">{spotlightBook.description}</p>
            <div className="spotlight-price-row">
              <span className="spotlight-price">{formatPrice(spotlightBook.price)}</span>
              <span className="spotlight-old-price">{formatPrice(spotlightBook.oldPrice)}</span>
              <span className="discount-badge">Tiết kiệm 30%</span>
            </div>
            <div className="spotlight-actions">
              <button className="btn-spotlight-primary">
                <i className="fas fa-shopping-bag"></i> Mua Sách Ngay
              </button>
              <button className="btn-spotlight-secondary">
                <i className="far fa-heart"></i> Yêu Thích
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE MARKETPLACE SECTION (Sách Ký Gửi Mới Lên Kệ) */}
      <section className="home-section gray-bg live-marketplace-section">
        <div className="container-inner">
          <div className="section-header">
            <h2>Sách Cũ Ký Gửi Vừa Lên Kệ</h2>
            <p>Khám phá sách cũ giá rẻ được mọi người đăng ký gửi bán trực tiếp trên hệ thống</p>
          </div>

          {loading ? (
            <div
              className="text-center"
              style={{ padding: "40px", fontSize: "16px", color: "#666" }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: "8px", color: "#8b5e3c" }}
              ></i>
              Đang kết nối thư viện sách cũ ký gửi...
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center"
              style={{ padding: "40px", color: "#888" }}
            >
              Hiện chưa có sách ký gửi nào trực tuyến. Hãy trở thành người đầu tiên ký gửi!
            </div>
          ) : (
            <div className="books-grid">
              {products.map((product) => (
                <div key={product.id} className="book-card border-card">
                  <div className="book-cover-wrapper">
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"}
                      alt={product.title}
                      className="book-cover"
                    />
                    <span className="book-condition-tag">
                      {product.status === "AVAILABLE" ? "Còn hàng" : "Đã bán"}
                    </span>
                    <div className="book-spine"></div>
                  </div>

                  <div className="book-info">
                    <span className="book-category-label">
                      Thể loại: {product.category || "Sách cũ"}
                    </span>
                    <h3 className="book-title" title={product.title}>{product.title}</h3>
                    <p className="book-author">Shop ID: #{product.shopId}</p>
                    <div className="book-price-row">
                      <span className="book-price">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="book-action">
                      <Link to={`/product/${product.id}`} className="btn-add-to-cart text-center-btn">
                        <i className="fas fa-search-plus"></i> Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: "40px" }}>
            <Link to="/products" className="btn-view-all-books">
              Xem toàn bộ kho sách cũ
            </Link>
          </div>
        </div>
      </section>

      {/* 7. USER BENIFITS SECTION */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-shipping-fast"></i>
            </div>
            <h4>Vận Chuyển Toàn Quốc</h4>
            <p>Giao sách tận nhà nhanh chóng, miễn phí đơn hàng từ 250k</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h4>Đảm Bảo Chất Lượng</h4>
            <p>Sách ký gửi được kiểm duyệt kỹ càng, đảm bảo không rách nát</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-redo"></i>
            </div>
            <h4>Trao Đổi Dễ Dàng</h4>
            <p>Đổi sách hoặc hoàn tiền 100% nếu sách lỗi không đúng cam kết</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
