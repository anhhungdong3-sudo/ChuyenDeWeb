import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/api";
import "../styles/ProductDetail.css"; // Đảm bảo bạn đã tạo file CSS này

export const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL thanh địa chỉ
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Gọi hàm API từ service
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setError("Không tìm thấy sản phẩm hoặc đã có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className="loading-box"
        style={{ padding: "100px", textAlign: "center" }}
      >
        <i
          className="fas fa-spinner fa-spin"
          style={{ fontSize: "24px", color: "#2e7d32" }}
        ></i>
        <p>Đang tải thông tin chi tiết trang phục...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="error-box"
        style={{ padding: "100px", textAlign: "center" }}
      >
        <i
          className="fas fa-exclamation-triangle"
          style={{ fontSize: "40px", color: "#d32f2f" }}
        ></i>
        <p style={{ marginTop: "15px" }}>
          {error || "Sản phẩm không tồn tại!"}
        </p>
        <Link to="/products" className="btn-back">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div
      className="product-detail-container"
      style={{ padding: "40px 10%", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        className="detail-breadcrumbs"
        style={{ marginBottom: "20px", color: "#777" }}
      >
        <Link to="/" style={{ color: "#2e7d32", textDecoration: "none" }}>
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link
          to="/products"
          style={{ color: "#2e7d32", textDecoration: "none" }}
        >
          Sản phẩm
        </Link>{" "}
        / <span>{product.title}</span>
      </div>

      <div
        className="detail-layout"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px" }}
      >
        {/* Khối bên trái: Hình ảnh sản phẩm */}
        <div className="detail-image-wrapper">
          <img
            src={product.imageUrl || "https://via.placeholder.com/500"}
            alt={product.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Khối bên phải: Thông tin chi tiết */}
        <div className="detail-info-wrapper">
          <div
            className="detail-seller-badge"
            style={{ color: "#555", fontSize: "14px", marginBottom: "10px" }}
          >
            <i className="far fa-user-circle"></i> Người bán:{" "}
            <b>Shop #{product.shopId}</b>
          </div>

          <h1
            className="detail-title"
            style={{ fontSize: "28px", marginBottom: "15px", color: "#333" }}
          >
            {product.title}
          </h1>

          <div className="detail-price-row" style={{ marginBottom: "20px" }}>
            <span
              className="detail-current-price"
              style={{ fontSize: "26px", fontWeight: "bold", color: "#d32f2f" }}
            >
              {product.price?.toLocaleString()}đ
            </span>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          <div
            className="detail-specs"
            style={{
              display: "grid",
              gridTemplateRows: "repeat(3, auto)",
              gap: "12px",
              marginBottom: "30px",
            }}
          >
            <div>
              Phân loại danh mục:{" "}
              <strong style={{ color: "#333" }}>
                {product.category || "Đồ cũ"}
              </strong>
            </div>
            <div>
              Kích cỡ (Size):{" "}
              <strong style={{ color: "#2e7d32" }}>
                {product.size || "Free Size"}
              </strong>
            </div>
            <div>
              Trạng thái:
              <span
                style={{
                  marginLeft: "8px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  backgroundColor:
                    product.status === "AVAILABLE" ? "#e8f5e9" : "#ffebee",
                  color: product.status === "AVAILABLE" ? "#2e7d32" : "#c62828",
                }}
              >
                {product.status === "AVAILABLE"
                  ? "Còn hàng (Đang mở bán)"
                  : "Đã bán"}
              </span>
            </div>
          </div>

          <div className="detail-description" style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "8px" }}>
              Mô tả sản phẩm của người đăng:
            </h4>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              {product.description ||
                "Chủ xe/Chủ shop chưa cập nhật mô tả chi tiết cho trang phục này. Vui lòng liên hệ trực tiếp để biết thêm tình trạng đồ."}
            </p>
          </div>

          <button
            className="btn-detail-add-to-cart"
            disabled={product.status !== "AVAILABLE"}
            style={{
              padding: "15px 30px",
              backgroundColor:
                product.status === "AVAILABLE" ? "#2e7d32" : "#999",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor:
                product.status === "AVAILABLE" ? "pointer" : "not-allowed",
              width: "100%",
            }}
          >
            <i
              className="fas fa-shopping-cart"
              style={{ marginRight: "10px" }}
            ></i>
            {product.status === "AVAILABLE"
              ? "MUA NGAY / THÊM VÀO GIỎ"
              : "SẢN PHẨM ĐÃ BÁN HẾT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
