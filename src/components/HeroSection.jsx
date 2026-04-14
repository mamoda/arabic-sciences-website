import { useState, useEffect, useRef } from "react";
import { Send, Trash2, Sparkles, Copy, Check, AlertCircle, ArrowDown } from "lucide-react";

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState(null);

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch (e) {
        console.error("Error loading messages:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (chatRef.current && (messages.length > 0 || loading)) {
      const shouldAutoScroll = chatRef.current.scrollHeight - chatRef.current.scrollTop - chatRef.current.clientHeight < 100;
      if (shouldAutoScroll) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatRef.current) {
        const isNearBottom = chatRef.current.scrollHeight - chatRef.current.scrollTop - chatRef.current.clientHeight < 100;
        setShowScrollButton(!isNearBottom && messages.length > 0);
      }
    };

    const chatElement = chatRef.current;
    if (chatElement) {
      chatElement.addEventListener("scroll", handleScroll);
      return () => chatElement.removeEventListener("scroll", handleScroll);
    }
  }, [messages]);

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const sendMessage = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    if (loading) return;

    const userMessage = trimmedQuestion;

    setMessages((prev) => [...prev, { role: "user", text: userMessage, timestamp: Date.now() }]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch("https://arabic-sciences-website-1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { 
          role: "ai", 
          text: data.answer || "لا يوجد رد", 
          timestamp: Date.now(),
          sources: data.sources || null 
        },
      ]);
    } catch (err) {
      let errorMessage = "حدث خطأ في الاتصال بالسيرفر";
      if (err.name === "AbortError") {
        errorMessage = "الطلب استغرق وقتاً طويلاً. يرجى المحاولة مرة أخرى.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.";
      }
      
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
      
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: errorMessage, isError: true, timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (messages.length > 0 && window.confirm("هل أنت متأكد من مسح جميع الرسائل؟")) {
      setMessages([]);
      localStorage.removeItem("chat_messages");
      setError(null);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-8">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-4xl z-10 animate-fade-in">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
            <img src="/images/logo.png" alt="Logo" className="h-36 w-36 items-center" />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10">
          
          <div className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-white/60">متصل</span>
            </div>
            <div className="text-xs text-white/40">
              {messages.length} رسالة{messages.length !== 2 ? '' : 'ن'}
            </div>
          </div>

          <div
            ref={chatRef}
            className="h-[500px] overflow-y-auto p-4 space-y-4 scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-white/60 font-medium mb-2">مرحباً بك!</h3>
                <p className="text-white/40 text-sm max-w-md">
                  يمكنك سؤالي عن أي موضوع في العلوم العربية أو الشرعية، وسأجيبك بدقة مع المصادر إن وجدت.
                </p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {["ما هي العلوم العربية؟", "شرح حديث نبوي", "قواعد اللغة العربية"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuestion(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/60 transition-all duration-200 hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg transition-all duration-200 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-br-sm"
                        : msg.isError 
                          ? "bg-red-500/20 text-red-200 border border-red-500/30 rounded-bl-sm"
                          : "bg-white/10 text-white rounded-bl-sm border border-white/10 hover:bg-white/15"
                    }`}
                  >
                    {msg.text}
                    {msg.sources && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/40">
                        📚 المصادر: {msg.sources}
                      </div>
                    )}
                  </div>
                  <div className={`flex gap-2 mt-1 text-[10px] text-white/30 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.role === "ai" && !msg.isError && (
                      <button
                        onClick={() => copyToClipboard(msg.text, i)}
                        className="hover:text-white transition-colors"
                        title="نسخ النص"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-slide-in">
                <div className="max-w-[85%]">
                  <div className="px-5 py-3 rounded-2xl bg-white/10 rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                      <span className="text-sm text-white/60 mr-2">يجري التفكير</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-24 right-8 bg-indigo-500 hover:bg-indigo-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 animate-bounce-in"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}

          {error && (
            <div className="mx-4 mb-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm flex items-center gap-2 animate-slide-in">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="border-t border-white/10 p-4 bg-black/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب سؤالك هنا..."
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/30 pointer-events-none">
                  {question.length > 0 && <span>{question.length}</span>}
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={loading || !question.trim()}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-500/50 disabled:to-indigo-600/50 transition-all duration-200 px-5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-2 text-[10px] text-white/30 text-center">
              اضغط Enter للإرسال · Shift + Enter لسطر جديد
            </div>
          </div>

          <div className="flex justify-between items-center px-6 py-3 text-xs border-t border-white/10 bg-black/20">
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="flex items-center gap-1.5 text-white/40 hover:text-red-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              مسح المحادثة
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-white/30">© 2026</span>
              <span className="text-white/20">|</span>
              <span className="text-white/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
               Edarty-Ai
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
}