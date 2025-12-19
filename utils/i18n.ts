import { Language } from '../locales';

/**
 * Format date according to language preference
 */
export const formatDate = (date: Date | string, language: Language): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const localeMap: Record<Language, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    jp: 'ja-JP',
  };
  
  const locale = localeMap[language] || 'zh-CN';
  
  // Format: "Jan 1, 14:00" or "1月 1日 14:00"
  return dateObj.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

