import mongoose from 'mongoose';

/**
 * System Settings Schema
 * For platform-wide configuration settings that can be managed by super admin
 */
const systemSettingsSchema = new mongoose.Schema({
  // Unique key for this setting
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // Setting value (stored as string for flexibility)
  value: {
    type: String,
    required: true,
  },

  // Data type for proper parsing
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json'],
    default: 'string',
  },

  // Human-readable label
  label: {
    type: String,
    required: true,
  },

  // Description/help text
  description: String,

  // Category for grouping settings
  category: {
    type: String,
    enum: ['tax', 'payment', 'email', 'general', 'subscription', 'design', 'security', 'pricing'],
    default: 'general',
  },

  // Last modified by
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Is this setting visible/editable in admin panel
  isEditable: {
    type: Boolean,
    default: true,
  },

  // Is this setting active
  isActive: {
    type: Boolean,
    default: true,
  },

}, {
  timestamps: true,
});

// Index for fast lookups
systemSettingsSchema.index({ key: 1 });
systemSettingsSchema.index({ category: 1 });

// Method to get parsed value based on dataType
systemSettingsSchema.methods.getParsedValue = function() {
  switch (this.dataType) {
    case 'number':
      return parseFloat(this.value);
    case 'boolean':
      return this.value === 'true';
    case 'json':
      try {
        return JSON.parse(this.value);
      } catch (e) {
        return null;
      }
    case 'string':
    default:
      return this.value;
  }
};

// Static method to get a setting by key
systemSettingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  try {
    const setting = await this.findOne({ key, isActive: true });
    if (!setting) return defaultValue;
    return setting.getParsedValue();
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
};

// Static method to set a setting
systemSettingsSchema.statics.setSetting = async function(key, value, userId = null) {
  try {
    const setting = await this.findOne({ key });

    if (setting) {
      setting.value = String(value);
      setting.lastModifiedBy = userId;
      await setting.save();
      return setting;
    }

    return null;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
};

// Static method to initialize default settings
systemSettingsSchema.statics.initializeDefaults = async function() {
  const defaults = [
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

  for (const defaultSetting of defaults) {
    const exists = await this.findOne({ key: defaultSetting.key });
    if (!exists) {
      await this.create(defaultSetting);
      console.log(`✅ Created default setting: ${defaultSetting.key}`);
    }
  }
};

const SystemSettings = mongoose.models.SystemSettings || mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
