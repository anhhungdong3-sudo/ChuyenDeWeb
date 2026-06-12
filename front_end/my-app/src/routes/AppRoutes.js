import React from "react";
import { Routes, Route } from "react-router-dom";

// Import trực tiếp từ thư mục pages của bạn
import { Home } from "../pages/Home";
import { Products } from "../pages/Products";

// Nếu bạn đã tách luôn Cart và ProductDetail sang pages thì import ở đây,
// nếu chưa thì tạm thời giữ nguyên import từ placeholderPages nhé
import { Cart } from "../pages/Cart";
import { Sell } from "../pages/Sell";
import { ProductDetail } from "../pages/ProductDetail";
import { Checkout } from "../pages/Checkout";
import { Register } from "../pages/Register";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AdProducts from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Settings from "../pages/admin/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
      </Route>
      {/* Trang chủ */}
      <Route path="/" element={<Home />} />

      {/* Trang danh sách sản phẩm */}
      <Route path="/products" element={<Products />} />

      {/* Trang giỏ hàng */}
      <Route path="/cart" element={<Cart />} />

      {/* Trang chi tiết sản phẩm */}
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Trang đăng bán */}
      <Route path="/sell" element={<Sell />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/register" element={<Register />} />
      {/* Trang 404 khi không tìm thấy URL */}
      <Route
        path="*"
        element={
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              minHeight: "60vh",
            }}
          >
            <h2 style={{ fontSize: "32px", color: "#d32f2f" }}>
              404 - Không Tìm Thấy Trang
            </h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
              Đường dẫn này không tồn tại trên hệ thống ReWear.vn
            </p>
          </div>
        }
      />
    </Routes>
    
  );
};

export default AppRoutes;
