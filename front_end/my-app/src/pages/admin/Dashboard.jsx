import React, { useEffect, useMemo, useState } from "react";
import "../../styles/admin/Dashboard.css";

import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import CategoryChart from "../../components/admin/CategoryChart";
import { formatCurrency, orderService } from "../../services/api";

const CHART_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed", "#0f766e"];

const EMPTY_STATS = {
  todayRevenue: 0,
  monthRevenue: 0,
  yearRevenue: 0,
  deliveredOrders: 0,
  booksSold: 0,
  dailyRevenue: [],
  categoryRevenue: [],
};

function Dashboard() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    orderService
      .getRevenueStats(days)
      .then((data) => {
        if (isMounted) {
          setStats(data || EMPTY_STATS);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Khong the tai du lieu thong ke doanh thu.");
          setStats(EMPTY_STATS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [days]);

  const activeStatsData = useMemo(() => {
    const chartData = (stats.dailyRevenue || []).map((item) => ({
      label: item.label,
      value: Number(item.revenue || 0),
      orders: Number(item.orders || 0),
    }));

    const categories = (stats.categoryRevenue || []).map((item, index) => ({
      name: item.name,
      value: Number(item.revenue || 0),
      booksSold: Number(item.booksSold || 0),
      percentage: Number(item.percentage || 0),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return { chartData, categories };
  }, [stats]);

  const SVG_CONFIG = {
    width: 600,
    height: 260,
    paddingLeft: 50,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 40,
  };

  const chartPoints = useMemo(() => {
    const data = activeStatsData.chartData;
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const xStep =
      data.length > 1
        ? (SVG_CONFIG.width - SVG_CONFIG.paddingLeft - SVG_CONFIG.paddingRight) / (data.length - 1)
        : 0;

    return data.map((item, index) => {
      const x = data.length > 1 ? SVG_CONFIG.paddingLeft + index * xStep : SVG_CONFIG.width / 2;
      const y =
        SVG_CONFIG.height -
        SVG_CONFIG.paddingBottom -
        (item.value / maxValue) * (SVG_CONFIG.height - SVG_CONFIG.paddingTop - SVG_CONFIG.paddingBottom);

      return { ...item, x, y };
    });
  }, [activeStatsData]);

  const linePathD = useMemo(() => {
    if (!chartPoints.length) return "";
    return chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [chartPoints]);

  const areaPathD = useMemo(() => {
    if (!chartPoints.length) return "";
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const bottom = SVG_CONFIG.height - SVG_CONFIG.paddingBottom;
    return `M ${first.x} ${bottom} L ${first.x} ${first.y} ${chartPoints
      .map((p) => `L ${p.x} ${p.y}`)
      .join(" ")} L ${last.x} ${bottom} Z`;
  }, [chartPoints]);

  const handleMouseMoveDot = (e, point) => {
    const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 70,
    });
    setHoveredDataPoint(point);
  };

  return (
    <>
      <div className="admin-header-panel">
        <div className="admin-header-title">
          <h1>Bao cao doanh thu</h1>
          <p>Doanh thu duoc tinh theo ngay don hang duoc chuyen sang trang thai da giao.</p>
        </div>

        <div className="admin-header-controls">
          <select className="time-range-select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>7 ngay qua</option>
            <option value={15}>15 ngay qua</option>
            <option value={30}>30 ngay qua</option>
          </select>
        </div>
      </div>

      {error && <div className="dashboard-alert">{error}</div>}

      <div className="kpi-cards-grid">
        <StatCard title="Doanh thu hom nay" value={formatCurrency(stats.todayRevenue)} icon="fas fa-wallet" variant="primary" />
        <StatCard title="Doanh thu thang nay" value={formatCurrency(stats.monthRevenue)} icon="fas fa-chart-line" variant="success" />
        <StatCard title="Doanh thu nam nay" value={formatCurrency(stats.yearRevenue)} icon="fas fa-calendar" variant="warning" />
        <StatCard title="So don da giao" value={stats.deliveredOrders || 0} icon="fas fa-box" variant="purple" />
        <StatCard title="So sach da ban" value={stats.booksSold || 0} icon="fas fa-book" variant="success" />
      </div>

      {loading ? (
        <div className="dashboard-loading">Dang tai thong ke...</div>
      ) : (
        <div className="charts-grid">
          <RevenueChart
            SVG_CONFIG={SVG_CONFIG}
            chartPoints={chartPoints}
            linePathD={linePathD}
            areaPathD={areaPathD}
            activeStatsData={activeStatsData}
            hoveredDataPoint={hoveredDataPoint}
            tooltipPos={tooltipPos}
            handleMouseMoveDot={handleMouseMoveDot}
            setHoveredDataPoint={setHoveredDataPoint}
          />

          <CategoryChart categories={activeStatsData.categories} />
        </div>
      )}
    </>
  );
}

export default Dashboard;
