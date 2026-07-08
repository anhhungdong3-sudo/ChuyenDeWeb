package com.exam.service;

import com.exam.dto.RegisterRequest;
import com.exam.entity.User;

public interface AuthService {
    boolean checkUsernameExists(String username);
    boolean checkEmailExists(String email);
    void createPendingRegistration(RegisterRequest request);
    boolean verifyAndSaveAccount(String email, String otpCode);
    String loginUser(String username, String password); // Trả về JWT token
    User getUserByUsername(String username);
    void requestForgotPassword(String email);
void resetPassword(String email, String otpCode, String newPassword);
}