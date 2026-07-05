import React, { useState } from "react";
import "../../styles/admin/Products.css";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      title: "Lập Trình Java Cơ Bản",
      category: "Công nghệ",
      price: 120000,
      stock: 25,
      status: "Đang bán",
    },
    {
      id: 2,
      title: "Clean Code",
      category: "Lập trình",
      price: 180000,
      stock: 15,
      status: "Đang bán",
    },
    {
      id: 3,
      title: "Spring Boot In Action",
      category: "Backend",
      price: 250000,
      stock: 0,
      status: "Hết hàng",
    },
  ];

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="admin-header-panel">
        <div className="admin-header-title">
          <h1>Quản Lý Sản Phẩm</h1>
          <p>
            Theo dõi và quản lý toàn bộ sản phẩm đang được đăng bán trên hệ thống
          </p>
        </div>

        <div className="admin-header-controls">
          <button className="btn-add-product">
            <i className="fas fa-plus"></i>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="product-summary-grid">
        <div className="summary-card">
          <h3>Tổng sản phẩm</h3>
          <span>{products.length}</span>
        </div>

        <div className="summary-card">
          <h3>Đang bán</h3>
          <span>
            {
              products.filter((p) => p.status === "Đang bán")
                .length
            }
          </span>
        </div>

        <div className="summary-card">
          <h3>Hết hàng</h3>
          <span>
            {
              products.filter((p) => p.status === "Hết hàng")
                .length
            }
          </span>
        </div>
      </div>

      {/* Product Table */}
      <div className="products-card">

        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sách</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>#{product.id}</td>

                <td>{product.title}</td>

                <td>{product.category}</td>

                <td>
                  {product.price.toLocaleString()}đ
                </td>

                <td>{product.stock}</td>

                <td>
                  <span
                    className={`status-badge ${
                      product.status === "Đang bán"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td>
                  <button className="btn-action edit">
                    <i className="fas fa-edit"></i>
                  </button>

                  <button className="btn-action delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Products;