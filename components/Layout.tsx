'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeContext, PostContext, LanguageContext } from '../app/providers';
import { NAV_CONFIG } from '../constants';
import { Moon, Sun, Menu, X, Github, Twitter, Rss, MessageCircle, Search, Languages, Check, User, LogOut } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { Language } from '../locales';
import { getCurrentUser, logoutUser } from '../services/auth';
import { UserProfile } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { posts } = useContext(PostContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Language State
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // User Menu State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'jp', label: '日本語' }
  ];

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]); // Re-check user on navigation (e.g. after login)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Fix Fixed Positioning on Mobile/Tablet
  // Apply overflow-x-hidden to body instead of wrapper to prevent stacking context issues
  useEffect(() => {
      document.body.style.overflowX = 'hidden';
      return () => {
          document.body.style.overflowX = '';
      };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
              setIsLangMenuOpen(false);
          }
          if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
              setIsUserMenuOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100">
      
      {/* Global Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.05]"></div>
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        posts={posts}
      />

      {/* Header - Fixed positioning */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-dark/60 border-b border-gray-200/50 dark:border-white/5 transition-all duration-300 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/10 dark:shadow-white/5 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                        <span className="text-white dark:text-gray-900 font-bold text-xl font-serif">权</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-none">
                            {t('siteName')}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase mt-1">Ethan Liu</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 ml-8 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/5 backdrop-blur-sm">
                    {NAV_CONFIG.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link 
                                key={item.key}
                                href={item.path} 
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    isActive 
                                    ? 'text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm font-semibold' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5'
                                }`}
                            >
                                {t(item.titleKey)}
                            </Link>
                        );
                    })}
                    <Link 
                        href="/about" 
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                            pathname === '/about'
                            ? 'text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm font-semibold' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5'
                        }`}
                    >
                        {t('nav.about')}
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                 {/* Search Trigger */}
                 <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-full pl-3 pr-1.5 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-white dark:hover:bg-white/10 transition-all group backdrop-blur-md shadow-sm active:scale-95 duration-200"
                >
                    <Search size={14} />
                    {/* Text hidden on sm, visible on lg */}
                    <span className="hidden lg:inline mr-4 opacity-70">{t('search.placeholder').split('...')[0]}</span>
                    <kbd className="hidden xl:inline-flex items-center justify-center h-5 min-w-[20px] font-sans text-[10px] font-bold border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-black/20 text-gray-400 group-hover:text-gray-500">
                        ⌘K
                    </kbd>
                </button>

                {/* Language Selector */}
                <div className="relative" ref={langMenuRef}>
                    <button 
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className={`p-2.5 rounded-full transition-all duration-300 ease-out focus:outline-none border border-transparent ${
                            isLangMenuOpen 
                            ? 'bg-primary/10 text-primary ring-2 ring-primary/20' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/7 active:bg-gray-100/50 dark:active:bg-white/5'
                        }`}
                        title="Switch Language"
                    >
                        <Languages size={18} />
                    </button>
                    
                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-4 w-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-slideDown origin-top-right ring-1 ring-black/5">
                             {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-all duration-300 ease-out hover:bg-primary/5 dark:hover:bg-white/5 active:bg-primary/6 dark:active:bg-white/6"
                                >
                                    <span className={`${language === lang.code ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {lang.label}
                                    </span>
                                    {language === lang.code && <Check size={14} className="text-primary" />}
                                </button>
                             ))}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full hover:bg-gray-100/70 dark:hover:bg-white/7 transition-all duration-300 ease-out focus:outline-none active:bg-gray-100/50 dark:active:bg-white/5 text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-yellow-400 border border-transparent"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

                {/* User Login/Profile */}
                <div className="relative" ref={userMenuRef}>
                    {user ? (
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:scale-105 active:opacity-80"
                            title={user.nickname}
                        >
                            <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
                        </button>
                    ) : (
                        <Link 
                            href="/login" 
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300 ease-out border border-transparent hover:border-gray-200 dark:hover:border-white/5 active:bg-gray-100/60 dark:active:bg-white/6"
                            title="Login"
                        >
                            <div className="p-0.5 rounded-full bg-gray-200 dark:bg-white/20">
                                <User size={14} />
                            </div>
                            <span className="hidden sm:inline">登录</span>
                        </Link>
                    )}

                     {isUserMenuOpen && user && (
                        <div className="absolute right-0 mt-4 w-48 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-slideDown origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="font-bold text-gray-900 dark:text-white truncate">{user.nickname}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/8 flex items-center gap-2 transition-all duration-300 ease-out active:bg-red-50/60 dark:active:bg-red-900/6"
                            >
                                <LogOut size={14} /> 退出登录
                            </button>
                        </div>
                    )}
                </div>

                 {/* Mobile Menu Button */}
                 <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 dark:bg-dark/90 border-b border-gray-200 dark:border-white/5 absolute w-full backdrop-blur-2xl animate-slideDown z-40">
            <div className="px-4 pt-4 pb-6 space-y-2">
                {NAV_CONFIG.map(item => (
                    <Link 
                        key={item.key}
                        href={item.path} 
                        className="block px-4 py-3.5 rounded-2xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all active:bg-gray-100 dark:active:bg-white/10"
                    >
                        {t(item.titleKey)}
                    </Link>
                ))}
                 <Link 
                    href="/about" 
                    className="block px-4 py-3.5 rounded-2xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all active:bg-gray-100 dark:active:bg-white/10"
                 >
                    {t('nav.about')}
                 </Link>
                 {!user && (
                    <Link 
                        href="/login"
                        className="block px-4 py-3.5 rounded-2xl text-base font-medium text-primary bg-primary/5 mt-4 active:bg-primary/10"
                    >
                        登录 / 注册
                    </Link>
                 )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Added margin top to account for fixed header */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 relative z-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/40 dark:bg-dark/40 backdrop-blur-lg border-t border-gray-200/60 dark:border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-1">
              <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                 {t('siteName')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                © {typeof window !== 'undefined' ? new Date().getFullYear() : 2025} NO BUG, NO CODE.
              </p>
            </div>
            <div className="flex space-x-4">
              {[
                  { Icon: Github, hover: 'hover:text-black dark:hover:text-white', link: '#' },
                  { Icon: MessageCircle, hover: 'hover:text-green-500', link: '#' },
                  { Icon: Rss, hover: 'hover:text-orange-500', link: '/rss.xml', target: '_blank' }
              ].map(({ Icon, hover, link, target }, i) => (
                  <a key={i} href={link} target={target} className={`p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-400 transition-all hover:scale-110 hover:shadow-md active:scale-90 ${hover}`}>
                    <Icon size={18} />
                  </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
