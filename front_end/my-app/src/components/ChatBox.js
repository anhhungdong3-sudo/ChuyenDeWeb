import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatBox.css";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Chào bạn! Bạn cần hỗ trợ gì về sản phẩm này không?",
    },
  ]);

  const endOfMessagesRef = useRef(null);

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Thêm tin nhắn của User
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");

    // Giả lập bot phản hồi sau 1 giây
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Cảm ơn bạn, chủ shop sẽ phản hồi sớm!" },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-wrapper">
      {/* Nút bóng chat nổi - Sử dụng fab cho icon Messenger và fas cho dấu X */}
      <div className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
        <i
          className={isOpen ? "fas fa-times" : "fab fa-facebook-messenger"}
        ></i>
      </div>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Chat với người bán</span>
            <i
              className="fas fa-minus"
              onClick={() => setIsOpen(false)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <div className="chat-body">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {/* Điểm neo để cuộn tự động */}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            {/* Nút gửi kèm icon máy bay giấy */}
            <button onClick={handleSend}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
