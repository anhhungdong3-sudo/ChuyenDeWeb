package com.exam.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String author;
    
    private String publisher;
    
    @Column(name = "publish_year")
    private Integer publishYear;
    
    private Integer pages;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer quantity = 1;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String status = "PENDING_APPROVAL"; // PENDING_APPROVAL, APPROVED, REJECTED, SOLD

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition", nullable = false)
    private BookCondition bookCondition; // NEW, LIKE_NEW, GOOD, FAIR, POOR

    @Column(name = "shop_id", nullable = false)
    private Long shopId; // UserID của người đăng bán sách cũ

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
