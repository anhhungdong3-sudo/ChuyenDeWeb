package com.exam.controller;

import com.exam.dto.MessageRequest;
import com.exam.entity.Conversation;
import com.exam.entity.Message;
import com.exam.entity.SenderType;
import com.exam.repository.ConversationRepository;
import com.exam.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam Long userId, @RequestParam Long shopId) {
        return conversationRepository.findByUserIdAndShopId(userId, shopId)
                .map(conversation -> messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId()))
                .orElse(new ArrayList<>());
    }

    @PostMapping("/send")
    public Message sendMessageRest(@RequestBody MessageRequest request) {
        return persistAndBroadcast(request);
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest request) {
        persistAndBroadcast(request);
    }

    private Message persistAndBroadcast(MessageRequest request) {
        Conversation conversation = conversationRepository
                .findByUserIdAndShopId(request.getUserId(), request.getShopId())
                .orElseGet(() -> {
                    Conversation newConversation = new Conversation();
                    newConversation.setUserId(request.getUserId());
                    newConversation.setShopId(request.getShopId());
                    return conversationRepository.save(newConversation);
                });

        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setSenderType(request.getSenderType());
        message.setText(request.getText());
        Message savedMessage = messageRepository.save(message);

        String destination = request.getSenderType() == SenderType.USER
                ? "/user/" + request.getShopId() + "/queue/messages"
                : "/user/" + request.getUserId() + "/queue/messages";
        messagingTemplate.convertAndSend(destination, savedMessage);

        return savedMessage;
    }
}
