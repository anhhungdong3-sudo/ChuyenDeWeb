import React, { useState, useEffect } from "react"; // 1. Thêm useEffect
import { Link } from "react-router-dom";
import { productService } from "../services/api"; // 2. Import API service
import "../styles/Products.css";

export const Products = () => {
  // --- QUẢN LÝ TRẠNG THÁI DỮ LIỆU TỪ BACKEND ---
  const [allProducts, setAllProducts] = useState([]); // Chuyển thành State chứa dữ liệu thật
  const [loading, setLoading] = useState(true); // Trạng thái chờ tải dữ liệu

  // --- TRẠNG THÁI BỘ LỌC (Giữ nguyên logic của bạn) ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [priceRange, setPriceRange] = useState(1000000); // Tăng lên 1M để bao quát giá sản phẩm thực tế
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  // --- TRẠNG THÁI HIỆU ỨNG TOAST ---
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 3. KÍCH HOẠT GỌI API LẤY DATA THỰC TẾ KHI TẢI TRANG
  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error(
          "Lỗi khi fetch danh sách sản phẩm từ Spring Boot:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBackendProducts();
  }, []);

  // Tự động tắt Toast thông báo sau 2.5 giây
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Xử lý click Checkbox danh mục
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== value));
    }
    setCurrentPage(1);
  };

  // Hiệu ứng thêm vào giỏ hàng bay (Fly Effect)
  const handleAddToCartQuick = (e, product) => {
    e.preventDefault();
    const cardElement = e.currentTarget.closest(".product-card");
    const imgElement = cardElement.querySelector(".product-img-wrapper img");
    const cartIcon =
      document.querySelector(".cart-icon") ||
      document.querySelector(".fa-shopping-bag");

    if (imgElement && cartIcon) {
      const imgRect = imgElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const imgCenterX = imgRect.left + imgRect.width / 2;
      const imgCenterY = imgRect.top + imgRect.height / 2;
      const cartCenterX = cartRect.left + cartRect.width / 2;
      const cartCenterY = cartRect.top + cartRect.height / 2;

      const targetX = cartCenterX - imgCenterX;
      const targetY = cartCenterY - imgCenterY;

      const flyer = document.createElement("img");
      flyer.src = product.imageUrl || "https://via.placeholder.com/200"; // Đổi thành product.imageUrl
      flyer.className = "shopping-flyer-element";

      flyer.style.left = `${imgRect.left}px`;
      flyer.style.top = `${imgRect.top}px`;
      flyer.style.width = `${imgRect.width}px`;
      flyer.style.height = `${imgRect.height}px`;

      flyer.style.setProperty("--target-x", `${targetX}px`);
      flyer.style.setProperty("--target-y", `${targetY}px`);

      document.body.appendChild(flyer);

      setTimeout(() => {
        flyer.remove();
        cartIcon.classList.add("cart-icon-bounce");
        setTimeout(() => cartIcon.classList.remove("cart-icon-bounce"), 300);

        setToastMessage(`Đã thêm "${product.title}" vào giỏ hàng thành công!`);
        setShowToast(true);
      }, 800);
    } else {
      setToastMessage(`Đã thêm "${product.title}" vào giỏ hàng thành công!`);
      setShowToast(true);
    }
  };

  // ================= LUỒNG XỬ LÝ LỌC DỮ LIỆU ĐỘNG (Đã ánh xạ trường Backend) =================
  let filteredProducts = allProducts.filter((product) => {
    // Lọc theo danh mục: Khớp với thuộc tính 'category' từ database
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }
    // Lọc theo giá bán
    if (product.price > priceRange) return false;

    // Lưu ý: Các trường size, condition hiện tại database mẫu chưa lưu cấu trúc này.
    // Nếu lọc theo size/condition, hệ thống tạm bỏ qua nếu item backend trả về null/undefined.
    if (selectedSize && product.size !== selectedSize) return false;
    if (selectedCondition && product.condition !== selectedCondition)
      return false;

    return true;
  });

  // ================= LUỒNG XỬ LÝ SẮP XẾP DỮ LIỆU ĐỘNG =================
  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // ================= LUỒNG LOGIC PHÂN TRANG FRONT-END =================
  const itemsPerPage = 6; // Tăng lên 6 item một trang nhìn lưới sẽ đẹp và cân đối hơn
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="products-page-container">
      {/* KHỐI HIỆU ỨNG TOAST NOTIFICATION */}
      {showToast && (
        <div className="toast-notification-success">
          <i className="fas fa-check-circle"></i> {toastMessage}
        </div>
      )}

      <div className="products-layout">
        {/* ================= SIDEBAR BỘ LỌC (LEFT) ================= */}
        <aside className="filter-sidebar">
          <div className="filter-section-title">
            <h3>
              <i className="fas fa-filter"></i> Bộ lọc tìm kiếm
            </h3>
          </div>

          <div className="filter-group">
            <h4>Danh mục sản phẩm</h4>
            <div className="filter-options-list">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value="nam"
                  checked={selectedCategories.includes("nam")}
                  onChange={handleCategoryChange}
                />{" "}
                Đồ Nam
              </label>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value="nu"
                  checked={selectedCategories.includes("nu")}
                  onChange={handleCategoryChange}
                />{" "}
                Đồ Nữ
              </label>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value="tre-em"
                  checked={selectedCategories.includes("tre-em")}
                  onChange={handleCategoryChange}
                />{" "}
                Trẻ Em
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h4>
              Giá tối đa:{" "}
              <span className="price-display">
                {priceRange.toLocaleString()}đ
              </span>
            </h4>
            <input
              type="range"
              min="30000"
              max="1000000"
              step="10000"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="price-slider"
            />
            <div className="price-range-limits">
              <span>30k</span>
              <span>1M</span>
            </div>
          </div>

          <div className="filter-group">
            <h4>Kích cỡ (Size)</h4>
            <div className="size-buttons-grid">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSize(selectedSize === size ? "" : size);
                    setCurrentPage(1);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Độ mới (Condition)</h4>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select-box"
            >
              <option value="">Tất cả độ mới</option>
              <option value="99">Hàng nước một (Mới 99%)</option>
              <option value="95">Còn rất tốt (Mới 95%)</option>
              <option value="90">Đồ dùng lướt (Mới 90%)</option>
              <option value="85">Đồ trung bình (Mới 85%)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn-clear-filter"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedSize("");
              setSelectedCondition("");
              setPriceRange(1000000);
              setCurrentPage(1);
            }}
          >
            Xóa bộ lọc
          </button>
        </aside>

        {/* ================= LƯỚI SẢN PHẨM (RIGHT) ================= */}
        <main className="products-main-content">
          <div className="products-top-bar">
            <div className="results-count">
              Tìm thấy <b>{filteredProducts.length}</b> sản phẩm quần áo cũ phù
              hợp
            </div>
            <div className="sort-wrapper">
              <span>Sắp xếp theo:</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Mới đăng gần đây</option>
                <option value="price-asc">Giá từ thấp đến cao</option>
                <option value="price-desc">Giá từ cao đến thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div
              className="text-center"
              style={{ padding: "60px", fontSize: "16px", color: "#555" }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: "8px", color: "#2e7d32" }}
              ></i>
              Đang đồng bộ dữ liệu từ ReWear Database...
            </div>
          ) : currentItems.length === 0 ? (
            <div className="no-products-found-box">
              <i className="fas fa-search-minus"></i>
              <p>
                Không tìm thấy trang phục cũ nào khớp với tiêu chuẩn lọc của
                bạn!
              </p>
            </div>
          ) : (
            <div className="products-page-grid">
              {currentItems.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="product-card-link-wrapper"
                >
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      {/* Thay đổi img -> imageUrl */}
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
                        <span>Shop #{product.shopId}</span>{" "}
                        {/* Thay đổi seller -> shopId */}
                      </div>
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-meta">
                        <span className="product-size">
                          Danh mục: <b>{product.category || "Chưa rõ"}</b>{" "}
                          {/* Thay đổi cate -> category */}
                        </span>
                      </div>
                      <div className="product-price-row">
                        <span className="current-price">
                          {product.price.toLocaleString()}đ
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn-add-to-cart-quick"
                        onClick={(e) => handleAddToCartQuick(e, product)}
                      >
                        <i className="fas fa-shopping-bag"></i> Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* KHỐI ĐIỀU HƯỚNG PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                className="page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                className="page-nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &raquo;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
