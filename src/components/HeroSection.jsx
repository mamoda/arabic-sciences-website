import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!question) return;

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      
      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 arabic-pattern opacity-10"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            اسأل في العلوم العربية والشرعية
          </h1>

          {/* Chat Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">

<div className="h-64 overflow-y-auto mb-4 space-y-2">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`p-2 rounded-lg max-w-[80%] ${
        msg.role === "user"
          ? "bg-white text-black ml-auto"
          : "bg-green-600 text-white mr-auto"
      }`}
    >
      {msg.text}
    </div>
  ))}
</div>
            {/* Input */}
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="اكتب سؤالك..."
                className="flex-1 p-3 rounded-lg outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-white text-primary px-6 rounded-lg"
              >
                إرسال
              </button>
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