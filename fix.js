import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function fixFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.html')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  if (filePath.endsWith('index.html')) {
    if (!content.includes('theme-color')) {
      content = content.replace('</title>', '</title>\n    <meta name="theme-color" content="#FAF7F2" />');
    }
  }

  // Replace text-xs or text-sm with text-[16px] sm:text-xs/sm for inputs to prevent iOS zoom
  content = content.replace(/<(input|textarea|select)[^>]*className=["']([^"']*)["'][^>]*>/g, (match, tag, classes) => {
    let newClasses = classes;
    if (newClasses.includes('text-xs') && !newClasses.includes('sm:text-xs')) {
      newClasses = newClasses.replace(/\btext-xs\b/g, 'text-[16px] sm:text-xs');
    } else if (newClasses.includes('text-sm') && !newClasses.includes('sm:text-sm')) {
      newClasses = newClasses.replace(/\btext-sm\b/g, 'text-[16px] sm:text-sm');
    } else if (!newClasses.includes('text-') && !newClasses.includes('text-[16px]')) {
      newClasses += ' text-[16px]';
    }
    return match.replace(classes, newClasses);
  });

  // Ensure buttons have touch-manipulation
  content = content.replace(/<button[^>]*className=["']([^"']*)["'][^>]*>/g, (match, classes) => {
    let newClasses = classes;
    if (!newClasses.includes('touch-manipulation')) {
      newClasses += ' touch-manipulation';
    }
    return match.replace(classes, newClasses);
  });
  
  // Ensure links have touch-manipulation
  content = content.replace(/<(a|Link)[^>]*className=["']([^"']*)["'][^>]*>/g, (match, tag, classes) => {
    let newClasses = classes;
    if (!newClasses.includes('touch-manipulation')) {
      newClasses += ' touch-manipulation';
    }
    return match.replace(classes, newClasses);
  });

  // Focus rings: make sure focus:outline-none is replaced with focus-visible:ring
  // Clean up existing duplicates just in case
  content = content.replace(/focus:outline-none focus-visible:ring-1 focus-visible:ring-\[#C49A45\]/g, 'focus:outline-none');
  content = content.replace(/outline-none focus-visible:ring-1 focus-visible:ring-\[#C49A45\]/g, 'outline-none');
  
  content = content.replace(/focus:outline-none/g, 'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]');
  content = content.replace(/outline-none(?!\s+focus-visible:ring-1)/g, 'outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]');
  
  // Clean up if outline-none became focus:outline-none focus-visible:ring-1 ... focus-visible:ring-1 ...
  content = content.replace(/focus:outline-none focus-visible:ring-1 focus-visible:ring-\[#C49A45\] focus-visible:ring-1 focus-visible:ring-\[#C49A45\]/g, 'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45]');

  // Use … instead of ...
  // Be careful not to replace JS spread operators (...) inside code blocks.
  // We can look for '>...<' or ' ... ' in JSX text nodes. 
  // Let's only do it for specific known strings or just skip it if it's too risky.
  // Actually, replace />\s*\.\.\.\s*</ to >…< is slightly safer.
  content = content.replace(/>\s*\.\.\.\s*</g, '>…<');
  content = content.replace(/"\.\.\."/g, '"…"');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed:', filePath);
  }
}

walkDir('./client/src', fixFile);
fixFile('./client/index.html');
console.log('Done.');
