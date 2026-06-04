package com.exam.entity; // Nhớ kiểm tra lại đúng package của bạn nhé

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "conversation_id", nullable = false)
	private Long conversationId;

	@Enumerated(EnumType.STRING)
	@Column(name = "sender_type", nullable = false)
	private SenderType senderType;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String text;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	// --- CONSTRUCTOR KHÔNG THAM SỐ ---
	public Message() {
	}

	// --- TỰ ĐỊNH NGHĨA GETTER VÀ SETTER TRUYỀN THỐNG ---
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getConversationId() {
		return conversationId;
	}

	public void setConversationId(Long conversationId) {
		this.conversationId = conversationId;
	}

	public SenderType getSenderType() {
		return senderType;
	}

	public void setSenderType(SenderType senderType) {
		this.senderType = senderType;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}