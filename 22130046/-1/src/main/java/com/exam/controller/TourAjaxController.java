package com.exam.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.service.TourService;

@RestController
@RequestMapping("/api/ajax")
public class TourAjaxController {

	@Autowired
	private TourService tourService; // Tiêm service vào để gọi check DB

	@PostMapping("/validate-field")
	public Map<String, Object> validateField(
			@RequestParam("fieldName") String fieldName,
			@RequestParam("fieldValue") String fieldValue) {
		
		Map<String, Object> response = new HashMap<>();
		boolean isValid = true;
		String message = "";

		// Kiểm tra dữ liệu dựa trên tên trường gửi lên
		switch (fieldName) {
			case "customer.name":
				if (fieldValue == null || fieldValue.trim().isEmpty()) {
					isValid = false;
					message = "Họ tên không được để trống!";
				} else if (fieldValue.trim().length() < 5) {
					isValid = false;
					message = "Họ tên phải có ít nhất 5 ký tự!";
				}
				break;

			case "customer.email":
				String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
				if (fieldValue == null || fieldValue.trim().isEmpty()) {
					isValid = false;
					message = "Email không được để trống!";
				} else if (!fieldValue.matches(emailRegex)) {
					isValid = false;
					message = "Định dạng Email không hợp lệ (Ví dụ: abc@gmail.com)!";
				} else {
					// KIỂM TRA TRÙNG EMAIL DƯỚI DATABASE
					if (tourService.checkEmailExists(fieldValue.trim())) {
						isValid = false;
						message = "Email này đã được sử dụng, vui lòng chọn email khác!";
					}
				}
				break;

			case "customer.phone":
				if (fieldValue == null || fieldValue.trim().isEmpty()) {
					isValid = false;
					message = "Số điện thoại không được để trống!";
				} else {
					// Regex chuẩn: Phải bắt đầu bằng số 0, theo sau là đúng 9 chữ số (Tổng cộng 10 số)
					String phoneRegex = "^0[0-9]{9}$";
					if (!fieldValue.matches(phoneRegex)) {
						isValid = false;
						message = "Số điện thoại không hợp lệ! Phải bắt đầu bằng số 0 và có đúng 10 chữ số.";
					} else {
						// KIỂM TRA TRÙNG SỐ ĐIỆN THOẠI DƯỚI DATABASE
						if (tourService.checkPhoneExists(fieldValue.trim())) {
							isValid = false;
							message = "Số điện thoại này đã được đăng ký, vui lòng nhập số khác!";
						}
					}
				}
				break;

			case "departureDate":
				if (fieldValue == null || fieldValue.trim().isEmpty()) {
					isValid = false;
					message = "Vui lòng chọn ngày khởi hành!";
				} else {
					// Kiểm tra nếu ngày chọn nhỏ hơn ngày hiện tại
					java.time.LocalDate chosenDate = java.time.LocalDate.parse(fieldValue);
					java.time.LocalDate today = java.time.LocalDate.now();
					if (chosenDate.isBefore(today)) {
						isValid = false;
						message = "Ngày khởi hành không được nhỏ hơn ngày hiện tại!";
					}
				}
				break;

			default:
				break;
		}

		response.put("valid", isValid);
		response.put("message", message);
		return response;
	}
}