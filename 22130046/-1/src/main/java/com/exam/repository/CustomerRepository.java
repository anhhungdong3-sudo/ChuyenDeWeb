package com.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.exam.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Thêm 2 hàm này để Spring Data JPA tự động sinh câu lệnh SELECT COUNT
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}