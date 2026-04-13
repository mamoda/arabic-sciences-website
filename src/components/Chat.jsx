import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!question) return;

    // ضيف سؤال المستخدم
    setMessages((prev) => [...prev, { role: "user", text: question }]);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      // ضيف رد AI
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer }
      ]);

    } catch (error) {
      console.error(error);
    }

    setQuestion("");
  };

  return (
    <div>
      <h2>AI Assistant</h2>

      {/* عرض الرسائل */}
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.role === "user" ? "أنت" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>

      {/* input */}
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="اكتب سؤالك..."
      />

      <button onClick={sendMessage}>
        إرسال
      </button>
    </div>
  );
}