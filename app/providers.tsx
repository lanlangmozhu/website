'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeContextType, LanguageContextType } from '../constants';
import { BlogPost } from '../types';
import { translations, Language } from '../locales';
import { loadPosts } from '../services/data';
import { Layout } from '../components/Layout';
import { AnalyticsTracker } from '../components/AnalyticsTracker';

// 重新导出 Context 以便在客户端组件中使用
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const PostContext = createContext<{
  posts: BlogPost[];
  loading: boolean;
}>({
  posts: [],
  loading: true,
});

export const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: (key, params) => {
    if (params) {
      return key.replace(/\{(\w+)\}/g, (match, k) => params[k] || match);
    }
    return key;
  },
});

// Helper function to detect browser language
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'zh';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja') || browserLang.startsWith('jp')) return 'jp';
  return 'en'; // Default to English for other languages
};

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize with safe defaults to avoid hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  // Helper for translations with support for placeholders
  const t = (path: string, params?: Record<string, string>) => {
    const keys = path.split('.');
    let value: any = translations[language];
    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        return path;
      }
    }
    
    // Replace placeholders if params provided
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    }
    
    return value;
  };

  // Mark as mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Language initialization with persistence and browser detection
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const validLanguages: Language[] = ['zh', 'en', 'jp'];
    
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language if no saved preference
      const detectedLang = detectBrowserLanguage();
      setLanguage(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, [mounted]);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const langMap: Record<Language, string> = {
      zh: 'zh-CN',
      en: 'en-US',
      jp: 'ja-JP',
    };
    
    document.documentElement.lang = langMap[language] || 'zh-CN';
  }, [language, mounted]);

  // Save language preference when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Theme Logic - Only run on client side to avoid hydration mismatch
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Data Loading Logic
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const loadedPosts = await loadPosts();
        setPosts(loadedPosts);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <PostContext.Provider value={{ posts, loading: loadingPosts }}>
          <AnalyticsTracker />
          <Layout>{children}</Layout>
        </PostContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

