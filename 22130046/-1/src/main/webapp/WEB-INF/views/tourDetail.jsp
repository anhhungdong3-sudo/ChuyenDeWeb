<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Chi tiết Chương trình Tour</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', sans-serif; }
        .details-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .timeline-item { border-left: 3px solid #0d6efd; padding-left: 20px; position: relative; margin-bottom: 25px; }
        .timeline-item::before { content: ""; position: absolute; width: 12px; height: 12px; background: #0d6efd; border-radius: 50%; left: -8px; top: 6px; }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="listTours"><i class="fa-solid fa-compass me-2"></i>VinaTour</a>
        </div>
    </nav>

    <div class="container">
        <div class="details-card">
            <h2 class="text-primary fw-bold mb-3"><i class="fa-solid fa-umbrella-beach me-2"></i>CHƯƠNG TRÌNH TOUR: ${tour.description}</h2>
            
            <div class="row g-3 bg-light p-3 rounded mb-4">
                <div class="col-md-4"><strong><i class="fa-regular fa-clock text-primary me-2"></i>Số ngày:</strong> ${tour.days}</div>
                <div class="col-md-4"><strong><i class="fa-solid fa-plane text-primary me-2"></i>Phương tiện:</strong> ${tour.transportation}</div>
                <div class="col-md-4"><strong><i class="fa-regular fa-calendar text-primary me-2"></i>Khởi hành:</strong> ${tour.departureSchedule}</div>
            </div>
            
            <h4 class="fw-bold mb-4 text-secondary"><i class="fa-solid fa-route me-2"></i>Lịch Trình Chi Tiết</h4>
            
            <div class="timeline shadow-sm p-4 bg-white rounded border">
                <div class="timeline-item">
                    <h5 class="fw-bold text-dark">Ngày 01 (Thứ bảy): PHỐ BIỂN NHA TRANG</h5>
                    <p class="text-muted mb-0">Tham quan suối Hoa Lan. Khám phá Mê Cung Trận Đồ. Chèo thuyền, ngắm cảnh trên Hồ Nghinh Xuân - Thủy Tiên. KDL Hòn Lao - Đảo Khỉ. Tham gia chương trình giải trí tại Thế giới giải trí Vinpearl Land.</p>
                </div>
                
                <div class="timeline-item mb-0">
                    <h5 class="fw-bold text-dark">Ngày 02 (Chủ nhật): NHA TRANG - SÀI GÒN (tàu lửa)</h5>
                    <p class="text-muted mb-0">Tham quan Tháp Bà Ponagar. Chùa Long Sơn. Ngắm cảnh Hòn Chồng, núi Cô Tiên. Khu du lịch Suối Khoáng Nóng Tháp Bà. Ăn tối, xe đưa quý khách ra ga Nha Trang khởi hành về Sài Gòn bằng tàu lửa. Kết thúc chuyến tham quan, hẹn ngày gặp lại.</p>
                </div>
            </div>
            
            <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <a href="listTours" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-left me-1"></i> Quay lại danh sách</a>
                <a href="bookTour?id=${t.id}" class="btn btn-success btn-lg px-4 shadow"><i class="fa-solid fa-file-signature me-1"></i> Đặt Tour Ngay</a>
            </div>
        </div>
    </div>

</body>
</html>