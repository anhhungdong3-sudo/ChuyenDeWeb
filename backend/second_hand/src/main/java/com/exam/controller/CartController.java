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
        return jwtTokenProvider.getUserIdFromJWT(authHeader.substring(7));
    }

    // Lấy toàn bộ giỏ hàng (đồng bộ từ DB)
    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(cartService.getCart(extractUserId(authHeader)));
    }

    // Thêm sách vào giỏ hàng
    @PostMapping("/add/{bookId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long bookId,
            @RequestHeader("Authorization") String authHeader) {
        Cart cart = cartService.addToCart(extractUserId(authHeader), bookId);
        return ResponseEntity.ok(Map.of("message", "Đã thêm sách vào giỏ hàng!", "cart", cart));
    }

    // Cập nhật số lượng sách trong giỏ (Asynchronous sync - tránh race condition)
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> body,
            @RequestHeader("Authorization") String authHeader) {
        int newQuantity = body.getOrDefault("quantity", 1);
        Cart cart = cartService.updateQuantity(extractUserId(authHeader), cartItemId, newQuantity);
        return ResponseEntity.ok(cart);
    }

    // Xóa một sách khỏi giỏ hàng
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String authHeader) {
        Cart cart = cartService.removeFromCart(extractUserId(authHeader), cartItemId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa sách khỏi giỏ hàng!", "cart", cart));
    }
}
