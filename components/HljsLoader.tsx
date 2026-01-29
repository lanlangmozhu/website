'use client';

import { useEffect } from 'react';

/**
 * 优化 Highlight.js 样式加载和配置
 * 1. 将 print media 样式转换为 all，避免阻塞渲染
 * 2. 配置 highlight.js（作为备用方案，确保配置生效）
 */
export const HljsLoader = () => {
  useEffect(() => {
    // 查找所有 media="print" 的样式表并转换为 all
    const stylesheets = document.querySelectorAll('link[media="print"]');
    stylesheets.forEach((link: any) => {
      if (link.href && link.href.includes('highlight.js')) {
        link.media = 'all';
      }
    });

    // 配置 highlight.js（确保配置生效）
    const configureHljs = () => {
      if (typeof window !== 'undefined' && (window as any).hljs) {
        try {
          (window as any).hljs.configure({ ignoreUnescapedHTML: true });
        } catch (error) {
          // 忽略配置错误
        }
      }
    };

    // 立即尝试配置
    configureHljs();

    // 如果库还没加载，等待一下再试（最多等待 2 秒）
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      configureHljs();
      if (attempts >= maxAttempts || (typeof window !== 'undefined' && (window as any).hljs)) {
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return null;
};

