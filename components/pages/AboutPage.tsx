'use client';

import React, { useContext, useState, useMemo } from 'react';
import { LanguageContext, PostContext } from '../../app/providers';
import { ABOUT_DATA, QR_IMAGES } from '../../constants';
import { translations } from '../../locales';
import { Download, ArrowUpRight, Mail, MessageCircle, Coffee, ScanLine, QrCode, Github } from 'lucide-react';
import { WeChatQRModal } from '../WeChatQRModal';
import { XIcon } from '../icons/XIcon';
import { renderIcon } from '../../utils/icons';
import Link from 'next/link';

export const AboutPage: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
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


  return (
    <div className="max-w-6xl mx-auto py-12 sm:py-20 text-gray-900 dark:text-white font-sans relative">
      <WeChatQRModal isOpen={showWechatQR} onClose={() => setShowWechatQR(false)} />

      {/* Header Name */}
      <h1 className="text-6xl sm:text-8xl font-black mb-16 tracking-tighter animate-slideUp" style={{ animationDelay: '100ms' }}>{t('siteName')}</h1>

      {/* Intro Section - Updated with Rich Links */}
      <div className="mb-20 animate-slideUp" style={{ animationDelay: '200ms' }}>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">{t('about.introTitle')}</h2>
        
        <div className="space-y-6 text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none">
            <p>
              {t('about.intro.paragraph1', { years: stats.yearsExp.toString() })}
            </p>
            <p>
              {language === 'zh' ? (
                <>热衷于技术探索，我已构建了 <Link href="/practice/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.practiceProjects}+ 个实战项目</Link>，涵盖动画交互、工具库与 <Link href="/ai/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">AI 应用</Link>。同时，我坚持长期写作，累计输出 <Link href="/blog/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.displayWords} 字的技术文章</Link>，分享关于设计系统、工程化思维与 AI 转型的深度思考。</>
              ) : language === 'en' ? (
                <>Passionate about technical exploration, I have built <Link href="/practice/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.practiceProjects}+ practical projects</Link>, covering animation interactions, tool libraries, and <Link href="/ai/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">AI applications</Link>. At the same time, I persist in long-term writing, having accumulated <Link href="/blog/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.displayWords} words of technical articles</Link>, sharing deep thoughts on design systems, engineering thinking, and AI transformation.</>
              ) : (
                <>技術探求に情熱を注ぎ、<Link href="/practice/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.practiceProjects}+の実践プロジェクト</Link>を構築しました。アニメーションインタラクション、ツールライブラリ、<Link href="/ai/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">AIアプリケーション</Link>をカバーしています。同時に、長期の執筆を続け、累計<Link href="/blog/" className="text-primary hover:underline decoration-2 underline-offset-4 font-bold">{stats.displayWords}字の技術記事</Link>を出力し、デザインシステム、エンジニアリング思考、AI変革に関する深い思考を共有しています。</>
              )}
            </p>
            <p>
              {language === 'zh' ? (
                <>我相信技术不仅是代码，更是解决问题的艺术。你可以关注我的 <a href="https://github.com/lanlangmozhu" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">GitHub</a> 查看源码，或者在 <a href="https://juejin.cn" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">掘金</a> 上与我交流。欢迎查看下方的作品与经历，寻找共鸣。</>
              ) : language === 'en' ? (
                <>I believe technology is not just code, but the art of solving problems. You can follow my <a href="https://github.com/lanlangmozhu" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">GitHub</a> to view source code, or communicate with me on <a href="https://juejin.cn" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">Juejin</a>. Welcome to check out the works and experiences below to find resonance.</>
              ) : (
                <>技術は単なるコードではなく、問題解決の芸術だと信じています。<a href="https://github.com/lanlangmozhu" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">GitHub</a>でソースコードを確認したり、<a href="https://juejin.cn" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors">掘金</a>で交流したりできます。下記の作品と経験を確認して、共鳴を見つけてください。</>
              )}
            </p>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="mb-20 animate-slideUp" style={{ animationDelay: '250ms' }}>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">{t('about.technicalStack.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ABOUT_DATA.technicalStack.map((item) => (
            <div key={item.key} className="bg-white/60 dark:bg-white/5 rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 backdrop-blur hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                {t(`about.technicalStack.${item.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {t(`about.technicalStack.${item.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education Background */}
      <div className="mb-20 animate-slideUp" style={{ animationDelay: '260ms' }}>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">{t('about.education.title')}</h2>
        <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-8 border border-gray-200/50 dark:border-white/5 backdrop-blur hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl font-black text-white">{language === 'zh' ? '学' : language === 'en' ? 'E' : '学'}</span>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t('about.education.university')}</div>
              <div className="text-base text-gray-600 dark:text-gray-400 font-medium">{t('about.education.major')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Evaluation */}
      <div className="mb-20 animate-slideUp" style={{ animationDelay: '270ms' }}>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">{t('about.personalEvaluation.title')}</h2>
        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-orange-900/10 dark:to-amber-900/5 rounded-2xl p-8 border border-amber-100 dark:border-orange-500/10 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💭</span>
            </div>
            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 flex-1">
              {t('about.personalEvaluation.content')}
            </p>
          </div>
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
         <h2 className="text-2xl font-bold mb-8">核心能力</h2>
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
        <h2 className="text-2xl font-bold mb-8">{t('about.workExperience')}</h2>
        {ABOUT_DATA.experience.map((exp, i) => {
            const workHistory = (translations[language].about as any).workHistory;
            const companyInfo = workHistory[exp.companyKey as keyof typeof workHistory];
            
            return (
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
                            {companyInfo.name} 
                        </div>
                        <div className="text-primary font-bold text-base mt-1">{companyInfo.role}</div>
                    </div>
                    
                    {companyInfo.desc && <div className="text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-white/5 inline-block px-3 py-1 rounded-lg text-sm">{companyInfo.desc}</div>}

                    <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {companyInfo.items.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )})}
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
                    <a href="mailto:lanlangmozhu@163.com" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors group p-2 rounded-xl hover:bg-white dark:hover:bg-white/5">
                        <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-primary/10">
                            <Mail size={16} />
                        </div>
                        <span className="font-bold text-sm">lanlangmozhu@163.com</span>
                    </a>
                    
                    {/* WeChat */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                             <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                                <MessageCircle size={16} />
                            </div>
                            <span className="font-bold text-sm">Q</span>
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
                        <a href="https://github.com/lanlangmozhu" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all">
                            <Github size={14} /> GitHub
                        </a>
                        {/* <a href="https://x.com/liu_quan55836" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-all">
                            <XIcon size={14} /> X
                        </a> */}
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
