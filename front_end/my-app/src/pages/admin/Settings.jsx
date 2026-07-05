import React, { useState } from "react";
import "../../styles/admin/Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    commissionRate: 10,
    siteName: "ReBook.vn",
    supportEmail: "support@rebook.vn",
    maintenanceMode: false,
    emailNotification: true,
    orderNotification: true,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    alert("Lưu cài đặt thành công!");
  };

  return (
    <>
      <div className="admin-header-panel">
        <div className="admin-header-title">
          <h1>Cài Đặt Hệ Thống</h1>
          <p>
            Quản lý cấu hình website, hoa hồng, thông báo và vận hành hệ thống
          </p>
        </div>
      </div>

      <div className="settings-grid">

        {/* Website */}

        <div className="settings-card">
          <h3>Thông Tin Website</h3>

          <div className="form-group">
            <label>Tên Website</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                handleChange("siteName", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Email hỗ trợ</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                handleChange("supportEmail", e.target.value)
              }
            />
          </div>
        </div>

        {/* Commission */}

        <div className="settings-card">
          <h3>Hoa Hồng Sàn</h3>

          <div className="form-group">
            <label>Tỷ lệ hoa hồng (%)</label>

            <input
              type="number"
              min="0"
              max="100"
              value={settings.commissionRate}
              onChange={(e) =>
                handleChange(
                  "commissionRate",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="commission-preview">
            Doanh thu sàn nhận:
            <strong>
              {" "}
              {settings.commissionRate}%
            </strong>
          </div>
        </div>

        {/* Notifications */}

        <div className="settings-card">
          <h3>Thông Báo</h3>

          <div className="toggle-row">
            <span>Thông báo Email</span>

            <input
              type="checkbox"
              checked={settings.emailNotification}
              onChange={(e) =>
                handleChange(
                  "emailNotification",
                  e.target.checked
                )
              }
            />
          </div>

          <div className="toggle-row">
            <span>Thông báo đơn hàng</span>

            <input
              type="checkbox"
              checked={settings.orderNotification}
              onChange={(e) =>
                handleChange(
                  "orderNotification",
                  e.target.checked
                )
              }
            />
          </div>
        </div>

        {/* System */}

        <div className="settings-card">
          <h3>Hệ Thống</h3>

          <div className="toggle-row">
            <span>Chế độ bảo trì</span>

            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                handleChange(
                  "maintenanceMode",
                  e.target.checked
                )
              }
            />
          </div>

          <div className="maintenance-status">
            {settings.maintenanceMode
              ? "🔴 Website đang bảo trì"
              : "🟢 Website hoạt động bình thường"}
          </div>
        </div>

      </div>

      <div className="settings-actions">
        <button
          className="btn-save-settings"
          onClick={handleSave}
        >
          <i className="fas fa-save"></i>
          Lưu Cài Đặt
        </button>
      </div>
    </>
  );
}

export default Settings;