package com.exam.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tours") // Khớp với tên bảng `tours` trong file SQL của bạn
public class Tour {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Khớp với kiểu tự động tăng AUTO_INCREMENT
	private long id;

	private String description;
	
	private String days;
	
	private String transportation;

	// Ánh xạ thuộc tính camelCase trong Java với tên cột snake_case dưới Database
	@Column(name = "departure_schedule")
	private String departureSchedule;
	
	private double price;

	// Hàm khởi tạo mặc định bắt buộc phải có cho JPA
	public Tour() {
	}

	// Hàm khởi tạo đầy đủ tham số
	public Tour(long id, String description, String days, String transportation, String departureSchedule,
			double price) {
		this.id = id;
		this.description = description;
		this.days = days;
		this.transportation = transportation;
		this.departureSchedule = departureSchedule;
		this.price = price;
	}

	// Getters and Setters
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDays() {
		return days;
	}

	public void setDays(String days) {
		this.days = days;
	}

	public String getTransportation() {
		return transportation;
	}

	public void setTransportation(String transportation) {
		this.transportation = transportation;
	}

	public String getDepartureSchedule() {
		return departureSchedule;
	}

	public void setDepartureSchedule(String departureSchedule) {
		this.departureSchedule = departureSchedule;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
}