import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Layout } from '../Layout';
import { ThemeContext, PostContext, LanguageContext } from '../../app/providers';

// Mock Next.js 相关模块
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock services
vi.mock('../../services/auth', () => ({
  getCurrentUser: vi.fn(() => null),
  logoutUser: vi.fn(),
}));

describe('Layout Component', () => {
  // Mock Context 的值
  const mockThemeContext = {
    isDarkMode: false,
    toggleTheme: vi.fn(),
  };

  const mockPostContext = {
    posts: [],
    loading: false,
  };

  const mockLanguageContext = {
    language: 'zh' as const,
    setLanguage: vi.fn(),
    t: (key: string) => key,
  };

  it('应该渲染子组件', () => {
    const { container } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <PostContext.Provider value={mockPostContext}>
          <LanguageContext.Provider value={mockLanguageContext}>
            <Layout>
              <div>Test Content</div>
            </Layout>
          </LanguageContext.Provider>
        </PostContext.Provider>
      </ThemeContext.Provider>
    );
    expect(container.textContent).toContain('Test Content');
  });
});

