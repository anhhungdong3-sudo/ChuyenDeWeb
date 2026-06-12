import React from "react";

function RevenueChart({
  SVG_CONFIG,
  activeStatsData,
  chartPoints,
  areaPathD,
  linePathD,
  hoveredDataPoint,
  tooltipPos,
  handleMouseMoveDot,
  setHoveredDataPoint,
}) {
  return (
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
        <svg
          viewBox={`0 0 ${SVG_CONFIG.width} ${SVG_CONFIG.height}`}
          className="svg-chart"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient
              id="chart-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--admin-accent-primary)"
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor="var(--admin-accent-primary)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Y Axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y =
              SVG_CONFIG.height -
              SVG_CONFIG.paddingBottom -
              ratio *
                (SVG_CONFIG.height -
                  SVG_CONFIG.paddingTop -
                  SVG_CONFIG.paddingBottom);

            const maxVal =
              Math.max(
                ...activeStatsData.chartData.map((d) => d.value)
              ) || 1;

            const labelValue = ratio * maxVal;

            return (
              <g key={i}>
                <line
                  x1={SVG_CONFIG.paddingLeft}
                  y1={y}
                  x2={SVG_CONFIG.width - SVG_CONFIG.paddingRight}
                  y2={y}
                  className="chart-grid-line"
                />

                <text
                  x={SVG_CONFIG.paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-text"
                >
                  {labelValue >= 1000000
                    ? `${(labelValue / 1000000).toFixed(1)}M`
                    : `${(labelValue / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* X Axis */}
          {chartPoints.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={SVG_CONFIG.height - 10}
              textAnchor="middle"
              className="chart-axis-text"
            >
              {point.label}
            </text>
          ))}

          {/* Area + Line */}
          {chartPoints.length > 0 && (
            <>
              <path
                d={areaPathD}
                className="chart-area-path"
              />

              <path
                d={linePathD}
                className="chart-line-path"
              />
            </>
          )}

          {/* Dots */}
          {chartPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="5"
              className="chart-dot"
              onMouseEnter={(e) =>
                handleMouseMoveDot(e, point)
              }
              onMouseLeave={() =>
                setHoveredDataPoint(null)
              }
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredDataPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className="chart-tooltip-date">
              {hoveredDataPoint.label}
            </div>

            <div className="chart-tooltip-value">
              {hoveredDataPoint.value.toLocaleString()}đ
            </div>

            <div
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              {hoveredDataPoint.orders} đơn hàng
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RevenueChart;