import React, { useState, useMemo } from "react";
import "../../styles/admin/Dashboard.css";

import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import CategoryChart from "../../components/admin/CategoryChart";

function Dashboard() {

  const [timeRange, setTimeRange] = useState("last7days");

  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
  });

  const settings = {
    commissionRate: 10,
  };

  const MOCK_STATS_DATA = {
    last7days: {
      kpi: {
        revenue: 2845000,
        revenueTrend: 12.5,

        orders: 12,
        ordersTrend: 8.3,

        avgOrderValue: 237083,
        avgOrderValueTrend: 3.8,

        commissionTrend: 12.5,
      },

      chartData: [
        { label: "T2", value: 320000, orders: 1 },
        { label: "T3", value: 450000, orders: 2 },
        { label: "T4", value: 180000, orders: 1 },
        { label: "T5", value: 620000, orders: 3 },
        { label: "T6", value: 290000, orders: 1 },
        { label: "T7", value: 580000, orders: 2 },
        { label: "CN", value: 405000, orders: 2 },
      ],

      categories: [
        {
          name: "Sách Văn Học",
          value: 1120000,
          percentage: 39,
          color: "#3b82f6",
        },
        {
          name: "Kinh Tế",
          value: 860000,
          percentage: 30,
          color: "#10b981",
        },
        {
          name: "Công Nghệ",
          value: 520000,
          percentage: 18,
          color: "#f59e0b",
        },
        {
          name: "Thiếu Nhi",
          value: 345000,
          percentage: 13,
          color: "#ef4444",
        },
      ],
    },
  };

  const activeStatsData = useMemo(() => {
    return MOCK_STATS_DATA[timeRange];
  }, [timeRange]);

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

    const maxValue =
      Math.max(...data.map((d) => d.value)) || 1;

    return data.map((item, index) => {

      const x =
        SVG_CONFIG.paddingLeft +
        index *
          ((SVG_CONFIG.width -
            SVG_CONFIG.paddingLeft -
            SVG_CONFIG.paddingRight) /
            (data.length - 1));

      const y =
        SVG_CONFIG.height -
        SVG_CONFIG.paddingBottom -
        (item.value / maxValue) *
          (SVG_CONFIG.height -
            SVG_CONFIG.paddingTop -
            SVG_CONFIG.paddingBottom);

      return {
        ...item,
        x,
        y,
      };
    });

  }, [activeStatsData]);

  const linePathD = useMemo(() => {

    if (!chartPoints.length) return "";

    return chartPoints
      .map((p, i) =>
        `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
      )
      .join(" ");

  }, [chartPoints]);

  const areaPathD = useMemo(() => {

    if (!chartPoints.length) return "";

    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];

    return `
      M ${first.x} ${SVG_CONFIG.height - SVG_CONFIG.paddingBottom}
      L ${first.x} ${first.y}
      ${chartPoints
        .map((p) => `L ${p.x} ${p.y}`)
        .join(" ")}
      L ${last.x} ${SVG_CONFIG.height - SVG_CONFIG.paddingBottom}
      Z
    `;

  }, [chartPoints]);

  const handleMouseMoveDot = (e, point) => {

    const rect =
      e.currentTarget
        .ownerSVGElement
        .getBoundingClientRect();

    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 70,
    });

    setHoveredDataPoint(point);
  };

  const exportToCSV = () => {
    alert("Xuất Excel thành công");
  };

  return (
    <>
      {/* HEADER */}

      <div className="admin-header-panel">

        <div className="admin-header-title">
          <h1>Báo Cáo Tài Chính & Doanh Thu</h1>

          <p>
            Phân tích hiệu năng bán hàng,
            phí commission và dòng tiền
            trên sàn ReBook.vn
          </p>
        </div>

        <div className="admin-header-controls">

          <select
            className="time-range-select"
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value)
            }
          >
            <option value="last7days">
              7 ngày qua
            </option>
          </select>

          <button
            className="btn-export-report"
            onClick={exportToCSV}
          >
            Xuất Excel
          </button>

        </div>

      </div>

      {/* KPI */}

      <div className="kpi-cards-grid">

        <StatCard
          title="Tổng doanh thu"
          value={`${activeStatsData.kpi.revenue.toLocaleString()}đ`}
          trend={activeStatsData.kpi.revenueTrend}
          icon="fas fa-wallet"
          variant="primary"
        />

        <StatCard
          title="Đơn hàng mới"
          value={activeStatsData.kpi.orders}
          trend={activeStatsData.kpi.ordersTrend}
          icon="fas fa-shopping-cart"
          variant="success"
        />

        <StatCard
          title="Giá trị TB đơn"
          value={`${activeStatsData.kpi.avgOrderValue.toLocaleString()}đ`}
          trend={activeStatsData.kpi.avgOrderValueTrend}
          icon="fas fa-chart-line"
          variant="warning"
        />

        <StatCard
          title={`Chiết khấu (${settings.commissionRate}%)`}
          value={`${(
            activeStatsData.kpi.revenue *
            settings.commissionRate /
            100
          ).toLocaleString()}đ`}
          trend={activeStatsData.kpi.commissionTrend}
          icon="fas fa-percentage"
          variant="purple"
        />

      </div>

      {/* CHART */}

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

        <CategoryChart
          categories={activeStatsData.categories}
        />

      </div>
    </>
  );
}

export default Dashboard;