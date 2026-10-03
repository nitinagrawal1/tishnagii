import React from 'react';
import { useShop } from '../context/ShopContext';
import { BLOG_POSTS, PRODUCTS } from '@shared/data/mockData';
import { ArrowLeft, Sparkles, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { handleInternalLinkClick } from '../utils/navigation';

interface BlogDetailPageProps {
  slug: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug }) => {
  const { navigateTo } = useShop();

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  const relatedProducts = post.relatedProductSlugs
    ? PRODUCTS.filter((p) => post.relatedProductSlugs?.includes(p.slug))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <a
        href="/blog"
        onClick={(event) => handleInternalLinkClick(event, () => navigateTo('blog'))}
        className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-[#4A1525]/70 transition-colors hover:text-[#2A0814]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Journal</span>
      </a>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#4A1525]/60">
          <span className="text-[#C49A45] font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2A0814] font-medium leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-9 h-9 rounded-full bg-[#380E1C] text-[#FAF7F2] font-serif flex items-center justify-center text-sm font-semibold">
            {post.author.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-semibold text-[#2A0814] block">
              {post.author}
            </span>
            <span className="text-[11px] text-[#4A1525]/60 font-light">
              {post.authorRole}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Visual */}
      <div className="aspect-16/10 rounded-xs overflow-hidden border border-[#EADBCE] shadow-md bg-[#F4EFEA]">
        <img
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={750}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="space-y-6 text-sm sm:text-base text-[#2A0814]/90 font-light leading-relaxed">
        {post.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Karigar Tips / Practical Guide Box */}
      {post.tips && post.tips.length > 0 && (
        <div className="p-6 bg-[#F4EFEA] border-l-4 border-[#C49A45] rounded-xs space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#2A0814] font-semibold">
            <Sparkles className="w-4 h-4 text-[#C49A45]" />
            <span>Artisan Care Rituals & Styling Rules</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A1525]/85 list-disc pl-5 font-light">
            {post.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Jewellery Featured in this Article */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#EADBCE] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-medium text-[#2A0814]">
              Featured Jewellery in this Story
            </h3>
            <a
              href="/shop"
              onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-[#A77E2C] hover:underline"
            >
              Shop Collection
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
