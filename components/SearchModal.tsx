'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { Search, FileText, Hash, Calendar, ArrowRight, Command, X } from 'lucide-react';
import { BlogPost } from '../types';
import { LanguageContext } from '../app/providers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, posts }) => {
  const { t } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
        setQuery('');
        setResults([]);
    }
  }, [isOpen]);

  // Filter logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).slice(0, 5); // Limit to 5 results

    setResults(filtered);
    setSelectedIndex(0);
  }, [query, posts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onClose();
          // Programmatic navigation via Link click simulation or external handler would be cleaner
          // but for simplicity we use the ID trigger logic or just let the Link in render handle clicks.
          // Here we manually trigger the click on the selected element if possible, 
          // or we could pass a navigate function. 
          // For this implementation, we rely on the user hitting Enter triggering the link click logic below.
          const link = document.getElementById(`search-result-${selectedIndex}`);
          link?.click();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100 opacity-100">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden sm:flex items-center gap-2">
             <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{t('search.esc')}</span>
          </div>
          <button onClick={onClose} className="ml-2 sm:hidden p-1 text-gray-500">
             <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div ref={resultContainerRef} className="max-h-[60vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p>{t('search.noResults', { query })}</p>
            </div>
          )}

          {!query && (
             <div className="py-12 text-center text-gray-400 dark:text-gray-500">
                <Command className="mx-auto mb-2 opacity-20" size={48} />
                <p>{t('search.typeToSearch')}</p>
             </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
               <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('search.results')}</div>
               {results.map((post, index) => (
                <Link
                  key={post.slug}
                  id={`search-result-${index}`}
                  href={`/post/${post.slug}`}
                  onClick={onClose}
                  className={`block px-4 py-3 mx-2 rounded-xl transition-colors border-l-4 ${
                    index === selectedIndex 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-primary' 
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className={`font-bold text-base truncate ${
                          index === selectedIndex ? 'text-primary' : 'text-gray-900 dark:text-white'
                      }`}>
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={12} />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           {post.tags.slice(0, 2).map(tag => (
                               <span key={tag} className="flex items-center gap-0.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                   <Hash size={10} /> {tag}
                               </span>
                           ))}
                        </div>
                      </div>
                    </div>
                    {index === selectedIndex && (
                        <ArrowRight className="text-primary self-center" size={18} />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 font-mono">↵</kbd>
                {t('search.select')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 font-mono">↑↓</kbd>
                {t('search.navigate')}
              </span>
           </div>
           <div className="hidden sm:block">
              {t('search.poweredBy')}
           </div>
        </div>
      </div>
    </div>
  );
};