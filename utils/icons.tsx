import React from 'react';
import { Layers, Users, Code, PenTool, Briefcase, BookOpen, Brain } from 'lucide-react';

/**
 * 根据 iconKey 渲染对应的图标组件
 * @param iconKey 图标键名
 * @param size 图标大小
 * @returns React 图标组件
 */
export const renderIcon = (iconKey: string, size: number = 24): React.ReactElement => {
  switch(iconKey) {
    case 'Layers': return <Layers size={size} />;
    case 'Users': return <Users size={size} />;
    case 'Code': return <Code size={size} />;
    case 'PenTool': return <PenTool size={size} />;
    case 'Briefcase': return <Briefcase size={size} />;
    case 'BookOpen': return <BookOpen size={size} />;
    case 'Brain': return <Brain size={size} />;
    default: return <Code size={size} />;
  }
};

/**
 * 根据导航 key 获取对应的图标（用于首页导航卡片）
 * @param key 导航键名
 * @returns React 图标组件
 */
export const getNavIcon = (key: string): React.ReactElement => {
  switch(key) {
    case 'blog': return <BookOpen size={32} />;
    case 'practice': return <Code size={32} />;
    case 'ai': return <Brain size={32} />;
    default: return <BookOpen size={32} />;
  }
};

/**
 * 根据导航 key 获取对应的颜色类（用于首页导航卡片）
 * @param key 导航键名
 * @returns Tailwind CSS 类名
 */
export const getNavColorClass = (key: string): string => {
  switch(key) {
    case 'blog': return 'text-blue-500 group-hover:text-blue-600 bg-blue-50 dark:bg-blue-500/10';
    case 'practice': return 'text-purple-500 group-hover:text-purple-600 bg-purple-50 dark:bg-purple-500/10';
    case 'ai': return 'text-emerald-500 group-hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10';
    default: return 'text-gray-500';
  }
};
