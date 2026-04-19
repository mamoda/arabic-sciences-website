import { useState, useEffect, useRef } from "react";
import { 
  Send, Trash2, Sparkles, Copy, Check, AlertCircle, ArrowDown,
  Rss, TrendingUp, Newspaper, BookOpen, Atom, Cpu, RefreshCw,
  ExternalLink, Calendar, Clock, Zap, WifiOff
} from "lucide-react";

// قائمة مصادر RSS العلمية المجانية (مع روابط بديلة)
const RSS_FEEDS = [
  {
    id: 1,
    name: "Nature News",
    url: "https://www.nature.com/nature/articles.rss",
    backupUrl: "https://feeds.nature.com/nature/rss/current",
    category: "العلوم الطبيعية",
    icon: <Atom className="w-4 h-4" />,
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 2,
    name: "Science Daily",
    url: "https://www.sciencedaily.com/rss/all.xml",
    backupUrl: "https://www.sciencedaily.com/rss/top.xml",
    category: "العلوم المتعددة",
    icon: <BookOpen className="w-4 h-4" />,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 3,
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    backupUrl: "https://www.technologyreview.com/feed/top/",
    category: "التقنية",
    icon: <Cpu className="w-4 h-4" />,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    name: "Space.com",
    url: "https://www.space.com/feeds/all",
    backupUrl: "https://www.space.com/feeds/news",
    category: "الفضاء",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "from-orange-500 to-red-600"
  },
  {
    id: 5,
    name: "Science News",
    url: "https://www.sciencenews.org/feed",
    backupUrl: "https://www.sciencenews.org/feed/news",
    category: "العلوم العامة",
    icon: <Zap className="w-4 h-4" />,
    color: "from-green-500 to-emerald-600"
  }
];

// خدمة جلب RSS باستخدام طرق متعددة
const fetchRSSWithRetry = async (url, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      // استخدام خدمة RSS2JSON كبديل رئيسي
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(rss2jsonUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        // تحويل البيانات من RSS2JSON إلى التنسيق المطلوب
        const articles = data.items.map(item => ({
          title: item.title || "بدون عنوان",
          link: item.link || "#",
          description: item.description?.replace(/<[^>]*>/g, '') || item.content?.replace(/<[^>]*>/g, '') || "لا يوجد وصف",
          pubDate: item.pubDate || new Date().toISOString(),
          author: item.author || data.feed?.title || "المصدر العلمي",
          thumbnail: item.thumbnail || item.enclosure?.link || null
        }));
        
        if (articles.length > 0) return articles;
      }
      
      throw new Error("No articles found");
      
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
      
      if (i === retries) {
        // المحاولة الأخيرة فشلت
        return [];
      }
      
      // انتظار قبل إعادة المحاولة
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  return [];
};

