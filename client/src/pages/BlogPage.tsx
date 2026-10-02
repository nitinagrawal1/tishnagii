import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BLOG_POSTS } from '@shared/data/mockData';
import { ArrowRight, BookOpen } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigateTo } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Jewellery Styling',
    'Jewellery Care',
    'Gifting Guides',
    'Jewellery Trends',
    'Editorial Stories',
  ];

  const filteredPosts =
    selectedCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          The Journal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814]">
          The TISHNAGII Gazette
        </h1>
        <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light leading-relaxed">
          Essays on heritage metalcraft, bridal styling secrets, artificial jewellery preservation, and modern Indian festive couture.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EADBCE]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2A0814] text-[#FAF7F2]'
                : 'bg-[#F4EFEA] text-[#2A0814] hover:bg-[#EADBCE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigateTo('blog-detail', post.slug)}
            className="group cursor-pointer bg-[#FAF7F2] border border-[#EADBCE] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#C49A45] transition-all"
          >
            <div className="aspect-16/10 overflow-hidden bg-[#F4EFEA]">
              <img
                src={post.coverImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#4A1525]/60 mb-2">
                  <span className="text-[#C49A45] font-semibold">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="font-serif text-xl font-medium text-[#2A0814] group-hover:text-[#4A1525] break-words leading-snug tabular-nums">
                  {post.title}
                </h2>

                <p className="text-xs text-[#4A1525]/75 mt-2 break-words leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#EADBCE] flex items-center justify-between text-xs text-[#2A0814]">
                <span className="text-[#4A1525]/60">{post.date}</span>
                <span className="font-semibold group-hover:text-[#C49A45] flex items-center gap-1 transition-colors">
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
