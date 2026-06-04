import React, { useState, useEffect } from "react"; // 1. Bổ sung useState và useEffect
import { Link } from "react-router-dom";
import { productService } from "../services/api"; // 2. Import service gọi API sản phẩm
import "../styles/Home.css";

export const Home = () => {
  // 3. Khởi tạo state chứa danh sách sản phẩm thực tế từ Database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Gọi API lấy danh sách sản phẩm ngay khi trang web được tải
  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data); // Cập nhật dữ liệu thật vào state
      } catch (error) {
        console.error("Lỗi khi kết nối API danh sách sản phẩm:", error);
      } finally {
        setLoading(false); // Tắt trạng thái chờ loading
      }
    };

    fetchActiveProducts();
  }, []);

  // Hàm tiện ích định dạng hiển thị giá tiền VND (Ví dụ: 150000 -> 150.000đ)
  const formatPrice = (value) => {
    if (!value) return "0đ";
    return value.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="home-page">
      {/* 1. HERO BANNER SECTION */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="badge-green">Sống Xanh - Mặc Chất</span>
          <h1>Tái sinh tủ đồ cũ của bạn cùng ReWear</h1>
          <p>
            Nền tảng mua bán, thanh lý quần áo cũ ký gửi hàng đầu Việt Nam. Săn
            đồ độc bản chất lượng với giá tiết kiệm đến 70%.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="btn-hero-primary">
              Săn Đồ Cũ Ngay
            </Link>
            <Link to="/sell" className="btn-hero-secondary">
              <i className="fas fa-plus-circle"></i> Đăng Bán Miễn Phí
            </Link>
          </div>
        </div>
        <div className="hero-image-box">
          <img
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80"
            alt="Thời trang bền vững ReWear"
          />
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="home-stats">
        <div className="stat-item">
          <h3>50K+</h3>
          <p>Thành viên tham gia</p>
        </div>
        <div className="stat-item">
          <h3>120K+</h3>
          <p>Sản phẩm đã tái sinh</p>
        </div>
        <div className="stat-item">
          <h3>3.5 Tấn</h3>
          <p>Rác thải vải được giảm thiểu</p>
        </div>
      </section>

      {/* 3. CATEGORIES INDEX */}
      <section className="home-section">
        <div className="section-header">
          <h2>Mua theo danh mục</h2>
          <p>Tìm kiếm trang phục phù hợp với gu của bạn</p>
        </div>
        <div className="categories-grid">
          <Link to="/products?cate=nam" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=60"
              alt="Đồ nam"
            />
            <div className="category-overlay">
              <span>Đồ Nam</span>
            </div>
          </Link>
          <Link to="/products?cate=nu" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60"
              alt="Đồ nữ"
            />
            <div className="category-overlay">
              <span>Đồ Nữ</span>
            </div>
          </Link>
          <Link to="/products?cate=tre-em" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1622244244253-3048cb160da2?w=400&auto=format&fit=crop&q=60"
              alt="Trẻ em"
            />
            <div className="category-overlay">
              <span>Trẻ Em</span>
            </div>
          </Link>
          <Link to="/products?condition=99" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=60"
              alt="Hàng mới 99%"
            />
            <div className="category-overlay">
              <span>Hàng Mới 99%</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. NEW PRODUCTS FEED (Đã chuyển sang map từ state dữ liệu thật) */}
      <section className="home-section gray-bg">
        <div className="container-inner">
          <div className="section-header">
            <h2>Đồ cũ vừa lên kệ</h2>
            <p>Khám phá những món đồ secondhand độc nhất vô nhị từ cộng đồng</p>
          </div>

          {loading ? (
            <div
              className="text-center"
              style={{ padding: "40px", fontSize: "16px", color: "#666" }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: "8px", color: "#2e7d32" }}
              ></i>
              Đang tải danh sách sản phẩm mới...
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center"
              style={{ padding: "40px", color: "#888" }}
            >
              Hiện chưa có sản phẩm nào trực tuyến.
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrapper">
                    {/* Map chính xác trường dữ liệu từ Entity Backend (imageUrl và status) */}
                    <img
                      src={
                        product.imageUrl || "https://via.placeholder.com/200"
                      }
                      alt={product.title}
                    />
                    <span className="product-condition-tag">
                      {product.status === "AVAILABLE" ? "Còn hàng" : "Đã bán"}
                    </span>
                  </div>

                  <div className="product-info">
                    <div className="product-seller">
                      <i className="far fa-user-circle"></i>{" "}
                      {/* Tạm thời hiển thị ID Shop hoặc chuỗi cố định trước khi kết nối bảng User */}
                      <span>Shop #{product.shopId}</span>
                    </div>
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-meta">
                      <span className="product-size">
                        Danh mục: <b>{product.category || "Chưa phân loại"}</b>
                      </span>
                    </div>
                    <div className="product-price-row">
                      {/* Ép dữ liệu dạng số (Double) từ backend qua hàm format tiền tệ */}
                      <span className="current-price">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: "35px" }}>
            <Link to="/products" className="btn-view-all">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
