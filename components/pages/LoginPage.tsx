'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser, getVisitorId } from '../../services/auth';
import { authorizeWithPopup, OAuthProvider } from '../../services/oauth';
import { User, ArrowRight, Sparkles, ShieldCheck, Fingerprint, Github, Command, MessageCircle, Apple, Loader2 } from 'lucide-react';
import { LanguageContext } from '../../app/providers';

const AVATARS = [
  'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Zane',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Milo',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Lola',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Bear'
];

const LoginPageInner: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('Scanning...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVisitorId().then(setDeviceId);
    
    // 检查 URL 参数中的错误信息
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // 清除 URL 中的错误参数
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  const performLogin = async (name: string, avatar: string) => {
      setIsSubmitting(true);
      try {
        await loginUser(name, avatar);
        // Redirect back to where they came from, or home
        const from = searchParams.get('from') || '/';
        router.push(from);
      } catch (error) {
        console.error("Login failed", error);
        setIsSubmitting(false);
        setLoadingProvider(null);
      }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    performLogin(nickname, selectedAvatar);
  };

  const handleSocialLogin = async (provider: OAuthProvider) => {
      setLoadingProvider(provider);
      
      try {
          // 所有 provider 都使用弹出窗口进行 OAuth 授权
          const userInfo = await authorizeWithPopup(provider);
          
          // 使用 OAuth 返回的用户信息进行登录
          const avatar = userInfo.avatar || selectedAvatar;
          await performLogin(userInfo.nickname, avatar);
      } catch (error) {
          console.error(`${provider} 授权失败:`, error);
          setLoadingProvider(null);
          // 可以在这里添加错误提示
          alert(error instanceof Error ? error.message : `${provider} 授权失败，请重试`);
      }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 animate-fadeIn px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary rotate-3 shadow-lg shadow-primary/10">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('login.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Social Login Channels */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            <button 
                onClick={() => handleSocialLogin('github')}
                disabled={!!loadingProvider}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loadingProvider === 'github' ? <Loader2 size={24} className="animate-spin text-gray-500" /> : <Github size={24} className="text-gray-700 dark:text-white group-hover:scale-110 transition-transform" />}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">GitHub</span>
            </button>
            <button 
                onClick={() => handleSocialLogin('apple')}
                disabled={!!loadingProvider}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 {loadingProvider === 'apple' ? <Loader2 size={24} className="animate-spin text-gray-500" /> : <Apple size={24} className="text-gray-900 dark:text-white group-hover:scale-110 transition-transform" />}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Apple</span>
            </button>
            <button 
                onClick={() => handleSocialLogin('wechat')}
                disabled={!!loadingProvider}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-green-200 dark:hover:border-green-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 {loadingProvider === 'wechat' ? <Loader2 size={24} className="animate-spin text-green-500" /> : <MessageCircle size={24} className="text-green-500 group-hover:scale-110 transition-transform" />}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">WeChat</span>
            </button>
        </div>

        <div className="relative flex py-2 items-center mb-8">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('login.or')}</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
        </div>

        {/* Anonymous / Fingerprint Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-center">{t('login.selectAvatar')}</label>
            <div className="flex justify-center gap-2 flex-wrap">
              {AVATARS.map((avatar, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${
                    selectedAvatar === avatar 
                    ? 'border-primary scale-110 bg-primary/10' 
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="avatar" className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Nickname Input */}
          <div className="space-y-2">
             <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('login.nicknamePlaceholder')}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-gray-900 dark:text-white"
                  maxLength={12}
                  required
                />
             </div>
          </div>

          {/* Device ID Info */}
          <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-lg border border-gray-100 dark:border-white/5 flex items-center gap-2 text-[10px] text-gray-500 justify-center">
             <Fingerprint size={12} className="text-primary" />
             <span className="font-mono opacity-70">{t('login.fingerprintId')}: {deviceId.substring(0, 16)}...</span>
             <ShieldCheck size={12} className="text-green-500" />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !nickname}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> {t('login.entering')}</> : <>{t('login.enter')} <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <LoginPageInner />
    </Suspense>
  );
};
