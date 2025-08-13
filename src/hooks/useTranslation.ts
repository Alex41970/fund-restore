import { useI18n } from '@/contexts/I18nContext';

export const useTranslation = () => {
  const { t, language, setLanguage, translations } = useI18n();
  
  return {
    t,
    language,
    setLanguage,
    translations,
  };
};