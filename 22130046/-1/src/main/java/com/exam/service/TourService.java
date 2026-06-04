package com.exam.service;

import java.util.Collection;

import com.exam.model.Booking;
import com.exam.model.Customer;
import com.exam.model.Tour;

public interface TourService {
	Collection<Tour> getAllTours();

	Tour getTour(Long id);

	void saveCustomer(Customer customer);

	void saveBooking(Booking booking);
	boolean checkEmailExists(String email);
	boolean checkPhoneExists(String phone);
}