import React, { useEffect, useRef, useState } from "react";
import { chatService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ shopId = 1 }) => {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [socketStatus, setSocketStatus] = useState("offline");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open || !isAuthenticated || !user?.id) return undefined;

    chatService
      .getHistory(user.id, shopId)
      .then((history) => setMessages(history))
      .catch(() => setMessages([]));

    const wsUrl = (process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws").replace(/^http/, "ws");
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      socket.onopen = () => setSocketStatus("online");
      socket.onmessage = (event) => {
        try {
          const incoming = JSON.parse(event.data);
          setMessages((current) => [...current, incoming]);
        } catch {
          setSocketStatus("rest");
        }
      };
      socket.onerror = () => setSocketStatus("rest");
      socket.onclose = () => setSocketStatus("rest");
    } catch {
      setSocketStatus("rest");
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [open, isAuthenticated, user?.id, shopId]);

  const handleSend = async (event) => {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || !isAuthenticated || !user?.id) return;

    const optimisticMessage = {
      id: `tmp-${Date.now()}`,
      senderType: "USER",
      text: cleanText,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticMessage]);
    setText("");
    setSending(true);

    try {
      const saved = await chatService.sendMessage(user.id, shopId, "USER", cleanText);
      setMessages((current) =>
        current.map((message) => (message.id === optimisticMessage.id ? saved : message)),
      );
    } catch {
      setMessages((current) => [
        ...current,
        { id: `err-${Date.now()}`, senderType: "SHOP", text: "Tin nhắn chưa gửi được. Vui lòng thử lại sau." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chatbox">
      <button className="chat-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "×" : "Chat"}
      </button>

      {open && (
        <section className="chat-panel" aria-label="Chat với người bán">
          <header>
            <div>
              <strong>Hỏi người bán</strong>
              <small>{socketStatus === "online" ? "WebSocket online" : "REST fallback"}</small>
            </div>
            <button type="button" onClick={() => setOpen(false)}>Đóng</button>
          </header>

          <div className="chat-messages">
            {!isAuthenticated ? (
              <p className="chat-note">Bạn cần đăng nhập để nhắn tin với người bán.</p>
            ) : messages.length === 0 ? (
              <p className="chat-note">Gửi lời chào hoặc hỏi thêm về tình trạng sách.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id || message.createdAt} className={`chat-message ${message.senderType === "USER" ? "mine" : ""}`}>
                  {message.text}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chat-form" onSubmit={handleSend}>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={isAuthenticated ? "Nhập tin nhắn..." : "Đăng nhập để chat"}
              disabled={!isAuthenticated || sending}
            />
            <button className="btn btn-primary btn-sm" type="submit" disabled={!isAuthenticated || sending}>Gửi</button>
          </form>
        </section>
      )}
    </div>
  );
};

export { ChatBox };
export default ChatBox;
