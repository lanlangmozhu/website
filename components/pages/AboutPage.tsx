'use client';

import React, { useContext, useState, useMemo } from 'react';
import { LanguageContext, PostContext } from '../../app/providers';
import { ABOUT_DATA } from '../../constants';
import { Download, ArrowUpRight, Mail, MessageCircle, Layers, Users, Code, PenTool, Briefcase, Coffee, X, ScanLine, QrCode, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export const AboutPage: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const { posts } = useContext(PostContext);
  const [showWechatQR, setShowWechatQR] = useState(false);

  // Dynamic Stats Calculation
  const stats = useMemo(() => {
      // Use a fixed year to avoid hydration mismatch
      // This will be recalculated on client side if needed
      const currentYear = typeof window !== 'undefined' ? new Date().getFullYear() : 2025;
      const yearsExp = currentYear - 2017;
      const totalArticles = posts.length;
      const totalWords = posts.reduce((sum, post) => sum + (post.wordCount || 0), 0);
      const displayWords = totalWords > 10000 ? `${(totalWords / 10000).toFixed(1)}w` : totalWords;
      const practiceProjects = posts.filter(p => p.category.toLowerCase() === 'practice').length;
      const aiApps = posts.filter(p => p.category.toLowerCase() === 'ai').length;

      return {
          yearsExp,
          practiceProjects,
          totalArticles,
          aiApps,
          displayWords,
          gridData: [
            { value: yearsExp.toString(), label: t('about.stats.years') },
            { value: `${practiceProjects}+`, label: t('about.stats.projects') },
            { value: `${totalArticles}+`, label: t('about.stats.articles') },
            { value: aiApps.toString(), label: t('about.stats.aiApps') },
          ]
      };
  }, [posts, t]);

  // Helper to render icons from string keys in constants
  const renderIcon = (iconKey: string, size: number) => {
      switch(iconKey) {
          case 'Layers': return <Layers size={size} />;
          case 'Users': return <Users size={size} />;
          case 'Code': return <Code size={size} />;
          case 'PenTool': return <PenTool size={size} />;
          case 'Briefcase': return <Briefcase size={size} />;
          default: return <Code size={size} />;
      }
  };

  // TODO: 替换为您真实的二维码图片路径
  const QR_IMAGES = {
      wechatContact: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=xiaocaiquan-contact-id',
      wechatPay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wechat-pay-url-placeholder',
      alipay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=alipay-url-placeholder'
  };

  return (
    <div className="max-w-6xl mx-auto py-12 sm:py-20 text-gray-900 dark:text-white font-sans relative">
      
      {/* Global Overlay for WeChat QR */}
      {showWechatQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setShowWechatQR(false)}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl max-w-sm w-full relative animate-blob" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowWechatQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <X size={24} />
                  </button>
                  <div className="text-center">
                      <h3 className="text-xl font-bold mb-4">{t('about.scanAdd')}</h3>
                      <div className="bg-white p-2 rounded-xl inline-block mb-2 shadow-inner border border-gray-100">
                          <img src={QR_IMAGES.wechatContact} alt="WeChat QR" className="w-48 h-48 object-contain" />
                      </div>
                      <p className="text-sm text-gray-500">ID: xiaocaiquan</p>
                  </div>
              </div>
          </div>
      )}

      {/* Header Name */}
      <h1 className="text-6xl sm:text-8xl font-black mb-16 tracking-tighter animate-slideUp" style={{ animationDelay: '100ms' }}>{t('siteName')}</h1>

      {/* Intro Section - Updated with Rich Links */}
      <div className="mb-20 animate-slideUp" style={{ animationDelay: '200ms' }}>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">{t('about.intro')}</h2>
        
        <div className="space-y-6 text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none">
            <p>
              目前是一名资深 B 端产品设计师与初级开发者，拥有 {stats.yearsExp} 年行业经验。我致力于打通设计与开发的边界，以"设计工程师"的视角，在云计算、低代码、智能客服等领域沉淀了深厚的实践经验。
            </p>
            <p>
              热衷于技术探索，我已构建了 <Link href="/practice" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.practiceProjects}+ 个实战项目</Link>，
              涵盖动画交互、工具库与 <Link href="/ai" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">AI 应用</Link>。
              同时，我坚持长期写作，累计输出 <Link href="/blog" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.displayWords} 字的技术文章</Link>，
              分享关于设计系统、工程化思维与 AI 转型的深度思考。
            </p>
            <p>
              我相信技术不仅是代码，更是解决问题的艺术。你可以关注我的 <a href="https://github.com/xiaocaiquan" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">GitHub</a> 查看源码，
              或者在 <a href="https://juejin.cn" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">掘金</a> 上与我交流。欢迎查看下方的作品与经历，寻找共鸣。
            </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-slideUp" style={{ animationDelay: '300ms' }}>
         {stats.gridData.map((stat, i) => (
             <div key={i} className="bg-white/60 dark:bg-white/5 rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 backdrop-blur hover:bg-white/80 dark:hover:bg-white/10 transition-colors group">
                 <div className="text-4xl sm:text-5xl font-black mb-2 text-gray-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                 <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
             </div>
         ))}
      </div>

      {/* Skills Grid */}
      <div className="mb-24 animate-slideUp" style={{ animationDelay: '400ms' }}>
         <h2 className="text-2xl font-bold mb-8">Core Competencies</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ABOUT_DATA.skills.map((skill, i) => (
                <div key={i} className="bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 flex flex-col justify-between h-44 group hover:bg-white dark:hover:bg-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 ${skill.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {renderIcon(skill.iconKey, 24)}
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 font-bold leading-snug">
                        {t(skill.textKey)}
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-16 animate-slideUp mb-24" style={{ animationDelay: '500ms' }}>
        <h2 className="text-2xl font-bold mb-8">Experience</h2>
        {ABOUT_DATA.experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-8 group">
                <div className="md:col-span-1 pt-1">
                    <div className="flex items-center gap-3 text-gray-400 font-mono text-sm mb-1">
                         <div className="w-2 h-2 bg-primary rounded-full ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all"></div>
                         {exp.date}
                    </div>
                </div>
                <div className="md:col-span-3 space-y-5 border-l-2 border-gray-100 dark:border-white/5 pl-8 md:pl-0 md:border-none">
                    <div>
                        <div className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">
                            {exp.company} 
                        </div>
                        <div className="text-primary font-bold text-base mt-1">{exp.role}</div>
                    </div>
                    
                    {exp.desc && <div className="text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-white/5 inline-block px-3 py-1 rounded-lg text-sm">{exp.desc}</div>}

                    <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {exp.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ))}
      </div>

      {/* Compact Footer Section (Sponsor & Contact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp" style={{ animationDelay: '600ms' }}>
         
        {/* Sponsor Compact Card (Left) */}
        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-orange-900/10 dark:to-amber-900/5 p-6 rounded-2xl border border-orange-100 dark:border-orange-500/10 backdrop-blur-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xs font-bold text-orange-400 dark:text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <Coffee size={14} /> {t('about.sponsor')}
                 </h2>
                 <span className="text-[10px] text-gray-400 flex items-center gap-1">
                     <ScanLine size={10} /> {t('about.scanPay')}
                 </span>
             </div>
             
             <div className="flex items-center gap-4">
                 {/* WeChat Pay */}
                 <div className="flex-1 bg-white p-2 rounded-xl shadow-sm border border-gray-50 group hover:border-green-500/30 transition-all">
                     <img src={QR_IMAGES.wechatPay} alt="WeChat Pay" className="w-full aspect-square object-contain opacity-90 group-hover:opacity-100" />
                     <div className="text-[10px] text-center mt-1 text-gray-400 font-bold">{t('about.wechat')}</div>
                 </div>

                 {/* Alipay */}
                 <div className="flex-1 bg-white p-2 rounded-xl shadow-sm border border-gray-50 group hover:border-blue-500/30 transition-all">
                     <img src={QR_IMAGES.alipay} alt="Alipay" className="w-full aspect-square object-contain opacity-90 group-hover:opacity-100" />
                     <div className="text-[10px] text-center mt-1 text-gray-400 font-bold">{t('about.alipay')}</div>
                 </div>
             </div>
        </div>

        {/* Contact Compact Card (Right) */}
         <div className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-sm flex flex-col justify-between hover:bg-white/70 dark:hover:bg-white/10 transition-colors">
            <div>
                <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t('about.contact')}</h2>
                <div className="grid grid-cols-1 gap-3">
                    {/* Email */}
                    <a href="mailto:hi@xiaocaiquan.cn" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors group p-2 rounded-xl hover:bg-white dark:hover:bg-white/5">
                        <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-primary/10">
                            <Mail size={16} />
                        </div>
                        <span className="font-bold text-sm">hi@xiaocaiquan.cn</span>
                    </a>
                    
                    {/* WeChat */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                             <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                                <MessageCircle size={16} />
                            </div>
                            <span className="font-bold text-sm">xiaocaiquan</span>
                        </div>
                         <button 
                            onClick={() => setShowWechatQR(true)}
                            className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded transition-colors"
                        >
                            <QrCode size={14} /> QR
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                        <a href="https://github.com/xiaocaiquan" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all">
                            <Github size={14} /> GitHub
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-all">
                            <Twitter size={14} /> Twitter
                        </a>
                    </div>
                </div>
            </div>
        </div>

      </div>

    </div>
  );
};

// 添加默认导出以满足 Next.js 类型检查要求
export default AboutPage;
