package com.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.exam.model.Booking;
import com.exam.model.Customer;
import com.exam.model.Tour;
import com.exam.service.TourService;

@Controller
public class TourController {

	@Autowired
	private TourService tourService;

	// Câu 1: Trang liệt kê danh sách các tour
	@RequestMapping(value = { "/", "/listTours" }, method = RequestMethod.GET)
	public String listTours(Model model) {
		model.addAttribute("tours", tourService.getAllTours());
		return "listTours";
	}

	// Câu 2: Trang chi tiết tour
	@RequestMapping(value = "/tourDetails", method = RequestMethod.GET)
	public String tourDetails(@RequestParam("id") Long id, Model model) {
		Tour tour = tourService.getTour(id);
		model.addAttribute("tour", tour);
		return "tourDetails";
	}

	// Câu 3: Giao diện form đặt tour (GET)
	@RequestMapping(value = "/bookTour", method = RequestMethod.GET)
	public String bookTourForm(@RequestParam("id") Long id, Model model) {
		Tour tour = tourService.getTour(id);

		Booking booking = new Booking();
		booking.setTour(tour); // Gán thông tin tour hiện tại vào booking
		booking.setCustomer(new Customer()); // Khởi tạo sẵn customer lồng bên trong

		model.addAttribute("tour", tour);
		model.addAttribute("booking", booking);
		return "bookTour";
	}

	// Câu 3: Xử lý lưu dữ liệu gửi lên form và chuyển hướng sang xác nhận (POST)
	@RequestMapping(value = "/saveBooking", method = RequestMethod.POST)
	public String saveBooking(@ModelAttribute("booking") Booking booking, Model model) {
		// 1. Lấy thông tin tour đầy đủ từ id để có dữ liệu hiển thị lại nếu dính lỗi trùng lặp
		Tour fullTour = tourService.getTour(booking.getTour().getId());
		booking.setTour(fullTour);

		// 2. KIỂM TRA TRÙNG LẶP BACKEND (Bảo mật lớp hai)
		String inputEmail = booking.getCustomer().getEmail().trim();
		String inputPhone = booking.getCustomer().getPhone().trim();
		boolean hasError = false;

		if (tourService.checkEmailExists(inputEmail)) {
			model.addAttribute("errorEmail", "Email này đã tồn tại trên hệ thống!");
			hasError = true;
		}

		if (tourService.checkPhoneExists(inputPhone)) {
			model.addAttribute("errorPhone", "Số điện thoại này đã được đăng ký!");
			hasError = true;
		}

		// Nếu dính lỗi trùng, giữ người dùng ở lại trang đặt tour và hiển thị thông báo lỗi
		if (hasError) {
			model.addAttribute("tour", fullTour);
			model.addAttribute("booking", booking);
			return "bookTour"; 
		}

		// 3. NẾU KHÔNG TRÙNG DỮ LIỆU -> TIẾN HÀNH LƯU VÀO DATABASE
		tourService.saveCustomer(booking.getCustomer());
		tourService.saveBooking(booking);

		// Đẩy đối tượng booking đã điền đầy đủ ra trang confirm.jsp
		model.addAttribute("booking", booking);
		return "confirm";
	}
}