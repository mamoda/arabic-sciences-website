import { useParams, Link } from "react-router-dom";

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
      name:`محمد بن موسى الخوارزمي
(باللاتينية: Algoritmi – وهو أصل كلمة "Algorithm")`,
      latinName: "Al-Khwarizmi",
      period:`ولد حوالي عام 780م في خوارزم (تقع اليوم في أوزبكستان).
توفي حوالي عام 850م في بغداد، الدولة العباسية.`,
      location: "بغداد، العراق",
      field: "الرياضيات والفلك",
      category: "mathematics",
      achievements: [
       `1. علم الجبر:
ألف كتابه الشهير "الكتاب المختصر في حساب الجبر والمقابلة" عام 830م.

أول من فصل علم الجبر عن الحساب، فأسس بذلك علم الجبر كعلم مستقل.

قدم طرقًا منهجية لحل المعادلات الخطية والتربيعية، مستخدمًا المصطلحين "الجبر" (الإزالة) و"المقابلة" (المعادلة).

ترجم إلى اللاتينية في القرن الثاني عشر، وأصبح مرجعًا في أوروبا لعدة قرون.

2. الرياضيات والحساب الهندي:
كتب في الأرقام الهندية ونظام العد العشري.

أدخل مفهوم الصفر إلى العالم الإسلامي ومنه إلى أوروبا.

ساهمت أعماله في تطوير اللوغاريتمات؛ ومن اسمه اشتُقت كلمة "Algorithm".

3. الجغرافيا:
كتب كتابًا بعنوان "صورة الأرض"، اعتمد فيه على كتاب "الجغرافيا" لبطليموس، لكنه صحح العديد من أخطائه.

أنشأ خريطة دقيقة للعالم المعروف آنذاك، وقام بإدراج أسماء أكثر من 2,400 موقع جغرافي.

4. الفلك:
كتب جداول فلكية تعرف باسم الزيج، استند فيها إلى أعمال هندية ويونانية.

طور أدوات ووسائل لرصد النجوم وحساب الوقت والقبلة (اتجاه الصلاة).`,
        "تطوير النظام العشري",
        "خوارزميات الحساب",
      ],
      description:
        "محمد بن موسى الخوارزمي، عالم رياضيات وفلك وجغرافيا مسلم. يعتبر أبو علم الجبر والخوارزميات.",
      image: "/images/khwarizmy.jpg",
    },
      {
      id: 3,
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
      image: "/images/ibn_hajar.png",
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
      image: "/images/razi.jpg",
    },
    {
      id: 5,
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
      image: "/images/Al-Shafie_Name.png",
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
      image: "/images/bayrony.jpg",
    },
    {
      id: 7,
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
      id: 8,
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
      image: "/images/Jābir_ibn_Ḥayyān.png",
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
      image: "/images/jwiny.webp",
    },
  ];

export function ScientistDetail() {
  const { id } = useParams();
  const scientist = scientists.find(s => s.id === Number(id));

  if (!scientist) {
    return (
      <div className="container py-10">
        <h2>العالم غير موجود</h2>
        <Link to="/">العودة إلى الصفحة الرئيسية</Link>
      </div>
    );
  }


  return (
    <div className="container py-10 max-w-2xl mx-auto text-right">
      <img src={scientist.image} alt={scientist.name} className="w-full rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-2">{scientist.name}</h1>
      <p className="text-lg text-muted-foreground mb-2">{scientist.latinName}</p>
      <div className="mb-4">
        <span className="font-semibold">الفترة:</span> {scientist.period}
        <br />
        <span className="font-semibold">الموقع:</span> {scientist.location}
        <br />
        <span className="font-semibold">المجال:</span> {scientist.field}
      </div>
      <p className="mb-4">{scientist.description}</p>
      <div>
        <span className="font-semibold">أهم الإنجازات:</span>
        <ul className="list-disc pr-6">
          {scientist.achievements.map((ach, idx) => (
            <li key={idx}>{ach}</li>
          ))}
        </ul>
      </div>
      <Link to="/" className="inline-block mt-6 text-primary underline">العودة</Link>
    </div>
  );
}