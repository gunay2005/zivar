import { useState } from 'react';
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

// ============ МОДАЛКА ============
function ExperienceModal({ isOpen, onClose, type, experience }) {
  const { t } = useTranslation();
  if (!isOpen || !experience) return null;
  const modalData = t(`modal.${type}`, { returnObjects: true }) || {};
  const items = Array.isArray(modalData.items) ? modalData.items : [];
  const bottom = Array.isArray(modalData.bottom) ? modalData.bottom : [];
  const icons = ['🍽', '🌿', '📅', '🍷', '🕐'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#F5F0E8] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="relative h-64">
              <img src={experience.image} alt={modalData.title || experience.title} className="w-full h-full object-cover rounded-t-2xl" />
              <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-serif text-[#2C2820] mb-2">{modalData.title || experience.title}</h2>
              <p className="text-[#C4973A] text-sm mb-8">{modalData.description || experience.description}</p>
              <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 pb-3 border-b border-[#E8E0D5]">
                    <span className="text-xl">{icons[i] || '•'}</span>
                    <span className="text-sm text-[#2C2820]">{item}</span>
                  </div>
                ))}
              </div>
              {bottom.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8E0D5]">
                  {bottom.map((b, i) => (
                    <div key={i} className="text-center">
                      <div className="flex justify-center mb-2 text-[#8A7E6E] text-xl">{i === 0 ? '☀' : i === 1 ? '👔' : '👨‍🍳'}</div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1">{b.label}</p>
                      <p className="text-xs font-medium text-[#2C2820]">{b.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ ГЛАВНЫЙ КОМПОНЕНТ ============
export default function MainContent() {
  const { t } = useTranslation();
import { experiences, gallery, contact } from '../data';
  const reservationHook = usePost('/reservations');
  const newsletterHook = usePost('/newsletter');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);
  const [resForm, setResForm] = useState({ date: '2026-06-24', time: '19:30', guests: 2, name: '', phone: '', occasion: '' });
  const [email, setEmail] = useState('');

  const slugMap = {
    'seasonal-menu': 'seasonalMenu',
    'chefs-tasting': 'chefTasting',
    'desserts': 'desserts',
    'zero-waste': 'zeroWaste'
  };

  const openModal = (type, exp) => { setModalType(type); setSelectedExp(exp); setModalOpen(true); };
  const handleReserve = async (e) => {
    e.preventDefault();
    try { await reservationHook.postData({ ...resForm, guests: Number(resForm.guests), status: 'pending', createdAt: new Date().toISOString() }); }
    catch (err) { console.error('Reservation error:', err); }
  };
  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    try { await newsletterHook.postData({ email, subscribedAt: new Date().toISOString() }); setEmail(''); }
    catch (err) { console.error('Newsletter error:', err); }
  };

//   if (loading) return <div className="pt-32 text-center text-[#8A7E6E]"><ZivarLogo size="medium" /></div>;
//   if (error) return <div className="pt-32 text-center text-red-500"><p>Error: {error}</p></div>;

  return (
    <main>
      {/* HERO - с фоновой картинкой тарелки как на скриншоте */}
      <section id="home" className="relative min-h-screen overflow-hidden bg-[#F3E3CAFF]">
        {/* Фоновая картинка тарелки - справа как на скриншоте */}
        <div className="absolute right-0 top-0 w-[55%] h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200" 
            alt="Dish" 
            className="w-full h-full object-cover object-center"
          />
          {/* Мягкое затемнение слева для плавного перехода */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F3E3CAFF] via-[#F3E3CAFF]/60 to-transparent" />
        </div>
        
        {/* Листья декоративные справа сверху */}
        {/* <div className="absolute right-0 top-0 w-48 h-48 opacity-40 pointer-events-none z-10 hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300" 
            alt="Leaves" 
            className="w-full h-full object-contain"
          />
        </div> */}

        <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-16 min-h-screen flex items-center">
          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-[#C4973A] text-[11px] uppercase tracking-[0.25em] mb-6"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-[90px] font-serif leading-[0.9] mb-8 text-[#2C2820]"
            >
              {t('hero.title1')}<br />{t('hero.title2')}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }} 
              animate={{ opacity: 1, scaleX: 1 }} 
              transition={{ delay: 0.6, duration: 0.5 }} 
              className="w-12 h-px bg-[#C4973A] mb-6 origin-left" 
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.7 }}
              className="text-[#8A7E6E] text-sm leading-relaxed max-w-sm mb-10"
            >
              {t('hero.description')}
            </motion.p>
            <motion.a 
              href="#story" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-3 text-[#C4973A] text-[11px] uppercase tracking-[0.15em] hover:gap-5 transition-all group"
            >
              {t('hero.cta')} 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>

        {/* Scroll indicator справа */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-20"
        >
          <span 
            className="text-[#8A7E6E] text-[9px] uppercase tracking-[0.2em]" 
            style={{ writingMode: 'vertical-rl' }}
          >
            {t('common.scrollToDiscover')}
          </span>
          <motion.div 
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }} 
            className="w-px h-12 bg-[#C4973A]" 
          />
        </motion.div>
      </section>

      {/* RESERVATION - шире, ближе к краям */}
      <section id="reservation" className="px-4 lg:px-6 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="max-w-[1400px] mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#E8E0D5] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Левая колонка с лого - шире */}
            <div className="lg:col-span-3 xl:col-span-2 relative w-full h-full min-h-[150px] lg:min-h-full overflow-hidden lg:border-r border-[#E8E2D9]">
  
  {/* Картинка логотипа, которая полностью заполняет весь квадрат */}
  <img 
    src="https://i.postimg.cc/hPdRn1hs/zivarlogo1.jpg" 
    alt="Zivar Logo" 
    className="absolute inset-0 w-full h-full object-cover" 
  />

</div>

            {/* Правая колонка с формой */}
            <div className="lg:col-span-10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-[#2C2820]">{t('reservation.title')}</h2>
                <button className="text-[#8A7E6E] hover:text-[#C4973A] transition-colors">
                  <X size={18} />
                </button>
              </div>

              {reservationHook.success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3 text-sm">
                  <Check size={16} /> {t('reservation.success')}
                </div>
              )}
              {reservationHook.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">{reservationHook.error}</div>
              )}

              <form onSubmit={handleReserve} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.date')}</label>
                  <div className="relative">
                    <input type="date" value={resForm.date} onChange={e => setResForm({...resForm, date: e.target.value})}
                      className="w-full px-3 py-2.5 bg-[#F5F0E8]/50 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C4973A] text-sm" required />
                    <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7E6E] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.time')}</label>
                  <select value={resForm.time} onChange={e => setResForm({...resForm, time: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#F5F0E8]/50 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C4973A] text-sm appearance-none">
                    {['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.guests')}</label>
                  <div className="flex items-center border border-[#E8E0D5] rounded-lg bg-[#F5F0E8]/50">
                    <button type="button" onClick={() => setResForm(p => ({...p, guests: Math.max(1, p.guests - 1)}))} 
                      className="px-3 py-2.5 text-[#8A7E6E] hover:text-[#C4973A]"><Minus size={14} /></button>
                    <span className="flex-1 text-center text-sm font-medium text-[#2C2820]">{resForm.guests}</span>
                    <button type="button" onClick={() => setResForm(p => ({...p, guests: Math.min(20, p.guests + 1)}))} 
                      className="px-3 py-2.5 text-[#8A7E6E] hover:text-[#C4973A]"><Plus size={14} /></button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.name')}</label>
                  <input type="text" value={resForm.name} onChange={e => setResForm({...resForm, name: e.target.value})}
                    placeholder={t('reservation.placeholderName')} 
                    className="w-full px-3 py-2.5 bg-[#F5F0E8]/50 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C4973A] text-sm placeholder:text-[#C8BBA8]" required />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.phone')}</label>
                  <input type="tel" value={resForm.phone} onChange={e => setResForm({...resForm, phone: e.target.value})}
                    placeholder={t('reservation.placeholderPhone')} 
                    className="w-full px-3 py-2.5 bg-[#F5F0E8]/50 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C4973A] text-sm placeholder:text-[#C8BBA8]" required />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#8A7E6E]">{t('reservation.occasion')}</label>
                  <input type="text" value={resForm.occasion} onChange={e => setResForm({...resForm, occasion: e.target.value})}
                    placeholder={t('reservation.placeholderOccasion')} 
                    className="w-full px-3 py-2.5 bg-[#F5F0E8]/50 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C4973A] text-sm placeholder:text-[#C8BBA8]" />
                </div>

                <div className="lg:col-span-6 pt-2">
                  <button type="submit" disabled={reservationHook.loading}
                    className="w-full md:w-auto px-12 py-3 bg-[#C4973A] text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#B0862E] transition-colors disabled:opacity-50">
                    {reservationHook.loading ? '...' : t('reservation.button')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4 EXPERIENCE CARDS - шире, меньше высота */}
      <section id="experiences" className="py-12 px-4 lg:px-6 bg-[#F3E3CAFF]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif text-[#2C2820]"
            >
              {t('experiences.title')}
            </motion.h2>
            <a href="#" className="hidden md:flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.15em] hover:gap-3 transition-all">
              {t('experiences.viewAll')} <ArrowRight size={12} />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {experiences?.map((exp, index) => {
              const type = slugMap[exp.slug];
              if (!type) return null;
              const titleKey = `experiences.${type}.title`;
              const ctaKey = `experiences.${type}.cta`;
              
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openModal(type, exp)}
                  className="group relative h-56 md:h-64 rounded-xl overflow-hidden cursor-pointer"
                >
                  <img src={exp.image} alt={exp.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h3 className="text-lg md:text-xl font-serif text-white mb-1.5">
                      {t(titleKey) !== titleKey ? t(titleKey) : exp.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4A84B] text-[10px] uppercase tracking-[0.15em] flex items-center gap-1.5">
                        {t(ctaKey) !== ctaKey ? t(ctaKey) : exp.subtitle}
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ExperienceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} experience={selectedExp} />

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
            className="relative h-[400px] rounded-xl overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" alt="Restaurant interior" 
              className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-16 px-4 lg:px-6 bg-[#F3E3CAFF]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl md:text-4xl font-serif mb-3 text-[#2C2820]">{t('gallery.title')}</h2>
              <p className="text-lg text-[#8A7E6E] mb-4">{t('gallery.subtitle')}</p>
              <a href="#" className="inline-flex items-center gap-2 text-[#C4973A] text-[10px] uppercase tracking-[0.15em] hover:gap-3 transition-all">
                {t('gallery.viewFull')} <ArrowRight size={12} />
              </a>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery?.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.08 }}
                  className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
                >
                  <img src={item.image} alt={item.alt || 'Gallery'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

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