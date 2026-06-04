package com.exam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
	List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}