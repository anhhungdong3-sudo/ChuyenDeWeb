package com.exam.controller;

import com.exam.dto.OrderRequest;
import com.exam.entity.Order;
import com.exam.security.JwtTokenProvider;
import com.exam.service.impl.OrderServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderServiceImpl orderService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Long extractUserId(String authHeader) {
        return jwtTokenProvider.getUserIdFromJWT(authHeader.substring(7));
    }

    // Đặt hàng - lưu đơn và kiểm tra phương thức thanh toán
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @Valid @RequestBody OrderRequest dto,
            @RequestHeader("Authorization") String authHeader,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(authHeader);
        Order order = orderService.placeOrder(userId, dto);

        if ("vnpay".equalsIgnoreCase(dto.getPaymentMethod())) {
            // Sinh URL thanh toán VNPAY và trả về client để redirect
            String clientIp = httpRequest.getRemoteAddr();
            String payUrl = orderService.createVnPayUrl(order.getId(), order.getTotalAmount(), clientIp);
            return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "paymentMethod", "vnpay",
                "payUrl", payUrl
            ));
        }

        return ResponseEntity.ok(Map.of(
            "orderId", order.getId(),
            "paymentMethod", "cod",
            "message", "Đặt hàng COD thành công! Shipper sẽ liên hệ bạn sớm."
        ));
    }

    // Xử lý kết quả trả về từ VNPAY sau thanh toán
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> allParams) {
        Map<String, Object> result = orderService.handleVnPayReturn(new java.util.HashMap<>(allParams));
        return ResponseEntity.ok(result);
    }

    // Lấy lịch sử đơn hàng của user đang đăng nhập
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(extractUserId(authHeader)));
    }
}
