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

function fixFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 44px hit targets on buttons for mobile
  content = content.replace(/<button([^>]*)className=["']([^"']*)["']([^>]*)>/g, (match, before, classes, after) => {
    let newClasses = classes;
    if (!newClasses.includes('min-h-[44px]')) {
      newClasses += ' min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0';
    }
    return `<button${before}className="${newClasses}"${after}>`;
  });
  
  // Also fix close buttons in modals that might be absolute (add padding if needed, but min-h/min-w covers it)

  // Tabular nums for prices
  // Look for text containing ₹ or price elements
  content = content.replace(/(₹\{[^}]+\})/g, '<span className="tabular-nums">$1</span>');
  content = content.replace(/(₹[0-9,]+)/g, '<span className="tabular-nums">$1</span>');
  
  // Wait, JSX might already be inside a span, nesting spans might be messy, but it's safe.
  // Actually, just add `tabular-nums` to price displays.
  content = content.replace(/className=["']([^"']*text-xl[^"']*)["']/g, (m, c) => {
    if (!c.includes('tabular-nums') && c.includes('text-[#2A0814]')) return `className="${c} tabular-nums"`;
    return m;
  });

  // Safe area padding for main layouts
  // The header and footer and main content should respect safe-area. 
  // Let's add pb-[env(safe-area-inset-bottom)] to Footer or App.tsx main container
  if (filePath.endsWith('App.tsx')) {
    content = content.replace(/<div className="min-h-screen flex flex-col([^"]*)"/g, '<div className="min-h-screen flex flex-col pb-[env(safe-area-inset-bottom)]$1"');
  }

  // Select styling for dark/light mode windows fix
  // "MUST: Native <select>: explicit background-color and color"
  content = content.replace(/<select([^>]*)className=["']([^"']*)["']([^>]*)>/g, (match, before, classes, after) => {
    let newClasses = classes;
    if (!newClasses.includes('bg-')) newClasses += ' bg-white';
    if (!newClasses.includes('text-')) newClasses += ' text-gray-900';
    return `<select${before}className="${newClasses}"${after}>`;
  });

  // URL state/history sync for tabs
  // If we are in AccountPage, let's sync section to URL
  if (filePath.endsWith('AccountPage.tsx')) {
    if (!content.includes('URLSearchParams')) {
      content = content.replace(
        "const [section, setSection] = useState<AccountSection>('profile');",
        `const [section, setSection] = useState<AccountSection>(() => {
    if (typeof window === 'undefined') return 'profile';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as AccountSection;
    return sections.some(s => s.id === tab) ? tab : 'profile';
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', section);
    window.history.replaceState({}, '', url);
  }, [section]);`
      );
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed:', filePath);
  }
}

walkDir('./client/src', fixFile);
console.log('Done fix2');
