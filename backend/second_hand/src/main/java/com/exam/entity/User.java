package com.exam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private LocalDate dob;
    private String gender;
    private String address;

    @Column(nullable = false)
    private String role = "USER"; // Mặc định là USER, có thể cấu hình ADMIN

    @Column(columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean enabled = true; // false = tài khoản bị khóa
}