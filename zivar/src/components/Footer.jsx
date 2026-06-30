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
    <footer className="py-8 px-6 lg:px-8 border-t border-zivar-beige">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zivar-stone">{t('footer.rights')}</p>
        <div className="flex items-center gap-6">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-xs text-zivar-stone hover:text-zivar-stone-dark transition-colors">{l.label}</a>
          ))}
        </div>
        <button onClick={scrollToTop} className="flex items-center gap-2 text-xs text-zivar-stone hover:text-zivar-gold transition-colors group">
          {t('footer.backToTop')}
          <span className="w-8 h-8 rounded-full border border-zivar-stone group-hover:border-zivar-gold flex items-center justify-center transition-colors">
            <ArrowUp size={14} />
          </span>
        </button>
      </div>
    </footer>
  );
}