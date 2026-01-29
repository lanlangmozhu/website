'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy, Terminal, Play, AlertCircle, Loader2, ExternalLink, Maximize2, Github } from 'lucide-react';
import { DemoRegistry } from './demos/registry';

interface MarkdownRendererProps {
  content: string;
}

// Declare hljs on window for TypeScript
declare global {
  interface Window {
    hljs: any;
  }
}

// --- Embed Renderer Component (Iframe) ---
const EmbedBlock = ({ configString }: { configString: string }) => {
  const [loading, setLoading] = useState(true);
  
  let config = { src: '', height: '500px', title: 'Embed' };

  try {
    const parsed = JSON.parse(configString);
    config = { ...config, ...parsed };
  } catch (err: any) {
    return (
        <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <div>
                <strong>Embed Error:</strong> Invalid JSON configuration
                <pre className="mt-2 text-xs opacity-75">{configString}</pre>
            </div>
        </div>
    );
  }

  if (!config.src) return null;

  // --- GitHub Auto-Convert Logic ---
  // Direct GitHub links are blocked by X-Frame-Options.
  // We convert them to StackBlitz embed links for a "Live Code" experience.
  const isGithub = config.src.includes('github.com');
  if (isGithub && !config.src.includes('stackblitz')) {
      // Remove protocol and domain to get 'user/repo'
      let repoPath = config.src.replace(/^https?:\/\/(www\.)?github\.com\//, '');
      // Remove trailing slash
      repoPath = repoPath.replace(/\/$/, '');
      
      // Construct StackBlitz Embed URL
      // Docs: https://developer.stackblitz.com/platform/api/javascript-sdk-options
      config.src = `https://stackblitz.com/github/${repoPath}?embed=1&hideExplorer=1&theme=dark`;
  }

  return (
    <div className="my-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-black/20 shadow-sm group">
       <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isGithub ? <Github size={12} /> : <Maximize2 size={12} />} 
                {config.title}
            </div>
            <a 
              href={config.src} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline"
            >
                Open <ExternalLink size={10} />
            </a>
       </div>
       <div className="relative w-full transition-all duration-500" style={{ height: config.height }}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 z-10">
                <Loader2 className="animate-spin text-gray-400 mb-2" size={24} />
                <span className="text-xs text-gray-400 font-mono">Loading Preview...</span>
            </div>
          )}
          <iframe 
            src={config.src} 
            title={config.title}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
       </div>
    </div>
  );
};

// --- Demo Renderer Component ---
const DemoBlock = ({ configString }: { configString: string }) => {
  const [error, setError] = useState<string | null>(null);
  
  let Component: React.FC<any> | null = null;
  let props = {};

  try {
    const config = JSON.parse(configString);
    if (config.component && DemoRegistry[config.component]) {
      Component = DemoRegistry[config.component];
      props = config.props || {};
    } else {
      throw new Error(`Component "${config.component}" not found in registry.`);
    }
  } catch (err: any) {
    if (!error) console.warn("Demo parse error:", err);
    return (
        <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <div>
                <strong>Demo Error:</strong> {err.message}
                <pre className="mt-2 text-xs opacity-75">{configString}</pre>
            </div>
        </div>
    );
  }

  if (!Component) return null;

  return (
    <div className="my-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-black/20">
       <div className="flex items-center justify-between px-4 py-2 bg-gray-100/50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Play size={12} className="text-primary" /> Live Demo
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
                &lt;{Component.name} /&gt;
            </div>
       </div>
       <div className="p-6 sm:p-10 flex justify-center">
          <Component {...props} />
       </div>
    </div>
  );
};

// --- Standard Code Block Component ---
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  // Hooks must be called before any early returns
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeContent = String(children).replace(/\n$/, '');

  // Check if this should be treated as inline code
  // Single words or short single-line code without explicit language should be inline
  const isShortSingleLine = !inline && codeContent.trim().length <= 50 && !codeContent.includes('\n');
  const shouldBeInline = inline || (isShortSingleLine && (language === 'text' || !match));

  // Apply Syntax Highlighting (must be before early returns)
  useEffect(() => {
    // Only apply highlighting if not demo or embed, and not inline
    if (shouldBeInline || language === 'demo' || language === 'embed') {
      return;
    }
    const highlightCode = () => {
      if (codeRef.current && typeof window !== 'undefined' && window.hljs) {
        try {
          window.hljs.highlightElement(codeRef.current);
        } catch (error) {
          console.warn('Failed to highlight code:', error);
        }
      }
    };

    // Check if hljs is already loaded
    if (typeof window !== 'undefined' && window.hljs) {
      highlightCode();
    } else {
      // Wait for hljs to load
      const checkHljs = setInterval(() => {
        if (typeof window !== 'undefined' && window.hljs) {
          highlightCode();
          clearInterval(checkHljs);
        }
      }, 100);

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkHljs), 5000);
    }
  }, [children, language, shouldBeInline]);
  
  // Intercept 'demo' language
  if (language === 'demo') {
    return <DemoBlock configString={codeContent} />;
  }

  // Intercept 'embed' language (New)
  if (language === 'embed') {
    return <EmbedBlock configString={codeContent} />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (shouldBeInline) {
    return (
      <code className={`${className} bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md font-mono text-sm font-bold border border-gray-200 dark:border-gray-700`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-[#282c34] group relative">
      {/* Mac-style Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#21252b] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
        </div>
        <div className="text-xs font-mono font-medium text-gray-400 select-none uppercase tracking-wider flex items-center gap-2">
          <Terminal size={12} />
          {language}
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-3 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>

      {/* Code Area */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 m-0 bg-[#282c34] !bg-opacity-100 overflow-visible">
          <code ref={codeRef} className={`${className} font-mono text-sm leading-relaxed`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-100
      prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
      prose-p:leading-relaxed prose-p:text-gray-900 dark:prose-p:text-gray-100
      prose-li:text-gray-900 dark:prose-li:text-gray-100
      prose-ul:text-gray-900 dark:prose-ul:text-gray-100
      prose-ol:text-gray-900 dark:prose-ol:text-gray-100
      prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
      prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
    ">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          pre: ({ children }) => <>{children}</>, // Remove default pre wrapper since CodeBlock handles it
          img: ({ src, alt, ...props }) => {
            // 确保图片有 alt 属性（SEO 和可访问性）
            const imageAlt = alt || '文章配图';
            return (
              <img
                src={src}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                {...props}
              />
            );
          },
          a: ({ href, children, ...props }) => {
            // 外部链接添加 rel="noopener noreferrer"
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                {...(isExternal && { rel: 'noopener noreferrer', target: '_blank' })}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
