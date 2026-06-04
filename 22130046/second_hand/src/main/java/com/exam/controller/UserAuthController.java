package com.exam.controller;

import com.exam.dto.RegisterRequest;
import com.exam.entity.User;
import com.exam.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserAuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register-pending")
    public ResponseEntity<?> registerPending(@RequestBody RegisterRequest request) {
        if (authService.checkUsernameExists(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tên đăng nhập đã tồn tại!");
        }
        if (authService.checkEmailExists(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email này đã được sử dụng!");
        }

        try {
            authService.createPendingRegistration(request);
            return ResponseEntity.ok(Map.of("message", "Mã OTP xác thực đã được gửi về Gmail của bạn!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi gửi mail xác thực! Hãy kiểm tra cấu hình SMTP.");
        }
    }

    @PostMapping("/register-confirm")
    public ResponseEntity<?> registerConfirm(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otpCode");

        try {
            boolean isSuccess = authService.verifyAndSaveAccount(email, otpCode);
            if (isSuccess) {
                return ResponseEntity.ok(Map.of("message", "Xác thực thành công! Tài khoản đã được kích hoạt."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã OTP không chính xác hoặc đã hết hạn!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xử lý kích hoạt tài khoản!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            User user = authService.loginUser(username, password);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());
            response.put("message", "Đăng nhập hệ thống thành công!");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}