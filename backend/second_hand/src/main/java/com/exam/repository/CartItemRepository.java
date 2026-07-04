package com.exam.repository;

import com.exam.entity.CartItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ci from CartItem ci where ci.cart.id = :cartId and ci.book.id = :bookId")
    Optional<CartItem> findByCartIdAndBookIdForUpdate(@Param("cartId") Long cartId, @Param("bookId") Long bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ci from CartItem ci where ci.id = :id")
    Optional<CartItem> findByIdForUpdate(@Param("id") Long id);
}
