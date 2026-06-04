package com.exam.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customers") // Khớp với tên bảng `customers` dưới database
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Khớp với AUTO_INCREMENT
	private long id;

	private String name;
	
	private String address;
	
	private String email;
	
	private String phone;

	// Hàm khởi tạo mặc định cho JPA
	public Customer() {
	}

	// Getters and Setters
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
}