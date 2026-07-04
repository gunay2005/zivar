import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Minus, Plus, Calendar, MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
import { useFetch, usePost } from '../hooks/useApi';

// ============ ЛОГО КОМПОНЕНТ ============
function ZivarLogo({ size = 'medium', className = '' }) {
  const sizes = {
    small: { width: 50, height: 40 },
    medium: { width: 80, height: 65 },
    large: { width: 110, height: 90 }
  };
  const s = sizes[size] || sizes.medium;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={s.width} height={s.height} viewBox="0 0 80 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="16" r="7" fill="#E8A838" />
        <path d="M12 28 L28 10 L44 28" stroke="#2C2820" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 33 L48 33 L23 48 L53 48" stroke="#2C2820" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="42" y="6" width="11" height="2.5" fill="#E85A3C" rx="1" transform="rotate(15 42 6)"/>
        <rect x="52" y="13" width="7" height="2" fill="#4A9B8E" rx="1" transform="rotate(-10 52 13)"/>
        <rect x="47" y="20" width="9" height="2" fill="#E8A838" rx="1" transform="rotate(5 47 20)"/>
        <circle cx="40" cy="40" r="2" fill="#E85A3C" />
        <path d="M58 23 L66 18" stroke="#4A9B8E" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 28 L68 26" stroke="#E8A838" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-[8px] tracking-[0.4em] text-[#8A7E6E] uppercase font-medium mt-0.5">Z I V A R</span>
    </div>
  );
}

