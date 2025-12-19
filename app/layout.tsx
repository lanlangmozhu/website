import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { HljsLoader } from '../components/HljsLoader';
import Script from 'next/script';

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
  title: '小菜权的个人网站 - NO BUG, NO CODE',
  description: '小菜权的个人网站',
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
        {/* Highlight.js Theme - 使用 afterInteractive 策略优化加载 */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
          media="print"
        />
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-light dark:bg-dark transition-colors duration-300 antialiased selection:bg-primary/30 selection:text-primary-900`}>
        
        {/* Highlight.js Core */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" 
          strategy="afterInteractive"
        />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/css.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xml.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js" strategy="afterInteractive" />
        <Script id="hljs-config" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.hljs) {
              window.hljs.configure({ ignoreUnescapedHTML: true });
            }
          `}
        </Script>
        
        <HljsLoader />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

