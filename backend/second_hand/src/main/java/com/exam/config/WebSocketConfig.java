package com.exam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Cấu hình broker để gửi tin nhắn đến các client đăng ký các prefix /topic và /queue
        config.enableSimpleBroker("/topic", "/queue");
        // Prefix dành cho các request từ client gửi lên các hàm xử lý trong MessageMapping
        config.setApplicationDestinationPrefixes("/app");
        // Prefix dành cho tin nhắn gửi đích danh cho một user cụ thể (/user/queue/...)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint kết nối WebSocket từ phía client (ReactJS)
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000") // Cấu hình CORS cho React port 3000
                .withSockJS(); // Cho phép kết nối qua SockJS dự phòng nếu trình duyệt không hỗ trợ WS trực tiếp
    }
}
