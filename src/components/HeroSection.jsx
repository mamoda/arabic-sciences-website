import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  // تحميل المحادثة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // حفظ المحادثة
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // scroll تلقائي
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userMessage })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
          sources: data.sources || []
        }
      ]);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 arabic-pattern opacity-10"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            اسأل الذكاء الاصطناعي
          </h1>

          <p className="text-white/80 mb-6">
            مساعد متخصص في العلوم العربية والشرعية مع إجابات موثوقة ومصادر
          </p>

          {/* Chat Box */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">

            {/* Messages */}
            <div
              ref={chatRef}
              className="h-80 overflow-y-auto mb-4 space-y-3 text-sm sm:text-base"
            >
              {messages.length === 0 && (
                <div className="text-white/60 text-center">
                  اكتب سؤالك وسيقوم الذكاء الاصطناعي بالإجابة
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-xl max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-white text-black"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* المصادر */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="text-right text-xs text-white/70 mt-1 px-2">
                      📚 المصادر:
                      {msg.sources.map((src, idx) => (
                        <div key={idx}>- {src}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/20 text-white px-4 py-2 rounded-xl animate-pulse">
                    جاري التفكير...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 p-3 rounded-lg outline-none text-black"
              />

              <button
                onClick={sendMessage}
                className="bg-white text-primary px-6 rounded-lg hover:bg-white/90 transition"
              >
                إرسال
              </button>
            </div>

            {/* أدوات */}
            <div className="flex justify-between items-center text-sm text-white/70">
              <button
                onClick={clearChat}
                className="hover:text-white transition"
              >
                مسح المحادثة
              </button>

              <span>مدعوم بالذكاء الاصطناعي</span>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </div>
    </section>
  );
}