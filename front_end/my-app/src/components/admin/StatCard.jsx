import React from "react";

function StatCard({
  title,
  value,
  trend,
  icon,
  variant = "primary",
  footerText = "so với kỳ trước",
}) {
  return (
    <div className={`kpi-card ${variant}`}>
      <div className="kpi-header">
        <span className="kpi-title">
          {title}
        </span>

        <div className="kpi-icon-box">
          <i className={icon}></i>
        </div>
      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-footer">
        <span className="trend-badge up">
          <i className="fas fa-arrow-up"></i>
          {" "}
          {trend}%
        </span>

        <span className="trend-text">
          {footerText}
        </span>
      </div>
    </div>
  );
}

export default StatCard;