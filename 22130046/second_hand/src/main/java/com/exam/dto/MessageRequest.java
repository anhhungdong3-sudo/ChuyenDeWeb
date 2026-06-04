package com.exam.dto; // Nhớ kiểm tra lại đúng package của bạn nhé

import com.exam.entity.SenderType;

public class MessageRequest {
	private Long userId;
	private Long shopId;
	private SenderType senderType;
	private String text;

	// --- CONSTRUCTOR KHÔNG THAM SỐ ---
	public MessageRequest() {
	}

	// --- CONSTRUCTOR ĐẦY ĐỦ THAM SỐ ---
	public MessageRequest(Long userId, Long shopId, SenderType senderType, String text) {
		this.userId = userId;
		this.shopId = shopId;
		this.senderType = senderType;
		this.text = text;
	}

	// --- TỰ ĐỊNH NGHĨA GETTER VÀ SETTER ---
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getShopId() {
		return shopId;
	}

	public void setShopId(Long shopId) {
		this.shopId = shopId;
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
}