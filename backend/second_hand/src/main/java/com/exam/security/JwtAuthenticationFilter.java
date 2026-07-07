package com.exam.security;

import com.exam.entity.User;
import com.exam.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Lấy JWT Token từ Header của Request gửi lên
            String jwt = getJwtFromRequest(request);

            // Kiểm tra Token hợp lệ
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);

                // Kiểm tra tài khoản có còn tồn tại và chưa bị khóa hay không.
                // Việc này đảm bảo nếu admin khóa tài khoản, các token đã cấp trước đó
                // (còn hạn) sẽ không thể tiếp tục dùng để truy cập hệ thống.
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent() && !Boolean.FALSE.equals(userOpt.get().getEnabled())) {
                    String role = userOpt.get().getRole();

                    // Gán quyền cho người dùng (Thêm prefix ROLE_ để Spring Security nhận diện quyền)
                    String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(roleWithPrefix));

                    // Tạo đối tượng Authentication lưu trữ trong SecurityContextHolder
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, authorities);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Đăng ký thông tin người dùng vào luồng bảo mật của Spring Security
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                // Nếu tài khoản không tồn tại hoặc đã bị khóa: không set Authentication
                // -> request sẽ bị coi là chưa đăng nhập (401) ở các route yêu cầu xác thực.
            }
        } catch (Exception ex) {
            System.err.println("Không thể thiết lập xác thực người dùng trong Security Context: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // Hàm phân tích cú pháp Header để trích xuất Bearer Token
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
