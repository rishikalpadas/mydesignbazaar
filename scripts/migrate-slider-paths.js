/**
 * Migration Script: Update Slider Image Paths
 *
 * This script updates all existing slider image paths to use the API route format.
 * Run this once after deploying the updated code.
 *
 * Usage:
 *   node scripts/migrate-slider-paths.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Slider Schema (inline for migration)
const sliderSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  theme: Object,
  trending: Boolean,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const Slider = mongoose.models.Slider || mongoose.model('Slider', sliderSchema);

async function migrateSliderPaths() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Fetching all sliders...');
    const sliders = await Slider.find({});
    console.log(`Found ${sliders.length} slider(s)\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const slider of sliders) {
      const oldPath = slider.image;
      let newPath = oldPath;

      // Check different path formats and update accordingly
      if (oldPath) {
        // Case 1: Full URL with domain (e.g., http://localhost:3000/uploads/sliders/image.jpg)
        if (oldPath.startsWith('http://') || oldPath.startsWith('https://')) {
          const url = new URL(oldPath);
          const pathWithoutDomain = url.pathname;

          if (pathWithoutDomain.startsWith('/uploads/')) {
            newPath = pathWithoutDomain.replace('/uploads/', '/api/uploads/');
          } else if (pathWithoutDomain.startsWith('/api/uploads/')) {
            newPath = pathWithoutDomain; // Already correct
          }
        }
        // Case 2: Relative path starting with /uploads/ (e.g., /uploads/sliders/image.jpg)
        else if (oldPath.startsWith('/uploads/')) {
          newPath = oldPath.replace('/uploads/', '/api/uploads/');
        }
        // Case 3: Already using API route (e.g., /api/uploads/sliders/image.jpg)
        else if (oldPath.startsWith('/api/uploads/')) {
          console.log(`⏭️  Skipping slider "${slider.title}" - already using API route format`);
          skippedCount++;
          continue;
        }

        // Update if path has changed
        if (newPath !== oldPath) {
          console.log(`🔧 Updating slider: "${slider.title}"`);
          console.log(`   Old path: ${oldPath}`);
          console.log(`   New path: ${newPath}`);

          slider.image = newPath;
          await slider.save();
          updatedCount++;
          console.log(`   ✅ Updated!\n`);
        } else {
          console.log(`⏭️  Skipping slider "${slider.title}" - no changes needed`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️  Warning: Slider "${slider.title}" has no image path`);
        skippedCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   Total sliders: ${sliders.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run migration
migrateSliderPaths();
