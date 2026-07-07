import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Minus, Plus, Calendar, MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
import { useFetch, usePost } from '../hooks/useApi';

// ============ ЛОГО КОМПОНЕНТ ============
function ZivarLogo({ size = 'medium', className = '' }) {
  const sizes = {
    small: { width: 40, height: 32 },
    medium: { width: 64, height: 52 },
    large: { width: 88, height: 72 }
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
      <span className="text-[6px] tracking-[0.4em] text-[#8A7E6E] uppercase font-medium mt-0.5">Z I V A R</span>
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-hidden"
          onClick={onClose}
        >
          <div
            className="flex items-center justify-center gap-2 md:gap-4 w-full max-w-[calc(100vw-1.5rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {total > 1 && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={prevSlide}
                className="hidden sm:flex shrink-0 w-9 h-9 md:w-10 md:h-10 bg-white/70 backdrop-blur-sm text-[#2C2820] rounded-full items-center justify-center shadow-lg hover:bg-white/90 transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F5F0E8] rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl"
            >
              <div className="relative h-72 md:h-[28rem]">
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

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                >
                  <X size={16} />
                </button>

                {total > 1 && (
                  <div className="sm:hidden">
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors backdrop-blur-sm"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors backdrop-blur-sm"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {total > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 md:p-10 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-[10px] text-[#C4973A] uppercase tracking-[0.2em]">
                        {experience.title}
                      </span>
                      <span className="text-[#D5C9B8]">|</span>
                      <span className="text-[10px] text-[#8A7E6E]">
                        {currentIndex + 1} / {total}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#2C2820] mb-3">
                      {currentItem.title}
                    </h2>
                    <p className="text-[#8A7E6E] text-sm leading-relaxed max-w-sm mx-auto">
                      {currentItem.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {total > 1 && (
                  <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevSlide}
                      className="flex items-center gap-2 px-4 py-2 border border-[#D5C9B8] rounded-full text-[#8A7E6E] text-[10px] uppercase tracking-[0.15em] hover:border-[#C4973A] hover:text-[#C4973A] transition-colors"
                    >
                      <ArrowRight size={12} className="rotate-180" />
                      {t('common.prev') || 'Back'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextSlide}
                      className="flex items-center gap-2 px-4 py-2 bg-[#C4973A] text-white rounded-full text-[10px] uppercase tracking-[0.15em] hover:bg-[#B0862E] transition-colors"
                    >
                      {t('common.next') || 'Next'}
                      <ArrowRight size={12} />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {total > 1 && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={nextSlide}
                className="hidden sm:flex shrink-0 w-9 h-9 md:w-10 md:h-10 bg-white/70 backdrop-blur-sm text-[#2C2820] rounded-full items-center justify-center shadow-lg hover:bg-white/90 transition-colors"
              >
                <ArrowRight size={16} />
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
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[#C4973A] text-xs md:text-sm uppercase tracking-[0.2em] font-serif">ZIVAR Gallery</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60 text-[10px]">
                {lightboxIndex !== null ? lightboxIndex + 1 : total} <span className="text-white/30">/</span> {total}
              </span>
            </div>
            <button
              onClick={() => (lightboxIndex !== null ? setLightboxIndex(null) : onClose())}
              className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {lightboxIndex === null && (
            <div className="flex-1 overflow-y-auto px-3 md:px-6 pb-6 scrollbar-thin scrollbar-thumb-[#C4973A]/30 scrollbar-track-transparent">
              <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 pt-2">
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
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {lightboxIndex !== null && (
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-12 md:px-20">
              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}
                onClick={goPrev} className="absolute left-3 md:left-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all">
                <ArrowRight size={20} className="rotate-180" />
              </motion.button>

              <AnimatePresence custom={direction} mode="wait">
                <motion.div key={lightboxIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[85vw] max-h-[70vh]">
                  <img src={current.image} alt={current.alt} className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl" draggable={false} />
                </motion.div>
              </AnimatePresence>

              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}
                onClick={goNext} className="absolute right-3 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all">
                <ArrowRight size={20} />
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
    <main className="overflow-x-hidden">
      <section id="home" className="relative h-[390px] md:h-[440px] lg:h-[490px] overflow-hidden bg-[#F3E3CAFF]">
        <div className="absolute right-0 top-0 w-[50%] h-full hidden lg:block overflow-hidden">
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

        <div className="relative z-20 max-w-[1100px] mx-auto px-4 lg:px-8 h-full flex items-center">
          <div className="max-w-sm pt-16">
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-[9px] uppercase tracking-[0.25em] mb-4 select-none"
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

            <h1 className="text-4xl md:text-5xl lg:text-[68px] font-serif leading-[0.88] mb-4 text-[#2C2820]">
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block cursor-default origin-left"
                  initial={{ opacity: 0, y: "100%", rotate: 2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ 
                    x: 10,
                    textShadow: "0 4px 20px rgba(196, 151, 58, 0.25), 0 0 60px rgba(196, 151, 58, 0.1)",
                    color: "#C4973A",
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  {t('hero.title1')}
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block cursor-default origin-left"
                  initial={{ opacity: 0, y: "100%", rotate: 2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ 
                    x: 10,
                    textShadow: "0 4px 20px rgba(196, 151, 58, 0.25), 0 0 60px rgba(196, 151, 58, 0.1)",
                    color: "#C4973A",
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  {t('hero.title2')}
                </motion.span>
              </span>
            </h1>

            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }} 
              animate={{ scaleX: 1, opacity: 1 }} 
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              className="w-10 h-px bg-[#C4973A] mb-4 origin-left relative overflow-hidden" 
            >
              <motion.div
                className="absolute inset-0 bg-white/80 pointer-events-none"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 1.5, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
              className="text-[#8A7E6E] text-xs leading-relaxed max-w-xs transition-colors duration-300 hover:text-[#2C2820]"
            >
              {t('hero.description')}
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute right-4 top-[80%] hidden lg:flex flex-col items-center gap-2 z-20 cursor-pointer group"
        >
          <motion.span 
            className="text-[#8A7E6E]/60 text-[8px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[#C4973A]" 
            style={{ writingMode: 'vertical-rl' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            {t('common.scrollToDiscover')}
          </motion.span>
          <div className="w-px h-10 bg-[#C4973A]/30 origin-top relative overflow-hidden">
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

     <section id="reservation" className="px-3 md:px-4 lg:px-6 pt-4 pb-4 -mt-1 relative z-30">
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
    className="max-w-[1200px] mx-auto bg-white rounded-sm shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] border border-[#D5C9B8] overflow-hidden transition-shadow duration-500"
  >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      <div className="lg:col-span-3 xl:col-span-2 relative w-full h-full min-h-[100px] lg:min-h-full overflow-hidden lg:border-r border-[#D5C9B8]/40">
        <motion.img 
          src="https://i.postimg.cc/hPdRn1hs/zivarlogo1.jpg" 
          alt="Zivar Logo" 
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="lg:col-span-10 p-4 md:p-5">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center mb-4"
        >
          <h2 className="text-lg md:text-xl font-serif text-[#2C2820]">{t('reservation.title')}</h2>
        </motion.div>

        {reservationHook.success && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            className="mb-3 p-2.5 bg-green-50/80 border border-green-200 text-green-800 rounded flex items-center gap-2 text-xs"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Check size={14} />
            </motion.div>
            {t('reservation.success')}
          </motion.div>
        )}
        {reservationHook.error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 p-2.5 bg-red-50 text-red-800 rounded text-xs"
          >
            {reservationHook.error}
          </motion.div>
        )}

        <form onSubmit={handleReserve} className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 group"
          >
            <label className="block text-[8px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.date')}</label>
            <div className="relative">
              <input 
                type="date" 
                name="date"
                value={resForm.date} 
                onChange={e => setResForm({...resForm, date: e.target.value})}
                className="w-full h-[32px] px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-xs transition-all duration-300 hover:border-[#C8BBA8]" 
                required 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 group"
          >
            <label className="block text-[8px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.time')}</label>
            <input 
              type="text" 
              name="time"
              maxLength={5}
              placeholder="19:30"
              value={resForm.time || ''} 
              onChange={e => {
                let val = e.target.value.replace(/\D/g, ''); // Удаляем всё, кроме цифр
                
                // Ограничиваем первую цифру часов (0, 1 или 2)
                if (val.length >= 1 && parseInt(val[0]) > 2) val = '';
                // Ограничиваем часы (не больше 23)
                if (val.length >= 2 && val[0] === '2' && parseInt(val[1]) > 3) val = val[0];
                // Ограничиваем первую цифру минут (не больше 5)
                if (val.length >= 3 && parseInt(val[2]) > 5) val = val.slice(0, 2);

                // Автоматически вставляем двоеточие
                if (val.length > 2) {
                  val = `${val.slice(0, 2)}:${val.slice(2, 4)}`;
                }

                setResForm({...resForm, time: val});
              }}
              onBlur={e => {
                // Если пользователь не до конца ввел данные, автодополняем при выходе из поля
                let val = e.target.value;
                if (val.length > 0 && val.length < 5) {
                  if (!val.includes(':') && val.length === 2) {
                    val = `${val}:00`;
                  } else {
                    const parts = val.split(':');
                    const hours = (parts[0] || '00').padStart(2, '0');
                    const minutes = (parts[1] || '00').padEnd(2, '0');
                    val = `${hours}:${minutes}`;
                  }
                  setResForm({...resForm, time: val});
                }
              }}
              className="w-full h-[32px] px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-xs transition-all duration-300 hover:border-[#C8BBA8]" 
              required 
              pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 group"
          >
            <label className="block text-[8px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.guests')}</label>
            <div className="flex items-center h-[32px] border border-[#E0D8CC] rounded-sm bg-[#FAF8F5] overflow-hidden hover:border-[#C8BBA8] transition-colors duration-300">
              <motion.button 
                type="button" 
                whileTap={{ scale: 0.8, backgroundColor: "rgba(196,151,58,0.1)"}}
                onClick={() => setResForm(p => ({...p, guests: Math.max(1, p.guests - 1)}))} 
                className="px-2.5 h-full flex items-center text-[#8A7E6E] hover:text-[#C4973A] transition-colors"
              >
                <Minus size={11} />
              </motion.button>
              <motion.span 
                key={resForm.guests}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="flex-1 text-center text-xs font-medium text-[#2C2820]"
              >
                {resForm.guests}
              </motion.span>
              <motion.button 
                type="button" 
                whileTap={{ scale: 0.8, backgroundColor: "rgba(196,151,58,0.1)"}}
                onClick={() => setResForm(p => ({...p, guests: Math.min(20, p.guests + 1)}))} 
                className="px-2.5 h-full flex items-center text-[#8A7E6E] hover:text-[#C4973A] transition-colors"
              >
                <Plus size={11} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 group"
          >
            <label className="block text-[8px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.name')}</label>
            <input 
              type="text" 
              name="name"
              value={resForm.name} 
              onChange={e => setResForm({...resForm, name: e.target.value})}
              placeholder={t('reservation.placeholderName')} 
              className="w-full h-[32px] px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-xs placeholder:text-[#C8BBA8] transition-all duration-300 hover:border-[#C8BBA8]" 
              required 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 group"
          >
            <label className="block text-[8px] uppercase tracking-[0.18em] text-[#8A7E6E] group-hover:text-[#C4973A] transition-colors duration-300">{t('reservation.phone')}</label>
            <input 
              type="tel" 
              name="phone"
              value={resForm.phone} 
              onChange={e => setResForm({...resForm, phone: e.target.value})}
              placeholder={t('reservation.placeholderPhone')} 
              className="w-full h-[32px] px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E0D8CC] rounded-sm focus:outline-none focus:border-[#C4973A] focus:shadow-[0_0_0_4px_rgba(196,151,58,0.08)] focus:bg-white text-xs placeholder:text-[#C8BBA8] transition-all duration-300 hover:border-[#C8BBA8]" 
              required 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <label className="block text-[8px] select-none opacity-0">&nbsp;</label>
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
              className="relative overflow-hidden w-full h-[32px] bg-[#C4973A] text-white text-[9px] uppercase tracking-[0.18em] font-medium rounded-sm hover:bg-[#B0862E] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
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
                    className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {t('reservation.button')}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                      <ArrowRight size={10} />
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


{/* Experiences */}

      <section id="experiences" className="mt-8 md:mt-12 py-16 md:py-20 px-3 lg:px-6 bg-[#F3E3CAFF]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <motion.h2
              key={t('experiences.title')}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#2C2820] cursor-default select-none py-2 block tracking-normal"
            >
              {t('experiences.title').split('').map((char, i) => (
                <motion.span
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
              className="hidden md:flex items-center gap-2 text-[#C4973A] text-[9px] uppercase tracking-[0.15em] hover:gap-3 transition-all"
            >
              {t('experiences.viewAll')} <ArrowRight size={10} />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
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
                  className="group relative w-full h-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[22rem] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-500"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                    <h3 className="text-base md:text-xl lg:text-2xl font-serif text-white mb-2">
                      {t(titleKey) !== titleKey ? t(titleKey) : exp.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4A84B] text-[8px] md:text-[10px] uppercase tracking-[0.15em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        {t(ctaKey) !== ctaKey ? t(ctaKey) : exp.subtitle}
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300"
                      >
                        <ArrowRight size={12} className="text-white" />
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


{/* Storyyy */}

      <section id="story" className="py-12 px-3 lg:px-5 bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C4973A] text-[9px] uppercase tracking-[0.25em] mb-2">{t('story.subtitle')}</p>
            <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-tight text-[#2C2820]">{t('story.title')}</h2>
            <p className="text-[#8A7E6E] text-xs leading-relaxed mb-5 max-w-sm">{t('story.description')}</p>
            <a href="#" className="inline-flex items-center gap-2 text-[#C4973A] text-[9px] uppercase tracking-[0.15em] hover:gap-3 transition-all group">
              {t('story.cta')} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[340px] rounded-xl overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant interior" 
              className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      <section id="gallery" className="py-16 md:py-20 px-3 lg:px-6 bg-[#F3E3CAFF]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-1">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl lg:text-4xl font-serif mb-3 text-[#2C2820]">
                {t('gallery.title')}
              </motion.h2>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-sm md:text-base text-[#8A7E6E] mb-5 leading-relaxed">
                {t('gallery.subtitle')}
              </motion.p>
              <motion.button initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ gap: '0.75rem' }} onClick={() => { setGalleryStart(0); setGalleryOpen(true); }}
                className="inline-flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.18em] font-medium transition-all group cursor-pointer">
                {t('gallery.viewFull')}
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {gallery?.slice(0, 4).map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => { setGalleryStart(index); setGalleryOpen(true); }}
                  className="aspect-[4/5] md:aspect-square overflow-hidden rounded-xl group cursor-pointer relative shadow-md hover:shadow-xl transition-shadow duration-500">
                  <img src={item.image} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FullscreenGallery isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} gallery={gallery} startIndex={galleryStart} />

      <section id="contact" className="py-12 px-3 lg:px-5 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-serif mb-2 text-[#2C2820]">{t('contact.title')}</h2>
              <p className="text-[#8A7E6E] mb-5 text-xs">{t('contact.subtitle')}</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-[#2C2820]">
                  <MapPin size={14} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.address')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#2C2820]">
                  <Phone size={14} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.phone')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#2C2820]">
                  <Mail size={14} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.email')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#2C2820]">
                  <Clock size={14} className="text-[#8A7E6E] mt-0.5 shrink-0" />
                  <span>{t('contact.hours')}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[240px] bg-[#E8E0D5] rounded-xl overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4!2d49.8671!3d40.4093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzMzLjUiTiA0OcKwNTInMDEuNiJF!5e0!3m2!1sen!2s!4v1"
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
                  allowFullScreen loading="lazy" className="absolute inset-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-7 h-7 bg-[#C4973A] rounded-full flex items-center justify-center shadow-lg">
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif mb-1 text-[#2C2820]">{t('contact.instagram')}</h3>
              <p className="text-xs text-[#8A7E6E] mb-3">{t('contact.at')}</p>
              <a href="https://instagram.com/zivar.restaurant" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C4973A] text-[9px] uppercase tracking-[0.15em] mb-4 hover:gap-3 transition-all">
                {t('contact.followUs')} <ArrowRight size={10} />
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

      <section className="py-10 px-3 lg:px-5 bg-[#E8E0D5]/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            <div>
              <h3 className="text-xl font-serif mb-2 text-[#2C2820]">{t('newsletter.title')}</h3>
              <p className="text-[#8A7E6E] text-xs">{t('newsletter.description')}</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-2.5 bg-white border border-[#E8E0D5] rounded-l-lg focus:outline-none focus:border-[#C4973A] text-xs" required />
              <button type="submit" 
                className="px-5 py-2.5 bg-[#C4973A] text-white text-[9px] uppercase tracking-[0.15em] font-medium rounded-r-lg hover:bg-[#B0862E] transition-colors">
                {newsletterHook.success ? <Check size={12} /> : t('newsletter.button')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}