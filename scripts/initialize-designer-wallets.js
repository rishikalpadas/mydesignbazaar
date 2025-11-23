/**
 * Migration Script: Initialize Wallets for Existing Designers
 * 
 * This script creates wallet records for all existing designers
 * who don't have wallets yet.
 * 
 * Run this script once after deploying the wallet system:
 * node scripts/initialize-designer-wallets.js
 */

import mongoose from 'mongoose';
import { Designer } from '../src/models/User.js';
import { Wallet } from '../src/models/Wallet.js';

// MongoDB connection URL - update this with your connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydesignbazaar';

async function initializeWallets() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Get all designers
    const designers = await Designer.find({});
    console.log(`Found ${designers.length} designers\n`);

    let created = 0;
    let existing = 0;

    for (const designer of designers) {
      // Check if wallet already exists
      const existingWallet = await Wallet.findOne({ userId: designer.userId });
      
      if (existingWallet) {
        existing++;
        console.log(`✓ Wallet already exists for designer ${designer.fullName} (${designer.userId})`);
      } else {
        // Create new wallet
        await Wallet.create({
          userId: designer.userId,
          balance: 0,
          totalEarnings: 0,
          totalWithdrawn: 0,
          currency: 'INR',
          status: 'active'
        });
        created++;
        console.log(`✓ Created wallet for designer ${designer.fullName} (${designer.userId})`);
      }
    }

    console.log('\n========================================');
    console.log('Migration completed successfully!');
    console.log(`Wallets created: ${created}`);
    console.log(`Wallets already existed: ${existing}`);
    console.log(`Total designers: ${designers.length}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
initializeWallets();
