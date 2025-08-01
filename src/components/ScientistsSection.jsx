import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, Award, ChevronRight } from "lucide-react";

export function ScientistsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const scientists = [
    {
      id: 1,
      name: "ابن سينا",
      latinName: "Avicenna",
      period: "980-1037 م",
      location: "بخارى، أفغانستان",
      field: "الطب والفلسفة",
      category: "medicine",
      achievements: [
        "كتاب القانون في الطب",
        "أول من وصف التهاب السحايا",
        "اكتشاف الطبيعة المعدية للأمراض",
      ],
      description:
        "أبو علي الحسين بن عبد الله بن سينا، طبيب وفيلسوف مسلم من أعظم أطباء العالم. ألف أكثر من 200 كتاب في مختلف المجالات.",
      image: "/images/arab_scientists.jpg",
    },
    {
      id: 2,
      name: "الخوارزمي",
      latinName: "Al-Khwarizmi",
      period: "780-850 م",
      location: "بغداد، العراق",
      field: "الرياضيات والفلك",
      category: "mathematics",
      achievements: [
        "مؤسس علم الجبر",
        "تطوير النظام العشري",
        "خوارزميات الحساب",
      ],
      description:
        "محمد بن موسى الخوارزمي، عالم رياضيات وفلك وجغرافيا مسلم. يعتبر أبو علم الجبر والخوارزميات.",
      image: "/images/manuscripts.jpeg",
    },
    {
      id: 3,
      name: "ابن الهيثم",
      latinName: "Alhazen",
      period: "965-1040 م",
      location: "البصرة، العراق",
      field: "البصريات والفيزياء",
      category: "physics",
      achievements: [
        "أبو علم البصريات الحديث",
        "اختراع الكاميرا المظلمة",
        "المنهج العلمي التجريبي",
      ],
      description:
        "أبو علي الحسن بن الهيثم، عالم موسوعي مسلم قدم إسهامات كبيرة في الرياضيات والبصريات والفيزياء.",
      image: "/images/muslim_scientists.jpeg",
    },
    {
      id: 4,
      name: "الرازي",
      latinName: "Al-Razi",
      period: "854-925 م",
      location: "الري، إيران",
      field: "الطب والكيمياء",
      category: "medicine",
      achievements: [
        "أول من فرق بين الجدري والحصبة",
        "استخدام الكحول في الطب",
        "تطوير أدوات جراحية",
      ],
      description:
        "أبو بكر محمد بن زكريا الرازي، طبيب وكيميائي مسلم، يعتبر من أعظم أطباء الإنسانية.",
      image: "/images/famous_scientists.jpg",
    },
    {
      id: 5,
      name: "جابر بن حيان",
      latinName: "Geber",
      period: "721-815 م",
      location: "الكوفة، العراق",
      field: "الكيمياء",
      category: "chemistry",
      achievements: [
        "أبو الكيمياء",
        "اكتشاف حمض الكبريتيك",
        "تطوير عمليات التقطير",
      ],
      description:
        "أبو موسى جابر بن حيان، كيميائي مسلم يعتبر مؤسس علم الكيمياء الحديث.",
      image: "/images/famous_scientists.jpg",
    },
    {
      id: 6,
      name: "البيروني",
      latinName: "Al-Biruni",
      period: "973-1048 م",
      location: "خوارزم، أوزبكستان",
      field: "الفلك والجغرافيا",
      category: "astronomy",
      achievements: [
        "حساب محيط الأرض بدقة",
        "دراسة الثقافات المختلفة",
        "تطوير طرق القياس الفلكي",
      ],
      description:
        "أبو الريحان محمد بن أحمد البيروني، عالم موسوعي مسلم برع في الفلك والرياضيات والجغرافيا.",
      image: "/images/famous_scientists.jpg",
    },
    {
      id: 7,
      name: "ابن حجر العسقلاني",
      latinName: "Ibn Hajar al-Asqalani",
      period: "1372-1449 م",
      location: "مصر",
      field: "الحديث النبوي",
      category: "hadith",
      achievements: [
        "تأليف كتاب فتح الباري في شرح صحيح البخاري",
        "تقويم رواة الحديث وتمييز الصحيح من الضعيف",
        "نشر منهجية نقد الحديث وسنده ومتنِه",
      ],
      description:
        "أحمد بن علي بن محمد بن حجر العسقلاني، من كبار علماء الحديث، اشتهر بدقته في نقد الأسانيد وشرحه لصحيح البخاري.",
      image: "/images/hadith_scholars.jpg",
    },
    {
      id: 8,
      name: "الإمام الشافعي",
      latinName: "Imam Al-Shafi'i",
      period: "767-820 م",
      location: "مكة المكرمة، الحجاز",
      field: "الفقه الإسلامي",
      category: "fiqh",
      achievements: [
        "تأسيس المذهب الشافعي",
        "تأليف كتاب الرسالة في أصول الفقه",
        "الجمع بين مدرسة الرأي وأهل الحديث",
      ],
      description:
        "محمد بن إدريس الشافعي، فقيه ومجتهد من كبار أئمة الإسلام، عرف ببلاغته في اللغة العربية وإرسائه لقواعد الفقه الإسلامي.",
      image: "/images/fiqh_scholars.jpg",
    },
    {
      id: 9,
      name: "الإمام الجويني",
      latinName: "Imam Al-Juwayni",
      period: "1028-1085 م",
      location: "نيسابور، خراسان (إيران حاليًا)",
      field: "أصول الفقه",
      category: "usul",
      achievements: [
        "تأليف كتاب البرهان في أصول الفقه",
        "تدريس كبار العلماء كالغزالي",
        "تطوير منهجية الاستدلال الأصولي",
      ],
      description:
        "عبد الملك بن عبد الله الجويني، أحد أعلام علم أصول الفقه، له تأثير بالغ في تأسيس منهج البحث الأصولي والمنطقي.",
      image: "/images/usul_scholars.jpg",
    },
  ];

  const categories = [
    { id: "all", name: "جميع المجالات", count: scientists.length },
    {
      id: "medicine",
      name: "الطب",
      count: scientists.filter((s) => s.category === "medicine").length,
    },
    {
      id: "mathematics",
      name: "الرياضيات",
      count: scientists.filter((s) => s.category === "mathematics").length,
    },
    {
      id: "physics",
      name: "الفيزياء",
      count: scientists.filter((s) => s.category === "physics").length,
    },
    {
      id: "chemistry",
      name: "الكيمياء",
      count: scientists.filter((s) => s.category === "chemistry").length,
    },
    {
      id: "fiqh",
      name: "الفقه",
      count: scientists.filter((s) => s.category === "fiqh").length,
    },
    {
      id: "hadith",
      name: "الحديث",
      count: scientists.filter((s) => s.category === "hadith").length,
    },
    {
      id: "usul",
      name: "أصول",
      count: scientists.filter((s) => s.category === "usul").length,
    },
  ];

  const filteredScientists =
    selectedCategory === "all"
      ? scientists
      : scientists.filter(
          (scientist) => scientist.category === selectedCategory
        );

  return (
    <section id="scientists" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            عباقرة العلماء العرب
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            تعرف على أعظم العقول العلمية في التاريخ العربي الإسلامي، الذين أرسوا
            أسس العلوم الحديثة وأثروا المعرفة الإنسانية بإنجازاتهم الخالدة
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="text-sm"
            >
              {category.name}
              <Badge variant="secondary" className="mr-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Scientists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredScientists.map((scientist, index) => (
            <Card
              key={scientist.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <img src={scientist.image} alt={scientist.name} className="w-full h-32 object-cover rounded-md mb-3" />
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {scientist.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">
                      {scientist.latinName}
                    </p>
                    <Badge variant="secondary" className="mb-3">
                      {scientist.field}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{scientist.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{scientist.location}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {scientist.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Award className="h-4 w-4 text-secondary" />
                    <span>أهم الإنجازات:</span>
                  </div>
                  <ul className="space-y-1">
                    {scientist.achievements
                      .slice(0, 2)
                      .map((achievement, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-secondary mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  اقرأ المزيد
                  <ChevronRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8">
            عرض جميع العلماء
            <ChevronRight className="h-5 w-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
