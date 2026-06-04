<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Nhận Đặt Tour Thành Công</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .voucher-card { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; max-width: 750px; margin: 40px auto; border: none; }
        .voucher-header { background: linear-gradient(135deg, #198754, #146c43); color: white; padding: 35px 20px; text-align: center; position: relative; }
        .voucher-body { padding: 30px; }
        .success-icon { font-size: 3.5rem; color: #ffffff; background: rgba(255,255,255,0.2); width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-bottom: 15px; }
        .info-title { font-size: 1.1rem; font-weight: 600; color: #198754; border-bottom: 2px dashed #dee2e6; padding-bottom: 6px; margin-bottom: 15px; margin-top: 25px; }
        .info-title:first-of-type { margin-top: 0; }
        .label-cell { width: 35%; color: #6c757d; font-weight: 500; }
        .value-cell { color: #212529; font-weight: 600; }
        .total-highlight { background-color: #f8f9fa; border-radius: 8px; padding: 15px; border-left: 4px solid #198754; }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="listTours"><i class="fa-solid fa-compass me-2"></i>VinaTour</a>
        </div>
    </nav>

    <div class="container">
        <div class="card voucher-card">
            
            <div class="voucher-header">
                <div class="success-icon shadow-sm">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2 class="fw-bold mb-1">ĐẶT TOUR THÀNH CÔNG!</h2>
                <p class="mb-0 opacity-75">Cảm ơn bạn đã lựa chọn dịch vụ du lịch của chúng tôi. Dưới đây là thông tin phiếu xác nhận của bạn.</p>
            </div>
            
            <div class="voucher-body">
                
                <div class="info-title"><i class="fa-solid fa-map-location-dot me-2"></i>1. Thông Tin Chương Trình Tour</div>
                <table class="table table-borderless align-middle mb-0">
                    <tr>
                        <td class="label-cell">Tên chương trình:</td>
                        <td class="value-cell text-primary fs-5">${booking.tour.description}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Thời gian hành trình:</td>
                        <td class="value-cell"><i class="fa-regular fa-clock me-1 text-muted"></i>${booking.tour.days}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Phương tiện di chuyển:</td>
                        <td class="value-cell"><i class="fa-solid fa-plane-departure me-1 text-muted"></i>${booking.tour.transportation}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Đơn giá cơ bản:</td>
                        <td class="value-cell text-danger"><fmt:formatNumber value="${booking.tour.price}" type="number"/> VNĐ / Khách</td>
                    </tr>
                </table>

                <div class="info-title"><i class="fa-solid fa-user-check me-2"></i>2. Thông Tin Khách Hàng</div>
                <table class="table table-borderless align-middle mb-0">
                    <tr>
                        <td class="label-cell">Họ và tên:</td>
                        <td class="value-cell">${booking.customer.name}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Địa chỉ liên hệ:</td>
                        <td class="value-cell">${empty booking.customer.address ? '<em>Chưa cung cấp</em>' : booking.customer.address}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Hộp thư Email:</td>
                        <td class="value-cell"><i class="fa-regular fa-envelope me-1 text-muted"></i>${booking.customer.email}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Số điện thoại:</td>
                        <td class="value-cell"><i class="fa-solid fa-mobile-screen-button me-1 text-muted"></i>${booking.customer.phone}</td>
                    </tr>
                </table>

                <div class="info-title"><i class="fa-solid fa-calendar-check me-2"></i>3. Thông Tin Đăng Ký Chuyến Đi</div>
                <table class="table table-borderless align-middle mb-3">
                    <tr>
                        <td class="label-cell">Ngày khởi hành:</td>
                        <td class="value-cell text-success"><i class="fa-regular fa-calendar-days me-1"></i>${booking.departureDate}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Số người lớn:</td>
                        <td class="value-cell"><span class="badge bg-dark px-2 py-1">${booking.noAdults} người</span></td>
                    </tr>
                    <tr>
                        <td class="label-cell">Số trẻ em đi kèm:</td>
                        <td class="value-cell"><span class="badge bg-secondary px-2 py-1">${booking.noChildren} người</span></td>
                    </tr>
                </table>

                <div class="total-highlight d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <span class="text-muted small d-block">Trạng thái phiếu</span>
                        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-bold">
                            <i class="fa-solid fa-spinner fa-spin me-1"></i> Đang chờ xử lý
                        </span>
                    </div>
                    <div class="text-end">
                        <span class="text-muted small d-block">Giá tour tham khảo</span>
                        <h4 class="text-danger fw-bold mb-0"><fmt:formatNumber value="${booking.tour.price}" type="number"/> đ</h4>
                    </div>
                </div>

                <div class="text-center mt-5 pt-3 border-top">
                    <a href="listTours" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                        <i class="fa-solid fa-house-chimney me-2"></i> Quay về trang chủ du lịch
                    </a>
                </div>
                
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>