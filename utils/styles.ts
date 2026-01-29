/**
 * 常用样式类工具函数
 * 用于统一管理重复使用的样式组合
 */

/**
 * 卡片基础样式（带悬停效果）
 */
export const cardBase = 'bg-white/60 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/5 backdrop-blur';

/**
 * 卡片悬停样式
 */
export const cardHover = 'hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-xl transition-all duration-300';

/**
 * 卡片悬停上移效果
 */
export const cardHoverLift = `${cardHover} hover:-translate-y-1`;

/**
 * 技术栈卡片样式
 */
export const techStackCard = `${cardBase} p-6 ${cardHoverLift}`;

/**
 * 统计卡片样式
 */
export const statsCard = `${cardBase} p-6 ${cardHover} transition-colors`;

/**
 * 技能卡片样式
 */
export const skillCard = 'bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 flex flex-col justify-between h-44 group hover:bg-white dark:hover:bg-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1';
