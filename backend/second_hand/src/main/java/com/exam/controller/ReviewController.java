package com.exam.controller;

import com.exam.dto.ReviewRequest;
import com.exam.entity.Review;
import com.exam.security.JwtTokenProvider;
import com.exam.service.impl.ReviewServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewServiceImpl reviewService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Kiểm tra user đã mua sách này và đơn hàng COMPLETED+PAID chưa (Công khai)
    @GetMapping("/check-purchase")
    public ResponseEntity<Map<String, Boolean>> checkPurchase(
            @RequestParam Long userId,
            @RequestParam Long bookId) {
        boolean purchased = reviewService.checkUserPurchased(userId, bookId);
        return ResponseEntity.ok(Map.of("purchased", purchased));
    }

    // Lấy danh sách đánh giá của một cuốn sách (Công khai)
    @GetMapping("/{bookId}")
    public ResponseEntity<List<Review>> getReviewsByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getReviewsByBookId(bookId));
    }

    // Thêm đánh giá mới (Cần đăng nhập và đã mua sách)
    @PostMapping
    public ResponseEntity<?> addReview(
            @Valid @RequestBody ReviewRequest dto,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtTokenProvider.getUserIdFromJWT(token);
        Review review = reviewService.addReview(userId, dto);
        return ResponseEntity.ok(review);
    }
}
