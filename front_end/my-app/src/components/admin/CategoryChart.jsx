import React from "react";

function CategoryChart({ categories }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Hiệu suất chuyên mục</h3>
      </div>

      <div className="categories-list">
        {categories.map((cat, index) => (
          <div
            className="category-row"
            key={index}
          >
            <div className="category-info">

              <div className="category-name-box">
                <span
                  className="category-dot"
                  style={{
                    backgroundColor: cat.color,
                  }}
                ></span>

                <span className="category-name">
                  {cat.name}
                </span>
              </div>

              <span className="category-value">
                {cat.value.toLocaleString()}đ
              </span>

            </div>

            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryChart;