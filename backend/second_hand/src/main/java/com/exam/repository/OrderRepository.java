package com.exam.repository;

import com.exam.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("""
            select distinct o from Order o
            left join fetch o.items i
            left join fetch i.book b
            left join fetch b.category
            where o.orderStatus = :orderStatus
            and o.deliveredAt is not null
            """)
    List<Order> findCompletedOrdersForRevenueStats(@Param("orderStatus") String orderStatus);
}
