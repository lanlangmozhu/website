'use client';

import { useEffect } from 'react';

/**
 * 优化 Highlight.js 样式加载
 * 将 print media 样式转换为 all，避免阻塞渲染
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
  }, []);

  return null;
};

