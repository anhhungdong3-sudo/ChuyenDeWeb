<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hệ Thống Đặt Tour Du Lịch</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .table-container { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .tour-title { color: #0d6efd; text-decoration: none; transition: 0.2s; }
        .tour-title:hover { color: #0a58ca; text-decoration: underline; }
        .badge-schedule { background-color: #e2e3e5; color: #41464b; font-size: 0.85rem; padding: 6px 12px; }
        .price-text { color: #dc3545; font-weight: 700; font-size: 1.1rem; }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="listTours"><i class="fa-solid fa-compass me-2"></i>VinaTour</a>
        </div>
    </nav>

    <div class="container">
        <div class="table-container">
            <div class="d-flex align-items-center mb-4">
                <div class="bg-primary text-white rounded p-2 me-3">
                    <i class="fa-solid fa-list-check fa-xl"></i>
                </div>
                <h2 class="mb-0 fw-bold text-secondary">Các Chương Trình DU LỊCH</h2>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 45%;">Chương trình</th>
                            <th style="width: 20%;">Lịch Khởi hành</th>
                            <th style="width: 15%;">Giá</th>
                            <th style="width: 20%;" class="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="t" items="${tours}">
                            <tr>
                                <td>
                                    <a href="tourDetails?id=${t.id}" class="tour-title fw-semibold fs-5">
                                        <i class="fa-solid fa-map-location-dot me-2 text-muted"></i>${t.description}
                                    </a>
                                    <div class="text-muted small ps-4 mt-1"><i class="fa-regular fa-clock me-1"></i>${t.days}</div>
                                </td>
                                <td>
                                    <span class="badge badge-schedule rounded-pill"><i class="fa-regular fa-calendar-days me-1"></i>${t.departureSchedule}</span>
                                </td>
                                <td>
                                    <span class="price-text"><fmt:formatNumber value="${t.price}" type="number"/> đ</span>
                                </td>
                                <td class="text-center">
                                    <a class="btn btn-primary btn-sm px-3 rounded-pill shadow-sm" href="bookTour?id=${t.id}">
                                        <i class="fa-solid fa-cart-shopping me-1"></i> Đặt tour
                                    </a>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>