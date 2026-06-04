package com.exam.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "bookings") // Khớp với tên bảng `bookings` dưới database
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Khớp với AUTO_INCREMENT
	private long id;

	// Thiết lập mối quan hệ Nhiều lượt đặt - Một Khách hàng
	@ManyToOne
	@JoinColumn(name = "customer_id") // Khớp với cột khóa ngoại customer_id dưới DB
	private Customer customer;

	// Thiết lập mối quan hệ Nhiều lượt đặt - Một Tour
	@ManyToOne
	@JoinColumn(name = "tour_id") // Khớp với cột khóa ngoại tour_id dưới DB
	private Tour tour;

	// Ánh xạ camelCase của Java sang snake_case dưới Database
	@Column(name = "departure_date")
	private String departureDate; 

	@Column(name = "no_adults")
	private int noAdults;

	@Column(name = "no_children")
	private int noChildren;

	// Hàm khởi tạo mặc định cho JPA
	public Booking() {
	}

	// Getters and Setters
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public Tour getTour() {
		return tour;
	}

	public void setTour(Tour tour) {
		this.tour = tour;
	}

	public String getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(String departureDate) {
		this.departureDate = departureDate;
	}

	public int getNoAdults() {
		return noAdults;
	}

	public void setNoAdults(int noAdults) {
		this.noAdults = noAdults;
	}

	public int getNoChildren() {
		return noChildren;
	}

	public void setNoChildren(int noChildren) {
		this.noChildren = noChildren;
	}
}