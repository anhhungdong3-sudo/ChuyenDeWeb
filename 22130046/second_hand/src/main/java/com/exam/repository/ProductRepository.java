package com.exam.repository;

import com.exam.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Tìm tất cả sản phẩm đang hiển thị (còn hàng) sắp xếp theo mới nhất
    List<Product> findByStatusOrderByCreatedAtDesc(String status);
    
    // Tìm sản phẩm theo danh mục
    List<Product> findByCategoryAndStatus(String category, String status);
}