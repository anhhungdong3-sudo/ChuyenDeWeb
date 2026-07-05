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
import AdminApproval from "../pages/AdminApproval";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
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
      <a className="btn btn-primary" href="/">Về trang chủ</a>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/books" element={<BooksPage />} />
    <Route path="/books/:id" element={<BookDetail />} />
    <Route path="/products" element={<Navigate to="/books" replace />} />
    <Route path="/product/:id" element={<BookDetail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
    <Route path="/vnpay-return" element={<ProtectedRoute><VnPayReturn /></ProtectedRoute>} />
    <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/admin/approval" element={<AdminRoute><AdminApproval /></AdminRoute>} />
    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
