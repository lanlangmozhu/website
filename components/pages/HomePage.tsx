'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { PostContext, LanguageContext } from '../../app/providers';
import { NAV_CONFIG } from '../../constants';
import { MessageCircle, Rss, User, Github, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { WeChatQRModal } from '../WeChatQRModal';
import { getNavIcon, getNavColorClass } from '../../utils/icons';

export const HomePage: React.FC = () => {
  const { posts, loading } = useContext(PostContext);
  const { t } = useContext(LanguageContext);
  const recentPosts = posts.slice(0, 3);
  const [showWechatQR, setShowWechatQR] = useState(false);


  // Helper to get color for nav item
  const getColorClass = (key: string) => {
    switch(key) {
        case 'blog': return 'text-blue-500 group-hover:text-blue-600 bg-blue-50 dark:bg-blue-500/10';
        case 'practice': return 'text-purple-500 group-hover:text-purple-600 bg-purple-50 dark:bg-purple-500/10';
        case 'ai': return 'text-emerald-500 group-hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10';
        default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-24 pb-12">
      <WeChatQRModal isOpen={showWechatQR} onClose={() => setShowWechatQR(false)} />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 sm:py-32 text-center space-y-8 animate-slideUp">
        
        <div className="relative group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-blob"></div>
            <div className="relative w-24 h-24 bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl ring-1 ring-white/20 group-hover:rotate-6 transition-transform duration-500 ease-out">
                <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-600 select-none">
                    权
                </span>
            </div>
        </div>
        
        <div className="space-y-6 max-w-4xl mx-auto px-4 relative">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                <span className="block">{t('home.heroTitle')}</span>
                {/* Shimmering Text Effect */}
                <span className="block bg-[linear-gradient(110deg,#9333ea,45%,#ec4899,55%,#9333ea)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shimmer">
                    {t('home.heroTitle2')}
                </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
                {t('home.heroSubtitle')}
            </p>
        </div>

        {/* Social Links Row - Updated to match Footer (Github, WeChat, RSS) */}
        <div className="flex items-center gap-4 pt-6">
            <a href="https://github.com/lanlangmozhu" target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 rounded-full border border-gray-200/60 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors"><Github size={20} /></span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">GitHub</span>
            </a>
            <button onClick={() => setShowWechatQR(true)} className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 rounded-full border border-gray-200/60 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors"><MessageCircle size={20} /></span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">WeChat</span>
            </button>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 rounded-full border border-gray-200/60 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors"><Rss size={20} /></span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">RSS</span>
            </a>
        </div>
      </section>

      {/* Dynamic Navigation Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 max-w-6xl mx-auto px-4">
          {NAV_CONFIG.map(nav => (
            <Link 
                key={nav.key} 
                href={nav.path} 
                className="group relative flex flex-col items-center p-4 lg:p-8 rounded-xl lg:rounded-[2rem] bg-white/60 dark:bg-gray-900/40 border border-gray-200/50 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
                <div className={`p-2.5 lg:p-5 rounded-lg lg:rounded-2xl mb-3 lg:mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${getNavColorClass(nav.key)} ring-1 ring-inset ring-black/5 dark:ring-white/5`}>
                    <div className="scale-75 lg:scale-100">
                        {getNavIcon(nav.key)}
                    </div>
                </div>
                <span className="font-bold text-sm lg:text-xl text-gray-900 dark:text-white relative z-10">{t(nav.titleKey)}</span>
                
                {/* Hover Gradient Bg */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Link>
          ))}
          
          <Link href="/about" className="group relative flex flex-col items-center p-4 lg:p-8 rounded-xl lg:rounded-[2rem] bg-white/60 dark:bg-gray-900/40 border border-gray-200/50 dark:border-white/5 hover:border-yellow-500/30 dark:hover:border-yellow-500/30 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
               <div className="p-2.5 lg:p-5 rounded-lg lg:rounded-2xl mb-3 lg:mb-6 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 group-hover:text-yellow-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ring-1 ring-inset ring-black/5 dark:ring-white/5">
                    <div className="scale-75 lg:scale-100">
                        <User size={32} />
                    </div>
                </div>
              <span className="font-bold text-sm lg:text-xl text-gray-900 dark:text-white relative z-10">{t('nav.about')}</span>
          </Link>
      </section>

      {/* Recent Updates */}
      <section className="max-w-6xl mx-auto pt-8 px-4">
        <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('home.latestUpdates')}</h2>
            </div>
            <Link href="/blog" className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full">
                {t('home.viewAll')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
             </div>
        ) : (
            <div className="grid gap-8 md:grid-cols-3">
                {recentPosts.map((post, i) => (
                    <Link 
                        key={post.slug} 
                        href={`/post/${post.slug}`} 
                        className="group flex flex-col bg-white/70 dark:bg-gray-900/40 rounded-[2rem] border border-gray-200/50 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 h-full backdrop-blur-sm"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="h-56 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                            {post.image ? (
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                    <div className="text-6xl font-black text-gray-200 dark:text-gray-700 opacity-50">{post.title?.charAt(0) || '?'}</div>
                                </div>
                            )}
                             
                             {/* Category Badge */}
                             <div className="absolute top-4 left-4 z-10">
                                 <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg text-gray-900 dark:text-white uppercase tracking-wider border border-white/20 dark:border-white/10 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    {post.subcategory || post.category}
                                </span>
                             </div>

                             {/* Gradient Overlay on Image */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-7 flex flex-col flex-grow relative">
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-wider">
                                <span>{post.date}</span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                <span>{post.readTime}</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight">{post.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                            
                            <div className="flex items-center gap-2 text-primary text-xs font-bold mt-auto group-hover:translate-x-1 transition-transform">
                                {t('home.readArticle')} <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </section>
    </div>
  );
};