/**
 * Sync Script: Update Designer's approvedDesigns Count
 * 
 * This script counts all approved designs for each designer
 * and updates their approvedDesigns field in the Designer collection.
 * 
 * Run this once to sync existing data:
 * node scripts/sync-approved-designs-count.js
 */

import mongoose from 'mongoose';
import { Designer } from '../src/models/User.js';
import Design from '../src/models/Design.js';

// MongoDB connection URL - update this with your connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydesignbazaar';

async function syncApprovedDesigns() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Get all designers
    const designers = await Designer.find({});
    console.log(`Found ${designers.length} designers\n`);

    let updated = 0;
    let unchanged = 0;

    for (const designer of designers) {
      // Count approved designs for this designer
      const approvedCount = await Design.countDocuments({
        uploadedBy: designer.userId,
        status: 'approved'
      });

      const currentCount = designer.approvedDesigns || 0;

      if (approvedCount !== currentCount) {
        // Update the designer's approvedDesigns count
        await Designer.findByIdAndUpdate(
          designer._id,
          { approvedDesigns: approvedCount }
        );
        
        updated++;
        console.log(`✓ Updated ${designer.fullName} (${designer.userId}): ${currentCount} → ${approvedCount} approved designs`);
      } else {
        unchanged++;
        console.log(`- ${designer.fullName} already synced: ${approvedCount} approved designs`);
      }
    }

    console.log('\n========================================');
    console.log('Sync completed successfully!');
    console.log(`Designers updated: ${updated}`);
    console.log(`Designers unchanged: ${unchanged}`);
    console.log(`Total designers: ${designers.length}`);
    console.log('========================================\n');

    // Show designers who are now eligible for wallet earnings
    const eligibleDesigners = await Designer.find({ approvedDesigns: { $gte: 10 } });
    console.log(`\n🎉 ${eligibleDesigners.length} designers are now eligible for wallet earnings (10+ approved designs):\n`);
    
    for (const designer of eligibleDesigners) {
      console.log(`   - ${designer.fullName}: ${designer.approvedDesigns} approved designs`);
    }

  } catch (error) {
    console.error('Sync error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the sync
syncApprovedDesigns();
