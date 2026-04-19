import { useState, useEffect, useRef } from "react";
import { Send, Trash2, Sparkles, Copy, Check, AlertCircle, ArrowDown, BookOpen } from "lucide-react";

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 new states
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // 🧠 جلب الأبحاث
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("https://api.openalex.org/works?per_page=6&sort=publication_date:desc");
        const data = await res.json();

        const formatted = data.results.map((item) => ({
          title: item.title,
          url: item.id,
          date: item.publication_date,
        }));

        setArticles(formatted);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // باقي الكود كما هو 👇
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
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmedQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("https://arabic-sciences-website-1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "لا يوجد رد" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "حدث خطأ", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* 🧠 LOGO */}
        <div className="text-center mb-10">
          <img src="/images/logo.svg" className="h-32 mx-auto" />
        </div>

        {/* 📰 ARTICLES */}
        <div className="mb-12">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            أحدث الأبحاث العلمية
          </h2>

          {articlesLoading ? (
            <p className="text-white/50">جاري التحميل...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {articles.map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
                >
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-white/40">{article.date}</p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 💬 CHAT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="h-80 overflow-y-auto mb-4 space-y-3" ref={chatRef}>
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

          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 bg-white/10 px-4 py-2 rounded-xl"
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