

import { ThemeContextType, BlogPost, NavConfigItem } from './types';
import { Language } from './locales';
import { Layers, Users, Code, PenTool, Briefcase } from 'lucide-react';

// Context types are exported here, actual Context instances are in app/providers.tsx
export interface PostContextType {
    posts: BlogPost[];
    loading: boolean;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Export types for type usage
export type { ThemeContextType, BlogPost };

// --- CONFIGURATION ---

export const SITE_NAME = "小菜权";
export const SITE_DESCRIPTION = "NO BUG, NO CODE";

// Google Analytics Measurement ID (Replace with your actual ID)
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; 

// Dynamic Navigation Configuration
// To add a new docs folder, just add an entry here and update locales.ts
export const NAV_CONFIG: NavConfigItem[] = [
  { key: 'blog', path: '/blog', folder: 'blog', titleKey: 'nav.blog' },
  { key: 'practice', path: '/practice', folder: 'practice', titleKey: 'nav.practice' },
  { key: 'ai', path: '/ai', folder: 'ai', titleKey: 'nav.ai' },
];

// About Page Data Definition
export const ABOUT_DATA = {
    skills: [
        { iconKey: 'Layers', textKey: 'about.skills.logic', color: 'text-purple-500' },
        { iconKey: 'Users', textKey: 'about.skills.system', color: 'text-green-500' },
        { iconKey: 'Code', textKey: 'about.skills.engineering', color: 'text-orange-500' },
        { iconKey: 'PenTool', textKey: 'about.skills.experience', color: 'text-blue-500' },
        { iconKey: 'Briefcase', textKey: 'about.skills.management', color: 'text-pink-500' },
    ],
    experience: [
        { 
          date: '2023.10 ~ Present', 
          company: '美叶', 
          role: '合作设计师 & 产品经理', 
          desc: '相关产品孵化中...',
          items: [
            '不断学习 AI 相关技术与工具，联合创立一款行业解决方案式 AI 产品；',
            '追求自我价值实现，与多个领域团队合作共创数个开源项目，丰富团队协作经验、积累开源项目经验、进一步提升开发水平。'
          ] 
        },
        { 
          date: '2019.08 ~ 2023.08', 
          company: '青云科技有限公司', 
          role: '高级产品设计师', 
          desc: '青云 QingCloud 设计资产',
          items: [
            '利用工程化思维沉淀完善且可落地的基础、业务、模式组件库及周边生态，覆盖 93% 产品线，规范设计产出、降低约 50% 验收成本、提升体验一致性与跨部门协作效率；',
            '解决图标、插画、可视化组件等基础设施的从无到有问题，深入了解其生命流程并建立前沿、高效的交付流程（交付周期缩短 3/4），真正解放设计师、研发双手，赋能产品、市场。'
          ] 
        },
    ]
};
