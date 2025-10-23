import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import SystemSettings from '../../../../../models/SystemSettings';
import { verifyToken } from '../../../../../middleware/auth';

/**
 * POST /api/admin/settings/init-pricing
 * Initialize pricing settings specifically
 */
export async function POST(request) {
  try {
    await connectDB();

    // Verify super admin
    const authResult = await verifyToken(request);
    if (authResult.error || !authResult.user.isAdmin || authResult.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super admin access required' },
        { status: 401 }
      );
    }

    const pricingSettings = [
      // Subscription Plan Prices (under 'subscription' category)
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
      // Pay-Per-Download Prices (under 'payment' category)
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

    let created = 0;
    let skipped = 0;

    for (const setting of pricingSettings) {
      const exists = await SystemSettings.findOne({ key: setting.key });
      if (!exists) {
        await SystemSettings.create(setting);
        created++;
        console.log(`✅ Created pricing setting: ${setting.key}`);
      } else {
        skipped++;
        console.log(`⏭️  Skipped existing setting: ${setting.key}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pricing settings initialized: ${created} created, ${skipped} already existed`,
      stats: { created, skipped }
    });

  } catch (error) {
    console.error('Initialize pricing settings error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize pricing settings', details: error.message },
      { status: 500 }
    );
  }
}
