import React from "react";
import "../styles/Profile.css";

export const Profile = () => {
  // Dữ liệu giả lập người dùng
  const user = {
    name: "Đồng Trần",
    joinedDate: "Tháng 05/2025",
    rating: 4.9,
    reviews: 128,
    avatar: "https://i.pravatar.cc/150?u=dongtran",
    products: [
      {
        id: 1,
        title: "Áo khoác Varsity Jacket",
        price: "249.000đ",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200",
      },
      {
        id: 4,
        title: "Áo Hoodie Unisex",
        price: "120.000đ",
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200",
      },
    ],
  };

  return (
    <div className="profile-container">
      {/* Header hồ sơ */}
      <div className="profile-header">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>Tham gia từ {user.joinedDate}</p>
          <div className="profile-stats">
            <span>
              <strong>{user.rating}</strong> ⭐ ({user.reviews} đánh giá)
            </span>
          </div>
          <button className="btn-edit-profile">Chỉnh sửa hồ sơ</button>
        </div>
      </div>

      {/* Danh sách sản phẩm của người này */}
      <div className="profile-listings">
        <h3>Sản phẩm đang bán ({user.products.length})</h3>
        <div className="listings-grid">
          {user.products.map((item) => (
            <div key={item.id} className="listing-card">
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
              <strong>{item.price}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Profile;
