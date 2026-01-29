

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
export const SITE_URL = "https://lanlangmozhu.com";

// Google Analytics Measurement ID (Replace with your actual ID)
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; 

// Dynamic Navigation Configuration
// To add a new docs folder, just add an entry here and update locales.ts
export const NAV_CONFIG: NavConfigItem[] = [
  { key: 'blog', path: '/blog/', folder: 'blog', titleKey: 'nav.blog' },
  { key: 'practice', path: '/practice/', folder: 'practice', titleKey: 'nav.practice' },
  { key: 'ai', path: '/ai/', folder: 'ai', titleKey: 'nav.ai' },
];

// QR Code Images Configuration
export const QR_IMAGES = {
  wechatContact: '/images/qr/wechat-contact.jpg',
  wechatPay: '/images/qr/wechat-pay.jpg',
  alipay: '/images/qr/alipay-pay.jpg',
};

// About Page Data Definition
export const ABOUT_DATA = {
    skills: [
        { iconKey: 'Layers', textKey: 'about.skills.logic', color: 'text-purple-500' },
        { iconKey: 'Users', textKey: 'about.skills.system', color: 'text-green-500' },
        { iconKey: 'Code', textKey: 'about.skills.engineering', color: 'text-orange-500' },
        { iconKey: 'PenTool', textKey: 'about.skills.experience', color: 'text-blue-500' },
        { iconKey: 'Briefcase', textKey: 'about.skills.management', color: 'text-pink-500' },
    ],
    technicalStack: [
        { key: 'coding', color: 'bg-blue-500' },
        { key: 'framework', color: 'bg-purple-500' },
        { key: 'engineering', color: 'bg-orange-500' },
        { key: 'client', color: 'bg-green-500' },
        { key: 'performance', color: 'bg-pink-500' },
        { key: 'backend', color: 'bg-emerald-500' },
        { key: 'designPattern', color: 'bg-indigo-500' },
        { key: 'algorithm', color: 'bg-cyan-500' },
    ],
    education: {
        university: '湖南湘潭大学',
        major: '计算机科学与技术（本科）',
    },
    personalEvaluation: '热衷于前端开发领域，不断扩展专业知识库，无论面对何种新兴技术，始终持积极态度，并通过阅读专业书籍、资料以及相关视频，能在一周内快速理解并应用这些技术。',
    experience: [
        { 
          date: '2022.07 ~ 2025.09', 
          companyKey: 'company1',
        },
        { 
          date: '2020.01 ~ 2022.05', 
          companyKey: 'company2',
        },
        { 
          date: '2017.07 ~ 2019.12', 
          companyKey: 'company3',
        },
    ]
};
