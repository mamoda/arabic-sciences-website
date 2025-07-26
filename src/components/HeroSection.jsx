import { useState, useEffect } from 'react';
import { ChevronDown, Star, Globe, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function HeroSection() {
  const [currentText, setCurrentText] = useState(0);
  
  const heroTexts = [
    "المنصة الأولى في العلوم العربية والإسلامية في الشرق الأوسط من نعها",
    "استكشف إنجازات العلماء العرب والمسلمين عبر العصور",
    "تعلم عن الاكتشافات التي غيرت مسار العلم في العالم",
    "انضم إلى مجتمعنا وشارك في إحياء التراث العلمي العربي"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Star, number: "1000+", label: "عالم عربي" },
    { icon: Globe, number: "15", label: "مجال علمي" },
    { icon: BookOpen, number: "500+", label: "اكتشاف مهم" }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 arabic-pattern opacity-10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 bg-primary/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
             مولانا
          </h1>
          
          {/* Animated subtitle */}
          <div className="h-16 mb-8">
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {heroTexts[currentText]}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            انطلق في رحلة استكشافية عبر التاريخ لتتعرف على إنجازات العلماء العرب والمسلمين 
            الذين أضاءوا طريق العلم والمعرفة للبشرية جمعاء
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
              ابدأ الاستكشاف
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
              تعرف على العلماء
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
                <div className="flex flex-col items-center">
                  <stat.icon className="h-8 w-8 mb-3 text-secondary" />
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </div>
    </section>
  );
}

