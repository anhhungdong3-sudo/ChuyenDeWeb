package com.exam.repository;

import com.exam.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookIdOrderByCreatedAtDesc(Long bookId);

    // Kiểm tra user đã đánh giá sách này chưa
    boolean existsByBookIdAndUserId(Long bookId, Long userId);

    // Kiểm tra user đã mua sách này thành công chưa (orderStatus=COMPLETED & paymentStatus=PAID)
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE o.user.id = :userId " +
           "AND oi.book.id = :bookId " +
           "AND o.orderStatus = 'COMPLETED' " +
           "AND o.paymentStatus = 'PAID'")
    boolean hasUserPurchasedBook(@Param("userId") Long userId, @Param("bookId") Long bookId);
}
