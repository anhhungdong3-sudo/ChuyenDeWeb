package com.exam.service;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.exam.model.Booking;
import com.exam.model.Customer;
import com.exam.model.Tour;
import com.exam.repository.BookingRepository;
import com.exam.repository.CustomerRepository;
import com.exam.repository.TourRepository;

@Service
public class TourServiceImpl implements TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Collection<Tour> getAllTours() {
        // Lấy toàn bộ danh sách tour từ database
        return tourRepository.findAll();
    }

    @Override
    public Tour getTour(Long id) {
        // Tìm tour theo ID, nếu không thấy trả về null
        return tourRepository.findById(id).orElse(null);
    }

    @Override
    public void saveCustomer(Customer customer) {
        // Lưu thông tin khách hàng xuống bảng customers
        customerRepository.save(customer);
    }

    @Override
    public void saveBooking(Booking booking) {
        // Lưu thông tin lượt đặt tour xuống bảng bookings
        bookingRepository.save(booking);
    }
    @Override
    public boolean checkEmailExists(String email) {
        return customerRepository.existsByEmail(email);
    }

    @Override
    public boolean checkPhoneExists(String phone) {
        return customerRepository.existsByPhone(phone);
    }
}