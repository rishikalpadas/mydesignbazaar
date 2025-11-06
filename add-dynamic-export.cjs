const fs = require('fs');
const path = require('path');

const dashboardPages = [
  'src/app/dashboard/buyers/page.js',
  'src/app/dashboard/designers/page.js',
  'src/app/dashboard/designers/blocked/page.js',
  'src/app/dashboard/designers/pending/page.js',
  'src/app/dashboard/designers/[id]/page.js',
  'src/app/dashboard/designs/page.js',
  'src/app/dashboard/my-designs/page.js',
  'src/app/dashboard/profile/page.js',
  'src/app/dashboard/settings/page.js',
  'src/app/dashboard/upload/page.js',
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
