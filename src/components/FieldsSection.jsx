import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Stethoscope, 
  Calculator, 
  Telescope, 
  FlaskConical, 
  Compass, 
  BookOpen,
  Microscope,
  Atom,
  ChevronRight
} from 'lucide-react';

export function FieldsSection() {
  const fields = [
    {
      id: 1,
      name: "الطب",
      icon: Stethoscope,
      description: "من التشخيص إلى الجراحة، أرسى العلماء العرب أسس الطب الحديث",
      achievements: [
        "أول مستشفيات في العالم",
        "علم التشريح والجراحة",
        "الصيدلة وعلم الأدوية",
        "طب العيون والأسنان"
      ],
      pioneers: ["ابن سينا", "الرازي", "ابن النفيس", "الزهراوي"],
      color: "bg-red-500",
      count: "200+"
    },
    {
      id: 2,
      name: "الرياضيات",
      icon: Calculator,
      description: "من الجبر إلى الهندسة، ثورة رياضية غيرت وجه العلم",
      achievements: [
        "علم الجبر والمقابلة",
        "النظام العشري والصفر",
        "حساب المثلثات",
        "الهندسة التحليلية"
      ],
      pioneers: ["الخوارزمي", "عمر الخيام", "ثابت بن قرة", "البيروني"],
      color: "bg-blue-500",
      count: "150+"
    },
    {
      id: 3,
      name: "الفلك",
      icon: Telescope,
      description: "رصد النجوم وحساب المدارات، رحلة عبر الكون",
      achievements: [
        "المراصد الفلكية الأولى",
        "حساب محيط الأرض",
        "تطوير الإسطرلاب",
        "نظريات حركة الكواكب"
      ],
      pioneers: ["البتاني", "ابن الشاطر", "الطوسي", "ابن رشد"],
      color: "bg-purple-500",
      count: "100+"
    },
    {
      id: 4,
      name: "الكيمياء",
      icon: FlaskConical,
      description: "من الخيمياء إلى الكيمياء، تحويل المواد وفهم الطبيعة",
      achievements: [
        "عمليات التقطير والتبلور",
        "اكتشاف الأحماض",
        "تطوير المعدات المخبرية",
        "علم المعادن"
      ],
      pioneers: ["جابر بن حيان", "الرازي", "ابن سينا", "الجلدكي"],
      color: "bg-green-500",
      count: "80+"
    },
    {
      id: 5,
      name: "الفيزياء",
      icon: Atom,
      description: "من البصريات إلى الميكانيكا، فهم قوانين الطبيعة",
      achievements: [
        "علم البصريات الحديث",
        "قوانين الانكسار والانعكاس",
        "دراسة الضوء والرؤية",
        "الميكانيكا والحركة"
      ],
      pioneers: ["ابن الهيثم", "الكندي", "ابن سهل", "البيروني"],
      color: "bg-orange-500",
      count: "90+"
    },
    {
      id: 6,
      name: "الجغرافيا",
      icon: Compass,
      description: "رسم الخرائط واستكشاف العالم، توسيع آفاق المعرفة",
      achievements: [
        "الخرائط الدقيقة للعالم",
        "تحديد خطوط الطول والعرض",
        "وصف البلدان والمناخ",
        "علم المساحة"
      ],
      pioneers: ["الإدريسي", "المسعودي", "ابن بطوطة", "الهمداني"],
      color: "bg-teal-500",
      count: "70+"
    },
    {
      id: 7,
      name: "الفلسفة",
      icon: BookOpen,
      description: "من المنطق إلى الأخلاق، تطوير الفكر الإنساني",
      achievements: [
        "فلسفة العلوم والمنطق",
        "نظريات المعرفة",
        "الفلسفة السياسية",
        "علم الكلام"
      ],
      pioneers: ["ابن رشد", "الفارابي", "الغزالي", "ابن خلدون"],
      color: "bg-indigo-500",
      count: "120+"
    },
    {
      id: 8,
      name: "البصريات",
      icon: Microscope,
      description: "فهم الضوء والرؤية، أساس التكنولوجيا البصرية الحديثة",
      achievements: [
        "قوانين الانكسار",
        "تشريح العين",
        "الكاميرا المظلمة",
        "العدسات والمرايا"
      ],
      pioneers: ["ابن الهيثم", "الكندي", "ابن سهل", "القزويني"],
      color: "bg-pink-500",
      count: "60+"
    }
  ];

  return (
    <section id="fields" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            المجالات العلمية
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            استكشف المجالات العلمية المختلفة التي برع فيها العلماء العرب والمسلمون، 
            وتعرف على إنجازاتهم التي أثرت على تطور العلوم الحديثة
          </p>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field, index) => (
            <Card 
              key={field.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 relative">
                  <div className={`w-16 h-16 ${field.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <field.icon className="h-8 w-8 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    {field.count}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {field.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {field.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">أهم الإنجازات:</h4>
                  <ul className="space-y-1">
                    {field.achievements.slice(0, 3).map((achievement, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-secondary mt-1">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">رواد المجال:</h4>
                  <div className="flex flex-wrap gap-1">
                    {field.pioneers.slice(0, 3).map((pioneer, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {pioneer}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  استكشف المجال
                  <ChevronRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              اكتشف المزيد من المجالات العلمية
            </h3>
            <p className="text-muted-foreground mb-6">
              تعمق أكثر في دراسة المجالات العلمية المختلفة وتعرف على تفاصيل الإنجازات والاكتشافات
            </p>
            <Button size="lg" className="px-8">
              عرض جميع المجالات
              <ChevronRight className="h-5 w-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

