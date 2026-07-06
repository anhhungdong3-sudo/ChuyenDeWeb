import React, { useEffect, useState } from "react";
import axios from "axios";
import { bookService } from "../../services/api";
import "../../styles/admin/Products.css";

function Products() {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const initialNewBook = {
    title: "",
    author: "",
    publisher: "",
    publishYear: new Date().getFullYear(),
    pages: "",
    price: "",
    quantity: 1,
    imageUrl: "",
    status: "PENDING_APPROVAL",
    bookCondition: "NEW",
    shopId: 1,
    categoryId: 1
  };

  const [newBook, setNewBook] = useState(initialNewBook);

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await bookService.getCategories();
      setCategories(data);
      if (data.length > 0) {
        setNewBook((prev) => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const loadBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/books");

      console.log(res.data);

      setBooks(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const saveBook = async () => {
    try {
      const token = localStorage.getItem("token");

      let imageUrl = newBook.imageUrl;
      if (imageFile) {
        setUploading(true);
        const uploadResult = await bookService.uploadImage(imageFile);
        imageUrl = uploadResult.imageUrl;
        setUploading(false);
      }

      await axios.post("http://localhost:8080/api/books/admin",
        { ...newBook, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thêm sách thành công!");

      setShowModal(false);
      setNewBook(initialNewBook);
      setImageFile(null);
      setImagePreview("");

      loadBooks();

    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Thêm sách thất bại!");
    }
  };

  const filteredProducts = books.filter((item) =>
    (item.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <h3>Đang tải dữ liệu...</h3>;
  }

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
          <button className="btn-add-product" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="product-summary-grid">
        <div className="summary-card">
          <h3>Tổng sản phẩm</h3>
          <span><span>{books.length}</span></span>
        </div>

        <div className="summary-card">
          <h3>Đang bán</h3>
          <span>
            {books.filter(b => b.status === "APPROVED").length}
          </span>
        </div>

        <div className="summary-card">
          <h3>Chờ duyệt</h3>
          <span>
            {books.filter(b => b.status === "PENDING_APPROVAL").length}
          </span>
        </div>

        <div className="summary-card">
          <h3>Hết hàng</h3>
          <span>
            {books.filter(b => b.status !== "APPROVED").length}
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
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tình trạng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>

            {
              filteredProducts.map(book => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category?.name}</td>
                  <td>{(book.price ?? 0).toLocaleString()} đ</td>
                  <td>{book.bookCondition}</td>
                  <td>{book.status}</td>
                  <td>
                    <button>Sửa</button>
                    <button>Xóa</button>
                  </td>
                </tr>
              ))
            }

          </tbody>

        </table>

      </div>
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "24px",
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >

          <h2>Thêm sách mới</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Tên sách</label>

              <input
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Tác giả</label>

              <input
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Nhà xuất bản</label>

              <input
                value={newBook.publisher}
                onChange={(e) =>
                  setNewBook({ ...newBook, publisher: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Năm xuất bản</label>

              <input
                type="number"
                value={newBook.publishYear}
                onChange={(e) =>
                  setNewBook({ ...newBook, publishYear: Number(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Số trang</label>

              <input
                type="number"
                value={newBook.pages}
                onChange={(e) =>
                  setNewBook({ ...newBook, pages: Number(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Giá bán</label>

              <input
                type="number"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: Number(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Số lượng</label>

              <input
                type="number"
                min="1"
                value={newBook.quantity}
                onChange={(e) =>
                  setNewBook({ ...newBook, quantity: Number(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Danh mục</label>

              <select
                value={newBook.categoryId}
                onChange={(e) =>
                  setNewBook({ ...newBook, categoryId: Number(e.target.value) })
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tình trạng sách</label>

              <select
                value={newBook.bookCondition}
                onChange={(e) =>
                  setNewBook({ ...newBook, bookCondition: e.target.value })
                }
              >
                <option value="NEW">Mới</option>
                <option value="LIKE_NEW">Như mới</option>
                <option value="GOOD">Tốt</option>
                <option value="FAIR">Khá</option>
                <option value="POOR">Cũ</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Ảnh bìa sách</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploading && <small>Đang tải ảnh lên...</small>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Xem trước bìa sách"
                  style={{ marginTop: "8px", maxWidth: "160px", borderRadius: "6px" }}
                />
              )}
            </div>

          </div>

          <div className="modal-actions">

            <button
              className="btn-cancel"
              onClick={() => {
                setShowModal(false);
                setImageFile(null);
                setImagePreview("");
              }}
            >
              Hủy
            </button>

            <button
              className="btn-save"
              onClick={saveBook}
              disabled={uploading}
            >
              {uploading ? "Đang tải ảnh lên..." : "Thêm sách"}
            </button>

          </div>

          </div>

        </div>

      )}
    </>
  );
}

export default Products;