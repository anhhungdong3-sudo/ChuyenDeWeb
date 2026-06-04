package com.exam.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
	Optional<Conversation> findByUserIdAndShopId(Long userId, Long shopId);
}