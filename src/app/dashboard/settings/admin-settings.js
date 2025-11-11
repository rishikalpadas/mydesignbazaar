'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Percent, DollarSign, Shield, Save, RefreshCw, Package, ShoppingCart } from 'lucide-react';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default function AdminSettingsContent() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editedValues, setEditedValues] = useState({});
  const router = useRouter();

  // Check authentication and authorization
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.isAdmin && data.user.role === 'super_admin') {
          setUser(data.user);
        } else {
          // Not a super admin, redirect
          router.push('/dashboard');
        }
      } else {
        // Not authenticated, redirect to login
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/dashboard');
    } finally {
      setUserLoading(false);
    }
  }, [router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        // Initialize edited values
        const initialValues = {};
        data.settings.forEach(s => {
          initialValues[s.key] = s.value;
        });
        setEditedValues(initialValues);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch settings' });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Error fetching settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleValueChange = (key, value) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key) => {
    try {
      setSaving(true);
      const value = editedValues[key];

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `${data.setting.label} updated successfully!` });
        await fetchSettings(); // Refresh settings
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update setting' });
      }
    } catch (error) {
      console.error('Save setting error:', error);
      setMessage({ type: 'error', text: 'Failed to save setting' });
    } finally {
      setSaving(false);
    }
  };

  const initializeDefaults = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initialize' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Default settings initialized!' });
        await fetchSettings();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to initialize' });
      }
    } catch (error) {
      console.error('Initialize error:', error);
      setMessage({ type: 'error', text: 'Failed to initialize settings' });
    } finally {
      setSaving(false);
    }
  };

  const initializePricing = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings/init-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `Pricing settings initialized! ${data.stats.created} created, ${data.stats.skipped} already existed.` });
        await fetchSettings();
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to initialize pricing' });
      }
    } catch (error) {
      console.error('Initialize pricing error:', error);
      setMessage({ type: 'error', text: 'Failed to initialize pricing settings' });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tax':
        return <Percent className="w-5 h-5 text-orange-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'security':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'subscription':
        return <DollarSign className="w-5 h-5 text-purple-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  // Separate pricing settings from other settings
  const pricingKeys = [
    'price_basic_plan',
    'price_premium_plan',
    'price_elite_plan',
    'price_standard_design',
    'price_exclusive_design',
    'price_ai_design'
  ];

  const subscriptionPriceKeys = ['price_basic_plan', 'price_premium_plan', 'price_elite_plan'];
  const payPerDownloadKeys = ['price_standard_design', 'price_exclusive_design', 'price_ai_design'];

  const pricingSettings = settings.filter(s => pricingKeys.includes(s.key));

  // Sort subscription prices in the correct order (Basic, Premium, Elite)
  const subscriptionPrices = subscriptionPriceKeys
    .map(key => pricingSettings.find(s => s.key === key))
    .filter(Boolean);

  // Sort pay-per-download prices in the correct order (Standard, Exclusive, AI)
  const payPerDownloadPrices = payPerDownloadKeys
    .map(key => pricingSettings.find(s => s.key === key))
    .filter(Boolean);
  const otherSettings = settings.filter(s => !pricingKeys.includes(s.key));

  const groupedSettings = otherSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {});

  if (userLoading || !user) {
    return <LoadingSpinner />;
  }

  const settingsContent = (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Manage platform-wide configuration settings</p>
          </div>
          {/* <div className="flex space-x-3">
            <button
              onClick={initializePricing}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <DollarSign className={`w-4 h-4 mr-2`} />
              Add Pricing Settings
            </button>
            <button
              onClick={initializeDefaults}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              Initialize Defaults
            </button>
          </div> */}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Subscription Plan Prices Section */}
      {subscriptionPrices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 ml-3">Subscription Plan Prices</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {subscriptionPrices.map((setting) => (
              <div key={setting.key} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
                    )}

                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={editedValues[setting.key] || ''}
                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        disabled={!setting.isEditable || saving}
                        step="0.01"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />

                      <button
                        onClick={() => handleSave(setting.key)}
                        disabled={!setting.isEditable || saving || editedValues[setting.key] === setting.rawValue}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Last updated: {new Date(setting.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay-Per-Download Prices Section */}
      {payPerDownloadPrices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 ml-3">Pay-Per-Download Prices</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {payPerDownloadPrices.map((setting) => (
              <div key={setting.key} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
                    )}

                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={editedValues[setting.key] || ''}
                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        disabled={!setting.isEditable || saving}
                        step="0.01"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />

                      <button
                        onClick={() => handleSave(setting.key)}
                        disabled={!setting.isEditable || saving || editedValues[setting.key] === setting.rawValue}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Last updated: {new Date(setting.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.keys(groupedSettings).map((category) => (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
              <div className="flex items-center">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-bold text-gray-900 ml-3 capitalize">{category} Settings</h2>
              </div>
            </div>

            {/* Settings List */}
            <div className="p-6 space-y-6">
              {groupedSettings[category].map((setting) => (
                <div key={setting.key} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {setting.label}
                      </label>
                      {setting.description && (
                        <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
                      )}

                      <div className="flex items-center space-x-4">
                        {setting.dataType === 'boolean' ? (
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedValues[setting.key] === 'true'}
                              onChange={(e) => handleValueChange(setting.key, e.target.checked ? 'true' : 'false')}
                              disabled={!setting.isEditable || saving}
                              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">
                              {editedValues[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
                            </span>
                          </label>
                        ) : (
                          <input
                            type={setting.dataType === 'number' ? 'number' : 'text'}
                            value={editedValues[setting.key] || ''}
                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                            disabled={!setting.isEditable || saving}
                            step={setting.dataType === 'number' ? '0.01' : undefined}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder={`Enter ${setting.label.toLowerCase()}`}
                          />
                        )}

                        {setting.dataType === 'number' && setting.key.includes('percentage') && (
                          <span className="text-gray-600 font-medium">%</span>
                        )}

                        <button
                          onClick={() => handleSave(setting.key)}
                          disabled={!setting.isEditable || saving || editedValues[setting.key] === setting.rawValue}
                          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </button>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        Last updated: {new Date(setting.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {settings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Settings Found</h3>
          <p className="text-gray-600 mb-6">Initialize default settings to get started</p>
          <button
            onClick={initializeDefaults}
            disabled={saving}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Initialize Default Settings
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        settingsContent
      )}
    </>
  );
}
