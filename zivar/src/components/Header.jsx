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
          ? 'bg-gradient-to-l from-[#F3E3CA] via-[#F3E3CA]/95 to-[#F3E3CA]/40 backdrop-blur-md shadow-[0_2px_25px_-10px_rgba(0,0,0,0.03)] border-b border-[#E3D3BA]/10'
          : 'bg-gradient-to-l from-[#F3E3CA] via-[#F3E3CA]/90 to-transparent'
      }`}
    >
      <div className={`w-full px-6 md:px-12 lg:px-16 flex items-center justify-between relative transition-all duration-500 ${
        isScrolled ? 'min-h-[72px] py-4' : 'min-h-[85px] md:min-h-[120px] py-4'
      }`}>

        {/* 1. СЛЕВА: Гамбургер */}
        <div className="flex items-center shrink-0 z-10">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="rounded-full border border-white/60 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-white hover:bg-white/10"
            style={{ width: '52px', height: '52px' }}
          >
            <div className="flex flex-col gap-[6px] items-center justify-center">
              <span className="block h-[1.5px] w-6 bg-[#1A1815] transition-all duration-300" />
              <span className="block h-[1.5px] w-6 bg-[#1A1815] transition-all duration-300" />
              <span className="block h-[1.5px] w-6 bg-[#1A1815] transition-all duration-300" />
            </div>
          </motion.button>
        </div>

        {/* 2. ЦЕНТР: Nav (Только для десктопа) */}
        <nav className="hidden md:flex items-center gap-8 md:gap-10 lg:gap-12 absolute left-1/2 -translate-x-1/2 z-10 w-max justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative text-[14px] md:text-[15px] lg:text-[16px] uppercase tracking-[0.22em] lg:tracking-[0.28em] transition-colors duration-300 font-bold py-2 whitespace-nowrap"
            >
              <span className={`transition-colors duration-300 ${
                activeNav === item.id ? 'text-[#A07322]' : 'text-[#1A1815] hover:text-[#A07322]'
              }`}>
                {t(item.key)}
              </span>
              {activeNav === item.id && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C4973A]"
                />
              )}
            </button>
          ))}
        </nav>

        {/* 3. СПРАВА: Языки + Лого (Отступ pt-2.5 применяется ТОЛЬКО на мобилках и убирается при скролле) */}
        <div className={`flex items-center gap-4 sm:gap-6 md:gap-12 lg:gap-16 shrink-0 z-10 transition-all duration-500 ${
          isScrolled ? 'pt-0' : 'pt-2.5 md:pt-0'
        }`}>
          
          {/* Языки */}
          <div className="flex items-center text-[10px] md:text-[12px] font-bold tracking-widest sm:tracking-medium">
            {languages.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                <button
                  onClick={() => handleLang(lang.code)}
                  className={`px-1 py-0.5 uppercase transition-colors duration-300 ${
                    activeLang === lang.code
                      ? 'text-[#A07322]'
                      : 'text-[#1A1815] hover:text-[#A07322]'
                  }`}
                >
                  {lang.label}
                </button>
                {i < languages.length - 1 && (
                  <span className="text-[#C8BBA8] opacity-60 text-[10px] mx-0.5 sm:mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>

          {/* Лого */}
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center shrink-0"
          >
            <img
              src="https://i.postimg.cc/hPdRn1hs/zivarlogo1.jpg"
              alt="Zivar Logo"
              className={`w-auto object-contain transition-all duration-500 ease-in-out ${
                isScrolled
                  ? 'md:opacity-0 md:h-0 md:overflow-hidden h-[75px] opacity-100'
                  : 'opacity-100 h-[95px] sm:h-[105px] md:h-[118px] lg:h-[128px]'
              }`}
            />
          </button>
        </div>

      </div>
    </motion.header>

    {/* БОКОВАЯ ПАНЕЛЬ СЛЕВА */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-md bg-[#F5F0E8] shadow-2xl"
          >
            <div className="flex justify-start p-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-[#E8E0D5] flex items-center justify-center hover:border-[#C4973A] transition-colors group"
              >
                <X size={18} className="text-[#2C2820] group-hover:text-[#C4973A] transition-colors" />
              </button>
            </div>

            <nav className="px-10 pt-4">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                  onClick={() => {
                    scrollTo(item.id);
                    setIsMobileMenuOpen(false);
                  }}
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