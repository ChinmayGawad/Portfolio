const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// 1. Copy dist/index.html to root index.html
const distIndexPath = path.join(distDir, 'index.html');
const rootIndexPath = path.join(rootDir, 'index.html');

if (fs.existsSync(distIndexPath)) {
  fs.copyFileSync(distIndexPath, rootIndexPath);
  console.log('Successfully updated root index.html with compiled production bundle references.');
}

// 2. Copy dist/assets to root assets
const distAssetsDir = path.join(distDir, 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');

if (fs.existsSync(distAssetsDir)) {
  if (!fs.existsSync(rootAssetsDir)) {
    fs.mkdirSync(rootAssetsDir, { recursive: true });
  }
  const files = fs.readdirSync(distAssetsDir);
  for (const file of files) {
    fs.copyFileSync(path.join(distAssetsDir, file), path.join(rootAssetsDir, file));
  }
  console.log(`Successfully copied ${files.length} compiled asset(s) to root assets/ directory.`);
}
