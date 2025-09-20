'use client'
import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Footer from '../../components/Footer';

export default function TermsOfServicePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('designer');

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@mydesignbazaar.com?subject=Legal Inquiry - Terms of Service';
  };

  const handleReportViolation = () => {
    window.location.href = 'mailto:legal@mydesignbazaar.com?subject=Policy Violation Report';
  };

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white py-20 px-4">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Terms of Service
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Comprehensive legal agreements governing the use of MyDesignBazaar platform for designers and manufacturers
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Effective immediately upon platform registration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Legal Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">50%</div>
                <div className="text-gray-600">Designer Revenue Share</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">30 Days</div>
                <div className="text-gray-600">Dispute Window</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-gray-600">Copyright Protection</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">24/7</div>
                <div className="text-gray-600">Legal Compliance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Agreement Tabs */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📋 Legal Agreements</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose your role to view the specific terms and conditions that apply to you
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('designer')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'designer'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    🎨 Designer Agreement
                  </button>
                  <button
                    onClick={() => setActiveTab('manufacturer')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'manufacturer'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    🏭 Manufacturer Agreement
                  </button>
                  <button
                    onClick={() => setActiveTab('platform')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'platform'
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    ⚖️ Platform Terms
                  </button>
                </div>
              </div>
            </div>

            {/* Designer Agreement Tab */}
            {activeTab === 'designer' && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🎨
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Designer Agreement</h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">
                    This agreement governs the relationship between designers and Design Bazaar for selling digital design files.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Designer Rights & Ownership */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                        📝
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Rights & Ownership</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">You retain <strong className="text-blue-600">full copyright ownership</strong> of all uploaded designs</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">You grant <strong className="text-purple-600">non-exclusive rights</strong> to sell your designs multiple times</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Design Bazaar can feature and promote your designs across marketing channels</p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue & Payments */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                        💰
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Revenue & Payments</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                        <p className="text-lg font-semibold text-green-700 mb-2">Earn up to 50% per sale</p>
                        <p className="text-sm text-gray-600">Revenue share based on design performance and exclusivity</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700"><strong>Monthly payouts</strong> via PayPal, Bank Transfer, or UPI</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">You&apos;re responsible for applicable taxes in your country</p>
                      </div>
                    </div>
                  </div>

                  {/* Design Approval */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                        ✅
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Approval Process</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">All designs undergo <strong className="text-purple-600">manual review</strong> before listing</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">We reserve the right to reject designs violating policies</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">AI-powered tools check for copyright violations</p>
                      </div>
                    </div>
                  </div>

                  {/* IP Violations */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
                        🚫
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">IP Violations</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-red-700 font-semibold mb-2">⚠️ Zero Tolerance Policy</p>
                        <p className="text-sm text-gray-600">Must submit original works only - no third-party copyrights</p>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>1st Offense:</strong> Warning & design removal</p>
                        <p><strong>2nd Offense:</strong> Account suspension</p>
                        <p><strong>3rd Offense:</strong> Permanent ban & legal action</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manufacturer Agreement Tab */}
            {activeTab === 'manufacturer' && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🏭
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Manufacturer Agreement</h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">
                    This agreement governs manufacturers purchasing and using digital designs from Design Bazaar.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Usage License */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-xl">
                        📜
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Usage License</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-lg p-4">
                        <p className="text-lg font-semibold text-orange-700 mb-2">Limited Non-Exclusive License</p>
                        <p className="text-sm text-gray-600">For garment production use only</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Use designs for <strong className="text-green-600">manufacturing garments</strong></p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-gray-700"><strong className="text-red-600">Cannot resell, redistribute, or modify</strong> designs as digital products</p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Model */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                        💳
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Pricing Model</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Access based on <strong className="text-purple-600">subscription plans</strong></p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Pay-per-download option available</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Subscription fees are non-refundable except for platform errors</p>
                      </div>
                    </div>
                  </div>

                  {/* Prohibited Uses */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
                        ❌
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Prohibited Uses</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-red-700 font-semibold mb-2">🚫 Strictly Forbidden</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <p className="text-gray-700">Using designs for <strong className="text-red-600">logos, trademarks, or branding</strong></p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <p className="text-gray-700">Promoting hate, violence, or illegal activities</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <p className="text-gray-700">Unauthorized distribution or resale</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal Consequences */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-xl">
                        ⚖️
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Legal Consequences</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-yellow-700 font-semibold mb-2">⚠️ Violation Penalties</p>
                        <p className="text-sm text-gray-600">Misuse results in immediate account termination</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-gray-700"><strong className="text-red-600">Account termination</strong> for unauthorized distribution</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Legal action for copyright violations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Terms Tab */}
            {activeTab === 'platform' && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      ⚖️
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Platform Terms of Service</h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">
                    General terms governing all users of the Design Bazaar platform and associated services.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* General Terms */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                        📋
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">General Terms</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Users must follow <strong className="text-green-600">all platform policies</strong></p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Platform reserves right to suspend/terminate accounts</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Terms subject to change with notice</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Refunds */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                        💰
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Payment & Refunds</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Secure processing through <strong className="text-blue-600">authorized gateways</strong></p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">No refunds for downloaded designs (except technical failures)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">All transactions are final upon completion</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                        🔐
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Account Security</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-700 font-semibold mb-2">🔒 Your Responsibility</p>
                        <p className="text-sm text-gray-600">Maintain account security and protect login credentials</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Platform not liable for unauthorized account access</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">2FA recommended for enhanced security</p>
                      </div>
                    </div>
                  </div>

                  {/* Liability Limitation */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-xl">
                        ⚠️
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 ml-3">Liability Limitation</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-yellow-700 font-semibold mb-2">📝 Important Notice</p>
                        <p className="text-sm text-gray-600">Platform limitations on liability for third-party actions</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Not responsible for third-party misuse of designs</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">Users assume risk for commercial use</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                🔒
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h2>
              <p className="text-xl text-gray-600">
                How we collect, use, and protect your personal information
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📊
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Data Collection</h3>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• User names and email addresses</p>
                  <p>• Payment information (securely processed)</p>
                  <p>• Usage analytics and preferences</p>
                  <p>• Account verification details</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🎯
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Data Usage</h3>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• Account verification and management</p>
                  <p>• Payment processing and invoicing</p>
                  <p>• Service improvements and updates</p>
                  <p>• Customer support and communication</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🛡️
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Data Protection</h3>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• Encryption and security measures</p>
                  <p>• No sale to third parties</p>
                  <p>• Secure cloud storage</p>
                  <p>• Regular security audits</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
              <p className="text-gray-600">
                <strong className="text-indigo-600">Important:</strong> We do not store or process sensitive financial information. 
                All payment data is handled by trusted third-party processors with PCI compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                ⚖️
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Dispute Resolution & Legal Framework</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Comprehensive legal procedures and governing laws for dispute resolution
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    📧
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Dispute Handling</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Report disputes via email support within <strong className="text-red-600">30 days</strong></p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Mediation attempted before legal action</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Fair resolution process for all parties</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🏛️
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Governing Law</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-purple-700 font-semibold text-center">🇮🇳 Indian Law Jurisdiction</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">All agreements governed by Indian law</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Legal disputes handled in <strong className="text-orange-600">Kolkata, India</strong></p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🏅
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Arbitration</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-orange-700 font-semibold text-center text-sm">Arbitration & Conciliation Act, 1996</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Professional arbitration services</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Binding resolution process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright Protection */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                  🛡️
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Copyright & IP Protection Framework</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive protection against copyright infringement and trademark violations
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="text-3xl mb-3">🔍</div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI Detection</h4>
                  <p className="text-sm text-gray-600">Automated copyright violation scanning</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="text-3xl mb-3">👥</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Manual Review</h4>
                  <p className="text-sm text-gray-600">Human verification of all submissions</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instant Removal</h4>
                  <p className="text-sm text-gray-600">Quick action on violation reports</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="text-3xl mb-3">🔐</div>
                  <h4 className="font-semibold text-gray-800 mb-2">DMCA Compliance</h4>
                  <p className="text-sm text-gray-600">Full legal compliance framework</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🚫
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Prohibited Content</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-700 mb-2">❌ Strictly Forbidden</h4>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                        <p>Copyrighted material from third parties</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                        <p>Trademark logos (Nike, Adidas, Disney, etc.)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                        <p>Stock image elements without proper licensing</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                        <p>Celebrity likenesses or branded characters</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      ⚡
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Violation Response</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-700 mb-2">⚠️ Progressive Enforcement</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-yellow-700">1st Violation: Warning + Content Removal</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-orange-700">2nd Violation: Account Suspension (30 days)</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-700">3rd Violation: Permanent Ban + Legal Action</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Termination & Contact */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📞 Legal Support & Contact</h2>
            <p className="text-xl text-gray-600 mb-12">Need legal assistance or have questions about our terms?</p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="font-bold text-gray-800 mb-2">General Support</h3>
                <p className="text-gray-600 text-sm mb-4">Questions about terms and policies</p>
                <button 
                  onClick={handleContactSupport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">⚖️</div>
                <h3 className="font-bold text-gray-800 mb-2">Legal Issues</h3>
                <p className="text-gray-600 text-sm mb-4">Copyright violations and legal matters</p>
                <button 
                  onClick={handleReportViolation}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Report Violation
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="font-bold text-gray-800 mb-2">Business Inquiries</h3>
                <p className="text-gray-600 text-sm mb-4">Partnership and licensing discussions</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Business Contact
                </button>
              </div>
            </div>

            {/* Termination Notice */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">📋 Agreement Termination</h3>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-3">Termination Rights</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Either party may terminate with 30 days written notice</p>
                      <p>• Immediate termination for policy violations</p>
                      <p>• Account closure removes future access only</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-300 mb-3">Post-Termination</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Previous sales and licenses remain valid</p>
                      <p>• Outstanding payments will be processed</p>
                      <p>• Design listings will be removed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Notice */}
            <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📘 Terms Updates & Acceptance</h3>
              <p className="text-gray-600 mb-4">
                These terms constitute the complete agreement between you and Design Bazaar. 
                We may update these terms at any time with appropriate notice to users.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-indigo-700 font-medium">
                  <strong>By using Design Bazaar, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                <strong>Last Updated:</strong> These terms are effective immediately upon posting • <strong>Jurisdiction:</strong> Kolkata, India
              </p>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}