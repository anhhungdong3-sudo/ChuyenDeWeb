package com.exam.controller;

import com.exam.dto.LoginRequest;
import com.exam.dto.RegisterRequest;
import com.exam.entity.User;
import com.exam.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserAuthController {

    @Autowired
    private AuthService authService;

    // ==================== BỔ SUNG KIỂM TRA BẤT ĐỒNG BỘ (ASYNC VALIDATION) ====================

    /**
     * Endpoint kiểm tra xem tên đăng nhập đã được ai sử dụng chưa
     * URL gọi: GET http://localhost:8080/api/auth/check-username?username=...
     */
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = authService.checkUsernameExists(username.trim());
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * Endpoint kiểm tra xem email đã được đăng ký tài khoản nào chưa
     * URL gọi: GET http://localhost:8080/api/auth/check-email?email=...
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email.trim());
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // =========================================================================================

    // Bước 1: Gửi thông tin đăng ký - sinh OTP và gửi email
    @PostMapping("/register-pending")
    public ResponseEntity<?> registerPending(@Valid @RequestBody RegisterRequest request) {
        if (authService.checkUsernameExists(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại!"));
        }
        if (authService.checkEmailExists(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã được sử dụng!"));
        }
        authService.createPendingRegistration(request);
        return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi về email " + request.getEmail() + "!"));
    }

    // Bước 2: Xác nhận OTP để kích hoạt tài khoản
    @PostMapping("/register-confirm")
    public ResponseEntity<?> registerConfirm(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otpCode = body.get("otpCode");
        if (email == null || otpCode == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email và mã OTP không được trống!"));
        }
        boolean success = authService.verifyAndSaveAccount(email, otpCode);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Xác thực thành công! Tài khoản đã được kích hoạt."));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP không chính xác hoặc đã hết hạn!"));
    }

    // Đăng nhập - trả về JWT token và thông tin người dùng
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.loginUser(request.getUsername(), request.getPassword());
        User user = authService.getUserByUsername(request.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        return ResponseEntity.ok(response);
    }
    // Cổng 1: Nhận email và gọi Service phát hành OTP khôi phục mật khẩu
    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestForgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập email của bạn!"));
        }
        try {
            authService.requestForgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Mã xác thực OTP đã được gửi về hòm thư điện tử của bạn!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Cổng 2: Nhận mã và gọi Service tiến hành cập nhật mật mã mới
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otpCode = body.get("otpCode");
        String newPassword = body.get("newPassword");

        if (email == null || otpCode == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Các trường thông tin không được để trống!"));
        }
        try {
            authService.resetPassword(email, otpCode, newPassword);
            return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}