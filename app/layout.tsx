import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { HljsLoader } from '../components/HljsLoader';
import Script from 'next/script';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../constants';

// 使用 Next.js 字体优化，自动处理字体加载和子集化
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-outfit',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['前端开发', 'React', 'Next.js', 'TypeScript', '博客', '技术文章', '前端工程师'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`, // 可以后续添加 OG 图片
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/og-image.png`],
    creator: '@your-twitter-handle', // 可以后续添加 Twitter 账号
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  verification: {
    // 可以添加搜索引擎验证
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: lang attribute will be dynamically updated by Providers component
  // Initial value is set to zh-CN, but will be updated based on user preference
  return (
    <html lang="zh-CN" className={`scroll-smooth ${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC (Flash of Unstyled Content) - Initialize theme and language before render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Initialize theme
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                  
                  // Initialize language
                  const savedLanguage = localStorage.getItem('language');
                  const validLanguages = ['zh', 'en', 'jp'];
                  if (savedLanguage && validLanguages.includes(savedLanguage)) {
                    const langMap = { zh: 'zh-CN', en: 'en-US', jp: 'ja-JP' };
                    document.documentElement.lang = langMap[savedLanguage] || 'zh-CN';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Preconnect for critical external resources */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        {/* Highlight.js Theme - 使用 afterInteractive 策略优化加载 */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
          media="print"
        />
        {/* Preload critical Highlight.js script */}
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" 
          as="script"
        />
        {/* 网站结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* 组织/个人结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: SITE_NAME,
              url: SITE_URL,
              jobTitle: '前端工程师',
              description: SITE_DESCRIPTION,
            }),
          }}
        />
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-light dark:bg-dark transition-colors duration-300 antialiased selection:bg-primary/30 selection:text-primary-900`} suppressHydrationWarning>
        
        {/* Highlight.js Core */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" 
          strategy="afterInteractive"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/css.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xml.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js" 
          strategy="afterInteractive" 
        />
        {/* Highlight.js 配置脚本 - 在库加载后执行 */}
        <Script 
          id="hljs-config" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function configureHljs() {
                  if (typeof window !== 'undefined' && window.hljs) {
                    window.hljs.configure({ ignoreUnescapedHTML: true });
                  } else {
                    // 如果库还没加载，等待一下再试
                    setTimeout(configureHljs, 100);
                  }
                }
                configureHljs();
              })();
            `,
          }}
        />
        
        <HljsLoader />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

