package com.exam.service.impl;

import com.exam.dto.ReviewRequest;
import com.exam.entity.Book;
import com.exam.entity.Review;
import com.exam.entity.User;
import com.exam.repository.BookRepository;
import com.exam.repository.ReviewRepository;
import com.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    // Kiểm tra user đã mua và nhận hàng thành công sách này chưa
    public boolean checkUserPurchased(Long userId, Long bookId) {
        return reviewRepository.hasUserPurchasedBook(userId, bookId);
    }

    // Lấy danh sách đánh giá của một cuốn sách
    public List<Review> getReviewsByBookId(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    // Thêm đánh giá mới (chỉ được phép nếu đã mua sách)
    public Review addReview(Long userId, ReviewRequest dto) {
        if (!reviewRepository.hasUserPurchasedBook(userId, dto.getBookId())) {
            throw new RuntimeException("Bạn chưa mua sách này hoặc đơn hàng chưa hoàn thành!");
        }
        if (reviewRepository.existsByBookIdAndUserId(dto.getBookId(), userId)) {
            throw new RuntimeException("Bạn đã đánh giá sách này rồi!");
        }

        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách!"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        Review review = new Review();
        review.setBook(book);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return reviewRepository.save(review);
    }
}
