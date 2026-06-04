package com.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}