import { useState, useEffect, useRef } from "react";
import { Send, Trash2, Sparkles, Copy, Check, AlertCircle, ArrowDown, Newspaper } from "lucide-react";

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 RSS states
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // 🧠 RSS fetch
  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://phys.org/rss-feed/"
        );
        const data = await res.json();
        if (data.items) {
          setArticles(data.items.slice(0, 12));
        }
      } catch (err) {
        console.error("RSS Error:", err);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchRSS();
  }, []);

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
      const timeoutId = setTimeout(() => controller.abort(), 30000);

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
        errorMessage = "لا يمكن الاتصال بالخادم.";
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
    if (messages.length > 0 && window.confirm("هل أنت متأكد؟")) {
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
    } catch {}
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
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-8">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">

        {/* 📰 الأخبار */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-[700px] overflow-y-auto">
          <h2 className="flex items-center gap-2 mb-4 text-lg">
            <Newspaper className="text-indigo-400" />
            أحدث الأخبار العلمية
          </h2>

          {newsLoading ? (
            <p className="text-white/50">جاري التحميل...</p>
          ) : (
            <div className="space-y-4">
              {articles.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <h3 className="text-sm font-semibold mb-2">{item.title}</h3>
                  <p className="text-xs text-white/40">
                    {new Date(item.pubDate).toLocaleDateString("ar-EG")}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 💬 الشات (نفس تصميمك) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">

          <div ref={chatRef} className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block px-4 py-2 rounded-xl ${
                  msg.role === "user" ? "bg-indigo-500" : "bg-white/10"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 flex gap-2 border-t border-white/10">
            <input
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white/10 px-3 py-2 rounded-xl"
              placeholder="اكتب سؤالك..."
            />
            <button onClick={sendMessage} className="bg-indigo-500 px-4 rounded-xl">
              <Send />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}