// بيانات تجريبية للاستخدام عند فشل جميع المحاولات
const getMockArticles = () => {
  return [
    {
      title: "اكتشاف جديد في علاج السرطان باستخدام الخلايا المناعية",
      link: "#",
      description: "توصل فريق من الباحثين إلى طريقة مبتكرة لتعزيز قدرة الخلايا المناعية على مكافحة الأورام السرطانية، مما يفتح آفاقاً جديدة للعلاج المناعي.",
      pubDate: new Date().toISOString(),
      author: "Nature Medicine",
      source: "العلوم الطبية",
      sourceIcon: <Zap className="w-4 h-4" />,
      sourceColor: "from-green-500 to-emerald-600",
      category: "الصحة"
    },
    {
      title: "تلسكوب جيمس ويب يكتشف أبعد مجرة تم رصدها على الإطلاق",
      link: "#",
      description: "تمكن تلسكوب جيمس ويب الفضائي من رصد مجرة على بعد 13.5 مليار سنة ضوئية، مما يساعد في فهم المراحل الأولى لتشكل الكون.",
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      author: "NASA",
      source: "الفضاء",
      sourceIcon: <TrendingUp className="w-4 h-4" />,
      sourceColor: "from-orange-500 to-red-600",
      category: "الفضاء"
    },
    {
      title: "تطور جديد في الذكاء الاصطناعي التوليدي",
      link: "#",
      description: "شركات التكنولوجيا تطلق نماذج جديدة قادرة على فهم السياق بشكل أعمق وإنتاج محتوى أكثر دقة وإبداعاً.",
      pubDate: new Date(Date.now() - 7200000).toISOString(),
      author: "MIT Technology Review",
      source: "التقنية",
      sourceIcon: <Cpu className="w-4 h-4" />,
      sourceColor: "from-purple-500 to-pink-600",
      category: "التقنية"
    },
    {
      title: "تغير المناخ: 2025 هو العام الأكثر حرارة في التاريخ",
      link: "#",
      description: "تشير البيانات إلى أن متوسط درجات الحرارة العالمية تجاوز الرقم القياسي السابق، مما يدق ناقوس الخطر بشأن ظاهرة الاحتباس الحراري.",
      pubDate: new Date(Date.now() - 10800000).toISOString(),
      author: "Science Daily",
      source: "العلوم البيئية",
      sourceIcon: <BookOpen className="w-4 h-4" />,
      sourceColor: "from-blue-500 to-cyan-600",
      category: "البيئة"
    },
    {
      title: "اكتشاف مضاد حيوي جديد من تربة غير مأهولة",
      link: "#",
      description: "باحثون يكتشفون مركباً طبيعياً في تربة من منطقة نائية يظهر فعالية ضد البكتيريا المقاومة للمضادات الحيوية.",
      pubDate: new Date(Date.now() - 14400000).toISOString(),
      author: "Nature",
      source: "العلوم الطبيعية",
      sourceIcon: <Atom className="w-4 h-4" />,
      sourceColor: "from-emerald-500 to-teal-600",
      category: "العلوم الطبيعية"
    }
  ];
};

