import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const links = [
    { label: t('footer.privacy'), href: '#' },
    { label: t('footer.terms'), href: '#' },
    { label: t('footer.careers'), href: '#' },
    { label: t('footer.press'), href: '#' },
  ];

  return (
    <footer className="py-5 px-4 lg:px-6 border-t border-[#E8E0D5] overflow-x-hidden">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-[#8A7E6E]">{t('footer.rights')}</p>
        <div className="flex items-center gap-4">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-[10px] text-[#8A7E6E] hover:text-[#2C2820] transition-colors">{l.label}</a>
          ))}
        </div>
        <button onClick={scrollToTop} className="flex items-center gap-1.5 text-[10px] text-[#8A7E6E] hover:text-[#C4973A] transition-colors group">
          {t('footer.backToTop')}
          <span className="w-6 h-6 rounded-full border border-[#C8BBA8] group-hover:border-[#C4973A] flex items-center justify-center transition-colors">
            <ArrowUp size={12} />
          </span>
        </button>
      </div>
    </footer>
  );
}