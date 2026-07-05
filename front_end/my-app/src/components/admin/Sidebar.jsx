import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/admin/Sidebar.css";

function Sidebar({ adminUser, handleLogout }) {
  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-header">
        <Link
          to="/"
          className="admin-sidebar-logo"
        >
          <i className="fas fa-crown"></i>

          <h2>
            ReBook<span>Admin</span>
          </h2>
        </Link>
      </div>

      <nav className="admin-sidebar-menu">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <i className="fas fa-chart-pie"></i>
          <span>Thống kê doanh thu</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `sidebar-menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <i className="fas fa-book"></i>
          <span>Quản lý sản phẩm</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <i className="fas fa-shopping-bag"></i>
          <span>Quản lý đơn hàng</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <i className="fas fa-users-cog"></i>
          <span>Quản lý người dùng</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `sidebar-menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <i className="fas fa-sliders-h"></i>
          <span>Cài đặt hệ thống</span>
        </NavLink>

        <div className="sidebar-menu-divider"></div>

        <Link
          to="/"
          className="sidebar-menu-item store-link"
        >
          <i className="fas fa-shopping-basket"></i>
          <span>Quay lại Cửa hàng</span>
        </Link>

      </nav>

      <div className="admin-sidebar-footer">

        <div className="admin-user-info">
          <span className="admin-username">
            {adminUser?.fullName || "Admin"}
          </span>

          <span className="admin-role">
            {adminUser?.role || "Administrator"} Portal
          </span>
        </div>

        <button
          className="btn-sidebar-logout"
          onClick={handleLogout}
          title="Đăng xuất"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;