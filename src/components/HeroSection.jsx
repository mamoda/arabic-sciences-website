import { useState, useEffect, useRef } from "react";
import { Send, Trash2, Sparkles } from "lucide-react";

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = question;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "لا يوجد رد" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "حدث خطأ في الاتصال بالسيرفر" },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4">

      {/* Container */}
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Chat Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">

          {/* Messages */}
          <div
            ref={chatRef}
            className="h-[420px] overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-center text-white/40 mt-20">
                ابدأ بسؤال عن أي موضوع في العلوم العربية أو الشرعية
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] shadow-md ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white/10 text-white/60 animate-pulse">
                  جاري التفكير...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3 flex gap-2 bg-black/20">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <button
              onClick={sendMessage}
              className="bg-indigo-500 hover:bg-indigo-600 transition px-4 rounded-xl flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex justify-between items-center px-4 py-3 text-xs text-white/40">
            <button
              onClick={clearChat}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Trash2 className="w-3 h-3" />
              مسح المحادثة
            </button>

            <span>Powered by RAG + OpenAI</span>
          </div>

        </div>
      </div>
    </section>
  );
}