export function HeroSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedNews, setExpandedNews] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const refreshInterval = useRef(null);

  // جلب الأخبار من RSS
  const fetchAllNews = async () => {
    setLoadingNews(true);
    setConnectionError(false);
    
    try {
      const allArticles = [];
      
      // محاولة جلب البيانات من جميع المصادر
      const fetchPromises = RSS_FEEDS.map(async (feed) => {
        try {
          const articles = await fetchRSSWithRetry(feed.url);
          
          if (articles.length > 0) {
            return articles.map(article => ({
              ...article,
              source: feed.name,
              sourceIcon: feed.icon,
              sourceColor: feed.color,
              category: feed.category
            }));
          }
          return [];
        } catch (error) {
          console.warn(`Failed to fetch ${feed.name}:`, error);
          return [];
        }
      });
      
      const results = await Promise.allSettled(fetchPromises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          allArticles.push(...result.value);
        }
      });
      
      // إذا لم يتم جلب أي بيانات، استخدم البيانات التجريبية
      let finalNews = allArticles;
      if (finalNews.length === 0) {
        setConnectionError(true);
        finalNews = getMockArticles();
      } else {
        // ترتيب حسب التاريخ
        finalNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      }
      
      setNews(finalNews.slice(0, 30));
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error("Error in fetchAllNews:", error);
      setConnectionError(true);
      setNews(getMockArticles());
      setLastUpdate(new Date());
    } finally {
      setLoadingNews(false);
    }
  };

  // تحديث تلقائي
  useEffect(() => {
    fetchAllNews();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchAllNews();
      }, 60000); // تحديث كل 60 ثانية بدلاً من 30
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  // بقية الـ Hooks الخاصة بالمحادثة تبقى كما هي...
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (isNaN(diffMins)) return "الآن";
      if (diffMins < 1) return "الآن";
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffMins < 1440) return `منذ ${Math.floor(diffMins / 60)} ساعة`;
      return date.toLocaleDateString("ar-EG");
    } catch {
      return "تاريخ غير معروف";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      fetchAllNews();
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-8">
      
      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* الهيدر */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-sm">
            <Rss className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-300">مصادر علمية موثوقة</span>
          </div>
          <img src="/images/logo.svg" alt="Logo" className="h-28 w-28 mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* قسم RSS - الأخبار العلمية */}
          <div className="lg:order-1 order-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 h-full flex flex-col">
              
              {/* عنوان RSS */}
              <div className="border-b border-white/10 px-6 py-4 bg-black/30">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Rss className="w-5 h-5 text-orange-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <h2 className="font-semibold">النشرة العلمية اليومية</h2>
                    {lastUpdate && (
                      <div className="flex items-center gap-1 text-xs text-white/40 mr-2">
                        <Clock className="w-3 h-3" />
                        <span>آخر تحديث: {formatDate(lastUpdate)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleAutoRefresh}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 flex items-center gap-1 ${
                        autoRefresh 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : "bg-white/5 text-white/40 border border-white/10"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${autoRefresh ? "animate-spin-slow" : ""}`} />
                      {autoRefresh ? "تحديث تلقائي" : "تحديث يدوي"}
                    </button>
                    <button
                      onClick={fetchAllNews}
                      disabled={loadingNews}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingNews ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* قائمة الأخبار */}
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px]">
                {connectionError && !loadingNews && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <WifiOff className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                {loadingNews ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-white/5 rounded w-full mb-1"></div>
                          <div className="h-3 bg-white/5 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : news.length === 0 ? (
                  <div className="text-center text-white/40 py-12">
                    <Rss className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد أخبار حالياً</p>
                  </div>
                ) : (
                  news.map((item, idx) => (
                    <div
                      key={idx}
                      className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-slide-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                      onClick={() => setExpandedNews(expandedNews === idx ? null : idx)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.sourceColor} flex items-center justify-center shrink-0`}>
                          {item.sourceIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                              {item.source || item.category || "علوم"}
                            </span>
                            <span className="text-xs text-white/30 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.pubDate)}
                            </span>
                          </div>
                          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </h3>
                          <div className={`text-xs text-white/40 leading-relaxed transition-all duration-300 ${
                            expandedNews === idx ? "max-h-96" : "max-h-12 overflow-hidden"
                          }`}>
                            {item.description}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {item.link && item.link !== "#" && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3" />
                                قراءة المزيد
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuestion(`أخبرني عن: ${item.title}`);
                                inputRef.current?.focus();
                              }}
                              className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              اسأل عن الخبر
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* إحصائيات RSS */}
              <div className="border-t border-white/10 px-6 py-3 bg-black/20">
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span>📊 {news.length} خبر علمي</span>
                  <span>🔄 {RSS_FEEDS.length} مصدر موثوق</span>
                  <span>⚡ تحديث مباشر</span>
                </div>
              </div>
            </div>
          </div>

          {/* قسم المحادثة - يبقى كما هو */}
          <div className="lg:order-2 order-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10">
              
              <div className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/30">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <span className="text-xs text-white/60">متصل • مساعد ذكي</span>
                </div>
                <div className="text-xs text-white/40 flex items-center gap-2">
                  <Newspaper className="w-3 h-3" />
                  {messages.length} محادثة
                </div>
              </div>

              <div
                ref={chatRef}
                className="h-[500px] overflow-y-auto p-4 space-y-4 scroll-smooth"
              >
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 animate-pulse">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-white/60 font-medium mb-2">مرحباً بك في المنصة العلمية!</h3>
                    <p className="text-white/40 text-sm max-w-md">
                      يمكنك سؤالي عن أي موضوع في العلوم، وسأجيبك بدقة مع الاستفادة من آخر الأخبار العلمية
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                      {["ما هي آخر discoveries في الفضاء؟", "أحدث علاجات السرطان", "تطورات الذكاء الاصطناعي"].map((suggestion) => (
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
                          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/40 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            المصادر: {msg.sources}
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
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-white/60 mr-2">يجري البحث في المصادر العلمية</span>
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
                      placeholder="اسأل عن أي موضوع علمي..."
                      disabled={loading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
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
                  اضغط Enter للإرسال · Shift + Enter لسطر جديد · أسئلة ذكية مدعومة بأحدث الأخبار
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
                    Edarty-Ai • مدعوم بـ RSS علمي
                  </span>
                </div>
              </div>
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
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
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
        
        .delay-2000 {
          animation-delay: 2000ms;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}