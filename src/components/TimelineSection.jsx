import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export function TimelineSection() {
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const timelinePeriods = [
    {
      id: 1,
      period: "القرن الثامن الميلادي",
      years: "700-800 م",
      title: "بداية النهضة العلمية",
      description: "بداية حركة الترجمة وتأسيس بيت الحكمة في بغداد",
      events: [
        {
          year: "750 م",
          title: "تأسيس الدولة العباسية",
          description: "بداية العصر الذهبي للعلوم العربية الإسلامية",
          location: "بغداد، العراق",
          importance: "high"
        },
        {
          year: "786 م",
          title: "بناء بيت الحكمة",
          description: "أول مكتبة ومركز ترجمة في العالم الإسلامي",
          location: "بغداد، العراق",
          importance: "high"
        },
        {
          year: "780 م",
          title: "ولادة الخوارزمي",
          description: "مؤسس علم الجبر والخوارزميات",
          location: "خوارزم، أوزبكستان",
          importance: "medium"
        }
      ],
      color: "bg-blue-500"
    },
    {
      id: 2,
      period: "القرن التاسع الميلادي",
      years: "800-900 م",
      title: "عصر الترجمة والتأليف",
      description: "ترجمة التراث اليوناني والفارسي والهندي وبداية التأليف العربي",
      events: [
        {
          year: "830 م",
          title: "كتاب الجبر والمقابلة",
          description: "الخوارزمي يؤلف أول كتاب في علم الجبر",
          location: "بغداد، العراق",
          importance: "high"
        },
        {
          year: "850 م",
          title: "كتاب الحاوي في الطب",
          description: "الرازي يؤلف موسوعة طبية شاملة",
          location: "الري، إيران",
          importance: "high"
        },
        {
          year: "820 م",
          title: "قياس محيط الأرض",
          description: "المأمون يكلف العلماء بقياس محيط الأرض",
          location: "سنجار، العراق",
          importance: "medium"
        }
      ],
      color: "bg-green-500"
    },
    {
      id: 3,
      period: "القرن العاشر الميلادي",
      years: "900-1000 م",
      title: "ذروة الإبداع العلمي",
      description: "عصر الاكتشافات الكبرى في الطب والرياضيات والفلك",
      events: [
        {
          year: "965 م",
          title: "ولادة ابن الهيثم",
          description: "أبو علم البصريات الحديث والمنهج العلمي",
          location: "البصرة، العراق",
          importance: "high"
        },
        {
          year: "980 م",
          title: "ولادة ابن سينا",
          description: "أعظم أطباء العصور الوسطى",
          location: "بخارى، أوزبكستان",
          importance: "high"
        },
        {
          year: "950 م",
          title: "تطوير الإسطرلاب",
          description: "تحسينات كبيرة على آلة الإسطرلاب الفلكية",
          location: "قرطبة، الأندلس",
          importance: "medium"
        }
      ],
      color: "bg-purple-500"
    },
    {
      id: 4,
      period: "القرن الحادي عشر",
      years: "1000-1100 م",
      title: "عصر الموسوعات العلمية",
      description: "تأليف الموسوعات الكبرى في الطب والفلسفة والعلوم",
      events: [
        {
          year: "1020 م",
          title: "كتاب المناظر",
          description: "ابن الهيثم يؤسس علم البصريات الحديث",
          location: "القاهرة، مصر",
          importance: "high"
        },
        {
          year: "1025 م",
          title: "القانون في الطب",
          description: "ابن سينا يؤلف أهم كتاب طبي في التاريخ",
          location: "همدان، إيران",
          importance: "high"
        },
        {
          year: "1048 م",
          title: "وفاة البيروني",
          description: "عالم موسوعي برع في الفلك والرياضيات",
          location: "غزنة، أفغانستان",
          importance: "medium"
        }
      ],
      color: "bg-orange-500"
    },
    {
      id: 5,
      period: "القرن الثاني عشر",
      years: "1100-1200 م",
      title: "انتشار العلوم في الأندلس",
      description: "ازدهار العلوم في الأندلس ونقلها إلى أوروبا",
      events: [
        {
          year: "1154 م",
          title: "خريطة الإدريسي",
          description: "أدق خريطة للعالم في العصور الوسطى",
          location: "صقلية، إيطاليا",
          importance: "high"
        },
        {
          year: "1180 م",
          title: "شروح ابن رشد",
          description: "شروح أرسطو التي أثرت على الفكر الأوروبي",
          location: "قرطبة، الأندلس",
          importance: "high"
        },
        {
          year: "1140 م",
          title: "مدرسة المترجمين",
          description: "تأسيس مدرسة طليطلة للترجمة",
          location: "طليطلة، الأندلس",
          importance: "medium"
        }
      ],
      color: "bg-red-500"
    }
  ];

  const currentPeriod = timelinePeriods[selectedPeriod];

  const nextPeriod = () => {
    setSelectedPeriod((prev) => (prev + 1) % timelinePeriods.length);
  };

  const prevPeriod = () => {
    setSelectedPeriod((prev) => (prev - 1 + timelinePeriods.length) % timelinePeriods.length);
  };

  return (
    <section id="timeline" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            الخط الزمني للعلوم العربية
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            تتبع تطور العلوم العربية الإسلامية عبر القرون، من بداية النهضة العلمية 
            حتى ذروة الإبداع والاكتشافات التي غيرت مجرى التاريخ
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              {timelinePeriods.map((period, index) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedPeriod 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Period Display */}
        <div className="max-w-4xl mx-auto">
          {/* Period Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white mb-4 ${currentPeriod.color}`}>
              <Calendar className="h-4 w-4 ml-2" />
              <span className="font-medium">{currentPeriod.years}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              {currentPeriod.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {currentPeriod.description}
            </p>
          </div>

          {/* Events */}
          <div className="space-y-6">
            {currentPeriod.events.map((event, index) => (
              <Card 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${currentPeriod.color}`}>
                        <span className="font-bold text-sm">{event.year.split(' ')[0]}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-bold">{event.title}</h4>
                        <Badge 
                          variant={event.importance === 'high' ? 'default' : 'secondary'}
                          className="flex-shrink-0"
                        >
                          {event.importance === 'high' ? (
                            <>
                              <Star className="h-3 w-3 ml-1" />
                              مهم جداً
                            </>
                          ) : (
                            'مهم'
                          )}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Period Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            الفترة {selectedPeriod + 1} من {timelinePeriods.length}
          </p>
          <Button variant="outline">
            عرض الخط الزمني الكامل
          </Button>
        </div>
      </div>
    </section>
  );
}

