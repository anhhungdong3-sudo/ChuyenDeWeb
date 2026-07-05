package com.exam.repository;

import com.exam.entity.Book;
import com.exam.entity.BookCondition;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Lấy danh sách sách đã được phê duyệt, sắp xếp mới nhất
    List<Book> findByStatusOrderByCreatedAtDesc(String status);

    // Lấy sách theo trạng thái và điều kiện (độ mới)
    List<Book> findByStatusAndBookConditionOrderByCreatedAtDesc(String status, BookCondition bookCondition);

    // Tìm kiếm AJAX theo tiêu đề hoặc tên tác giả (không phân biệt hoa thường)
    @Query("SELECT b FROM Book b WHERE b.status = 'APPROVED' AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Book> searchApprovedBooks(@Param("query") String query);

    // Lấy danh sách sách chờ duyệt của Admin
    List<Book> findByStatusOrderByCreatedAtAsc(String status);

    // Lấy sách theo người bán
    List<Book> findByShopIdOrderByCreatedAtDesc(Long shopId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Book b where b.id = :id")
    Optional<Book> findByIdForUpdate(@Param("id") Long id);
}
