import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function getHref(page, slug, categorySlug) {
  let urlPath = '/';
  if (page === 'shop') urlPath = '/shop';
  else if (page === 'categories') urlPath = '/categories';
  else if (page === 'product-detail' && slug) urlPath = `/product/${slug}`;
  else if (page === 'blog') urlPath = '/blog';
  else if (page === 'blog-detail' && slug) urlPath = `/blog/${slug}`;
  else if (page === 'about') urlPath = '/about';
  else if (page === 'contact') urlPath = '/contact';
  else if (page === 'faq') urlPath = '/faq';
  else if (page === 'wishlist') urlPath = '/wishlist';
  else if (page === 'cart') urlPath = '/cart';
  else if (page === 'account') urlPath = '/account';
  else if (page === 'order-success' && slug) urlPath = `/order-success/${slug}`;
  else if (page === 'shipping') urlPath = '/shipping';
  else if (page === 'returns') urlPath = '/returns';
  else if (page === 'privacy') urlPath = '/privacy';
  else if (page === 'terms') urlPath = '/terms';
  else if (page === 'sitemap') urlPath = '/sitemap';
  
  if (categorySlug && categorySlug !== 'undefined') {
     // ShopPage handles it via state, but if we need a URL for middle click, /shop is the best we have since it's not in the URL schema.
     // Wait, ShopPage uses url /shop and state.
  }
  return urlPath;
}

function fixFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replace <button onClick={() => navigateTo('page')} ...> with <a href="/page" onClick={(e) => { e.preventDefault(); navigateTo('page'); }} ...>
  // This is a naive replacement but works for simple cases.
  content = content.replace(/<button([^>]*)onClick=\{\(\) => navigateTo\('([^']+)'(?:,\s*([^,]+))?(?:,\s*'([^']+)')?\)\}([^>]*)>/g, (match, before, page, slugArg, categorySlug, after) => {
    
    // We only replace if there's no complex logic inside onClick
    const slugStr = (slugArg && slugArg !== 'undefined') ? slugArg.replace(/['"]/g, '') : undefined;
    const href = getHref(page, slugStr, categorySlug);
    
    // Convert button to a
    let args = `'${page}'`;
    if (slugArg) args += `, ${slugArg}`;
    if (categorySlug) args += `, '${categorySlug}'`;
    
    return `<a href="${href}"${before}onClick={(e) => { e.preventDefault(); navigateTo(${args}); }}${after}>`;
  });
  
  // Need to also change the closing </button> to </a> for those!
  // This is dangerous via regex. Let's not do AST parsing here for all buttons, but just for the Footer which has most of them.
  if (filePath.endsWith('Footer.tsx') || filePath.endsWith('Header.tsx')) {
      // Actually, since we replaced the opening tag, we have mismatched tags!
      // This is risky. 
  }

  // Instead of regex for a tag, let's just use the fact that they are simple components
}
