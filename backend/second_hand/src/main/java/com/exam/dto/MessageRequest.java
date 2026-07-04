package com.exam.dto;

import com.exam.entity.SenderType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private Long userId;
    private Long shopId;
    private SenderType senderType;
    private String text;
}