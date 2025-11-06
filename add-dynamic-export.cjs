const fs = require('fs');
const path = require('path');

const dashboardPages = [
  'src/app/about-us/page.js',
  'src/app/brand-guidelines/page.js',
  'src/app/cart/page.js',
  'src/app/contact-us/page.js',
  'src/app/copyright-terms/page.js',
  'src/app/licensing-policy/page.js',
  'src/app/wishlist/page.js',
  'src/app/categories/page.jsx',
  'src/app/designer-portfolio/page.jsx',
  'src/app/pricing/page.js',
  'src/app/reset-password/page.js',
];

const dynamicExport = `\n// Disable static generation for this page (requires authentication)\nexport const dynamic = 'force-dynamic'\n\n`;

dashboardPages.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${filePath} - file not found`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already has dynamic export
    if (content.includes("export const dynamic")) {
      console.log(`Skipping ${filePath} - already has dynamic export`);
      return;
    }

    // Add before the last export default
    const exportIndex = content.lastIndexOf('export default');
    if (exportIndex !== -1) {
      content = content.slice(0, exportIndex) + dynamicExport + content.slice(exportIndex);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Added dynamic export to ${filePath}`);
    } else {
      console.log(`✗ Could not find 'export default' in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
