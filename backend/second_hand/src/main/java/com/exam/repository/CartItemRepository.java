package com.exam.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.exam.entity.CartItem; 
import jakarta.persistence.LockModeType;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.book.id = :bookId")
    Optional<CartItem> findByCartIdAndBookIdForUpdate(@Param("cartId") Long cartId, @Param("bookId") Long bookId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ci FROM CartItem ci WHERE ci.id = :id")
    Optional<CartItem> findByIdForUpdate(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId")
    void deleteByCartId(@Param("cartId") Long cartId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.id IN :itemsIds")
    void deleteByCartIdAndIdsIn(@Param("cartId") Long cartId, @Param("itemsIds") List<Long> itemsIds);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.id IN :ids")
    void deleteByCartItemIdsIn(@Param("ids") List<Long> ids);
}