import React, { useState } from "react";
import "../../styles/admin/Users.css";

function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      role: "User",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@gmail.com",
      role: "Seller",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "vanc@gmail.com",
      role: "Admin",
      status: "Khóa",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="admin-header-panel">
        <div className="admin-header-title">
          <h1>Quản Lý Người Dùng</h1>
          <p>
            Theo dõi tài khoản, phân quyền và trạng thái hoạt động của người dùng
          </p>
        </div>
      </div>

      {/* Summary */}

      <div className="users-summary-grid">

        <div className="summary-card">
          <h3>Tổng người dùng</h3>
          <span>{users.length}</span>
        </div>

        <div className="summary-card">
          <h3>Người bán</h3>
          <span>
            {users.filter((u) => u.role === "Seller").length}
          </span>
        </div>

        <div className="summary-card">
          <h3>Quản trị viên</h3>
          <span>
            {users.filter((u) => u.role === "Admin").length}
          </span>
        </div>

      </div>

      {/* Table */}

      <div className="users-card">

        <div className="users-toolbar">
          <input
            type="text"
            placeholder="Tìm tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="btn-add-user">
            <i className="fas fa-user-plus"></i>
            Thêm người dùng
          </button>
        </div>

        <table className="users-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`role-badge ${
                      user.role.toLowerCase()
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      user.status === "Hoạt động"
                        ? "active"
                        : "locked"
                    }`}
                  >
                    {user.status}
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

export default Users;