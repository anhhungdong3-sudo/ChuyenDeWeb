package com.exam.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.entity.Product;
import com.exam.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 1. Lấy danh sách sản phẩm còn hàng (AVAILABLE) và sắp xếp theo thời gian tạo mới nhất
    // Hàm này phục vụ cho ProductController (Trang danh sách)
    public List<Product> getAvailableProducts() {
        return productRepository.findByStatusOrderByCreatedAtDesc("AVAILABLE");
    }

    // 2. Lấy chi tiết sản phẩm dựa vào ID bằng Lambda viết ngắn gọn, tối ưu
    // Hàm này phục vụ cho ProductDetailController (Trang chi tiết)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    // 3. Lưu sản phẩm mới đăng bán vào Database
    // Hàm này phục vụ cho tính năng Đăng tin bán đồ cũ
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}