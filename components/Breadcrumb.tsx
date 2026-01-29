'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 面包屑导航组件
 * 提供视觉导航和结构化数据（JSON-LD）
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* 视觉导航 */}
      <nav
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
        aria-label="面包屑导航"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <Home size={16} />
          <span>首页</span>
        </Link>
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            <ChevronRight size={16} className="text-gray-400" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};
