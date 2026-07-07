package com.exam.controller;

import com.exam.entity.User;
import com.exam.security.JwtTokenProvider;
import com.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Long extractUserId(String authHeader) {
        return jwtTokenProvider.getUserIdFromJWT(authHeader.substring(7));
    }

    // === ADMIN ENDPOINTS ===

    // Lấy danh sách tất cả người dùng (Chỉ ADMIN)
    @GetMapping("/admin")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Cập nhật vai trò người dùng (Chỉ ADMIN)
    @PutMapping("/admin/{id}/role")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        User updatedUser = userService.updateUserRole(id, body.get("role"), extractUserId(authHeader));
        return ResponseEntity.ok(Map.of("message", "Cập nhật vai trò thành công!", "user", updatedUser));
    }

    // Khóa / Mở khóa tài khoản người dùng (Chỉ ADMIN)
    @PutMapping("/admin/{id}/status")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @RequestHeader("Authorization") String authHeader) {
        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));
        User updatedUser = userService.updateUserStatus(id, enabled, extractUserId(authHeader));
        String message = enabled ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản!";
        return ResponseEntity.ok(Map.of("message", message, "user", updatedUser));
    }

    // Xóa người dùng (Chỉ ADMIN)
    @DeleteMapping("/admin/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        userService.deleteUser(id, extractUserId(authHeader));
        return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công!"));
    }
}
