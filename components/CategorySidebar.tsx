
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { LanguageContext } from '../app/providers';
import { Layers, FolderOpen, ChevronUp, ChevronDown, ChevronRight, X, Filter } from 'lucide-react';
import { BlogPost } from '../types';

interface CategorySidebarProps {
  posts: BlogPost[];
  selectedGroup: string | null;
  selectedTopic: string | null;
  onSelectGroup: (group: string | null) => void;
  onSelectTopic: (group: string, topic: string) => void;
}

interface CategoryTree {
  [group: string]: {
    count: number;
    children: {
      [topic: string]: number;
    };
  };
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  posts, 
  selectedGroup, 
  selectedTopic, 
  onSelectGroup, 
  onSelectTopic 
}) => {
  const { t } = useContext(LanguageContext);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Build Tree
  const categoryTree = useMemo(() => {
    const tree: CategoryTree = {};
    posts.forEach(post => {
      const subPath = post.subcategory || 'Other/General';
      const parts = subPath.split('/');
      const group = parts[0];
      const topic = parts[1] || 'General';

      if (!tree[group]) {
        tree[group] = { count: 0, children: {} };
      }
      tree[group].count += 1;
      tree[group].children[topic] = (tree[group].children[topic] || 0) + 1;
    });
    return tree;
  }, [posts]);

  // Default expand all
  useEffect(() => {
    if (Object.keys(categoryTree).length > 0) {
        setExpandedGroups(new Set(Object.keys(categoryTree)));
    }
  }, [categoryTree]);

  const toggleGroup = (group: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(group)) newSet.delete(group);
    else newSet.add(group);
    setExpandedGroups(newSet);
  };

  const handleGroupClick = (group: string | null) => {
      onSelectGroup(group);
      setIsMobileFilterOpen(false);
  };

  const handleTopicClick = (group: string, topic: string) => {
      onSelectTopic(group, topic);
      setIsMobileFilterOpen(false);
  };

  return (
    <>
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-lg text-gray-900 dark:text-white transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                 {isMobileFilterOpen ? <X size={18} /> : <Filter size={18} />}
               </div>
               <div className="text-left">
                  <span className="font-bold block text-sm">{t('category.nav')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                    {selectedGroup ? `${selectedGroup} ${selectedTopic ? `/ ${selectedTopic}` : ''}` : t('category.allContent')}
                  </span>
               </div>
            </div>
            <div className={`bg-gray-100 dark:bg-white/5 p-1.5 rounded-full transition-transform duration-300 ${isMobileFilterOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={16} />
            </div>
          </button>
        </div>

        {/* Sidebar Content */}
        <aside className={`
            w-full lg:w-72 flex-shrink-0 space-y-6 transition-all duration-500 ease-in-out overflow-hidden
            ${isMobileFilterOpen ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100 lg:mb-0'}
        `}>
           <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-3 font-bold text-lg mb-6 text-gray-900 dark:text-white">
                 <div className="p-1.5 bg-primary/10 rounded-lg text-primary"><Layers size={18} /></div>
                 <span>{t('category.nav')}</span>
              </div>
              
              <nav className="space-y-1">
                 {/* All Content Button */}
                 <button 
                    onClick={() => handleGroupClick(null)}
                    className={`w-full flex justify-between items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedGroup === null 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
                    }`}
                 >
                    <div className="flex items-center gap-3">
                        <FolderOpen size={16} />
                        <span>{t('category.allContent')}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedGroup === null ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}>
                        {posts.length}
                    </span>
                 </button>

                 <div className="h-px bg-gray-200/50 dark:bg-white/5 my-3"></div>

                 {/* Groups */}
                 {Object.entries(categoryTree).sort().map(([group, data]) => {
                     const isExpanded = expandedGroups.has(group);
                     const isGroupActive = selectedGroup === group;

                     return (
                        <div key={group} className="space-y-1">
                            <div className={`flex items-center justify-between px-2 py-2.5 rounded-xl cursor-pointer transition-all ${
                                isGroupActive && !selectedTopic 
                                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}>
                                <div 
                                    className="flex-1 flex items-center gap-3 text-sm"
                                    onClick={() => handleGroupClick(group)}
                                >
                                     <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isGroupActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                     {group}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); toggleGroup(group); }} className="p-1 hover:text-primary transition-colors">
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>
                            
                            {isExpanded && (
                                <div className="ml-4 pl-3 border-l border-gray-200 dark:border-white/10 space-y-1 py-1 animate-slideDown origin-top">
                                    {Object.entries(data.children).map(([topic, count]) => {
                                        const isTopicActive = selectedGroup === group && selectedTopic === topic;
                                        return (
                                            <button
                                                key={topic}
                                                onClick={() => handleTopicClick(group, topic)}
                                                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs transition-all ${
                                                    isTopicActive
                                                    ? 'text-primary font-bold bg-primary/10'
                                                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                                }`}
                                            >
                                                <span>{topic}</span>
                                                {isTopicActive && <ChevronRight size={12} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                     );
                 })}
              </nav>
           </div>
        </aside>
    </>
  );
};
