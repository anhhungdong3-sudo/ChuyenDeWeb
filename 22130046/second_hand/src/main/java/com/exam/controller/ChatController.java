package com.exam.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.MessageRequest;
import com.exam.entity.Conversation;
import com.exam.entity.Message;
import com.exam.entity.SenderType;
import com.exam.repository.ConversationRepository;
import com.exam.repository.MessageRepository;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Chỉ định đích danh port React chạy
public class ChatController {

	@Autowired
	private ConversationRepository conversationRepository;

	@Autowired
	private MessageRepository messageRepository;

	// 1. Lấy lịch sử chat dựa vào cặp userId và shopId
	@GetMapping("/history")
	public List<Message> getChatHistory(@RequestParam Long userId, @RequestParam Long shopId) {
		return conversationRepository.findByUserIdAndShopId(userId, shopId)
				.map(conversation -> messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId()))
				.orElse(new ArrayList<>()); // Trả về mảng rỗng nếu chưa từng chat (chưa có phòng)
	}

	// 2. Lưu tin nhắn mới và sinh câu trả lời tự động của BOT
	@PostMapping("/send")
	public Message sendMessage(@RequestBody MessageRequest requestDto) {
		// Kiểm tra xem đã có phòng chat chưa, nếu chưa có thì tạo mới
		Conversation conversation = conversationRepository
				.findByUserIdAndShopId(requestDto.getUserId(), requestDto.getShopId()).orElseGet(() -> {
					Conversation newConv = new Conversation();
					newConv.setUserId(requestDto.getUserId());
					newConv.setShopId(requestDto.getShopId());
					return conversationRepository.save(newConv);
				});

		// Lưu tin nhắn hiện tại của User gửi lên
		Message userMessage = new Message();
		userMessage.setConversationId(conversation.getId());
		userMessage.setSenderType(requestDto.getSenderType());
		userMessage.setText(requestDto.getText());
		Message savedMessage = messageRepository.save(userMessage);

		// Nếu người gửi là USER, kích hoạt trả lời tự động của BOT sau đó
		if (requestDto.getSenderType() == SenderType.USER) {
			Message botMessage = new Message();
			botMessage.setConversationId(conversation.getId());
			botMessage.setSenderType(SenderType.BOT);
			botMessage.setText("Cảm ơn bạn, chủ shop sẽ phản hồi sớm!");
			messageRepository.save(botMessage);
		}

		return savedMessage;
	}
}