package com.exam.service.impl;

import com.exam.dto.RegisterRequest;
import com.exam.entity.OtpVerification;
import com.exam.entity.User;
import com.exam.repository.OtpVerificationRepository;
import com.exam.repository.UserRepository;
import com.exam.security.JwtTokenProvider;
import com.exam.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void createPendingRegistration(RegisterRequest request) {
        try {
            // Xóa OTP cũ nếu email đã đăng ký trước
            otpVerificationRepository.deleteByEmail(request.getEmail());

            // Sinh mã OTP 6 chữ số ngẫu nhiên
            String otp = String.format("%06d", new Random().nextInt(1_000_000));
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

            // Chuyển đổi RegisterRequest sang chuỗi JSON để lưu tạm vào DB
            String registrationJson = objectMapper.writeValueAsString(request);

            OtpVerification otpRecord = new OtpVerification();
            otpRecord.setEmail(request.getEmail());
            otpRecord.setOtpCode(otp);
            otpRecord.setRegistrationData(registrationJson);
            otpRecord.setExpiryTime(expiryTime);
            otpVerificationRepository.save(otpRecord);

            // Gửi email xác thực
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getEmail());
            message.setSubject("[OldBookstore] Mã xác thực đăng ký tài khoản");
            message.setText("Xin chào " + request.getFullName() + ",\n\n" +
                    "Mã OTP kích hoạt tài khoản của bạn là: " + otp +
                    "\n\nMã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với ai.");
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống khi gửi email xác thực. Vui lòng thử lại sau!");
        }
    }

    @Override
    @Transactional
    public boolean verifyAndSaveAccount(String email, String otpCode) {
        OtpVerification otpRecord = otpVerificationRepository
                .findByEmailAndOtpCode(email, otpCode)
                .orElse(null);

        if (otpRecord == null)
            return false;

        // Kiểm tra OTP còn hạn
        if (otpRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpVerificationRepository.delete(otpRecord);
            throw new RuntimeException("Mã OTP đã hết hạn! Vui lòng đăng ký lại.");
        }

        try {
            // Chuyển JSON lưu tạm sang RegisterRequest để tạo User
            RegisterRequest request = objectMapper.readValue(otpRecord.getRegistrationData(), RegisterRequest.class);

            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setDob(request.getDob());
            user.setGender(request.getGender());
            user.setAddress(request.getAddress());
            user.setRole("USER");
            userRepository.save(user);

            // Xóa OTP đã dùng
            otpVerificationRepository.delete(otpRecord);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống khi kích hoạt tài khoản!");
        }
    }

    @Override
    public String loginUser(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại!"));

        // Kiểm tra tài khoản có bị khóa không
        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        return jwtTokenProvider.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getId());
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
    }
    @Override
@Transactional
public void requestForgotPassword(String email) {
    // 1. Kiểm tra xem Email có tồn tại trong hệ thống hay không
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Địa chỉ email này không tồn tại trên hệ thống!"));

    // 2. Dọn sạch các yêu cầu OTP cũ của email này nếu có
    otpVerificationRepository.deleteByEmail(email);

    // 3. Tạo mã OTP ngẫu nhiên gồm 6 chữ số
    String otp = String.format("%06d", new java.util.Random().nextInt(1_000_000));
    LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5); // Hiệu lực 5 phút

    // 4. Lưu vết OTP vào bảng otp_verifications (Trường registrationData để trống hoặc lưu chữ "FORGOT")
    OtpVerification otpRecord = new OtpVerification();
    otpRecord.setEmail(email);
    otpRecord.setOtpCode(otp);
    otpRecord.setRegistrationData("FORGOT_PASSWORD_REQUEST");
    otpRecord.setExpiryTime(expiryTime);
    otpVerificationRepository.save(otpRecord);

    // 5. Gửi thư chứa mã khôi phục cho người dùng
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("[OldBookstore] Khôi phục mật mã tài khoản");
    message.setText("Xin chào " + user.getFullName() + ",\n\n" +
            "Hệ thống nhận được yêu cầu thay đổi mật mã từ bạn. Mã OTP của bạn là: " + otp +
            "\n\nMã có hiệu lực trong 5 phút. Nếu không phải bạn thực hiện, vui lòng bỏ qua thư này.");
    mailSender.send(message);
}

@Override
@Transactional
public void resetPassword(String email, String otpCode, String newPassword) {
    // 1. Kiểm tra tính hợp lệ của cặp Email và OTP
    OtpVerification otpRecord = otpVerificationRepository
            .findByEmailAndOtpCode(email, otpCode)
            .orElseThrow(() -> new RuntimeException("Mã xác thực OTP không chính xác!"));

    // 2. Kiểm tra thời hạn OTP
    if (otpRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
        otpVerificationRepository.delete(otpRecord);
        throw new RuntimeException("Mã OTP đã hết hạn! Vui lòng gửi lại yêu cầu.");
    }

    // 3. Tìm tài khoản và mã hóa mật khẩu mới để cập nhật vào cơ sở dữ liệu
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Hệ thống không tìm thấy tài khoản tương ứng."));
            
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    // 4. Giải phóng bản ghi OTP đã sử dụng xong
    otpVerificationRepository.delete(otpRecord);
}
}
