package com.exam.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.exam.dto.RegisterRequest;
import com.exam.entity.User;
import com.exam.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSenderImpl mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Bộ nhớ tạm lưu mã OTP và thông tin đăng ký theo Email (Thực tế nên dùng Redis)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, RegisterRequest> pendingUsers = new ConcurrentHashMap<>();

    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // Bước 1: Tạo mã và gửi Mail
    public void createPendingRegistration(RegisterRequest request) {
        // Tạo mã OTP gồm 6 số ngẫu nhiên
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        // Lưu vào bộ nhớ tạm thời
        otpStorage.put(request.getEmail(), otp);
        pendingUsers.put(request.getEmail(), request);

        // Tiến hành gửi Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getEmail());
        message.setSubject("Mã xác thực đăng ký tài khoản ReWear");
        message.setText("Chào bạn, mã OTP kích hoạt tài khoản của bạn là: " + otp + " (Có hiệu lực trong 5 phút).");
        mailSender.send(message);
    }

    // Bước 2: Xác thực mã OTP và lưu vào database chính thức
    public boolean verifyAndSaveAccount(String email, String otpCode) {
        String savedOtp = otpStorage.get(email);
        
        if (savedOtp != null && savedOtp.equals(otpCode)) {
            RegisterRequest request = pendingUsers.get(email);
            if (request != null) {
                // Chuyển dữ liệu từ DTO sang Entity để lưu trữ
                User user = new User();
                user.setUsername(request.getUsername());
                // Mã hóa mật khẩu trước khi lưu vào database
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPhone(request.getPhone());
                user.setDob(request.getDob());
                user.setGender(request.getGender());
                user.setAddress(request.getAddress());

                userRepository.save(user);

                // Xóa dữ liệu tạm sau khi kích hoạt thành công
                otpStorage.remove(email);
                pendingUsers.remove(email);
                return true;
            }
        }
        return false;
    }

    // Nghiệp vụ đăng nhập
    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại!"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }
        return user;
    }
}