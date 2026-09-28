import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

console.log('--- Starting Production Build Sync for GitHub Pages ---');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

// 1. Copy dist to docs for GitHub Pages (/docs deployment)
fs.cpSync(distDir, docsDir, { recursive: true });
console.log('✓ Successfully synced dist/ -> docs/');

// 2. Copy dist/assets to root assets/
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
fs.cpSync(path.join(distDir, 'assets'), assetsDir, { recursive: true });
console.log('✓ Successfully synced dist/assets/ -> assets/');

// 3. Overwrite all legacy hash files in assets/ with current bundle to prevent stale caches
const latestJsPath = path.join(distDir, 'assets', 'index.js');
const latestCssPath = path.join(distDir, 'assets', 'index.css');

if (fs.existsSync(latestJsPath) && fs.existsSync(latestCssPath)) {
  const latestJs = fs.readFileSync(latestJsPath);
  const latestCss = fs.readFileSync(latestCssPath);

  const existingAssets = fs.readdirSync(assetsDir);
  for (const file of existingAssets) {
    const fullPath = path.join(assetsDir, file);
    if (file.endsWith('.js') && file !== 'index.js') {
      fs.writeFileSync(fullPath, latestJs);
      console.log(`  Updated legacy asset: assets/${file}`);
    } else if (file.endsWith('.css') && file !== 'index.css') {
      fs.writeFileSync(fullPath, latestCss);
      console.log(`  Updated legacy asset: assets/${file}`);
    }
  }

  // Also do the same in docs/assets
  const docsAssetsDir = path.join(docsDir, 'assets');
  if (fs.existsSync(docsAssetsDir)) {
    const existingDocsAssets = fs.readdirSync(docsAssetsDir);
    for (const file of existingDocsAssets) {
      const fullPath = path.join(docsAssetsDir, file);
      if (file.endsWith('.js') && file !== 'index.js') {
        fs.writeFileSync(fullPath, latestJs);
      } else if (file.endsWith('.css') && file !== 'index.css') {
        fs.writeFileSync(fullPath, latestCss);
      }
    }
  }
}

// 4. Create 404.html for SPA fallback on GitHub Pages
const distHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
fs.writeFileSync(path.join(rootDir, '404.html'), distHtml);
fs.writeFileSync(path.join(docsDir, '404.html'), distHtml);
console.log('✓ Created 404.html in root and docs/ for GitHub Pages SPA support');

// 5. Ensure root index.html can be directly served by static GitHub Pages
fs.writeFileSync(path.join(rootDir, 'index.html'), distHtml);
console.log('✓ Updated root index.html with production-ready bundle reference');

console.log('--- Production Build Sync Completed Successfully ---');
