import fs from 'fs';

function fixFooter() {
  const file = './client/src/components/layout/Footer.tsx';
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace simple buttons that call navigateTo
  const regex = /<button\s+onClick=\{\(\) => navigateTo\('([^']+)'(?:,\s*undefined,\s*'([^']+)')?\)\}\s+className="([^"]+)"\s*>([^<]+)<\/button>/g;
  
  content = content.replace(regex, (match, page, category, classes, text) => {
    let href = page === 'shop' ? '/shop' : `/${page}`;
    let args = `'${page}'`;
    if (category) args += `, undefined, '${category}'`;
    
    return `<a href="${href}" onClick={(e) => { e.preventDefault(); navigateTo(${args}); }} className="${classes}">${text}</a>`;
  });
  
  // Also the bottom links
  const regexBottom = /<button\s+onClick=\{\(\) => navigateTo\('([^']+)'\)\}\s+className="([^"]+)"\s*>([^<]+)<\/button>/g;
  content = content.replace(regexBottom, (match, page, classes, text) => {
    let href = `/${page}`;
    return `<a href="${href}" onClick={(e) => { e.preventDefault(); navigateTo('${page}'); }} className="${classes}">${text}</a>`;
  });

  fs.writeFileSync(file, content, 'utf-8');
}
fixFooter();
console.log('Fixed Footer');
