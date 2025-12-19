'use client';

import React, { useContext, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PostContext, LanguageContext } from '../../app/providers';
import { ArrowRight, Loader2, Hash, FolderOpen, ChevronRight } from 'lucide-react';
import { CategorySidebar } from '../CategorySidebar';

interface CategoryPageProps {
  categoryKey: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryKey }) => {
  const { posts, loading } = useContext(PostContext);
  const { t } = useContext(LanguageContext);
  
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setSelectedGroup(null);
    setSelectedTopic(null);
    setSelectedTag(null);
  }, [categoryKey]);

  const categoryPosts = useMemo(() => 
    posts.filter(post => post.category.toLowerCase() === categoryKey.toLowerCase()), 
  [posts, categoryKey]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    const filteredByNav = categoryPosts.filter(post => {
        if (!selectedGroup) return true;
        const subPath = post.subcategory || 'Other/General';
        const [group, topic] = subPath.split('/');
        if (selectedTopic) return group === selectedGroup && (topic || 'General') === selectedTopic;
        return group === selectedGroup;
    });
    filteredByNav.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [categoryPosts, selectedGroup, selectedTopic]);

  const displayPosts = useMemo(() => {
    return categoryPosts.filter(post => {
      const subPath = post.subcategory || 'Other/General';
      const [group, topic] = subPath.split('/');
      const safeTopic = topic || 'General';

      const matchesGroup = selectedGroup ? group === selectedGroup : true;
      const matchesTopic = selectedTopic ? safeTopic === selectedTopic : true;
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      
      return matchesGroup && matchesTopic && matchesTag;
    });
  }, [categoryPosts, selectedGroup, selectedTopic, selectedTag]);

  const handleSelectGroup = (group: string | null) => {
      setSelectedGroup(group);
      setSelectedTopic(null);
      setSelectedTag(null);
  };

  const handleSelectTopic = (group: string, topic: string) => {
      setSelectedGroup(group);
      setSelectedTopic(topic);
      setSelectedTag(null);
  };

  return (
    <div className="animate-fadeIn min-h-[80vh]">
      <header className="py-12 border-b border-gray-200/50 dark:border-white/5 mb-10">
        <h1 className="text-5xl sm:text-6xl font-black mb-4 text-gray-900 dark:text-white tracking-tighter">{t(`nav.${categoryKey}`)}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl leading-relaxed font-medium">
           {t('siteName')} {t(`nav.${categoryKey}`)} Collection
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Unified Sidebar Component */}
        <CategorySidebar 
            posts={categoryPosts}
            selectedGroup={selectedGroup}
            selectedTopic={selectedTopic}
            onSelectGroup={handleSelectGroup}
            onSelectTopic={handleSelectTopic}
        />

        {/* Right Content */}
        <main className="flex-1 space-y-8">
            {/* Tags */}
            <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white mt-1.5 flex-shrink-0 font-bold">
                    <Hash size={16} className="text-primary" />
                    <span className="text-sm">{t('category.tags')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableTags.length > 0 ? availableTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1 font-medium ${
                                selectedTag === tag
                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary'
                            }`}
                        >
                            {tag}
                        </button>
                    )) : (
                        <span className="text-sm text-gray-400 italic py-1">No tags available</span>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            {(selectedGroup || selectedTag) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 animate-fadeIn">
                    <span>{t('category.currentView')}:</span>
                    {selectedGroup && (
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1 bg-white dark:bg-white/5 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                             {selectedGroup}
                             {selectedTopic && <><ChevronRight size={12} className="text-gray-400" /> {selectedTopic}</>}
                        </span>
                    )}
                    {selectedTag && (
                        <>
                            <span className="text-gray-300">+</span>
                            <span className="font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">#{selectedTag}</span>
                        </>
                    )}
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-300 dark:text-gray-600" size={40} />
                </div>
            ) : displayPosts.length > 0 ? (
            <div className="grid gap-6">
                {displayPosts.map((post, i) => (
                    <Link 
                    key={post.slug} 
                    href={`/post/${post.slug}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className="group flex flex-col sm:flex-row gap-0 sm:gap-6 rounded-[1.5rem] bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm animate-slideUp sm:min-h-[248px]"
                    >
                        <div className="w-full sm:w-72 h-52 sm:h-full sm:min-h-[248px] flex-shrink-0 overflow-hidden relative">
                           {post.image ? (
                             <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                style={{ objectPosition: 'center' }}
                             />
                           ) : (
                             <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <span className="text-4xl text-gray-300 dark:text-gray-700 font-black">
                                    {post.title?.charAt(0) || '?'}
                                </span>
                             </div>
                           )}
                           <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>

                        <div className="flex-1 p-6 sm:py-6 sm:pr-8 sm:pl-0 flex flex-col">
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">{post.subcategory || 'General'}</span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                <span>{post.date}</span>
                            </div>
            
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight tracking-tight line-clamp-2">
                                {post.title}
                            </h2>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed font-medium">
                                {post.excerpt}
                            </p>
            
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    {post.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase border border-gray-200 dark:border-white/5">
                                        #{tag}
                                    </span>
                                    ))}
                                </div>
                                <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                    {t('category.read')} <ArrowRight size={14} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                <FolderOpen size={64} className="mb-6 text-gray-200 dark:text-gray-700" />
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('category.noContent')}</p>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters</p>
                <button onClick={() => { setSelectedGroup(null); setSelectedTag(null); }} className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-primary/30">
                    {t('category.allContent')}
                </button>
            </div>
            )}
        </main>
      </div>
    </div>
  );
};
