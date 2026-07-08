package com.exam.controller;

import com.exam.entity.Cart;
import com.exam.security.JwtTokenProvider;
import com.exam.service.impl.CartServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartServiceImpl cartService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token xác thực bị thiếu hoặc không hợp lệ!");
        }
        return jwtTokenProvider.getUserIdFromJWT(authHeader.substring(7));
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(cartService.getCart(extractUserId(authHeader)));
    }

    @PostMapping("/add/{bookId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long bookId,
            @RequestHeader("Authorization") String authHeader) {
        Cart cart = cartService.addToCart(extractUserId(authHeader), bookId);
        return ResponseEntity.ok(Map.of("message", "Đã thêm sách vào giỏ hàng!", "cart", cart));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> body,
            @RequestHeader("Authorization") String authHeader) {
        int newQuantity = body.getOrDefault("quantity", 1);
        Cart cart = cartService.updateQuantity(extractUserId(authHeader), cartItemId, newQuantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String authHeader) {
        Cart cart = cartService.removeFromCart(extractUserId(authHeader), cartItemId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa sách khỏi giỏ hàng!", "cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        Cart cart = cartService.clearCart(extractUserId(authHeader));
        return ResponseEntity.ok(Map.of("message", "Đã xóa sạch toàn bộ giỏ hàng!", "cart", cart));
    }

    // FIX BUG: Trước đây khai báo @DeleteMapping trong khi frontend (api.js) gọi
    // bằng axiosClient.post("/cart/remove-multiple", ...) => luôn trả về lỗi 405
    // Method Not Allowed. Sửa lại thành @PostMapping để khớp phương thức HTTP thực tế
    // mà client đang sử dụng, giúp tính năng "Xóa mục đã chọn" hoạt động đúng.
    @PostMapping("/remove-multiple")
    public ResponseEntity<?> removeMultipleFromCart(
            @RequestBody Map<String, java.util.List<Long>> body,
            @RequestHeader("Authorization") String authHeader) {
        java.util.List<Long> ids = body.get("cartItemIds");
        Cart cart = cartService.removeMultipleFromCart(extractUserId(authHeader), ids);
        return ResponseEntity.ok(Map.of("message", "Đã xóa các mục lựa chọn khỏi giỏ hàng!", "cart", cart));
    }
}