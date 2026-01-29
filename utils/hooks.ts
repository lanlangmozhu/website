import { useState, useEffect } from 'react';

/**
 * 滚动到顶部 Hook
 * @param threshold 显示按钮的滚动阈值（默认 400px）
 * @returns { showButton: boolean, scrollToTop: () => void }
 */
export const useScrollToTop = (threshold: number = 400) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { showButton, scrollToTop };
};
