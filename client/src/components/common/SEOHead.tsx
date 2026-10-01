import React, { useEffect } from 'react';
import { PageRoute, Product, BlogPost } from '@shared/types';

interface SEOHeadProps {
  page: PageRoute;
  product?: Product | null;
  post?: BlogPost | null;
  categoryName?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ page, product, post, categoryName }) => {
  useEffect(() => {
    let title = 'TISHNAGII (तिश्नगी) - Artisanal Artificial Jewellery';
    let description =
      'Discover handcrafted luxury artificial jewellery by TISHNAGII. Heritage Kundan, Polki, temple jewellery, and modern bridal statements crafted with timeless elegance.';
    let schemaJson: object | null = null;

    if (page === 'shop') {
      title = categoryName
        ? `${categoryName} Collection | TISHNAGII Artificial Jewellery`
        : 'Curated Artificial Jewellery Collection | TISHNAGII';
      description =
        'Explore hand-carved Kundan chokers, Dravidian temple jhumkas, and royal polki suites. 22K micron antique plated, hypoallergenic, and ethically made.';
    } else if (page === 'categories') {
      title = 'Jewellery Collections & Suites | TISHNAGII (तिश्नगी)';
      description =
        'Browse our distinctive categories: Necklaces & Chokers, Earrings & Jhumkas, Bangles & Kadas, Maang Tikka & Passa, and Royal Bridal Suites.';
    } else if (page === 'product-detail' && product) {
      title = `${product.name} | TISHNAGII`;
      description = product.description.substring(0, 155) + '...';
      schemaJson = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'TISHNAGII',
        },
        offers: {
          '@type': 'Offer',
          url: window.location.href,
          priceCurrency: 'INR',
          price: product.price,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      };
    } else if (page === 'blog') {
      title = 'The TISHNAGII Gazette | Jewellery Styling, Care & Heritage';
      description =
        'Read insider styling tips, artificial jewellery preservation guides, bridesmaid gifting ideas, and deep dives into Indian royal metalcraft.';
    } else if (page === 'blog-detail' && post) {
      title = `${post.title} | TISHNAGII Gazette`;
      description = post.excerpt;
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        author: {
          '@type': 'Person',
          name: post.author,
          jobTitle: post.authorRole,
        },
        publisher: {
          '@type': 'Organization',
          name: 'TISHNAGII',
          logo: {
            '@type': 'ImageObject',
            url: 'https://tishnagii.com/logo.png',
          },
        },
        datePublished: post.date,
      };
    } else if (page === 'about') {
      title = 'Our Heritage & Philosophy | The Story of TISHNAGII (तिश्नगी)';
      description =
        'Tishnagii represents the eternal thirst for aesthetic beauty. Learn about our Karigar collective, sustainable alloy foundations, and bridal craft.';
    } else if (page === 'contact') {
      title = 'Concierge & Bridal Inquiries | TISHNAGII';
      description =
        'Get in touch with our Jaipur atelier and customer concierge for bespoke bridal consultation, order assistance, or styling guidance.';
    } else if (page === 'faq') {
      title = 'Frequently Asked Questions & Care | TISHNAGII';
      description =
        'Find answers regarding shipping times, cash on delivery, anti-tarnish warranty, hypoallergenic materials, and 7-day easy returns.';
    } else if (page === 'wishlist') {
      title = 'Saved Creations | My TISHNAGII Wishlist';
      description = 'View and curate your favorite handcrafted artificial jewellery pieces.';
    } else if (page === 'cart') {
      title = 'Shopping Bag | TISHNAGII';
      description = 'Review your chosen artificial jewellery items, apply gift vouchers, and checkout securely.';
    } else if (page === 'account') {
      title = 'My Account | TISHNAGII';
      description = 'Manage your TISHNAGII profile, saved addresses, and orders.';
    } else if (page === 'order-success') {
      title = 'Order Confirmation | TISHNAGII';
      description = 'Your TISHNAGII order details and invoice.';
    } else if (page === 'shipping') {
      title = 'Shipping & Delivery Information | TISHNAGII';
      description = 'Free insured express shipping across India on orders over ₹1,499. Worldwide express transit with DHL.';
    } else if (page === 'returns') {
      title = 'Hassle-Free Returns & 7-Day Exchange | TISHNAGII';
      description = 'Learn about our 7-day return policy, doorstep reverse pick-up, and 100% money-back guarantee.';
    } else if (page === 'privacy') {
      title = 'Privacy Policy & Data Security | TISHNAGII';
      description = 'We safeguard your personal data with state-of-the-art encryption and strict non-disclosure.';
    } else if (page === 'terms') {
      title = 'Terms of Service & Warranty | TISHNAGII';
      description = 'Read the terms of sale, authentic craft guarantee, and care conditions for TISHNAGII.';
    } else if (page === 'sitemap') {
      title = 'Directory & Sitemap | TISHNAGII';
      description = 'Complete directory of products, categories, blog archives, and customer support pages.';
    } else if (page === '404') {
      title = 'Page Not Found | TISHNAGII';
      description = 'The piece or collection you are looking for has moved or is currently in our vault.';
    }

    // Determine current canonical URL and social preview image
    const currentUrl = window.location.origin + window.location.pathname;
    let previewImage = window.location.origin + '/images/hero_jewellery_campaign_1790671876902.jpg';
    if (product && product.images && product.images.length > 0) {
      previewImage = window.location.origin + product.images[0];
    } else if (post && post.coverImage) {
      previewImage = window.location.origin + post.coverImage;
    }

    // Update document metadata
    document.title = title;

    const updateOrCreateMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('meta[name="description"]', 'name', 'description', description);
    updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    updateOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', previewImage);
    updateOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', previewImage);

    // Robots indexing tag
    const isNoIndex = page === '404' || page === 'cart' || page === 'wishlist' || page === 'account' || page === 'order-success';
    updateOrCreateMeta('meta[name="robots"]', 'name', 'robots', isNoIndex ? 'noindex, follow' : 'index, follow');

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Inject dynamic schema if present
    const existingDynamicScript = document.getElementById('dynamic-jsonld');
    if (existingDynamicScript) {
      existingDynamicScript.remove();
    }
    if (schemaJson) {
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaJson);
      document.head.appendChild(script);
    }
  }, [page, product, post, categoryName]);

  return null;
};
