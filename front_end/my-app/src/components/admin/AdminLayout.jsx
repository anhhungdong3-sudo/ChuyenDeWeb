import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../styles/admin/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const adminUser = {
  fullName: "Administrator",
  role: "Admin",
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar
        adminUser={adminUser}
        handleLogout={handleLogout}
      />

      <main className="admin-main-content">
        <div className="admin-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;