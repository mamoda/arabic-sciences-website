import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Building2, Users, BarChart3, Calendar, Bell, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

export function AnimatedAdButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Building2, text: 'إدارة المؤسسات' },
    { icon: Users, text: 'متابعة الموظفين' },
    { icon: BarChart3, text: 'تقارير لحظية' },
    { icon: Calendar, text: 'جدولة المهام' },
    { icon: Bell, text: 'إشعارات فورية' }
  ];

  useEffect(() => {
    if (isExpanded) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isExpanded, features.length]);

  return (
    <div className="fixed left-4 top-20 z-50 rtl:left-auto rtl:right-4">
      {/* الزر الرئيسي */}
      <div className="relative group">
        {/* تأثير النبض الخلفي */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
        
        {/* الزر المتوهج */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full shadow-2xl transition-all duration-500 overflow-hidden group"
          style={{
            padding: isExpanded ? '12px 20px' : '12px 20px',
            transform: isExpanded ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div className="flex items-center gap-3 rtl:gap-3">
            {/* أيقونة متحركة */}
            <div className="relative">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <div className="absolute inset-0 animate-ping opacity-75">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            
            {/* النص */}
            <span className="font-bold whitespace-nowrap">
              {isExpanded ? 'خدمات إدارتي المتكاملة' : 'إدارتي'}
            </span>
            
            {/* السهم */}
            <ChevronLeft 
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* تأثير التموج عند hover */}
          <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>

        {/* البانر الموسع */}
        <div className={`
          absolute left-0 top-full mt-3 w-96 overflow-hidden transition-all duration-500
          rtl:left-auto rtl:right-0
          ${isExpanded ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
        `}>
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden">
            
            {/* رأس البانر */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">تطبيق إدارتي</h3>
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <p className="text-emerald-100 text-sm">الحل المتكامل لإدارة مؤسستك</p>
            </div>

            {/* الميزات المتحركة */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">الميزة الحالية:</span>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {(() => {
                    const FeatureIcon = features[currentFeature].icon;
                    return <FeatureIcon className="w-4 h-4" />;
                  })()}
                  <span className="animate-fade-in">{features[currentFeature].text}</span>
                </div>
              </div>

              {/* شريط التقدم */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((currentFeature + 1) / features.length) * 100}%` }}
                ></div>
              </div>

              {/* قائمة الخدمات */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                    >
                      <Icon className="w-3 h-3 text-emerald-500" />
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* زر الإجراء */}
              <Button 
                className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group"
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform rtl:mr-0 rtl:ml-2 rtl:group-hover:-translate-x-1" />
              </Button>
            </div>

            {/* مثلث التوجيه */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-gradient-to-br from-emerald-600 to-teal-600 transform rotate-45 rtl:left-auto rtl:right-4"></div>
          </div>
        </div>
      </div>

      {/* CSS إضافي للحركات */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}