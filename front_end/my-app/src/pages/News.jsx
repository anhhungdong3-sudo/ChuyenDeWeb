import React from "react";
import { Link } from "react-router-dom";

const News = () => {
  const dummyNews = [
    {
      id: 1,
      title:
        "Xu hướng đọc sách giấy của giới trẻ quay trở lại mạnh mẽ trong năm nay",
      summary:
        "Thay vì lướt màn hình điện thoại, nhiều bạn trẻ đang tìm đến các quán cà phê sách cũ để tận hưởng không gian yên tĩnh và mùi giấy thơm đặc trưng...",
      date: "08/07/2026",
      category: "Xu hướng văn hóa",
      image:
        "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600",
    },
    {
      id: 2,
      title:
        "5 cuốn sách cũ kinh điển về tư duy kinh doanh bạn nên đọc một lần trong đời",
      summary:
        "Những giá trị tri thức vượt thời gian từ những đầu sách cũ không hề giảm giá trị mà trái lại càng được minh chứng sắc bén qua thời gian...",
      date: "05/07/2026",
      category: "Góc review",
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
    },
    {
      id: 3,
      title:
        "Chương trình 'Đổi giấy lấy sách cũ cứu hành tinh xanh' tại TP.HCM",
      summary:
        "Sự kiện thu hút hơn 1000 lượt tham gia của các học sinh sinh viên quyên góp sách cũ giúp tái tạo thư viện mini cho trẻ em nghèo vùng cao...",
      date: "01/07/2026",
      category: "Sự kiện cộng đồng",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
    },
    {
      id: 4,
      title:
        "Bí quyết bảo quản và phục chế sách cũ bị ố vàng ngay tại nhà cực đơn giản",
      summary:
        "Làm thế nào để giữ cho những trang sách cũ không bị mối mọt hay ẩm mốc tàn phá? Khám phá ngay các mẹo xử lý giấy từ các chuyên gia lưu trữ...",
      date: "28/06/2026",
      category: "Mẹo hay mọt sách",
      image:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
    },
    {
      id: 5,
      title: "Ký ức Sài Gòn qua những sạp sách cũ vỉa hè hơn nửa thế kỷ",
      summary:
        "Tìm lại nét văn hóa xưa cũ của những cung đường sách nổi tiếng tại Sài Gòn, nơi những cuốn sách nhuốm màu thời gian vẫn âm thầm kể chuyện...",
      date: "25/06/2026",
      category: "Ký ức & Tư liệu",
      image:
        "https://images.unsplash.com/photo-1532012164546-f432f2c3edd0?w=600",
    },
    {
      id: 6,
      title:
        "Top 7 tựa sách văn học nước ngoài đã ngưng xuất bản nay săn lùng ở đâu?",
      summary:
        "Điểm mặt những tác phẩm văn học kinh điển cực kỳ khan hiếm trên thị trường sách mới nhưng lại có thể vô tình tìm thấy ở các kệ sách cũ...",
      date: "20/06/2026",
      category: "Góc săn sách",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    },
    {
      id: 7,
      title:
        "Tác động tích cực của việc mua bán sách cũ đối với bảo vệ môi trường",
      summary:
        "Mỗi cuốn sách cũ được tái sử dụng đồng nghĩa với việc giảm thiểu lượng lớn cây xanh bị đốn hạ và năng lượng vận hành nhà máy in ấn...",
      date: "15/06/2026",
      category: "Sống xanh",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
    },
    {
      id: 8,
      title:
        "Nghệ thuật sắp đặt kệ sách cũ - Biến không gian phòng ngủ thành góc chill",
      summary:
        "Gợi ý những phong cách decor phòng với sách cũ theo xu hướng Vintage và Retro đang làm mưa làm gió trong cộng đồng kiến trúc nội thất...",
      date: "10/06/2026",
      category: "Không gian sống",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
    },
    {
      id: 9,
      title:
        "Gặp gỡ chàng trai 9x sở hữu bộ sưu tập hơn 3000 cuốn sách cổ quý hiếm",
      summary:
        "Lắng nghe câu chuyện truyền cảm hứng của một người trẻ đam mê săn lùng và gìn giữ những bản in đầu tiên từ thế kỷ trước tại Việt Nam...",
      date: "05/06/2026",
      category: "Nhân vật truyền cảm hứng",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
    },
  ];

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <span
          className="badge px-3 py-2 text-white mb-2"
          style={{ backgroundColor: "#8B5A2B" }}
        >
          Bản Tin Tri Thức
        </span>
        <h2 className="fw-bold text-dark display-6">
          Tin Tức & Hoạt Động Của Nhóm
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Cập nhật những xu hướng đọc sách, bài review ý nghĩa và các chiến dịch
          lan tỏa văn hóa đọc từ Old Bookstore.
        </p>
      </div>

      <div className="row g-4">
        {dummyNews.map((item) => (
          <div className="col-lg-4 col-md-6" key={item.id}>
            <article className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">
              <div className="position-relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="card-img-top object-fit-cover"
                  style={{ height: "220px" }}
                />
                <span className="position-absolute bottom-0 start-0 m-3 badge bg-white text-dark shadow-sm fw-medium">
                  {item.category}
                </span>
              </div>
              <div className="card-body p-4 d-flex flex-column">
                <div className="text-muted small mb-2">
                  📅 Ngày đăng: {item.date}
                </div>
                <h5 className="card-title fw-bold text-dark line-clamp-2 mb-3">
                  {item.title}
                </h5>
                <p className="card-text text-secondary small mb-4 flex-grow-1">
                  {item.summary}
                </p>
                <Link
                  to={`/news/${item.id}`}
                  className="fw-bold text-decoration-none mt-auto align-self-start"
                  style={{ color: "#8B5A2B" }}
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
