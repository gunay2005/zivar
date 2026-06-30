import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import az from './translations/az';
import ru from './translations/ru';
import fr from './translations/fr';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    az: { translation: az },
    ru: { translation: ru },
    fr: { translation: fr }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;