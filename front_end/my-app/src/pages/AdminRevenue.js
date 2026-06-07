import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminRevenue.css";

// Sample high-fidelity mock data for different time ranges (used in Stats tab)
const MOCK_STATS_DATA = {
  last7days: {
    kpi: {
      revenue: 2845000,
      revenueTrend: 12.5,
      orders: 12,
      ordersTrend: 8.3,
      avgOrderValue: 237083,
      avgOrderValueTrend: 3.8,
      commission: 284500,
      commissionTrend: 12.5
    },
    chartData: [
      { label: "Thứ 2", value: 320000, orders: 1 },
      { label: "Thứ 3", value: 450000, orders: 2 },
      { label: "Thứ 4", value: 180000, orders: 1 },
      { label: "Thứ 5", value: 620000, orders: 3 },
      { label: "Thứ 6", value: 290000, orders: 1 },
      { label: "Thứ 7", value: 580000, orders: 2 },
      { label: "Chủ Nhật", value: 405000, orders: 2 }
    ],
    categories: [
      { name: "Sách Văn Học", value: 1120000, count: 5, percentage: 39, color: "var(--admin-accent-primary)" },
      { name: "Kinh Tế - Kinh Doanh", value: 850000, count: 3, percentage: 30, color: "var(--admin-accent-purple)" },
      { name: "Kỹ Năng Sống", value: 525000, count: 3, percentage: 18, color: "var(--admin-accent-success)" },
      { name: "Sách Thiếu Nhi", value: 350000, count: 1, percentage: 13, color: "var(--admin-accent-warning)" }
    ]
  },
  last30days: {
    kpi: {
      revenue: 14580000,
      revenueTrend: 18.2,
      orders: 68,
      ordersTrend: 14.5,
      avgOrderValue: 214411,
      avgOrderValueTrend: 3.2,
      commission: 1458000,
      commissionTrend: 18.2
    },
    chartData: [
      { label: "Tuần 1", value: 2900000, orders: 13 },
      { label: "Tuần 2", value: 3850000, orders: 18 },
      { label: "Tuần 3", value: 4120000, orders: 19 },
      { label: "Tuần 4", value: 3710000, orders: 18 }
    ],
    categories: [
      { name: "Sách Văn Học", value: 5680000, count: 26, percentage: 39, color: "var(--admin-accent-primary)" },
      { name: "Kinh Tế - Kinh Doanh", value: 4230000, count: 20, percentage: 29, color: "var(--admin-accent-purple)" },
      { name: "Kỹ Năng Sống", value: 2770000, count: 13, percentage: 19, color: "var(--admin-accent-success)" },
      { name: "Sách Thiếu Nhi", value: 1100000, count: 6, percentage: 8, color: "var(--admin-accent-warning)" },
      { name: "Sách Ngoại Văn", value: 800000, count: 3, percentage: 5, color: "var(--admin-accent-rose)" }
    ]
  },
  thisyear: {
    kpi: {
      revenue: 168420000,
      revenueTrend: 24.6,
      orders: 782,
      ordersTrend: 21.3,
      avgOrderValue: 215370,
      avgOrderValueTrend: 2.7,
      commission: 16842000,
      commissionTrend: 24.6
    },
    chartData: [
      { label: "Tháng 1", value: 12500000, orders: 58 },
      { label: "Tháng 2", value: 9800000, orders: 45 },
      { label: "Tháng 3", value: 14200000, orders: 66 },
      { label: "Tháng 4", value: 16500000, orders: 77 },
      { label: "Tháng 5", value: 18900000, orders: 88 },
      { label: "Tháng 6", value: 20120000, orders: 94 },
      { label: "Tháng 7", value: 0, orders: 0 },
      { label: "Tháng 8", value: 0, orders: 0 },
      { label: "Tháng 9", value: 0, orders: 0 },
      { label: "Tháng 10", value: 0, orders: 0 },
      { label: "Tháng 11", value: 0, orders: 0 },
      { label: "Tháng 12", value: 0, orders: 0 }
    ],
    categories: [
      { name: "Sách Văn Học", value: 65680000, count: 305, percentage: 39, color: "var(--admin-accent-primary)" },
      { name: "Kinh Tế - Kinh Doanh", value: 50530000, count: 235, percentage: 30, color: "var(--admin-accent-purple)" },
      { name: "Kỹ Năng Sống", value: 32000000, count: 149, percentage: 19, color: "var(--admin-accent-success)" },
      { name: "Sách Thiếu Nhi", value: 13470000, count: 62, percentage: 8, color: "var(--admin-accent-warning)" },
      { name: "Sách Ngoại Văn", value: 6740000, count: 31, percentage: 4, color: "var(--admin-accent-rose)" }
    ]
  }
};

