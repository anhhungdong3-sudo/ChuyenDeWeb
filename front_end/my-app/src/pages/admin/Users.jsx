import React, { useEffect, useState } from "react";
import "../../styles/admin/Users.css";
import { userService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    userService
      .getAllUsers()
      .then(setUsers)
      .catch(() => setError("Không thể tải danh sách người dùng."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const isSelf = (id) => currentUser?.id === id;

  const handleRoleChange = async (userId, newRole) => {
    const previous = users;
    setBusyId(userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    try {
      await userService.updateUserRole(userId, newRole);
    } catch (err) {
      setUsers(previous);
      alert(err.response?.data?.message || "Cập nhật vai trò thất bại!");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextEnabled = user.enabled === false;
    const confirmMsg = nextEnabled
      ? `Mở khóa tài khoản "${user.fullName}"?`
      : `Khóa tài khoản "${user.fullName}"? Người dùng sẽ không thể đăng nhập.`;
    if (!window.confirm(confirmMsg)) return;

    const previous = users;
    setBusyId(user.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, enabled: nextEnabled } : u))
    );
    try {
      await userService.updateUserStatus(user.id, nextEnabled);
    } catch (err) {
      setUsers(previous);
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại!");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${user.fullName}"?`)) return;

    const previous = users;
    setBusyId(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    try {
      await userService.deleteUser(user.id);
    } catch (err) {
      setUsers(previous);
      alert(err.response?.data?.message || "Xóa người dùng thất bại!");
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.fullName || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term) ||
      (user.username || "").toLowerCase().includes(term)
    );
  });

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
          <h3>Quản trị viên</h3>
          <span>{users.filter((u) => u.role === "ADMIN").length}</span>
        </div>

        <div className="summary-card">
          <h3>Đã khóa</h3>
          <span>{users.filter((u) => u.enabled === false).length}</span>
        </div>
      </div>

      {/* Table */}

      <div className="users-card">
        <div className="users-toolbar">
          <input
            type="text"
            placeholder="Tìm tên, email hoặc username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ padding: 16 }}>Đang tải danh sách người dùng...</p>
        ) : error ? (
          <p style={{ padding: 16, color: "#dc3545" }}>{error}</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Username</th>
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
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  <td>
                    <select
                      className={`role-select ${user.role?.toLowerCase()}`}
                      value={user.role}
                      disabled={busyId === user.id || isSelf(user.id)}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      title={isSelf(user.id) ? "Không thể tự đổi vai trò của mình" : ""}
                    >
                      <option value="USER">Người dùng</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        user.enabled === false ? "locked" : "active"
                      }`}
                    >
                      {user.enabled === false ? "Đã khóa" : "Hoạt động"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <button
                      className={`btn-action ${
                        user.enabled === false ? "unlock" : "lock"
                      }`}
                      disabled={busyId === user.id || isSelf(user.id)}
                      onClick={() => handleToggleStatus(user)}
                      title={
                        isSelf(user.id)
                          ? "Không thể tự khóa tài khoản của mình"
                          : user.enabled === false
                          ? "Mở khóa"
                          : "Khóa tài khoản"
                      }
                    >
                      <i
                        className={`fas ${
                          user.enabled === false ? "fa-unlock" : "fa-lock"
                        }`}
                      ></i>
                    </button>

                    <button
                      className="btn-action delete"
                      disabled={busyId === user.id || isSelf(user.id)}
                      onClick={() => handleDelete(user)}
                      title={
                        isSelf(user.id)
                          ? "Không thể tự xóa tài khoản của mình"
                          : "Xóa người dùng"
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Users;
