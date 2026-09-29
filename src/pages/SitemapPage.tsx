import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES, BLOG_POSTS } from '../data/mockData';
import { Globe, FileText, Check, Copy, ArrowRight } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const { navigateTo, showToast } = useShop();
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;

  const coreRoutes = [
    { name: 'Homepage (Home)', path: '/', page: 'home' as const },
    { name: 'Shop All Jewellery', path: '/shop', page: 'shop' as const },
    { name: 'Jewellery Categories & Suites', path: '/categories', page: 'categories' as const },
    { name: 'About TISHNAGII & Karigar Story', path: '/about', page: 'about' as const },
    { name: 'The Gazette (Journal / Blog)', path: '/blog', page: 'blog' as const },
    { name: 'Bespoke Concierge & Contact', path: '/contact', page: 'contact' as const },
    { name: 'Frequently Asked Questions (FAQ)', path: '/faq', page: 'faq' as const },
    { name: 'Saved Wishlist', path: '/wishlist', page: 'wishlist' as const },
    { name: 'Shopping Bag / Cart', path: '/cart', page: 'cart' as const },
    { name: 'Shipping & Pan-India Delivery', path: '/shipping', page: 'shipping' as const },
    { name: '7-Day Returns & Exchange Policy', path: '/returns', page: 'returns' as const },
    { name: 'Privacy Policy', path: '/privacy', page: 'privacy' as const },
    { name: 'Terms & Conditions', path: '/terms', page: 'terms' as const },
  ];

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${coreRoutes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
${PRODUCTS.map(
  (p) => `  <url>
    <loc>${baseUrl}/product/${p.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
).join('\n')}
${BLOG_POSTS.map(
  (b) => `  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
).join('\n')}
</urlset>`;

  const copySitemap = () => {
    navigator.clipboard.writeText(xmlSitemap);
    setCopied(true);
    showToast('Sitemap XML copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C49A45] font-semibold block">
          Architecture & Indexing
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#2A0814]">
          Directory & Sitemap
        </h1>
        <p className="text-xs sm:text-sm text-[#4A1525]/75 font-light max-w-xl mx-auto leading-relaxed">
          Comprehensive sitemap for search engine crawlers and patrons navigating TISHNAGII.
        </p>
      </div>

      {/* Directory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Pages */}
        <div className="bg-[#FAF7F2] p-6 border border-[#EADBCE] rounded-xs space-y-4">
          <h2 className="font-serif text-lg font-medium text-[#2A0814] pb-2 border-b border-[#EADBCE]">
            Primary Brand & Client Pages ({coreRoutes.length})
          </h2>
          <ul className="space-y-2 text-xs">
            {coreRoutes.map((route) => (
              <li key={route.path} className="flex items-center justify-between">
                <button
                  onClick={() => navigateTo(route.page)}
                  className="text-[#2A0814] hover:text-[#C49A45] font-medium text-left"
                >
                  {route.name}
                </button>
                <span className="text-[#4A1525]/50 font-mono">{route.path}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Catalogue Links */}
        <div className="bg-[#FAF7F2] p-6 border border-[#EADBCE] rounded-xs space-y-4">
          <h2 className="font-serif text-lg font-medium text-[#2A0814] pb-2 border-b border-[#EADBCE]">
            Product Catalog Index ({PRODUCTS.length})
          </h2>
          <ul className="space-y-2 text-xs">
            {PRODUCTS.map((prod) => (
              <li key={prod.id} className="flex min-w-0 items-start justify-between gap-2">
                <button
                  onClick={() => navigateTo('product-detail', prod.slug)}
                  className="min-w-0 flex-1 break-words text-left font-medium text-[#2A0814] hover:text-[#C49A45]"
                >
                  {prod.name}
                </button>
                <span className="shrink-0 font-mono text-[#4A1525]/50">₹{prod.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Categories & Articles Index */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#FAF7F2] p-6 border border-[#EADBCE] rounded-xs space-y-4">
          <h2 className="font-serif text-lg font-medium text-[#2A0814] pb-2 border-b border-[#EADBCE]">
            Suites & Categories ({CATEGORIES.length})
          </h2>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <button
                  onClick={() => navigateTo('shop', undefined, c.id)}
                  className="text-[#2A0814] hover:text-[#C49A45] font-medium"
                >
                  {c.name} ({c.hindiName})
                </button>
                <span className="text-[#4A1525]/50 font-mono">{c.itemCount} pieces</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FAF7F2] p-6 border border-[#EADBCE] rounded-xs space-y-4">
          <h2 className="font-serif text-lg font-medium text-[#2A0814] pb-2 border-b border-[#EADBCE]">
            Journal & Guides ({BLOG_POSTS.length})
          </h2>
          <ul className="space-y-2 text-xs">
            {BLOG_POSTS.map((b) => (
              <li key={b.id} className="flex min-w-0 items-start justify-between gap-2">
                <button
                  onClick={() => navigateTo('blog-detail', b.slug)}
                  className="min-w-0 flex-1 break-words text-left font-medium text-[#2A0814] hover:text-[#C49A45]"
                >
                  {b.title}
                </button>
                <span className="shrink-0 font-mono text-[#4A1525]/50">{b.readTime}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Robots.txt & XML Export */}
      <div className="bg-[#F4EFEA] p-6 border border-[#EADBCE] rounded-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#2A0814]">
            <Globe className="w-4 h-4 text-[#C49A45]" />
            <span>Search Engine XML Feed (sitemap.xml)</span>
          </div>
          <button
            onClick={copySitemap}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#2A0814] text-[#FAF7F2] text-xs rounded-xs hover:bg-[#380E1C] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy XML'}</span>
          </button>
        </div>

        <pre className="p-3 bg-[#FAF7F2] border border-[#EADBCE] text-[10px] font-mono text-[#2A0814] overflow-x-auto max-h-40 rounded-xs">
          {xmlSitemap}
        </pre>
      </div>
    </div>
  );
};
