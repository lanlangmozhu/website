'use client';

import React, { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostContext, LanguageContext } from '../../app/providers';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { CommentSection } from '../CommentSection';
import { ArrowLeft, Calendar, Clock, User, Loader2, Share2, Hash, FileText, ArrowUp } from 'lucide-react';

export const PostPage: React.FC<{ slug: string }> = ({ slug }) => {
  const router = useRouter();
  const { posts, loading } = useContext(PostContext);
  const { t } = useContext(LanguageContext);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Decode URL-encoded slug (handle both encoded and decoded cases)
  const decodedSlug = slug.includes('%') ? decodeURIComponent(slug) : slug;
  
  // Find post by slug (try multiple matching strategies for compatibility)
  const post = posts.find(p => {
    // Direct match
    if (p.slug === slug || p.slug === decodedSlug) return true;
    
    // Normalized match (case-insensitive, trimmed)
    const normalize = (s: string) => s.trim().toLowerCase();
    if (normalize(p.slug) === normalize(slug) || normalize(p.slug) === normalize(decodedSlug)) return true;
    
    // URL-encoded match
    try {
      const encodedSlug = encodeURIComponent(p.slug);
      if (encodedSlug === slug || slug === encodedSlug) return true;
    } catch (e) {
      // Ignore encoding errors
    }
    
    return false;
  });

  useEffect(() => {
    if (!loading && !post) {
      // router.push('/'); 
    }
  }, [post, loading, router]);

  // Scroll listener for Back-to-Top button
  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 400) {
              setShowScrollTop(true);
          } else {
              setShowScrollTop(false);
          }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
      return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      );
  }

  if (!post) return (
      <div className="text-center py-32">
          <h2 className="text-2xl font-bold mb-4">{t('post.notFound')}</h2>
          <Link href="/" className="text-primary hover:underline">{t('post.goHome')}</Link>
      </div>
  );

  return (
    <article className="max-w-4xl mx-auto pb-20 animate-fadeIn font-sans relative">
      {/* Navigation Bar - Static (Not Sticky) */}
      <div className="flex justify-between items-center mb-8 px-4 py-2 bg-white/80 dark:bg-dark/80 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-white/5 shadow-sm relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <ArrowLeft size={16} className="mr-2" /> {t('post.back')}
        </Link>
        <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <Share2 size={18} />
            </button>
        </div>
      </div>

      {/* Hero Image */}
      {post.image && (
          <div className="w-full h-[300px] sm:h-[500px] rounded-[2rem] overflow-hidden mb-12 shadow-2xl shadow-primary/10 relative group">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute bottom-8 left-8 right-8 animate-slideUp">
                   <div className="flex flex-wrap gap-3 mb-4">
                       <span className="bg-primary text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg">
                          {post.subcategory || post.category}
                       </span>
                   </div>
                   <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                        {post.title}
                   </h1>
                   {/* Tags Header */}
                   {post.tags && post.tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/10 hover:bg-white/30 transition-colors cursor-default">
                                <Hash size={10} /> {tag}
                            </span>
                        ))}
                     </div>
                   )}
              </div>
          </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-0">
        {/* Metadata (if no image, title shows here) */}
        {!post.image && (
            <header className="mb-12 border-b border-gray-200 dark:border-white/10 pb-8">
                <div className="flex gap-3 mb-6">
                     <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">
                          {post.subcategory || post.category}
                       </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                    {post.title}
                </h1>
                {/* Tags Header (No Image) */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-default">
                            <Hash size={10} /> {tag}
                        </span>
                    ))}
                    </div>
                )}
            </header>
        )}

        {/* Author & Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-12 font-medium border-b border-gray-100 dark:border-white/5 pb-8">
               <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                       <User size={16} className="text-gray-600 dark:text-gray-300" />
                   </div>
                   <span className="font-bold text-gray-900 dark:text-white">{post.author}</span>
               </div>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="flex items-center gap-1.5"><Calendar size={16} /> {post.date}</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="flex items-center gap-1.5"><Clock size={16} /> {post.readTime}</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="flex items-center gap-1.5"><FileText size={16} /> {post.wordCount?.toLocaleString() || 0} {t('post.words')}</span>
        </div>

        {/* Main Content */}
        <div className="relative">
            <MarkdownRenderer content={post.content} />
        </div>
        
        {/* Comments */}
        <CommentSection slug={post.slug} />
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3.5 rounded-full bg-primary text-white shadow-xl hover:bg-blue-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 z-[100] flex items-center justify-center ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <ArrowUp size={24} />
      </button>
    </article>
  );
};