// ============ МОДАЛКА С КАРУСЕЛЬЮ (6 карточек) ============
function ExperienceModal({ isOpen, onClose, experience }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !experience) return null;

  const items = experience.items || [];
  const total = items.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  const currentItem = items[currentIndex] || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* Ряд: стрелка слева — карточка — стрелка справа, всё центрировано и не вылезает за экран */}
          <div
            className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-[calc(100vw-2rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Стрелка НАЗАД — вне карточки */}
            {total > 1 && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={prevSlide}
                className="hidden sm:flex shrink-0 w-11 h-11 md:w-12 md:h-12 bg-white/70 backdrop-blur-sm text-[#2C2820] rounded-full items-center justify-center shadow-lg hover:bg-white/90 transition-colors"
              >
                <ArrowRight size={20} className="rotate-180" />
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F5F0E8] rounded-2xl w-full max-w-[580px] max-h-[92vh] overflow-y-auto overflow-x-hidden shadow-2xl"
            >
              {/* Картинка */}
              <div className="relative h-96 md:h-[36rem]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={currentItem.image}
                    alt={currentItem.title}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </AnimatePresence>

                {/* Кнопка закрыть */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                >
                  <X size={18} />
                </button>

                {/* Мобильные стрелки поверх картинки (когда боковые скрыты) */}
                {total > 1 && (
                  <div className="sm:hidden">
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors backdrop-blur-sm"
                    >
                      <ArrowRight size={16} className="rotate-180" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors backdrop-blur-sm"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Индикатор слайдов */}
                {total > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Текст под картинкой */}
              <div className="p-8 md:p-12 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xs text-[#C4973A] uppercase tracking-[0.2em]">
                        {experience.title}
                      </span>
                      <span className="text-[#D5C9B8]">|</span>
                      <span className="text-xs text-[#8A7E6E]">
                        {currentIndex + 1} / {total}
                      </span>
                    </div>
                    <h2 className="text-3xl font-serif text-[#2C2820] mb-3">
                      {currentItem.title}
                    </h2>
                    <p className="text-[#8A7E6E] text-sm leading-relaxed max-w-sm mx-auto">
                      {currentItem.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Мобильные текстовые кнопки Back/Next (боковые скрыты на мобиле) */}
                {total > 1 && (
                  <div className="flex sm:hidden items-center justify-center gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevSlide}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#D5C9B8] rounded-full text-[#8A7E6E] text-[11px] uppercase tracking-[0.15em] hover:border-[#C4973A] hover:text-[#C4973A] transition-colors"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                      {t('common.prev') || 'Back'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextSlide}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#C4973A] text-white rounded-full text-[11px] uppercase tracking-[0.15em] hover:bg-[#B0862E] transition-colors"
                    >
                      {t('common.next') || 'Next'}
                      <ArrowRight size={14} />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Стрелка ВПЕРЁД — вне карточки */}
            {total > 1 && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={nextSlide}
                className="hidden sm:flex shrink-0 w-11 h-11 md:w-12 md:h-12 bg-white/70 backdrop-blur-sm text-[#2C2820] rounded-full items-center justify-center shadow-lg hover:bg-white/90 transition-colors"
              >
                <ArrowRight size={20} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}






// ============ ПОЛНОЭКРАННАЯ ГАЛЕРЕЯ (сетка 20 фото + лайтбокс) ============
function FullscreenGallery({ isOpen, onClose, gallery, startIndex = 0 }) {
  // null = показана сетка; число = открыт лайтбокс с этим индексом
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen) setLightboxIndex(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, lightboxIndex]);

  if (!isOpen || !gallery?.length) return null;

  const total = gallery.length;
  const goNext = () => { setDirection(1); setLightboxIndex((p) => (p === null ? 0 : (p + 1) % total)); };
  const goPrev = () => { setDirection(-1); setLightboxIndex((p) => (p === null ? 0 : (p - 1 + total) % total)); };

  const variants = {
    enter: (dir) => ({ opacity: 0, scale: 0.94, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, scale: 0.94, x: dir > 0 ? -60 : 60 }),
  };

  const current = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-[#0f0e0c] flex flex-col"
        >
          {/* Верхняя панель */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[#C4973A] text-sm md:text-base uppercase tracking-[0.2em] font-serif">ZIVAR Gallery</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60 text-xs">
                {lightboxIndex !== null ? lightboxIndex + 1 : total} <span className="text-white/30">/</span> {total}
              </span>
            </div>
            <button
              onClick={() => (lightboxIndex !== null ? setLightboxIndex(null) : onClose())}
              className="w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* ===== СЕТКА (по строкам и столбцам, все фото сразу) ===== */}
          {lightboxIndex === null && (
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 scrollbar-thin scrollbar-thumb-[#C4973A]/30 scrollbar-track-transparent">
              <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3 pt-2">
                {gallery.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setDirection(0); setLightboxIndex(i); }}
                    className="aspect-square overflow-hidden rounded-lg relative group"
                  >
                    <img src={item.image} alt={item.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" draggable={false} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ===== ЛАЙТБОКС (увеличенное фото + стрелки) ===== */}
          {lightboxIndex !== null && (
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-16 md:px-24">
              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}
                onClick={goPrev} className="absolute left-4 md:left-8 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all">
                <ArrowRight size={24} className="rotate-180" />
              </motion.button>

              <AnimatePresence custom={direction} mode="wait">
                <motion.div key={lightboxIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[85vw] max-h-[75vh]">
                  <img src={current.image} alt={current.alt} className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-2xl" draggable={false} />
                </motion.div>
              </AnimatePresence>

              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}
                onClick={goNext} className="absolute right-4 md:right-8 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all">
                <ArrowRight size={24} />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ ГЛАВНЫЙ КОМПОНЕНТ ============
export default function MainContent() {
  const { t } = useTranslation();
  const { data: experiences, loading, error } = useFetch('/experiences');
  const { data: gallery } = useFetch('/gallery');
  const { data: contact } = useFetch('/contact');
  const reservationHook = usePost('/reservations');
  const newsletterHook = usePost('/newsletter');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [resForm, setResForm] = useState({ date: '2026-06-24', time: '19:30', guests: 2, name: '', phone: '', occasion: '' });
  const [email, setEmail] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);

  const slugMap = {
    'seasonal-menu': 'seasonalMenu',
    'chefs-tasting': 'chefTasting',
    'desserts': 'desserts',
    'zero-waste': 'zeroWaste'
  };

  const openModal = (exp) => { setSelectedExp(exp); setModalOpen(true); };
  const handleReserve = async (e) => {
    e.preventDefault();
    
    const payload = {
      date: resForm.date,
      time: resForm.time,
      guests: Number(resForm.guests),
      name: resForm.name.trim(),
      phone: resForm.phone.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try { 
      await reservationHook.postData(payload); 
    }
    catch (err) { 
      console.error('Reservation error:', err); 
    }
  };
  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    try { await newsletterHook.postData({ email, subscribedAt: new Date().toISOString() }); setEmail(''); }
    catch (err) { console.error('Newsletter error:', err); }
  };

  if (loading) return <div className="pt-32 text-center text-[#8A7E6E]"><ZivarLogo size="medium" /></div>;
  if (error) return <div className="pt-32 text-center text-red-500"><p>Error: {error}</p></div>;

  return (
    <main>
                               {/* HERO — УВЕЛИЧЕНА ВЫСОТА: h-[520/580/640px], ОПУЩЕН КОНТЕНТ: pt-20 */}
<section id="home" className="relative h-[490px] md:h-[550px] lg:h-[610px] overflow-hidden bg-[#F3E3CAFF]">
  {/* Фоновая картинка тарелки с кинематографичным параллакс-эффектом при загрузке */}
  <div className="absolute right-0 top-0 w-[55%] h-full hidden lg:block overflow-hidden">
    <motion.img 
      initial={{ scale: 1.08, x: 20, filter: "blur(4px)" }}
      animate={{ scale: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200" 
      alt="Dish" 
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#F3E3CAFF] via-[#F3E3CAFF]/60 to-transparent" />
  </div>

  {/* ОПУЩЕН КОНТЕНТ: pt-20 (было pt-14) */}
  <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex items-center">
    <div className="max-w-xl pt-20">
      
      {/* CONTEMPORARY CUISINE — Мягкое появление букв + Роскошный золотой отлив (Шёлковый блеск) */}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="text-[11px] uppercase tracking-[0.25em] mb-6 select-none"
      >
        {t('hero.subtitle').split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10, color: "#C4973A" }}
            animate={{ 
              opacity: 1, 
              y: 0,
              color: ["#C4973A", "#DFBA6B", "#F3E3CA", "#DFBA6B", "#C4973A"]
            }}
            transition={{ 
              delay: 0.15 + i * 0.03,
              duration: 0.5,
              color: {
                delay: 1.2 + i * 0.04,
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.p>

      {/* Modern Minimal — Появление из невидимой маски (снизу-вверх) + Премиальный Hover Glow */}
      <h1 className="text-5xl md:text-6xl lg:text-[88px] font-serif leading-[0.88] mb-6 text-[#2C2820]">
        {/* Первая строчка заголовка */}
        <span className="block overflow-hidden pb-2">
          <motion.span
            className="block cursor-default origin-left"
            initial={{ opacity: 0, y: "100%", rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ 
              x: 12,
              textShadow: "0 4px 20px rgba(196, 151, 58, 0.25), 0 0 60px rgba(196, 151, 58, 0.1)",
              color: "#C4973A",
              transition: { duration: 0.4, ease: "easeOut" }
            }}
          >
            {t('hero.title1')}
          </motion.span>
        </span>

        {/* Вторая строчка заголовка */}
        <span className="block overflow-hidden pb-2">
          <motion.span
            className="block cursor-default origin-left"
            initial={{ opacity: 0, y: "100%", rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ 
              x: 12,
              textShadow: "0 4px 20px rgba(196, 151, 58, 0.25), 0 0 60px rgba(196, 151, 58, 0.1)",
              color: "#C4973A",
              transition: { duration: 0.4, ease: "easeOut" }
            }}
          >
            {t('hero.title2')}
          </motion.span>
        </span>
      </h1>

      {/* Линия — Плавное раскрытие из центра влево/вправо + деликатный блик */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }} 
        animate={{ scaleX: 1, opacity: 1 }} 
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        className="w-12 h-px bg-[#C4973A] mb-6 origin-left relative overflow-hidden" 
      >
        <motion.div
          className="absolute inset-0 bg-white/80 pointer-events-none"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 1.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Описание — Элегантное проявление с легким подъемом */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
        className="text-[#8A7E6E] text-sm leading-relaxed max-w-sm transition-colors duration-300 hover:text-[#2C2820]"
      >
        {t('hero.description')}
      </motion.p>
    </div>
  </div>

  {/* Scroll to Discover — Стал интерактивным и деликатно пульсирует */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 1.4, duration: 0.8 }}
    className="absolute right-5 top-[82%] hidden lg:flex flex-col items-center gap-3 z-20 cursor-pointer group"
  >
    <motion.span 
      className="text-[#8A7E6E]/60 text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[#C4973A]" 
      style={{ writingMode: 'vertical-rl' }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      {t('common.scrollToDiscover')}
    </motion.span>
    <div className="w-px h-12 bg-[#C4973A]/30 origin-top relative overflow-hidden">
      <motion.div 
        animate={{ 
          y: ["-100%", "100%"],
          opacity: [0, 1, 0]
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 2, 
          ease: "easeInOut" 
        }} 
        className="absolute inset-x-0 top-0 h-1/2 bg-[#C4973A]" 
      />
    </div>
  </motion.div>
</section>
{/* RESERVATION — шире, компактнее по высоте, поднято ближе к hero */}
<section id="reservation" className="px-3 md:px-6 lg:px-8 pt-6 pb-6 -mt-2 relative z-30">
  <motion.div 
    initial={{ opacity: 0, y: 60, scale: 0.99 }} 
    whileInView={{ opacity: 1, y: 0, scale: 1 }} 
    viewport={{ once: true, margin: "-40px" }} 
    transition={{ 
      duration: 0.9, 
      ease: [0.16, 1, 0.3, 1],
      type: "spring",
      stiffness: 70,
      damping: 18 
    }}
    whileHover={{ 
      boxShadow: "0 20px 50px -12px rgba(196, 151, 58, 0.16)",
      y: -2,
      transition: { duration: 0.4, ease: "easeOut" }
    }}
    className="max-w-[1520px] mx-auto bg-white rounded-sm shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] border border-[#D5C9B8] overflow-hidden transition-shadow duration-500"
  >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* Левая колонка с лого */}
      <div className="lg:col-span-3 xl:col-span-2 relative w-full h-full min-h-[130px] lg:min-h-full overflow-hidden lg:border-r border-[#D5C9B8]/40">
        <motion.img 
          src="https://i.postimg.cc/hPdRn1hs/zivarlogo1.jpg" 
          alt="Zivar Logo" 
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Правая колонка с формой */}
      <div className="lg:col-span-10 p-5 md:p-6">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center mb-5"
        >
          <h2 className="text-xl md:text-2xl font-serif text-[#2C2820]">{t('reservation.title')}</h2>
        </motion.div>

        {reservationHook.success && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            className="mb-4 p-3 bg-green-50/80 border border-green-200 text-green-800 rounded flex items-center gap-3 text-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Check size={16} />
            </motion.div>
            {t('reservation.success')}
          </motion.div>
        )}
        {reservationHook.error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-800 rounded text-sm"
          >
            {reservationHook.error}
          </motion.div>
        )}

        {/* === ФОРМА — CSS Grid 2 строки × 3 колонки === */}
        <form onSubmit={handleReserve} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-end">
          
          {/* ROW 1: DATE */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 group"
          >
            <label className="block text-[9px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.date')}</label>
            <div className="relative">
              <input 
                type="date" 
                name="date"
                value={resForm.date} 
                onChange={e => setResForm({...resForm, date: e.target.value})}
                className="w-full h-[38px] px-3 py-2 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-sm transition-all duration-300 hover:border-[#C8BBA8]" 
                required 
              />
            </div>
          </motion.div>

          {/* ROW 1: TIME */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 group"
          >
            <label className="block text-[9px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.time')}</label>
            <select 
              name="time"
              value={resForm.time} 
              onChange={e => setResForm({...resForm, time: e.target.value})}
              className="w-full h-[38px] px-3 py-2 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-sm appearance-none transition-all duration-300 hover:border-[#C8BBA8]"
            >
              {['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </motion.div>

          {/* ROW 1: GUESTS */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 group"
          >
            <label className="block text-[9px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.guests')}</label>
            <div className="flex items-center h-[38px] border border-[#E0D8CC] rounded-sm bg-[#FAF8F5] overflow-hidden hover:border-[#C8BBA8] transition-colors duration-300">
              <motion.button 
                type="button" 
                whileTap={{ scale: 0.8, backgroundColor: "rgba(196,151,58,0.1)" }}
                onClick={() => setResForm(p => ({...p, guests: Math.max(1, p.guests - 1)}))} 
                className="px-3 h-full flex items-center text-[#8A7E6E] hover:text-[#C4973A] transition-colors"
              >
                <Minus size={13} />
              </motion.button>
              <motion.span 
                key={resForm.guests}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="flex-1 text-center text-sm font-medium text-[#2C2820]"
              >
                {resForm.guests}
              </motion.span>
              <motion.button 
                type="button" 
                whileTap={{ scale: 0.8, backgroundColor: "rgba(196,151,58,0.1)" }}
                onClick={() => setResForm(p => ({...p, guests: Math.min(20, p.guests + 1)}))} 
                className="px-3 h-full flex items-center text-[#8A7E6E] hover:text-[#C4973A] transition-colors"
              >
                <Plus size={13} />
              </motion.button>
            </div>
          </motion.div>

          {/* ROW 2: NAME */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 group"
          >
            <label className="block text-[9px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.name')}</label>
            <input 
              type="text" 
              name="name"
              value={resForm.name} 
              onChange={e => setResForm({...resForm, name: e.target.value})}
              placeholder={t('reservation.placeholderName')} 
              className="w-full h-[38px] px-3 py-2 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-sm placeholder:text-[#C8BBA8] transition-all duration-300 hover:border-[#C8BBA8]" 
              required 
            />
          </motion.div>

          {/* ROW 2: PHONE */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 group"
          >
            <label className="block text-[9px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.phone')}</label>
            <input 
              type="tel" 
              name="phone"
              value={resForm.phone} 
              onChange={e => setResForm({...resForm, phone: e.target.value})}
              placeholder={t('reservation.placeholderPhone')} 
              className="w-full h-[38px] px-3 py-2 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-sm placeholder:text-[#C8BBA8] transition-all duration-300 hover:border-[#C8BBA8]" 
              required 
            />
          </motion.div>

          {/* ROW 2: BUTTON */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5"
          >
            <label className="block text-[9px] select-none opacity-0">&nbsp;</label>
            <motion.button 
              type="submit" 
              disabled={reservationHook.loading}
              whileHover={{ 
                scale: 1.01,
                y: -1,
                boxShadow: "0 8px 24px -6px rgba(196, 151, 58, 0.3)"
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative overflow-hidden w-full h-[38px] bg-[#C4973A] text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-sm hover:bg-[#B0862E] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-white/20 pointer-events-none"
                initial={{ x: "-100%", skewX: -20 }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-white/10 pointer-events-none"
                initial={{ x: "-100%", skewX: -20 }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
              />
              <span className="relative z-10 w-full h-full flex items-center justify-center gap-2">
                {reservationHook.loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {t('reservation.button')}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                      <ArrowRight size={12} />
                    </motion.span>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

        </form>
      </div>
    </div>
  </motion.div>
</section>

      {/* EXPERIENCE CARDS — увеличена секция, карточки одинаковой высоты на мобиле через aspect-ratio */}
      <section id="experiences" className="mt-10 md:mt-16  py-20 md:py-28 px-4 lg:px-8 bg-[#F3E3CAFF]">
        <div className="max-w-[1520px] mx-auto">
          <div className="flex justify-between items-end mb-12">
   <motion.h2
  // key={t('experiences.title')} заставляет анимацию полностью перезапускаться при смене языка.
  // Это уберет баг, когда буквы застревали в памяти и удалялись.
  key={t('experiences.title')}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2C2820] cursor-default select-none py-2 block tracking-normal"
>
  {t('experiences.title').split('').map((char, i) => (
    <motion.span
      // Уникальный ключ для каждой буквы на конкретном языке
      key={`${t('experiences.title')}-${i}`}
      className="inline-block will-change-transform"
      variants={{
        hidden: { 
          opacity: 0, 
          x: -6, 
          color: '#2C2820' 
        },
        visible: {
          opacity: 1,
          x: 0,
          color: ['#2C2820', '#C4973A', '#DFBA6B', '#C4973A', '#2C2820'], 
          transition: {
            x: { duration: 0.4, ease: "easeOut", delay: i * 0.02 },
            opacity: { duration: 0.4, ease: "easeOut", delay: i * 0.02 },
            color: {
              duration: 3.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1, 
            }
          }
        }
      }}
      whileHover={{
        scale: 1.15,
        y: -4,
        textShadow: '0 6px 16px rgba(196,151,58,0.3)',
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ))}
</motion.h2>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.15em] hover:gap-3 transition-all"
            >
              {t('experiences.viewAll')} <ArrowRight size={12} />
            </a>
          </div>

          {/* auto-rows-fr гарантирует, что все карточки в ряду ОДИНАКОВОЙ высоты,
              независимо от пропорций исходных картинок */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-fr">
            {experiences?.map((exp, index) => {
              const type = slugMap[exp.slug];
              if (!type) return null;
              const titleKey = `experiences.${type}.title`;
              const ctaKey = `experiences.${type}.cta`;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => openModal(exp)}
                  className="group relative w-full h-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[28rem] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-500"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
                    <h3 className="text-lg md:text-2xl lg:text-3xl font-serif text-white mb-2">
                      {t(titleKey) !== titleKey ? t(titleKey) : exp.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4A84B] text-[9px] md:text-[11px] uppercase tracking-[0.15em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        {t(ctaKey) !== ctaKey ? t(ctaKey) : exp.subtitle}
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300"
                      >
                        <ArrowRight size={14} className="text-white" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ExperienceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        experience={selectedExp}
      />

      {/* OUR STORY */}
      <section id="story" className="py-16 px-4 lg:px-6 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C4973A] text-[10px] uppercase tracking-[0.25em] mb-3">{t('story.subtitle')}</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-5 leading-tight text-[#2C2820]">{t('story.title')}</h2>
            <p className="text-[#8A7E6E] text-sm leading-relaxed mb-6 max-w-md">{t('story.description')}</p>
            <a href="#" className="inline-flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.15em] hover:gap-3 transition-all group">
              {t('story.cta')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[430px] rounded-xl overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant interior" 
              className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* GALLERY — опущена, чуть крупнее, 4 превью + полноэкранная галерея */}
      <section id="gallery" className="py-20 md:py-28 px-4 lg:px-8 bg-[#F3E3CAFF]">
        <div className="max-w-[1520px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Левая колонка */}
            <div className="lg:col-span-1">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 text-[#2C2820]">
                {t('gallery.title')}
              </motion.h2>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base md:text-lg text-[#8A7E6E] mb-6 leading-relaxed">
                {t('gallery.subtitle')}
              </motion.p>
              <motion.button initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ gap: '0.75rem' }} onClick={() => { setGalleryStart(0); setGalleryOpen(true); }}
                className="inline-flex items-center gap-2 text-[#C4973A] text-[11px] uppercase tracking-[0.18em] font-medium transition-all group cursor-pointer">
                {t('gallery.viewFull')}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Правая колонка — 4 превью */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {gallery?.slice(0, 4).map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => { setGalleryStart(index); setGalleryOpen(true); }}
                  className="aspect-[4/5] md:aspect-square overflow-hidden rounded-xl group cursor-pointer relative shadow-md hover:shadow-xl transition-shadow duration-500">
                  <img src={item.image} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Полноэкранная галерея (все 20 фото) */}
      <FullscreenGallery isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} gallery={gallery} startIndex={galleryStart} />

      {/* CONTACT */}
      <section id="contact" className="py-16 px-4 lg:px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-serif mb-2 text-[#2C2820]">{t('contact.title')}</h2>
              <p className="text-[#8A7E6E] mb-6 text-sm">{t('contact.subtitle')}</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-[#2C2820]">
                  <MapPin size={16} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.address')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-[#2C2820]">
                  <Phone size={16} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.phone')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-[#2C2820]">
                  <Mail size={16} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.email')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-[#2C2820]">
                  <Clock size={16} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.hours')}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] bg-[#E8E0D5] rounded-xl overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4!2d49.8671!3d40.4093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzMzLjUiTiA0OcKwNTInMDEuNiJF!5e0!3m2!1sen!2s!4v1"
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
                  allowFullScreen loading="lazy" className="absolute inset-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-[#C4973A] rounded-full flex items-center justify-center shadow-lg">
                    <MapPin size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-xl font-serif mb-1 text-[#2C2820]">{t('contact.instagram')}</h3>
              <p className="text-sm text-[#8A7E6E] mb-3">{t('contact.at')}</p>
              <a href="https://instagram.com/zivar.restaurant" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.15em] mb-4 hover:gap-3 transition-all">
                {t('contact.followUs')} <ArrowRight size={12} />
              </a>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(i => (
                  <a key={i} href="https://instagram.com/zivar.restaurant" target="_blank" rel="noopener noreferrer" 
                    className="aspect-square rounded-lg overflow-hidden bg-[#E8E0D5]">
                    <img src={`https://images.unsplash.com/photo-${['1414235077428-338989a2e8c0','1517248135467-4c7edcad34c4','1559339352-11d035aa65de','1550966871-3ed3c47e2ce2','1551632436-cbf8dd35adfa','1510812431401-41d2bd2722f3'][i-1]}?w=200`}
                      alt={`Instagram ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-12 px-4 lg:px-6 bg-[#E8E0D5]/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-serif mb-2 text-[#2C2820]">{t('newsletter.title')}</h3>
              <p className="text-[#8A7E6E] text-sm">{t('newsletter.description')}</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-5 py-3 bg-white border border-[#E8E0D5] rounded-l-lg focus:outline-none focus:border-[#C4973A] text-sm" required />
              <button type="submit" 
                className="px-6 py-3 bg-[#C4973A] text-white text-[10px] uppercase tracking-[0.15em] font-medium rounded-r-lg hover:bg-[#B0862E] transition-colors">
                {newsletterHook.success ? <Check size={14} /> : t('newsletter.button')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}