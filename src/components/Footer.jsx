import { BookOpen, Mail, Github, Twitter, Facebook, Heart } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  const footerSections = [
    {
      title: "المحتوى",
      links: [
        { name: "العلماء العرب", href: "#scientists" },
        { name: "المجالات العلمية", href: "#fields" },
        { name: "الاكتشافات", href: "#discoveries" },
        { name: "الخط الزمني", href: "#timeline" }
      ]
    },
    {
      title: "الموارد",
      links: [
        { name: "المكتبة الرقمية", href: "#library" },
        { name: "المراجع والمصادر", href: "#references" },
        { name: "الاختبارات التفاعلية", href: "#quizzes" },
        { name: "المقالات", href: "#articles" }
      ]
    },
    {
      title: "حول الموقع",
      links: [
        { name: "من نحن", href: "#about" },
        { name: "اتصل بنا", href: "#contact" },
        { name: "سياسة الخصوصية", href: "#privacy" },
        { name: "شروط الاستخدام", href: "#terms" }
      ]
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
                <BookOpen className="h-8 w-8 text-secondary" />
                <span className="text-2xl font-bold">مولانا</span>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                منصة تعليمية تهدف إلى إحياء التراث العلمي العربي الإسلامي 
                وتعريف الأجيال الجديدة بإنجازات علمائنا العظام.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button variant="ghost" href="https://twitter.com" size="icon" className="text-primary-foreground hover:text-secondary">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 text-secondary">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">
              اشترك في النشرة الإخبارية
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              احصل على آخر المقالات والاكتشافات العلمية مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="secondary" className="px-6">
                اشتراك
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-primary-foreground/80 text-sm">
              © 2025 العلوم العربية. جميع الحقوق محفوظة.
            </div>
            
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <span>صُنع بـ</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>لإحياء التراث العلمي العربي</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <a href="#privacy" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                الخصوصية
              </a>
              <a href="#terms" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                الشروط
              </a>
              <a href="#sitemap" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                خريطة الموقع
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

