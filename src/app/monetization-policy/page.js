import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer';

export default function MonetizationTermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white py-20 px-4">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                💰
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Designer Monetization <br />
                <span className="text-orange-300">Policy & Terms</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                For designers selling on MyDesignBazaar: eligibility, review process, revenue sharing, and legal responsibilities
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Clear terms for creative professionals and entrepreneurs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">45%</div>
                <div className="text-gray-600">Designer Revenue</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">₹2,000</div>
                <div className="text-gray-600">Min. Payout</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">3-7</div>
                <div className="text-gray-600">Review Days</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">₹1,000+</div>
                <div className="text-gray-600">Annual Target</div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📋 Eligibility & Content Requirements</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start your journey as a monetized designer with clear entry requirements and quality standards
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🎨
                    </div>
                    <h3 className="text-2xl font-bold ml-4 text-gray-800">Getting Started</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong className="text-blue-600">Minimum 10 designs</strong> required for platform joining</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong className="text-purple-600">100 designs</strong> needed to unlock full monetization features</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Maintain <strong className="text-orange-600">₹1,000+ annual sales</strong> for continued eligibility</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      📁
                    </div>
                    <h3 className="text-2xl font-bold ml-4 text-gray-800">File Requirements</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700"><strong className="text-green-600">Vector formats:</strong> AI, EPS, SVG, CDR, PSD</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Files must be <strong className="text-blue-600">layered and editable</strong></span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">High resolution and <strong className="text-purple-600">print-ready quality</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 rounded-3xl p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      🚀
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Start Earning</h3>
                    <p className="text-gray-600 max-w-sm">
                      Meet our requirements and begin monetizing your creative talent on India&apos;s fastest-growing design marketplace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                💸
              </div>
              <h2 className="text-4xl font-bold mb-6">Revenue & Payment Structure</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Transparent revenue sharing with flexible payment options designed for Indian creators
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Revenue Split</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/15 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-300 mb-1">45%</div>
                    <div className="text-sm opacity-80">Designer Share</div>
                  </div>
                  <div className="bg-white/15 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-300 mb-1">55%</div>
                    <div className="text-sm opacity-80">Platform Fee</div>
                  </div>
                  <p className="text-sm opacity-90 text-center">Platform handles marketing, hosting, customer acquisition, and payment processing</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Payment Methods</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">UPI (Instant Transfer)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Razorpay Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">PayPal (International)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Direct Bank Transfer</span>
                  </div>
                </div>
                <div className="mt-4 bg-white/15 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-300">Monthly Payouts</div>
                  <div className="text-xs opacity-80">Processed on 1st of each month</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Payout Terms</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/15 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-300 mb-1">₹2,000</div>
                    <div className="text-xs opacity-80">Minimum Payout Threshold</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="opacity-90">• Exclusive/AI designs may have varied pricing</p>
                    <p className="opacity-90">• Platform reserves right to set competitive pricing</p>
                    <p className="opacity-90">• Premium categories earn higher revenue shares</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Review Process */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🔍 Design Review & Approval Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every design undergoes rigorous quality control to maintain our marketplace standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📤
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Step 1: Upload</h3>
                <p className="text-gray-600 text-sm">Designer submits design files through dashboard</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🔍
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Step 2: Review</h3>
                <p className="text-gray-600 text-sm">Manual and digital review for quality and originality</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ⏱️
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Step 3: Timeline</h3>
                <p className="text-gray-600 text-sm">Review completed within 3-7 business days</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Step 4: Live</h3>
                <p className="text-gray-600 text-sm">Approved designs go live on marketplace</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Control Notice</h3>
                  <p className="text-gray-700 mb-4">Files with technical errors, quality issues, or copyright concerns will be sent back for correction. Our team provides detailed feedback to help you meet our standards.</p>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-semibold text-yellow-600 mb-1">Technical Issues</div>
                      <div className="text-gray-600">Resolution, format, layers</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-semibold text-orange-600 mb-1">Quality Standards</div>
                      <div className="text-gray-600">Design aesthetics, market appeal</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-semibold text-red-600 mb-1">Copyright Compliance</div>
                      <div className="text-gray-600">Originality verification</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Responsibilities */}
        <section className="py-20 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                ⚖️
              </div>
              <h2 className="text-4xl font-bold mb-6">Legal Responsibility & Platform Rights</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Understanding ownership, platform rights, and legal obligations in our ecosystem
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">🎨 Copyright & Ownership</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Designers retain full copyright ownership</strong> of their original artwork</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Platform receives <strong>non-exclusive resale rights</strong> for licensing</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Designers may <strong>sell same designs elsewhere</strong> unless marked exclusive</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Platform handles all licensing, sales, and customer support</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">🛡️ Designer Responsibilities</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Full legal responsibility</strong> for IP and copyright compliance</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Guarantee that all uploaded designs are <strong>100% original work</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Immediate liability for any <strong>copyright infringement claims</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Must defend against legal disputes independently</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-300/20">
              <h3 className="text-2xl font-bold mb-6 text-center">⛔ Violations & Consequences</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-400/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🚫
                  </div>
                  <h4 className="font-semibold mb-2">Account Suspension</h4>
                  <p className="text-sm opacity-80">Immediate suspension for copyright violations or disputes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-400/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <h4 className="font-semibold mb-2">Earnings Withheld</h4>
                  <p className="text-sm opacity-80">Platform may withhold earnings during dispute resolution</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-400/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <h4 className="font-semibold mb-2">Design Removal</h4>
                  <p className="text-sm opacity-80">Instant removal of flagged or disputed designs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-8">🔄 Account Management & Performance</h2>
                <p className="text-xl text-gray-600 mb-8">Stay active and maintain performance standards to keep your monetization status</p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Activity Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">Maintain minimum <strong className="text-orange-600">₹1,000 annual sales</strong> target</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">Inactive accounts may be <strong className="text-red-600">deactivated annually</strong></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">Low-performing sellers subject to <strong className="text-purple-600">account review</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Performance Incentives</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">⭐</div>
                          <div className="text-sm font-semibold text-gray-800">Top Performers</div>
                          <div className="text-xs text-gray-600">Enhanced revenue sharing</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">🎯</div>
                          <div className="text-sm font-semibold text-gray-800">Featured Status</div>
                          <div className="text-xs text-gray-600">Premium marketplace placement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-8 h-full">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      📊
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Performance Tracking</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Monitor your sales, earnings, and performance metrics through our comprehensive designer dashboard
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-lg font-bold text-indigo-600">Sales</div>
                        <div className="text-xs text-gray-600">Track daily</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600">Analytics</div>
                        <div className="text-xs text-gray-600">View trends</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-lg font-bold text-pink-600">Earnings</div>
                        <div className="text-xs text-gray-600">Real-time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Summary */}
        <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">📋 Terms Summary</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Key points every designer should remember before joining our monetization program
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    💼
                  </div>
                  <h3 className="text-xl font-bold">Revenue Structure</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p>• 45% designer revenue per sale</p>
                  <p>• Monthly payouts with ₹2,000 minimum</p>
                  <p>• Platform handles pricing strategy</p>
                  <p>• Exclusive designs may have different rates</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <h3 className="text-xl font-bold">Quality Standards</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p>• Minimum 10 designs to start</p>
                  <p>• 100 designs for full monetization</p>
                  <p>• Vector files only (AI/EPS/SVG/CDR/PSD)</p>
                  <p>• 3-7 day manual review process</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    ⚖️
                  </div>
                  <h3 className="text-xl font-bold">Legal Obligations</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p>• Designers retain copyright ownership</p>
                  <p>• Full responsibility for IP compliance</p>
                  <p>• Platform has non-exclusive resale rights</p>
                  <p>• Account suspension for violations</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Monetizing?</h3>
              <p className="mb-6 opacity-90">Join thousands of designers already earning from their creativity on India&apos;s premier design marketplace.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Apply as Designer
                </button>
                <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Guidelines Integration */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🎨 Brand Alignment & Design Categories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Align your designs with our marketplace categories for maximum visibility and sales potential
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">👶</div>
                <h3 className="font-semibold text-gray-800 mb-1">Kidswear Collection</h3>
                <p className="text-xs text-gray-600">Fun, colorful, child-friendly designs</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🧑‍🎓</div>
                <h3 className="font-semibold text-gray-800 mb-1">Teens & Tweens</h3>
                <p className="text-xs text-gray-600">Trendy, youth-oriented graphics</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">👔</div>
                <h3 className="font-semibold text-gray-800 mb-1">Menswear Graphics</h3>
                <p className="text-xs text-gray-600">Masculine, bold design elements</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">👗</div>
                <h3 className="font-semibold text-gray-800 mb-1">Womenswear</h3>
                <p className="text-xs text-gray-600">Elegant, feminine embellishments</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="font-semibold text-gray-800 mb-1">Occasion-Based</h3>
                <p className="text-xs text-gray-600">Festive, wedding, casual, workwear</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-800 mb-1">AI-Generated</h3>
                <p className="text-xs text-gray-600">Cutting-edge AI design themes</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🌸</div>
                <h3 className="font-semibold text-gray-800 mb-1">Cultural & Regional</h3>
                <p className="text-xs text-gray-600">Traditional Indian motifs</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-semibold text-gray-800 mb-1">Typography</h3>
                <p className="text-xs text-gray-600">Quotes, text-based designs</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">💎 Design Excellence Standards</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-blue-200">Technical Requirements:</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Vector-based, layered file formats</p>
                    <p>• High resolution (minimum 300 DPI)</p>
                    <p>• Organized layer structure</p>
                    <p>• Multiple format exports available</p>
                    <p>• Color-changeable elements preferred</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-purple-200">Creative Standards:</h4>
                  <div className="space-y-2 text-sm">
                    <p>• 100% original artwork only</p>
                    <p>• Commercial print-ready quality</p>
                    <p>• Market-relevant design trends</p>
                    <p>• Cultural sensitivity compliance</p>
                    <p>• No copyrighted content or trademarks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Compliance */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 rounded-3xl p-8 h-full">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      🛡️
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Legal Protection</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Understanding copyright laws and your responsibilities as a designer on our platform
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-8">📜 Legal Compliance Notice</h2>
                <p className="text-xl text-gray-600 mb-8">All designs uploaded must comply with Indian Copyright Laws and International IP Treaties</p>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Copyright Responsibility</h3>
                    <div className="space-y-3 text-gray-700">
                      <p className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Designers are <strong>fully responsible</strong> for ensuring originality of all uploaded content</span>
                      </p>
                      <p className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Any copyright infringement claims will be <strong>directly handled by the designer</strong></span>
                      </p>
                      <p className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Platform reserves right to <strong>remove designs and suspend accounts</strong> during disputes</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-blue-600 mb-4">🔒 Platform Protection</h3>
                    <div className="space-y-3 text-gray-700">
                      <p className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>All design files include <strong>licensing watermark:</strong> &quot;© Design licensed by MY DESIGN BAZAAR™&quot;</span>
                      </p>
                      <p className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Commercial use only</strong> - redistribution or resale of digital files prohibited</span>
                      </p>
                      <p className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Legal enforcement monitored under <strong>Indian Copyright Act, 1957</strong></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support & Resources */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📞 Designer Support & Resources</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Our dedicated support team is here to help you succeed on the platform
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📧
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Email Support</h3>
                <a href="mailto:mydesignbazaarindia@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium block mb-2">
                  mydesignbazaarindia@gmail.com
                </a>
                <p className="text-xs text-gray-600">For design review queries and technical support</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🌐
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Website Portal</h3>
                <a href="https://www.mydesignbazaar.com" className="text-green-600 hover:text-green-700 font-medium block mb-2">
                  www.mydesignbazaar.com
                </a>
                <p className="text-xs text-gray-600">Access your designer dashboard and analytics</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📱
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Toll-Free Support</h3>
                <div className="text-orange-600 font-medium mb-2">1800-33-4445</div>
                <p className="text-xs text-gray-600">Phone support for urgent monetization queries</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready to Transform Your Creative Passion into Profit?</h3>
              <p className="mb-6 opacity-90 leading-relaxed">
                Join MY DESIGN BAZAAR™ today and become part of India&apos;s fastest-growing community of successful design entrepreneurs. 
                With our transparent monetization model, comprehensive support, and commitment to designer success, your creative journey starts here.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:mydesignbazaarindia@gmail.com" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Contact Support
                </a>
                <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Start Uploading
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Values Integration */}
        <section className="py-20 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">🌟 Our Commitment to Designers</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Built on the foundation of creativity, integrity, accessibility, and innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
                  🎨
                </div>
                <h3 className="font-semibold mb-2">Creative Freedom</h3>
                <p className="text-sm opacity-80">Express your individuality while earning</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
                  💼
                </div>
                <h3 className="font-semibold mb-2">Commercial Reliability</h3>
                <p className="text-sm opacity-80">Industry-grade design standards</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
                  ⚖️
                </div>
                <h3 className="font-semibold mb-2">Legal Integrity</h3>
                <p className="text-sm opacity-80">Copyright-safe, properly licensed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
                  🌍
                </div>
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-sm opacity-80">Serving users across regions</p>
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}