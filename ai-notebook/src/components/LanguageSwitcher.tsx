import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      title={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">Toggle Language</span>
    </button>
  );
}
