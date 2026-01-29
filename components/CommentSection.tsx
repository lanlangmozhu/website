'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Send, MessageSquare, Trash2, LogIn, Monitor, Info, MoreHorizontal } from 'lucide-react';
import ReactGA from 'react-ga4';
import { getCurrentUser, getVisitorId, getBrowserInfo } from '../services/auth';
import { Comment, UserProfile } from '../types';
import { GA_MEASUREMENT_ID } from '../constants';
import { LanguageContext } from '../app/providers';
import { formatDate } from '../utils/i18n';

interface CommentSectionProps {
  slug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
  const { t, language } = useContext(LanguageContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  // Initialize Auth & Load Comments - Only on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const user = getCurrentUser();
    setCurrentUser(user);
    getVisitorId().then(setDeviceId);

    const storedComments = localStorage.getItem(`comments-${slug}`);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error("Failed to parse comments", e);
      }
    }
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    
    setIsSubmitting(true);

    // Track Event in GA4
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
        ReactGA.event({
            category: "User Interaction",
            action: "Post Comment",
            label: slug, // Track which article got the comment
        });
    }

    setTimeout(() => {
        const newComment: Comment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.userId, // Link comment to unique device ID
          name: currentUser.nickname,
          avatar: currentUser.avatar,
          content: content.trim(),
          date: formatDate(new Date(), language),
          browserInfo: getBrowserInfo()
        };

        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);
        localStorage.setItem(`comments-${slug}`, JSON.stringify(updatedComments));
        
        setContent('');
        setIsSubmitting(false);
    }, 600);
  };

  const handleDelete = (id: string) => {
      if(window.confirm(t('comment.deleteConfirm'))) {
          const updatedComments = comments.filter(c => c.id !== id);
          setComments(updatedComments);
          localStorage.setItem(`comments-${slug}`, JSON.stringify(updatedComments));
      }
  };

  // Check if current device owns the comment
  const isOwner = (commentUserId: string) => {
    // 1. Match stored profile ID
    if (currentUser && currentUser.userId === commentUserId) return true;
    // 2. Match raw device fingerprint (fallback)
    if (deviceId === commentUserId) return true;
    return false;
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-200 dark:border-white/5" id="comments">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <MessageSquare size={24} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {t('comment.title')} <span className="text-gray-400 text-lg font-medium ml-1">({comments.length})</span>
            </h3>
        </div>
      </div>

      {/* Auth Gate / Comment Form */}
      {!currentUser ? (
        <div className="mb-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 p-8 rounded-3xl border border-gray-200 dark:border-white/5 text-center backdrop-blur-sm">
            <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <LogIn size={24} className="text-primary" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('comment.join')}</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {t('comment.joinDesc')}
            </p>
            <Link 
                href="/login/" 
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
                {t('comment.loginNow')} <Monitor size={16} />
            </Link>
        </div>
      ) : (
        <div className="mb-12 flex gap-4 animate-fadeIn">
             <div className="flex-shrink-0 hidden sm:block">
                <img src={currentUser.avatar} alt="Me" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-md" />
             </div>
             <form onSubmit={handleSubmit} className="flex-grow relative group">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t('comment.placeholder', { name: currentUser.nickname })}
                    className="w-full min-h-[140px] p-5 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-y text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                    required
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono hidden sm:block opacity-0 group-focus-within:opacity-100 transition-opacity">
                        {t('comment.markdownSupported')}
                    </span>
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className={`flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-bold transition-all ${
                            isSubmitting || !content.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        {isSubmitting ? t('comment.publishing') : <><Send size={16} /> {t('comment.publish')}</>}
                    </button>
                </div>
             </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 sm:gap-6 animate-fadeIn group">
              <div className="flex-shrink-0">
                 <img 
                    src={comment.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${comment.name}`} 
                    alt={comment.name} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-100 dark:border-white/10 shadow-sm bg-white dark:bg-white/5" 
                 />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-baseline gap-3 flex-wrap">
                         <h4 className="font-bold text-gray-900 dark:text-white text-base">{comment.name}</h4>
                         <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{comment.date}</span>
                         {comment.browserInfo && (
                             <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-100 dark:border-white/5">
                                 <Monitor size={10} /> {comment.browserInfo}
                             </span>
                         )}
                    </div>
                    {isOwner(comment.userId) && (
                        <button 
                            onClick={() => handleDelete(comment.id)} 
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
                            title={t('comment.delete')}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
                
                <div className="relative">
                    <div className={`text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base ${isOwner(comment.userId) ? 'bg-primary/5 dark:bg-primary/10 -mx-4 px-4 py-3 rounded-2xl' : ''}`}>
                        {comment.content}
                    </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
             <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-full mb-4 text-gray-400">
                <MoreHorizontal size={32} />
             </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{t('comment.empty')}</p>
          </div>
        )}
      </div>
    </section>
  );
};