import { useState, useEffect, useRef } from "react";
import { 
  Send, Trash2, Sparkles, Copy, Check, AlertCircle, ArrowDown,
  Rss, TrendingUp, Newspaper, BookOpen, Atom, Cpu, RefreshCw,
  ExternalLink, Calendar, Clock, Zap, WifiOff, Image,
  ChevronLeft, ChevronRight, X, Moon, MapPin, Compass
} from "lucide-react";

// قائمة مصادر RSS العلمية المجانية
const RSS_FEEDS = [
  {
    id: 1,
    name: "Nature News",
    url: "https://www.nature.com/nature/articles.rss",
    category: "العلوم الطبيعية",
    icon: <Atom className="w-4 h-4" />,
    color: "from-emerald-500 to-teal-600",
    hasImages: true
  },
  {
    id: 2,
    name: "Science Daily",
    url: "https://www.sciencedaily.com/rss/all.xml",
    category: "العلوم المتعددة",
    icon: <BookOpen className="w-4 h-4" />,
    color: "from-blue-500 to-cyan-600",
    hasImages: true
  },
  {
    id: 3,
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "التقنية",
    icon: <Cpu className="w-4 h-4" />,
    color: "from-purple-500 to-pink-600",
    hasImages: true
  },
  {
    id: 4,
    name: "Space.com",
    url: "https://www.space.com/feeds/all",
    category: "الفضاء",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "from-orange-500 to-red-600",
    hasImages: true
  },
  {
    id: 5,
    name: "Science News",
    url: "https://www.sciencenews.org/feed",
    category: "العلوم العامة",
    icon: <Zap className="w-4 h-4" />,
    color: "from-green-500 to-emerald-600",
    hasImages: true
  }
];

// استخراج الصور من محتوى RSS
const extractImagesFromContent = (content) => {
  if (!content) return [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('logo') && !match[1].includes('icon')) {
      images.push(match[1]);
    }
  }
  return images;
};

// خدمة جلب RSS باستخدام طرق متعددة
const fetchRSSWithRetry = async (url, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(rss2jsonUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const articles = data.items.map(item => {
          const contentImages = extractImagesFromContent(item.content || item.description || '');
          const thumbnail = item.thumbnail || 
                           (contentImages.length > 0 ? contentImages[0] : null) ||
                           `https://picsum.photos/seed/${Math.random()}/400/200`;
          
          return {
            title: item.title || "بدون عنوان",
            link: item.link || "#",
            description: item.description?.replace(/<[^>]*>/g, '') || 
                        item.content?.replace(/<[^>]*>/g, '') || 
                        "لا يوجد وصف",
            pubDate: item.pubDate || new Date().toISOString(),
            author: item.author || data.feed?.title || "المصدر العلمي",
            thumbnail: thumbnail,
            images: contentImages.length > 0 ? contentImages : [thumbnail],
            enclosure: item.enclosure?.link || null
          };
        });
        
        if (articles.length > 0) return articles;
      }
      
      throw new Error("No articles found");
      
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
      if (i === retries) return [];
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return [];
};

// بيانات تجريبية مع صور
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
      category: "الصحة",
      thumbnail: "https://images.unsplash.com/photo-1576081141729-b6b2a0ff5f2e?w=400&h=200&fit=crop",
      images: ["https://images.unsplash.com/photo-1576081141729-b6b2a0ff5f2e?w=800&h=400&fit=crop"]
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
      category: "الفضاء",
      thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=200&fit=crop",
      images: ["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop"]
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
      category: "التقنية",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"]
    }
  ];
};

