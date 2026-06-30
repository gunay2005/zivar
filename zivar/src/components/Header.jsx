import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'az', label: 'AZ' },
  { code: 'ru', label: 'RU' },
  { code: 'fr', label: 'FR' }
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(i18n.language?.slice(0, 2) || 'en');
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['home', 'experiences', 'story', 'gallery', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveNav(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setActiveNav(id);
  };

  const handleLang = (code) => {
    setActiveLang(code);
    i18n.changeLanguage(code);
  };

  const navItems = [
    { key: 'nav.home', id: 'home' },
    { key: 'nav.menu', id: 'experiences' },
    { key: 'nav.story', id: 'story' },
    { key: 'nav.gallery', id: 'gallery' },
    { key: 'nav.contact', id: 'contact' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-r from-[#F3E3CA] via-[#F3E3CA]/90 to-[#F3E3CA]/20 backdrop-blur-lg shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] py-1.5 border-b border-[#E3D3BA]/10'
            : 'bg-[#F3E3CA] py-5'
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-20 flex items-center justify-between relative">

         {/* Logo - скраю слева */}
<motion.button
  onClick={() => scrollTo('home')}
  className="flex items-center shrink-0 "
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  <img 
    src="https://i.postimg.cc/hPdRn1hs/zivarlogo1.jpg" 
    alt="Zivar Logo" 
    className="h-[80px] md:h-[90px] w-auto object-contain" 
  />
</motion.button>

          {/* Desktop nav - по центру */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
  key={item.id}
  onClick={() => scrollTo(item.id)}
  className="relative text-[13px] uppercase tracking-[0.25em] transition-colors duration-300 font-semibold py-2" // Сделали 13px и font-semibold
>
  <span className={`transition-colors duration-300 ${
    activeNav === item.id ? 'text-[#A07322]' : 'text-[#1A1815] hover:text-[#A07322]' // Сделали цвет #1A1815 вместо #2C2820 (он темнее и глубже)
  }`}>
    {t(item.key)}
  </span>
                {/* Только точка для активного, черточка для hover */}
                {activeNav === item.id && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C4973A]"
                  />
                )}
                <span className="absolute -bottom-0 left-0 w-0 h-px bg-[#C4973A] transition-all duration-300 hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right: languages + hamburger - скраю справа */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Language switcher */}
            <div className="flex items-center text-[11px] tracking-wider">
              {languages.map((lang, i) => (
                <span key={lang.code} className="flex items-center">
                  <button
                    onClick={() => handleLang(lang.code)}
                    className={`px-1 py-0.5 transition-colors font-medium ${
                      activeLang === lang.code
                        ? 'text-[#C4973A]'
                        : 'text-[#8A7E6E] hover:text-[#2C2820]'
                    }`}
                  >
                    {lang.label}
                  </button>
                  {i < languages.length - 1 && (
                    <span className="text-[#C8BBA8] text-xs mx-1">/</span>
                  )}
                </span>
              ))}
            </div>

            {/* Красивый гамбургер - тонкие линии в круге */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-[#E8E0D5] flex items-center justify-center hover:border-[#C4973A] transition-colors duration-300 group"
            >
              <div className="flex flex-col gap-[4px] items-center">
                <span className={`block h-[1px] bg-[#2C2820] transition-all duration-300 ${isMobileMenuOpen ? 'w-4 rotate-45 translate-y-[2.5px]' : 'w-4'}`} />
                <span className={`block h-[1px] bg-[#2C2820] transition-all duration-300 ${isMobileMenuOpen ? 'w-0 opacity-0' : 'w-3'}`} />
                <span className={`block h-[1px] bg-[#2C2820] transition-all duration-300 ${isMobileMenuOpen ? 'w-4 -rotate-45 -translate-y-[2.5px]' : 'w-4'}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Меню справа - slide from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Side panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F5F0E8] shadow-2xl"
            >
              {/* Закрыть кнопка */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full border border-[#E8E0D5] flex items-center justify-center hover:border-[#C4973A] transition-colors group"
                >
                  <X size={18} className="text-[#2C2820] group-hover:text-[#C4973A] transition-colors" />
                </button>
              </div>

              {/* Навигация */}
              <nav className="px-10 pt-8">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left py-4 border-b border-[#E8E0D5] group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-serif transition-colors duration-300 ${
                        activeNav === item.id ? 'text-[#C4973A]' : 'text-[#2C2820] group-hover:text-[#C4973A]'
                      }`}>
                        {t(item.key)}
                      </span>
                      <span className={`text-[10px] tracking-wider transition-colors duration-300 ${
                        activeNav === item.id ? 'text-[#C4973A]' : 'text-[#C8BBA8]'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* Нижняя часть */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-10 right-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  {languages.map((lang, i) => (
                    <span key={lang.code} className="flex items-center gap-3">
                      <button
                        onClick={() => handleLang(lang.code)}
                        className={`text-sm font-medium transition-colors ${
                          activeLang === lang.code ? 'text-[#C4973A]' : 'text-[#8A7E6E] hover:text-[#2C2820]'
                        }`}
                      >
                        {lang.label}
                      </button>
                      {i < languages.length - 1 && <span className="text-[#C8BBA8]">/</span>}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#8A7E6E] space-y-1">
                  <p>Port Baku Tower, 153 Neftchilar Ave.</p>
                  <p>Baku, AZ1010, Azerbaijan</p>
                  <p className="text-[#C4973A] mt-2">+994 12 404 00 00</p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}