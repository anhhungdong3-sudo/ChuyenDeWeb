package com.exam.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Người mua hàng

    @Column(name = "shop_id", nullable = false)
    private Long shopId; // Người đăng bán (chủ shop)

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}