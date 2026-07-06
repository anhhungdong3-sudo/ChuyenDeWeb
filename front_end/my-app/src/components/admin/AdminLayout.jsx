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
    <div className="admin-layout">
      <Sidebar
        adminUser={adminUser}
        handleLogout={handleLogout}
      />

        <div className="admin-main">
          <Outlet />
        </div>
    </div>
  );
}

export default AdminLayout;