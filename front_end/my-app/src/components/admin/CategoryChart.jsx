import React, { useMemo } from "react";
import { formatCurrency } from "../../services/api";

const createArcPath = (startAngle, endAngle, radius = 82, center = 100) => {
  if (endAngle - startAngle >= Math.PI * 2 - 0.0001) {
    return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`;
  }

  const start = {
    x: center + radius * Math.cos(startAngle),
    y: center + radius * Math.sin(startAngle),
  };
  const end = {
    x: center + radius * Math.cos(endAngle),
    y: center + radius * Math.sin(endAngle),
  };
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
};

function CategoryChart({ categories }) {
  const slices = useMemo(() => {
    let currentAngle = -Math.PI / 2;
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);

    return categories.map((cat) => {
      const sliceAngle = total > 0 ? (cat.value / total) * Math.PI * 2 : 0;
      const slice = {
        ...cat,
        path: createArcPath(currentAngle, currentAngle + sliceAngle),
      };
      currentAngle += sliceAngle;
      return slice;
    });
  }, [categories]);

  const totalRevenue = categories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Doanh thu theo the loai</h3>
      </div>

      {categories.length === 0 ? (
        <div className="empty-chart-state">Chua co doanh thu da giao trong khoang nay.</div>
      ) : (
        <div className="category-chart-layout">
          <div className="pie-chart-wrap">
            <svg viewBox="0 0 200 200" className="pie-chart" role="img" aria-label="Doanh thu theo the loai sach">
              {slices.map((cat) => (
                <path key={cat.name} d={cat.path} fill={cat.color} />
              ))}
              <circle cx="100" cy="100" r="48" className="pie-center" />
            </svg>
            <div className="pie-total">
              <span>Tong</span>
              <strong>{formatCurrency(totalRevenue)}</strong>
            </div>
          </div>

          <div className="categories-list">
            {categories.map((cat) => (
              <div className="category-row" key={cat.name}>
                <div className="category-info">
                  <div className="category-name-box">
                    <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="category-name">{cat.name}</span>
                  </div>

                  <span className="category-value">{formatCurrency(cat.value)}</span>
                </div>

                <div className="category-meta">
                  <span>{cat.percentage.toFixed(1)}%</span>
                  <span>{cat.booksSold} sach</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryChart;