// Config for SVG Line/Area Chart
const SVG_CONFIG = { width: 500, height: 200, paddingLeft: 45, paddingRight: 20, paddingTop: 20, paddingBottom: 30 };

export const AdminRevenue = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stats"); // stats, products, orders, users, settings
  const [timeRange, setTimeRange] = useState("last7days");
  
  // Interactive Local States for management
  const [adminUser, setAdminUser] = useState({ fullName: "Admin Nhật Trọng", username: "nhatrong2026", role: "ADMIN" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Load admin details from local storage if available
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        if (parsed.role === "ADMIN") {
          setAdminUser(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 1. Interactive Orders State
  const [orders, setOrders] = useState([
    { id: "RB-0912", name: "Nguyễn Văn A", phone: "0912345678", date: "07/06/2026", amount: 249000, method: "momo", status: "completed" },
    { id: "RB-0911", name: "Trần Thị B", phone: "0987654321", date: "07/06/2026", amount: 189000, method: "cod", status: "shipping" },
    { id: "RB-0910", name: "Lê Văn C", phone: "0905111222", date: "06/06/2026", amount: 350000, method: "qr", status: "completed" },
    { id: "RB-0909", name: "Phạm Minh D", phone: "0934555666", date: "06/06/2026", amount: 120000, method: "cod", status: "pending" },
    { id: "RB-0908", name: "Hoàng Đức E", phone: "0977888999", date: "05/06/2026", amount: 450000, method: "qr", status: "completed" },
    { id: "RB-0907", name: "Đỗ Hải F", phone: "0966777888", date: "04/06/2026", amount: 290000, method: "cod", status: "cancelled" },
    { id: "RB-0906", name: "Ngô Quốc G", phone: "0911222333", date: "03/06/2026", amount: 580000, method: "momo", status: "completed" },
    { id: "RB-0905", name: "Bùi Thị H", phone: "0922333444", date: "02/06/2026", amount: 157000, method: "cod", status: "completed" },
    { id: "RB-0904", name: "Dương Minh I", phone: "0944555666", date: "01/06/2026", amount: 320000, method: "qr", status: "completed" },
    { id: "RB-0903", name: "Lý Thanh J", phone: "0955666777", date: "01/06/2026", amount: 140000, method: "momo", status: "completed" }
  ]);

  // 2. Interactive Products State
  const [products, setProducts] = useState([
    { id: 1, title: "Đắc Nhân Tâm", price: 85000, category: "ky-nang-song", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60", status: "AVAILABLE", shopId: 101, author: "Dale Carnegie" },
    { id: 2, title: "Nhà Giả Kim", price: 79000, category: "van-hoc", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60", status: "AVAILABLE", shopId: 102, author: "Paulo Coelho" },
    { id: 3, title: "Dạy Con Làm Giàu (Tập 1)", price: 120000, category: "kinh-te", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop&q=60", status: "SOLD", shopId: 101, author: "Robert Kiyosaki" },
    { id: 4, title: "Kính Vạn Hoa (Trọn Bộ)", price: 245000, category: "thieu-nhi", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60", status: "AVAILABLE", shopId: 103, author: "Nguyễn Nhật Ánh" },
    { id: 5, title: "Sapiens: Lược Sử Loài Người", price: 185000, category: "van-hoc", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60", status: "AVAILABLE", shopId: 104, author: "Yuval Noah Harari" }
  ]);

  // 3. Interactive Users State
  const [users, setUsers] = useState([
    { id: 1, username: "dongtran", fullName: "Trần Văn Đồng", email: "dongtran@gmail.com", phone: "0912345678", role: "USER", status: "ACTIVE" },
    { id: 2, username: "nhatrong2026", fullName: "Admin Nhật Trọng", email: "nhatrong2026@gmail.com", phone: "0905111222", role: "ADMIN", status: "ACTIVE" },
    { id: 3, username: "minhthu", fullName: "Nguyễn Thị Minh Thư", email: "minhthu@gmail.com", phone: "0987654321", role: "USER", status: "ACTIVE" },
    { id: 4, username: "hoangduc", fullName: "Lê Hoàng Đức", email: "hoangduc@gmail.com", phone: "0934555666", role: "USER", status: "SUSPENDED" }
  ]);

  // 4. Interactive Settings State
  const [settings, setSettings] = useState({
    commissionRate: 10,
    baseShippingFee: 30000,
    freeShipThreshold: 300000,
    smtpUser: "nhatrong2026@gmail.com",
    maintenanceMode: false,
    autoConfirm: true,
    adminNotifications: true
  });

  const activeStatsData = useMemo(() => {
    return MOCK_STATS_DATA[timeRange] || MOCK_STATS_DATA.last7days;
  }, [timeRange]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // Switch Order Status dynamically for visual simulation
  const cycleOrderStatus = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId) {
          const statusCycle = ["pending", "shipping", "completed", "cancelled"];
          const nextIndex = (statusCycle.indexOf(o.status) + 1) % statusCycle.length;
          return { ...o, status: statusCycle[nextIndex] };
        }
        return o;
      })
    );
  };

  // Toggle user suspension
  const toggleUserStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" };
        }
        return u;
      })
    );
  };

  // Promote / Demote User Role
  const toggleUserRole = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" };
        }
        return u;
      })
    );
  };

  // Add Product Prompt simulation
  const handleAddProduct = () => {
    const title = prompt("Nhập tên sách mới:");
    if (!title) return;
    const author = prompt("Nhập tác giả:");
    const priceStr = prompt("Nhập giá bán (đ):");
    const price = parseFloat(priceStr) || 50000;
    const category = prompt("Nhập thể loại (van-hoc, kinh-te, ky-nang-song, thieu-nhi):", "van-hoc");

    const newProd = {
      id: Date.now(),
      title,
      author: author || "Chưa rõ",
      price,
      category,
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60",
      status: "AVAILABLE",
      shopId: 101 + Math.floor(Math.random() * 10)
    };

    setProducts([newProd, ...products]);
  };

  // Edit product price simulation
  const handleEditProductPrice = (prodId) => {
    const current = products.find((p) => p.id === prodId);
    if (!current) return;
    const newPriceStr = prompt(`Cập nhật giá mới cho sách "${current.title}" (Giá hiện tại: ${current.price}đ):`);
    if (!newPriceStr) return;
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice)) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, price: newPrice } : p))
    );
  };

  // Delete product simulation
  const handleDeleteProduct = (prodId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi sàn?")) {
      setProducts(products.filter((p) => p.id !== prodId));
    }
  };

  // Save Settings simulation
  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert("Hệ thống đã lưu lại toàn bộ cấu hình mới thành công!");
  };

  // CSV Exporter for Orders
  const exportToCSV = () => {
    const headers = ["Mã Đơn Hàng", "Khách Hàng", "Số Điện Thoại", "Ngày Đặt", "Tổng Tiền", "Phương Thức", "Trạng Thái"];
    const rows = orders.map((o) => [
      o.id,
      o.name,
      o.phone,
      o.date,
      o.amount,
      o.method.toUpperCase(),
      o.status === "completed"
        ? "Thành Công"
        : o.status === "shipping"
        ? "Đang Giao"
        : o.status === "pending"
        ? "Chờ Duyệt"
        : "Đã Hủy"
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(",") + "\n";
    rows.forEach((rowArray) => {
      const row = rowArray.map((val) => `"${val}"`).join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_Cao_Doanh_Thu_Admin.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Coordinate Calculations for SVG Line/Area Chart (Stats Tab)
  const chartPoints = useMemo(() => {
    const data = activeStatsData.chartData;
    const maxVal = Math.max(...data.map((d) => d.value)) || 1;
    const usableWidth = SVG_CONFIG.width - SVG_CONFIG.paddingLeft - SVG_CONFIG.paddingRight;
    const usableHeight = SVG_CONFIG.height - SVG_CONFIG.paddingTop - SVG_CONFIG.paddingBottom;

    return data.map((d, index) => {
      const x = SVG_CONFIG.paddingLeft + (index / (data.length - 1)) * usableWidth;
      const y = SVG_CONFIG.height - SVG_CONFIG.paddingBottom - (d.value / maxVal) * usableHeight;
      return { x, y, label: d.label, value: d.value, orders: d.orders };
    });
  }, [activeStatsData.chartData]);

  // Create path elements for line and shaded area
  const linePathD = useMemo(() => {
    if (chartPoints.length === 0) return "";
    return chartPoints.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");
  }, [chartPoints]);

  const areaPathD = useMemo(() => {
    if (chartPoints.length === 0) return "";
    const startX = chartPoints[0].x;
    const endX = chartPoints[chartPoints.length - 1].x;
    const bottomY = SVG_CONFIG.height - SVG_CONFIG.paddingBottom;
    return `${linePathD} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [chartPoints, linePathD]);

  const handleMouseMoveDot = (e, point) => {
    const rect = e.target.getBoundingClientRect();
    const wrapper = e.currentTarget.closest(".chart-canvas-container").getBoundingClientRect();
    setHoveredDataPoint(point);
    setTooltipPos({
      x: rect.left - wrapper.left + rect.width / 2,
      y: rect.top - wrapper.top - 55
    });
  };

  // Filtering for Products/Orders tables
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const filteredOrdersList = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.name.toLowerCase().includes(term) ||
        o.phone.includes(term)
    );
  }, [orders, searchTerm]);

  return (
    <div className="admin-dashboard-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            <i className="fas fa-crown"></i>
            <h2>ReBook<span>Admin</span></h2>
          </Link>
        </div>

        <nav className="admin-sidebar-menu">
          <button
            className={`sidebar-menu-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => { setActiveTab("stats"); setSearchTerm(""); }}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Thống kê doanh thu</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setSearchTerm(""); }}
          >
            <i className="fas fa-book"></i>
            <span>Quản lý sản phẩm</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setSearchTerm(""); }}
          >
            <i className="fas fa-shopping-bag"></i>
            <span>Quản lý đơn hàng</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
          >
            <i className="fas fa-users-cog"></i>
            <span>Quản lý người dùng</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setSearchTerm(""); }}
          >
            <i className="fas fa-sliders-h"></i>
            <span>Cài đặt hệ thống</span>
          </button>

          <div className="sidebar-menu-divider"></div>

          <Link to="/" className="sidebar-menu-item store-link">
            <i className="fas fa-shopping-basket"></i>
            <span>Quay lại Cửa hàng</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-username">{adminUser.fullName}</span>
            <span className="admin-role">{adminUser.role} Portal</span>
          </div>
          <button className="btn-sidebar-logout" onClick={handleLogout} title="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT CONTENT VIEWPORT */}
      <main className="admin-main-content">
        <div className="admin-content-container">

          {/* ================= VIEW 1: STATS / DASHBOARD ================= */}
          {activeTab === "stats" && (
            <>
              <div className="admin-header-panel">
                <div className="admin-header-title">
                  <h1>Báo Cáo Tài Chính & Doanh Thu</h1>
                  <p>Phân tích hiệu năng bán hàng, phí commission và dòng tiền trên sàn ReBook.vn</p>
                </div>
                <div className="admin-header-controls">
                  <select
                    className="time-range-select"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="last7days">7 ngày qua</option>
                    <option value="last30days">30 ngày qua</option>
                    <option value="thisyear">Năm 2026</option>
                  </select>
                  <button className="btn-export-report" onClick={exportToCSV}>
                    <i className="fas fa-file-download"></i> Xuất Excel
                  </button>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="kpi-cards-grid">
                <div className="kpi-card primary">
                  <div className="kpi-header">
                    <span className="kpi-title">Tổng doanh thu</span>
                    <div className="kpi-icon-box"><i className="fas fa-wallet"></i></div>
                  </div>
                  <div className="kpi-value">{activeStatsData.kpi.revenue.toLocaleString()}đ</div>
                  <div className="kpi-footer">
                    <span className="trend-badge up"><i className="fas fa-arrow-up"></i> {activeStatsData.kpi.revenueTrend}%</span>
                    <span className="trend-text">so với kỳ trước</span>
                  </div>
                </div>

                <div className="kpi-card success">
                  <div className="kpi-header">
                    <span className="kpi-title">Đơn hàng mới</span>
                    <div className="kpi-icon-box"><i className="fas fa-shopping-cart"></i></div>
                  </div>
                  <div className="kpi-value">{activeStatsData.kpi.orders}</div>
                  <div className="kpi-footer">
                    <span className="trend-badge up"><i className="fas fa-arrow-up"></i> {activeStatsData.kpi.ordersTrend}%</span>
                    <span className="trend-text">so với kỳ trước</span>
                  </div>
                </div>

                <div className="kpi-card warning">
                  <div className="kpi-header">
                    <span className="kpi-title">Giá trị TB đơn</span>
                    <div className="kpi-icon-box"><i className="fas fa-chart-line"></i></div>
                  </div>
                  <div className="kpi-value">{activeStatsData.kpi.avgOrderValue.toLocaleString()}đ</div>
                  <div className="kpi-footer">
                    <span className="trend-badge up"><i className="fas fa-arrow-up"></i> {activeStatsData.kpi.avgOrderValueTrend}%</span>
                    <span className="trend-text">so với kỳ trước</span>
                  </div>
                </div>

                <div className="kpi-card purple">
                  <div className="kpi-header">
                    <span className="kpi-title">Chiết khấu sàn ({settings.commissionRate}%)</span>
                    <div className="kpi-icon-box"><i className="fas fa-percentage"></i></div>
                  </div>
                  <div className="kpi-value">{(activeStatsData.kpi.revenue * (settings.commissionRate / 100)).toLocaleString()}đ</div>
                  <div className="kpi-footer">
                    <span className="trend-badge up"><i className="fas fa-arrow-up"></i> {activeStatsData.kpi.commissionTrend}%</span>
                    <span className="trend-text">Lợi nhuận gộp sàn nhận</span>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="charts-grid">
                
                {/* SVG Area Chart */}
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3>Biểu đồ doanh thu theo thời gian</h3>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-dot revenue"></span>
                        <span>Doanh thu</span>
                      </div>
                    </div>
                  </div>
                  <div className="chart-canvas-container">
                    <svg viewBox={`0 0 ${SVG_CONFIG.width} ${SVG_CONFIG.height}`} className="svg-chart" width="100%" height="100%">
                      <defs>
                        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--admin-accent-primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--admin-accent-primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y Axis Grid & Labels */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = SVG_CONFIG.height - SVG_CONFIG.paddingBottom - ratio * (SVG_CONFIG.height - SVG_CONFIG.paddingTop - SVG_CONFIG.paddingBottom);
                        const maxVal = Math.max(...activeStatsData.chartData.map((d) => d.value)) || 1;
                        const labelValue = ratio * maxVal;
                        return (
                          <g key={i}>
                            <line x1={SVG_CONFIG.paddingLeft} y1={y} x2={SVG_CONFIG.width - SVG_CONFIG.paddingRight} y2={y} className="chart-grid-line" />
                            <text x={SVG_CONFIG.paddingLeft - 8} y={y + 4} textAnchor="end" className="chart-axis-text">
                              {labelValue >= 1000000 ? `${(labelValue / 1000000).toFixed(1)}M` : `${(labelValue / 1000).toFixed(0)}k`}
                            </text>
                          </g>
                        );
                      })}

                      {/* X Axis labels */}
                      {chartPoints.map((p, i) => (
                        <text key={i} x={p.x} y={SVG_CONFIG.height - 10} textAnchor="middle" className="chart-axis-text">{p.label}</text>
                      ))}

                      {/* Area and Line */}
                      {chartPoints.length > 0 && (
                        <>
                          <path d={areaPathD} className="chart-area-path" />
                          <path d={linePathD} className="chart-line-path" />
                        </>
                      )}

                      {/* Dots */}
                      {chartPoints.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          className="chart-dot"
                          onMouseEnter={(e) => handleMouseMoveDot(e, p)}
                          onMouseLeave={() => setHoveredDataPoint(null)}
                        />
                      ))}
                    </svg>

                    {hoveredDataPoint && (
                      <div className="chart-tooltip" style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}>
                        <div className="chart-tooltip-date">{hoveredDataPoint.label}</div>
                        <div className="chart-tooltip-value">{hoveredDataPoint.value.toLocaleString()}đ</div>
                        <div style={{ color: "var(--admin-text-secondary)" }}>{hoveredDataPoint.orders} đơn hàng</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories progress */}
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3>Hiệu suất chuyên mục</h3>
                  </div>
                  <div className="categories-list">
                    {activeStatsData.categories.map((cat, idx) => (
                      <div className="category-row" key={idx}>
                        <div className="category-info">
                          <div className="category-name-box">
                            <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
                            <span className="category-name">{cat.name}</span>
                          </div>
                          <span className="category-value">{cat.value.toLocaleString()}đ</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ================= VIEW 2: PRODUCTS MANAGEMENT ================= */}
          {activeTab === "products" && (
            <div className="table-card">
              <div className="admin-tab-actions-bar">
                <div className="admin-header-title">
                  <h1>Quản Lý Sản Phẩm Sách</h1>
                  <p>Danh sách toàn bộ sách cũ đang bán, kiểm duyệt trạng thái và chỉnh sửa giá cả sản phẩm</p>
                </div>
                <button className="btn-admin-add" onClick={handleAddProduct}>
                  <i className="fas fa-plus"></i> Đăng Sách Mới
                </button>
              </div>

              <div className="table-card-header">
                <h3>Danh sách sản phẩm sách ({filteredProducts.length})</h3>
                <div className="table-search-box">
                  <input
                    type="text"
                    placeholder="Tìm tên sách, tác giả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search"></i>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Thông tin sách</th>
                      <th>Tác giả</th>
                      <th>Giá bán</th>
                      <th>Shop ID</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img src={p.img} alt={p.title} className="table-img-preview" />
                        </td>
                        <td>
                          <div className="product-cell">
                            <div className="product-title-sub">
                              <span className="product-title-text">{p.title}</span>
                              <span className="product-title-cat">{p.category.toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td>{p.author}</td>
                        <td><b style={{ color: "var(--admin-text-primary)" }}>{p.price.toLocaleString()}đ</b></td>
                        <td><span className="payment-method-tag">Shop #{p.shopId}</span></td>
                        <td>
                          <span className={`status-badge ${p.status === "AVAILABLE" ? "completed" : "cancelled"}`}>
                            {p.status === "AVAILABLE" ? "Còn hàng" : "Đã bán"}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-action-edit" onClick={() => handleEditProductPrice(p.id)} title="Sửa giá">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn-action-delete" onClick={() => handleDeleteProduct(p.id)} title="Xóa sách">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: ORDERS MANAGEMENT ================= */}
          {activeTab === "orders" && (
            <div className="table-card">
              <div className="admin-tab-actions-bar">
                <div className="admin-header-title">
                  <h1>Quản Lý Đơn Hàng</h1>
                  <p>Kiểm tra quy trình vận đơn, thay đổi trạng thái đơn hàng (Click để chuyển nhanh trạng thái)</p>
                </div>
                <button className="btn-export-report" onClick={exportToCSV}>
                  <i className="fas fa-file-download"></i> Xuất Danh Sách
                </button>
              </div>

              <div className="table-card-header">
                <h3>Tất cả hóa đơn ({filteredOrdersList.length})</h3>
                <div className="table-search-box">
                  <input
                    type="text"
                    placeholder="Tìm mã đơn, tên khách..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search"></i>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                      <th>Cập nhật nhanh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersList.map((order) => (
                      <tr key={order.id}>
                        <td><span className="order-id-badge">{order.id}</span></td>
                        <td>
                          <div className="customer-info-cell">
                            <span className="customer-name">{order.name}</span>
                            <span className="customer-phone">{order.phone}</span>
                          </div>
                        </td>
                        <td><span className="order-date">{order.date}</span></td>
                        <td><span className="order-amount">{order.amount.toLocaleString()}đ</span></td>
                        <td><span className="payment-method-tag">{order.method}</span></td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status === "completed"
                              ? "Thành Công"
                              : order.status === "shipping"
                              ? "Đang Giao"
                              : order.status === "pending"
                              ? "Chờ Duyệt"
                              : "Đã Hủy"}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action-view" onClick={() => cycleOrderStatus(order.id)}>
                            <i className="fas fa-sync-alt"></i> Chuyển trạng thái
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 4: USERS MANAGEMENT ================= */}
          {activeTab === "users" && (
            <div className="table-card">
              <div className="admin-tab-actions-bar">
                <div className="admin-header-title">
                  <h1>Quản Lý Người Dùng & Sách Ký Gửi</h1>
                  <p>Quản lý tài khoản khách mua và chủ shop ký gửi sách trên hệ thống ReBook.vn</p>
                </div>
              </div>

              <div className="table-card-header">
                <h3>Danh sách tài khoản ({users.length})</h3>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Họ và Tên</th>
                      <th>Email</th>
                      <th>Điện thoại</th>
                      <th>Quyền hạn</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><b>#{u.id}</b></td>
                        <td><span className="order-id-badge">{u.username}</span></td>
                        <td><span className="customer-name">{u.fullName}</span></td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <span className={`payment-method-tag`} style={{ color: u.role === "ADMIN" ? "var(--admin-accent-warning)" : "var(--admin-text-secondary)" }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.status === "ACTIVE" ? "completed" : "cancelled"}`}>
                            {u.status === "ACTIVE" ? "Hoạt động" : "Khóa"}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-action-view" onClick={() => toggleUserRole(u.id)} title="Đổi Quyền Hạn">
                              <i className="fas fa-user-shield"></i> Quyền
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => toggleUserStatus(u.id)}
                              style={{ backgroundColor: u.status === "ACTIVE" ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", color: u.status === "ACTIVE" ? "var(--admin-accent-rose)" : "var(--admin-accent-success)" }}
                              title={u.status === "ACTIVE" ? "Khóa tài khoản" : "Mở tài khoản"}
                            >
                              <i className={u.status === "ACTIVE" ? "fas fa-ban" : "fas fa-check"}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 5: SETTINGS ================= */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="settings-grid">
              
              {/* Card 1: Shop config */}
              <div className="settings-card">
                <h3><i className="fas fa-store"></i> Cấu hình Sàn Giao Dịch</h3>
                
                <div className="setting-form-group">
                  <label>Tỷ lệ chiết khấu sàn (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({ ...settings, commissionRate: parseInt(e.target.value) || 0 })}
                    required
                  />
                  <span className="setting-desc">Tỷ lệ phần trăm hoa hồng sàn thu trên mỗi đơn hàng sách cũ giao dịch thành công.</span>
                </div>

                <div className="setting-form-group">
                  <label>Phí vận chuyển cơ bản (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.baseShippingFee}
                    onChange={(e) => setSettings({ ...settings, baseShippingFee: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="setting-form-group">
                  <label>Hạn mức miễn phí vận chuyển (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.freeShipThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShipThreshold: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              {/* Card 2: Server SMTP config */}
              <div className="settings-card">
                <h3><i className="fas fa-envelope"></i> SMTP Email Server</h3>
                
                <div className="setting-form-group">
                  <label>Email gửi hệ thống (Gmail)</label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    required
                  />
                </div>

                <div className="setting-form-group">
                  <label>Mật khẩu ứng dụng (App Password)</label>
                  <input
                    type="password"
                    value="••••••••••••••••"
                    disabled
                  />
                  <span className="setting-desc">Mã bảo mật 16 chữ số tạo từ Google Account Security.</span>
                </div>

                <div className="setting-form-group">
                  <label>Cổng SMTP (Port)</label>
                  <select>
                    <option value="587">587 (TLS - Khuyên dùng)</option>
                    <option value="465">465 (SSL)</option>
                  </select>
                </div>
              </div>

              {/* Card 3: System Status config */}
              <div className="settings-card">
                <h3><i className="fas fa-server"></i> Trạng Thái Hệ Thống</h3>
                
                <div className="setting-switch-row">
                  <div className="setting-switch-info">
                    <span className="setting-switch-label">Chế độ bảo trì sàn (Maintenance)</span>
                    <span className="setting-desc">Tạm thời khóa các tính năng thanh toán của khách hàng.</span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-switch-row">
                  <div className="setting-switch-info">
                    <span className="setting-switch-label">Tự động duyệt đơn hàng (Auto Confirm)</span>
                    <span className="setting-desc">Duyệt tự động chuyển qua trạng thái "Đang giao" khi thanh toán momo/qr.</span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.autoConfirm}
                      onChange={(e) => setSettings({ ...settings, autoConfirm: e.target.checked })}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-switch-row">
                  <div className="setting-switch-info">
                    <span className="setting-switch-label">Nhận thông báo Admin (Email Alerts)</span>
                    <span className="setting-desc">Gửi mail báo cáo hàng tuần về doanh thu cho ban quản trị.</span>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.adminNotifications}
                      onChange={(e) => setSettings({ ...settings, adminNotifications: e.target.checked })}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <button type="submit" className="btn-settings-save">
                  <i className="fas fa-save"></i> Lưu Tất Cả Thay Đổi
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
};

export default AdminRevenue;
