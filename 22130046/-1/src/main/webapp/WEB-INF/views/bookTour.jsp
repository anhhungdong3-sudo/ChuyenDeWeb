<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng Ký Đặt Tour</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', sans-serif; }
        .form-container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto; }
        .section-title { font-size: 1.15rem; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 20px; margin-top: 25px; }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="listTours"><i class="fa-solid fa-compass me-2"></i>VinaTour</a>
        </div>
    </nav>

    <div class="container mb-5">
        <div class="form-container">
            <div class="alert alert-info border-0 shadow-sm mb-4">
                <h4 class="alert-heading fw-bold mb-1"><i class="fa-solid fa-circle-info me-2"></i>Đang đặt: ${tour.description}</h4>
                <p class="mb-0 small text-muted"><i class="fa-regular fa-clock me-1"></i>Thời gian: ${tour.days}</p>
            </div>

            <form:form id="tourBookingForm" action="saveBooking" method="POST" modelAttribute="booking">
                <form:hidden path="tour.id"/>

                <div class="section-title text-primary"><i class="fa-solid fa-user-tag me-2"></i>Thông Tin Khách Hàng</div>
                
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Họ tên <span class="text-danger">(*)</span></label>
                        <form:input path="customer.name" id="customerName" class="form-control ajax-validate" placeholder="Nhập đầy đủ họ tên"/>
                        <div id="customerName-err" class="invalid-feedback d-block"></div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">E-mail <span class="text-danger">(*)</span></label>
                        <form:input path="customer.email" id="customerEmail" class="form-control ajax-validate ${not empty errorEmail ? 'is-invalid' : ''}" placeholder="name@example.com"/>
                        <div id="customerEmail-err" class="invalid-feedback d-block" style="color: #dc3545;">
                            <c:if test="${not empty errorEmail}">
                                <i class='fa-solid fa-circle-exclamation me-1'></i>${errorEmail}
                            </c:if>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Điện thoại <span class="text-danger">(*)</span></label>
                        <form:input path="customer.phone" id="customerPhone" class="form-control ajax-validate ${not empty errorPhone ? 'is-invalid' : ''}" placeholder="Số điện thoại liên hệ (10 số, bắt đầu bằng 0)"/>
                        <div id="customerPhone-err" class="invalid-feedback d-block" style="color: #dc3545;">
                            <c:if test="${not empty errorPhone}">
                                <i class='fa-solid fa-circle-exclamation me-1'></i>${errorPhone}
                            </c:if>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Địa chỉ</label>
                        <form:input path="customer.address" class="form-control" placeholder="Số nhà, tên đường, tỉnh/thành"/>
                    </div>
                </div>

                <div class="section-title text-primary"><i class="fa-solid fa-suitcase-rolling me-2"></i>Thông Tin Chuyến Đi</div>
                
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Ngày khởi hành <span class="text-danger">(*)</span></label>
                        <form:input path="departureDate" type="date" id="departureDate" class="form-control ajax-validate"/>
                        <div id="departureDate-err" class="invalid-feedback d-block"></div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Số người lớn <span class="text-danger">(*)</span></label>
                        <form:input path="noAdults" type="number" min="1" class="form-control" required="true"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Số trẻ em</label>
                        <form:input path="noChildren" type="number" min="0" class="form-control"/>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                    <a href="listTours" class="btn btn-light border px-4">Hủy bỏ</a>
                    <button type="submit" class="btn btn-primary px-4 shadow-sm"><i class="fa-solid fa-paper-plane me-1"></i> Gửi đăng ký</button>
                </div>
            </form:form>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            // Hàm kiểm tra và thực hiện gọi Ajax kiểm tra
            $(".ajax-validate").on("blur change", function() {
                var inputTag = $(this);
                var fieldName = inputTag.attr("name");
                var fieldValue = inputTag.val();
                var errorSpanId = "#" + inputTag.attr("id") + "-err";

                $.ajax({
                    url: "${pageContext.request.contextPath}/api/ajax/validate-field",
                    type: "POST",
                    data: { fieldName: fieldName, fieldValue: fieldValue },
                    success: function(response) {
                        if (response.valid === false) {
                            $(errorSpanId).html("<i class='fa-solid fa-circle-exclamation me-1'></i>" + response.message).css("color", "#dc3545");
                            inputTag.removeClass("is-valid").addClass("is-invalid");
                        } else {
                            if(fieldValue.trim() !== "") {
                                $(errorSpanId).html("<i class='fa-solid fa-circle-check me-1'></i> Hợp lệ").css("color", "#198754");
                                inputTag.removeClass("is-invalid").addClass("is-valid");
                            } else {
                                $(errorSpanId).html("");
                                inputTag.removeClass("is-invalid is-valid");
                            }
                        }
                    }
                });
            });

            // Xử lý sự kiện khi ấn nút Submit Form
            $("#tourBookingForm").on("submit", function(e) {
                // Kích hoạt tất cả các ô kiểm tra để cập nhật trạng thái mới nhất
                $(".ajax-validate").each(function() {
                    if ($(this).val().trim() === "") {
                        // Nếu rỗng, kích hoạt blur để hiển thị thông báo bắt buộc điền
                        $(this).trigger("blur");
                    }
                });

                var hasError = false;

                // Kiểm tra xem có bất kỳ trường nào có class 'is-invalid' hay không
                $(".ajax-validate").each(function() {
                    if ($(this).hasClass("is-invalid")) {
                        hasError = true;
                    }
                });

                // Kiểm tra dự phòng dựa trên màu sắc hoặc nội dung của các thẻ thông báo lỗi
                $(".invalid-feedback").each(function() {
                    var text = $(this).text().trim();
                    // Nếu chứa ký tự lỗi và không phải chữ "Hợp lệ"
                    if(text !== "" && !text.includes("Hợp lệ")) {
                        hasError = true;
                    }
                });

                if (hasError) {
                    alert("Vui lòng sửa đổi các thông tin không hợp lệ hoặc bị trùng lặp trước khi gửi đăng ký!");
                    e.preventDefault(); // Chặn đứng hành vi submit form lên server
                }
            });
        });
    </script>
</body>
</html>