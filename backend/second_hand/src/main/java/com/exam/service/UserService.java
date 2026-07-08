package com.exam.service;

import com.exam.entity.User;
import com.exam.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final List<String> VALID_ROLES = List.of("USER", "ADMIN");

   // ==================== BỔ SUNG KIỂM TRA BẤT ĐỒNG BỘ (FOR ASYNC VALIDATION) ====================

    /**
     * Kiểm tra xem tên đăng nhập đã tồn tại trong hệ thống chưa
     */
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return userRepository.existsByUsername(username.trim());
    }

    /**
     * Kiểm tra xem email đã được sử dụng chưa
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return userRepository.existsByEmail(email.trim());
    }

    // =============================================================================================

    // Logic Đăng ký tài khoản
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // MÃ HÓA MẬT KHẨU trước khi ném vào DB
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER"); // Mặc định tài khoản đăng ký mới là USER

        return userRepository.save(user);
    }

    // Logic Đăng nhập hệ thống
    public User loginUser(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác!"));

        // Kiểm tra đối chiếu mật khẩu thô từ Frontend gửi lên với mật khẩu đã mã hóa trong DB
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác!");
        }

        return user; // Đăng nhập thành công, trả về thông tin User (ẩn mật khẩu đi ở Controller)
    }

    //=== QUẢN LÝ NGƯỜI DÙNG (ADMIN) ===

    // Lấy danh sách tất cả người dùng
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    // Cập nhật vai trò người dùng (USER / ADMIN)
    @Transactional
    public User updateUserRole(Long targetUserId, String newRole, Long requesterId) {
        if (targetUserId.equals(requesterId)) {
            throw new RuntimeException("Bạn không thể tự thay đổi vai trò của chính mình!");
        }
        if (newRole == null || !VALID_ROLES.contains(newRole.toUpperCase())) {
            throw new RuntimeException("Vai trò không hợp lệ!");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        user.setRole(newRole.toUpperCase());
        return userRepository.save(user);
    }

    // Khóa / Mở khóa tài khoản người dùng
    @Transactional
    public User updateUserStatus(Long targetUserId, boolean enabled, Long requesterId) {
        if (targetUserId.equals(requesterId)) {
            throw new RuntimeException("Bạn không thể tự khóa tài khoản của chính mình!");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    // Xóa người dùng
    @Transactional
    public void deleteUser(Long targetUserId, Long requesterId) {
        if (targetUserId.equals(requesterId)) {
            throw new RuntimeException("Bạn không thể tự xóa tài khoản của chính mình!");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        try {
            userRepository.delete(user);
            userRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException(
                    "Không thể xóa người dùng này vì đang có đơn hàng hoặc dữ liệu liên quan trong hệ thống!");
        }
    }
}