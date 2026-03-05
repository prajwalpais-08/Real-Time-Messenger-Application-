import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ socket, username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      const payload = { type: "chat", text: input, sender: username };
      socket.send(JSON.stringify(payload));
      // Optionally add local message immediately for better UX
      setMessages((prev) => [...prev, payload]);
      setInput("");
    }
  };

  return (
    <div className="chat-panel">
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
        Live Chat ({username})
      </div>
      
      <div className="messages-list">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender === username ? "self" : "other"}`}>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>{m.sender}</div>
            <div>{m.text}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '10px', display: 'flex', gap: '5px' }}>
        <input 
          style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Message..." 
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
};

export default Chat;