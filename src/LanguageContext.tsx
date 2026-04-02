import { createContext, useContext } from 'react';
import { translations, Language, Translations } from './i18n';

interface LanguageContextType {
  language: Language;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  t: translations.de,
});

export const useLanguage = () => useContext(LanguageContext);
