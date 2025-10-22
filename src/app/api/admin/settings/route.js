import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import SystemSettings from '../../../../models/SystemSettings';
import { verifyToken } from '../../../../middleware/auth';

/**
 * Middleware to verify super admin
 */
async function verifySuperAdmin(request) {
  try {
    // Use the standard verifyToken from middleware
    const authResult = await verifyToken(request);

    if (authResult.error) {
      return { authorized: false, error: authResult.error };
    }

    const user = authResult.user;

    // Check if user is admin
    if (!user.isAdmin) {
      return { authorized: false, error: 'Admin access required' };
    }

    // Check if user is super admin
    if (user.role !== 'super_admin') {
      return { authorized: false, error: 'Access denied. Super admin only.' };
    }

    return { authorized: true, user };
  } catch (error) {
    console.error('Super admin verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

/**
 * GET /api/admin/settings
 * Get all system settings or specific setting by key
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const category = searchParams.get('category');
    const publicOnly = searchParams.get('public') === 'true';

    // If public query, only return specific public settings (like GST)
    if (publicOnly) {
      const gstSetting = await SystemSettings.findOne({ key: 'gst_percentage', isActive: true });
      return NextResponse.json({
        success: true,
        settings: {
          gst_percentage: gstSetting ? gstSetting.getParsedValue() : 18,
        }
      });
    }

    // For admin queries, verify authentication
    const auth = await verifySuperAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    // Get specific setting by key
    if (key) {
      const setting = await SystemSettings.findOne({ key, isActive: true });
      if (!setting) {
        return NextResponse.json(
          { error: 'Setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        setting: {
          key: setting.key,
          value: setting.getParsedValue(),
          rawValue: setting.value,
          dataType: setting.dataType,
          label: setting.label,
          description: setting.description,
          category: setting.category,
          updatedAt: setting.updatedAt,
        }
      });
    }

    // Get all settings or by category
    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const settings = await SystemSettings.find(query).sort({ category: 1, key: 1 });

    return NextResponse.json({
      success: true,
      settings: settings.map(s => ({
        key: s.key,
        value: s.getParsedValue(),
        rawValue: s.value,
        dataType: s.dataType,
        label: s.label,
        description: s.description,
        category: s.category,
        isEditable: s.isEditable,
        updatedAt: s.updatedAt,
      }))
    });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update system setting (Super Admin only)
 */
export async function PUT(request) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { key, value } = await request.json();

    if (!key || value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Find and update setting
    const setting = await SystemSettings.findOne({ key });

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    if (!setting.isEditable) {
      return NextResponse.json(
        { error: 'This setting is not editable' },
        { status: 403 }
      );
    }

    // Validate value based on dataType
    if (setting.dataType === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return NextResponse.json(
          { error: 'Invalid number value' },
          { status: 400 }
        );
      }
      setting.value = String(numValue);
    } else if (setting.dataType === 'boolean') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        return NextResponse.json(
          { error: 'Invalid boolean value' },
          { status: 400 }
        );
      }
      setting.value = String(value);
    } else {
      setting.value = String(value);
    }

    setting.lastModifiedBy = auth.user._id;
    await setting.save();

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
      setting: {
        key: setting.key,
        value: setting.getParsedValue(),
        label: setting.label,
        updatedAt: setting.updatedAt,
      }
    });

  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json(
      { error: 'Failed to update setting', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Initialize default settings or other POST actions (Super Admin only)
 */
export async function POST(request) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'initialize') {
      // Initialize default settings
      await SystemSettings.initializeDefaults();

      return NextResponse.json({
        success: true,
        message: 'Default settings initialized successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('POST settings error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}
