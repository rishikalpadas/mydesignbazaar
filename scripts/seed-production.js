#!/usr/bin/env node

/**
 * Production Database Seeding Script
 *
 * This script initializes a fresh MongoDB database with:
 * - Admin accounts
 * - System settings (pricing, GST, etc.)
 * - Essential collections and indexes
 *
 * Usage:
 *   node scripts/seed-production.js
 *
 * Make sure to set MONGODB_URI in your environment before running
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['super_admin', 'designer_admin', 'buyer_admin'], required: true },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// SystemSettings Schema
const SystemSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: String, required: true },
  dataType: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
  label: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['tax', 'payment', 'email', 'general', 'subscription', 'design', 'security', 'pricing'],
    default: 'general',
  },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isEditable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Admin Accounts Configuration
const adminAccounts = [
  {
    email: 'admin@mydesignbazaar.com',
    password: 'Admin@123!MDB',
    name: 'Super Administrator',
    role: 'super_admin',
    permissions: [
      'manage_designers',
      'manage_buyers',
      'manage_designs',
      'manage_payments',
      'manage_orders',
      'view_analytics',
      'manage_admins',
      'system_settings'
    ]
  },
  {
    email: 'designer@mydesignbazaar.com',
    password: 'Designer@123!MDB',
    name: 'Designer Administrator',
    role: 'designer_admin',
    permissions: ['manage_designers', 'manage_designs', 'view_analytics']
  },
  {
    email: 'buyer@mydesignbazaar.com',
    password: 'Buyer@123!MDB',
    name: 'Buyer Administrator',
    role: 'buyer_admin',
    permissions: ['manage_buyers', 'manage_orders', 'manage_payments', 'view_analytics']
  }
];

// System Settings Configuration
const systemSettings = [
  {
    key: 'gst_percentage',
    value: '18',
    dataType: 'number',
    label: 'GST Percentage',
    description: 'GST percentage to be applied on all subscription plans and purchases',
    category: 'tax',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'platform_commission',
    value: '20',
    dataType: 'number',
    label: 'Platform Commission (%)',
    description: 'Commission percentage taken from designer earnings',
    category: 'payment',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'enable_auto_approval',
    value: 'false',
    dataType: 'boolean',
    label: 'Auto-approve Designs',
    description: 'Automatically approve designs without manual review',
    category: 'design',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'minimum_withdrawal_amount',
    value: '1000',
    dataType: 'number',
    label: 'Minimum Withdrawal (₹)',
    description: 'Minimum amount designers can withdraw from their earnings',
    category: 'payment',
    isEditable: true,
    isActive: true,
  },
  // Subscription Plan Prices
  {
    key: 'price_basic_plan',
    value: '600',
    dataType: 'number',
    label: 'Basic Plan Price (₹)',
    description: 'Base price for Basic subscription plan (before GST)',
    category: 'subscription',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'price_premium_plan',
    value: '5000',
    dataType: 'number',
    label: 'Premium Plan Price (₹)',
    description: 'Base price for Premium subscription plan (before GST)',
    category: 'subscription',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'price_elite_plan',
    value: '50000',
    dataType: 'number',
    label: 'Elite Plan Price (₹)',
    description: 'Base price for Elite subscription plan (before GST)',
    category: 'subscription',
    isEditable: true,
    isActive: true,
  },
  // Pay-Per-Download Prices
  {
    key: 'price_standard_design',
    value: '199',
    dataType: 'number',
    label: 'Standard Design Price (₹)',
    description: 'Base price for Premium Standard Design (before GST)',
    category: 'payment',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'price_exclusive_design',
    value: '399',
    dataType: 'number',
    label: 'Exclusive Design Price (₹)',
    description: 'Base price for Exclusive Designer Upload (before GST)',
    category: 'payment',
    isEditable: true,
    isActive: true,
  },
  {
    key: 'price_ai_design',
    value: '499',
    dataType: 'number',
    label: 'AI Design Price (₹)',
    description: 'Base price for AI-Generated Beta Phase Design (before GST)',
    category: 'payment',
    isEditable: true,
    isActive: true,
  },
];

// Prompt user for confirmation
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function seedAdmins(Admin) {
  log('\n📋 Seeding Admin Accounts...', colors.cyan);
  const results = [];

  for (const adminData of adminAccounts) {
    try {
      const existingAdmin = await Admin.findOne({ email: adminData.email });

      if (existingAdmin) {
        log(`  ⏭️  ${adminData.email} - Already exists`, colors.yellow);
        results.push({ email: adminData.email, status: 'exists' });
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      const admin = new Admin({
        ...adminData,
        password: hashedPassword
      });
      await admin.save();

      log(`  ✅ ${adminData.email} - Created (Password: ${adminData.password})`, colors.green);
      results.push({
        email: adminData.email,
        status: 'created',
        password: adminData.password
      });
    } catch (error) {
      log(`  ❌ ${adminData.email} - Error: ${error.message}`, colors.red);
      results.push({ email: adminData.email, status: 'error', error: error.message });
    }
  }

  return results;
}

async function seedSystemSettings(SystemSettings) {
  log('\n⚙️  Seeding System Settings...', colors.cyan);
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const setting of systemSettings) {
    try {
      const existing = await SystemSettings.findOne({ key: setting.key });

      if (existing) {
        log(`  ⏭️  ${setting.key} - Already exists`, colors.yellow);
        skipped++;
        continue;
      }

      await SystemSettings.create(setting);
      log(`  ✅ ${setting.key} - Created`, colors.green);
      created++;
    } catch (error) {
      log(`  ❌ ${setting.key} - Error: ${error.message}`, colors.red);
      errors++;
    }
  }

  return { created, skipped, errors };
}

async function createIndexes() {
  log('\n🔍 Creating Database Indexes...', colors.cyan);

  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    log(`  Found ${collectionNames.length} collections: ${collectionNames.join(', ')}`, colors.blue);
    log('  ✅ Indexes will be created automatically by Mongoose schemas', colors.green);
  } catch (error) {
    log(`  ⚠️  Could not list collections: ${error.message}`, colors.yellow);
  }
}

async function main() {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      log('\n❌ ERROR: MONGODB_URI environment variable is not set!', colors.red);
      log('   Please set it in your .env.production or .env.local file\n', colors.yellow);
      process.exit(1);
    }

    log('\n' + '='.repeat(60), colors.bright);
    log('  🚀 MyDesignBazaar - Production Database Seeder', colors.bright);
    log('='.repeat(60) + '\n', colors.bright);

    log(`📦 MongoDB URI: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`, colors.blue);
    log(`🌍 Node Environment: ${process.env.NODE_ENV || 'not set'}`, colors.blue);

    // Confirmation prompt
    log('\n⚠️  WARNING: This will seed your database with initial data.', colors.yellow);
    const confirmed = await promptUser('Continue? (yes/no): ');

    if (!confirmed) {
      log('\n❌ Operation cancelled by user\n', colors.red);
      process.exit(0);
    }

    // Connect to MongoDB
    log('\n🔌 Connecting to MongoDB...', colors.cyan);
    await mongoose.connect(process.env.MONGODB_URI);
    log('  ✅ Connected successfully!\n', colors.green);

    // Get or create models
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
    const SystemSettings = mongoose.models.SystemSettings || mongoose.model('SystemSettings', SystemSettingsSchema);

    // Seed data
    const adminResults = await seedAdmins(Admin);
    const settingsResults = await seedSystemSettings(SystemSettings);
    await createIndexes();

    // Summary
    log('\n' + '='.repeat(60), colors.bright);
    log('  📊 Seeding Summary', colors.bright);
    log('='.repeat(60), colors.bright);

    log(`\n👥 Admin Accounts:`, colors.cyan);
    const createdAdmins = adminResults.filter(r => r.status === 'created');
    const existingAdmins = adminResults.filter(r => r.status === 'exists');
    const errorAdmins = adminResults.filter(r => r.status === 'error');

    log(`  ✅ Created: ${createdAdmins.length}`, colors.green);
    log(`  ⏭️  Skipped: ${existingAdmins.length}`, colors.yellow);
    log(`  ❌ Errors: ${errorAdmins.length}`, colors.red);

    if (createdAdmins.length > 0) {
      log(`\n  🔑 New Admin Credentials (SAVE THESE!):`, colors.yellow);
      createdAdmins.forEach(admin => {
        log(`     ${admin.email} : ${admin.password}`, colors.yellow);
      });
    }

    log(`\n⚙️  System Settings:`, colors.cyan);
    log(`  ✅ Created: ${settingsResults.created}`, colors.green);
    log(`  ⏭️  Skipped: ${settingsResults.skipped}`, colors.yellow);
    log(`  ❌ Errors: ${settingsResults.errors}`, colors.red);

    log('\n' + '='.repeat(60), colors.bright);
    log('  ✨ Database seeding completed successfully!', colors.green + colors.bright);
    log('='.repeat(60) + '\n', colors.bright);

    log('📝 Next Steps:', colors.cyan);
    log('  1. Change default admin passwords immediately');
    log('  2. Verify pricing and system settings in admin panel');
    log('  3. Test application functionality');
    log('  4. Remove or restrict access to /setup page\n');

    // Close connection
    await mongoose.connection.close();
    log('🔌 Database connection closed\n', colors.blue);
    process.exit(0);

  } catch (error) {
    log('\n❌ FATAL ERROR:', colors.red + colors.bright);
    log(`   ${error.message}\n`, colors.red);
    console.error(error);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

// Run the seeder
main();
