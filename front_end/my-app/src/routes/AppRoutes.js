import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import BooksPage from "../pages/BooksPage";
import BookDetail from "../pages/BookDetail";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import VnPayReturn from "../pages/VnPayReturn";
import Sell from "../pages/Sell";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Settings from "../pages/admin/Settings";
import AdminLayout from "../components/admin/AdminLayout";
import { useAuth } from "../context/AuthContext";
import UserLayout from "../layouts/UserLayout";
import News from "../pages/News"; // Đường dẫn tới file News.jsx bạn vừa tạo
import Contact from "../pages/Contact";

// Import thêm component duyệt tin của Admin mà bạn đã bổ sung

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const NotFound = () => (
  <div className="container page-section">
    <div className="state-box">
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại trong Old Bookstore.</p>
      <a className="btn btn-primary" href="/">
        Về trang chủ
      </a>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Các Tuyến Đường Cho Khách Hàng (Nằm trong giao diện chung UserLayout) */}
    <Route element={<UserLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/products" element={<Navigate to="/books" replace />} />
      <Route path="/product/:id" element={<BookDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* ======= KHAI BÁO ROUTE CHO 2 TRANG MỚI TẠI ĐÂY ======= */}
      <Route path="/books" element={<BooksPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            {" "}
            <CheckoutPage />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            {" "}
            <Sell />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {" "}
            <Profile />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/vnpay-return"
        element={
          <ProtectedRoute>
            <VnPayReturn />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Các Tuyến Đường Cho Admin (Nằm trong giao diện bảo mật AdminLayout) */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          {" "}
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    {/* Xử lý lỗi điều hướng khi không tìm thấy trang */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