// ==================== مكون شريط الوقت والصلاة ====================
function TimeAndPrayerBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState("");
  const [is24Hour, setIs24Hour] = useState(true);
  const [showPrayerDetails, setShowPrayerDetails] = useState(false);
  const [city, setCity] = useState("Cairo");
  const [country, setCountry] = useState("Egypt");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempCity, setTempCity] = useState(city);
  const [tempCountry, setTempCountry] = useState(country);
  const [hijriDate, setHijriDate] = useState("");

  // تحديث الوقت
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // تحديث التاريخ
  useEffect(() => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    setCurrentDate(new Date().toLocaleDateString('ar-EG', options));
  }, [currentTime]);

  // جلب أوقات الصلاة والتاريخ الهجري
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=8`
        );
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          const timings = data.data.timings;
          setPrayerTimes({
            fajr: timings.Fajr.substring(0, 5),
            sunrise: timings.Sunrise.substring(0, 5),
            dhuhr: timings.Dhuhr.substring(0, 5),
            asr: timings.Asr.substring(0, 5),
            maghrib: timings.Maghrib.substring(0, 5),
            isha: timings.Isha.substring(0, 5)
          });
        }
        
        const hijriResponse = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        );
        const hijriData = await hijriResponse.json();
        if (hijriData.code === 200) {
          setHijriDate(`${hijriData.data.hijri.day} ${hijriData.data.hijri.month.ar} ${hijriData.data.hijri.year} هـ`);
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    };
    
    fetchTimes();
    const interval = setInterval(fetchTimes, 3600000);
    return () => clearInterval(interval);
  }, [city, country]);

  // حساب أقرب صلاة
  useEffect(() => {
    if (!prayerTimes) return;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotal = currentHours * 60 + currentMinutes;
    
    const prayers = [
      { name: "الفجر", time: prayerTimes.fajr, arabicName: "الفجر" },
      { name: "الشروق", time: prayerTimes.sunrise, arabicName: "الشروق" },
      { name: "الظهر", time: prayerTimes.dhuhr, arabicName: "الظهر" },
      { name: "العصر", time: prayerTimes.asr, arabicName: "العصر" },
      { name: "المغرب", time: prayerTimes.maghrib, arabicName: "المغرب" },
      { name: "العشاء", time: prayerTimes.isha, arabicName: "العشاء" }
    ];
    
    let next = null;
    let minDiff = Infinity;
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTotal = hours * 60 + minutes;
      let diff = prayerTotal - currentTotal;
      
      if (diff < 0) {
        diff += 24 * 60;
      }
      
      if (diff < minDiff) {
        minDiff = diff;
        next = prayer;
      }
    }
    
    if (next) {
      setNextPrayer(next);
      const hoursLeft = Math.floor(minDiff / 60);
      const minutesLeft = minDiff % 60;
      
      if (minDiff <= 0) {
        setTimeToNextPrayer("الآن");
      } else if (hoursLeft > 0) {
        setTimeToNextPrayer(`${hoursLeft} ساعة ${minutesLeft > 0 ? `و ${minutesLeft} دقيقة` : ""}`);
      } else {
        setTimeToNextPrayer(`${minutesLeft} دقيقة`);
      }
    }
  }, [prayerTimes, currentTime]);

  const formatTime = (date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
  };

  const getPrayerStatus = (prayerTime) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0);
    return now > prayerDate ? "انتهى" : "قادم";
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (tempCity && tempCountry) {
      setCity(tempCity);
      setCountry(tempCountry);
      setIsEditingLocation(false);
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* الوقت والتاريخ */}
          <div className="text-center md:text-right">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent font-mono tracking-wider">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-white/40 mt-1 flex items-center justify-center md:justify-end gap-2">
              <Calendar className="w-3 h-3" />
              <span>{currentDate}</span>
            </div>
            {hijriDate && (
              <div className="text-xs text-indigo-300/60 mt-1 flex items-center justify-center md:justify-end gap-2">
                <Moon className="w-3 h-3" />
                <span>{hijriDate}</span>
              </div>
            )}
          </div>

          {/* أوقات الصلاة */}
          <div className="flex-1">
            <button
              onClick={() => setShowPrayerDetails(!showPrayerDetails)}
              className="w-full"
            >
              <div className="bg-black/30 rounded-xl p-3 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Moon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40">أقرب صلاة</div>
                      <div className="text-lg font-semibold text-white">
                        {nextPrayer?.arabicName || "جاري التحميل"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-white/40">الوقت المتبقي</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {timeToNextPrayer || "--"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40">الموقع</div>
                      <div className="text-sm text-white/80">{city}, {country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-2">
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
              title="تبديل التنسيق"
            >
              <Clock className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => setIsEditingLocation(!isEditingLocation)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
              title="تغيير الموقع"
            >
              <Compass className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* تفاصيل أوقات الصلاة */}
        {showPrayerDetails && prayerTimes && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-slide-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(prayerTimes).map(([prayer, time]) => {
                const prayerNames = {
                  fajr: "الفجر",
                  sunrise: "الشروق",
                  dhuhr: "الظهر",
                  asr: "العصر",
                  maghrib: "المغرب",
                  isha: "العشاء"
                };
                const status = getPrayerStatus(time);
                return (
                  <div key={prayer} className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/40 mb-1">{prayerNames[prayer]}</div>
                    <div className="text-lg font-semibold text-white">{time}</div>
                    <div className={`text-xs mt-1 ${status === "قادم" ? "text-emerald-400" : "text-white/30"}`}>
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نافذة تغيير الموقع */}
        {isEditingLocation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsEditingLocation(false)}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                تغيير الموقع
              </h3>
              <form onSubmit={handleLocationSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">المدينة</label>
                    <input
                      type="text"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all"
                      placeholder="مثال: Cairo, Dubai, Riyadh"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">الدولة</label>
                    <input
                      type="text"
                      value={tempCountry}
                      onChange={(e) => setTempCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all"
                      placeholder="مثال: Egypt, UAE, Saudi Arabia"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 py-2 rounded-xl transition-all duration-200"
                    >
                      تطبيق
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingLocation(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-xl transition-all duration-200"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* شريط RSS أسفل الوقت
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
          <Rss className="w-3 h-3 text-indigo-400 animate-pulse" />
          <span className="text-[11px] text-indigo-300">مصادر علمية موثوقة • تحديث مباشر</span>
        </div>
      </div> */}
    </div>
  );
}

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentArticleImages, setCurrentArticleImages] = useState([]);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const refreshInterval = useRef(null);

  // جلب الأخبار من RSS
  const fetchAllNews = async () => {
    setLoadingNews(true);
    setConnectionError(false);
    
    try {
      const allArticles = [];
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
      
      let finalNews = allArticles;
      if (finalNews.length === 0) {
        setConnectionError(true);
        finalNews = getMockArticles();
      } else {
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

  // فتح معرض الصور
  const openLightbox = (images, index) => {
    setCurrentArticleImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentArticleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentArticleImages.length) % currentArticleImages.length);
  };

  const handleImageError = (articleId) => {
    setImageLoadErrors(prev => ({ ...prev, [articleId]: true }));
  };

  // تحديث تلقائي
  useEffect(() => {
    fetchAllNews();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchAllNews();
      }, 60000);
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  // باقي الـ Hooks
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

      {/* Lightbox للمعرض */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <img
            src={currentArticleImages[currentImageIndex]}
            alt={`صورة ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {currentArticleImages.length}
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* شريط الوقت والصلاة */}
        <TimeAndPrayerBar />

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* قسم RSS - الأخبار العلمية مع الصور */}
          <div className="lg:order-1 order-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 h-full flex flex-col">
              
              <div className="border-b border-white/10 px-6 py-4 bg-black/30">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Rss className="w-5 h-5 text-orange-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <h2 className="font-semibold">النشرة العلمية المصورة</h2>
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

              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
                {connectionError && !loadingNews && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <WifiOff className="w-4 h-4" />
                      <span>جاري عرض بيانات تجريبية مؤقتاً</span>
                    </div>
                  </div>
                )}
                
                {loadingNews ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-white/5 rounded-xl overflow-hidden">
                          <div className="h-48 bg-white/10"></div>
                          <div className="p-4">
                            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-white/5 rounded w-full mb-1"></div>
                            <div className="h-3 bg-white/5 rounded w-2/3"></div>
                          </div>
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
                  news.map((item, idx) => {
                    const hasValidImage = item.thumbnail && !imageLoadErrors[idx];
                    return (
                      <div
                        key={idx}
                        className="group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                        onClick={() => setExpandedNews(expandedNews === idx ? null : idx)}
                      >
                        {/* صورة الخبر */}
                        {hasValidImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={() => handleImageError(idx)}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute top-2 left-2 flex gap-1">
                              <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${item.sourceColor} shadow-lg`}>
                                {item.source}
                              </span>
                            </div>
                            {item.images && item.images.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLightbox(item.images, 0);
                                }}
                                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                        
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs text-white/30 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.pubDate)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
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
                            {item.images && item.images.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLightbox(item.images, 0);
                                }}
                                className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
                              >
                                <Image className="w-3 h-3" />
                                معرض الصور
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-white/10 px-6 py-3 bg-black/20">
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span>📊 {news.length} خبر علمي مصور</span>
                  <span>🔄 {RSS_FEEDS.length} مصدر موثوق</span>
                  <span>🖼️ معرض صور تفاعلي</span>
                </div>
              </div>
            </div>
          </div>

          {/* قسم المحادثة */}
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
                      يمكنك سؤالي عن أي موضوع في العلوم، وسأجيبك بدقة مع الاستفادة من آخر الأخبار العلمية المصورة
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
                    Edarty-Ai
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