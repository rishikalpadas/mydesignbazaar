'use client'
import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import { useAuth } from '@/context/AuthContext';
import Footer from '../../components/Footer';

export default function RefundPolicyPage() {
  const { user } = useAuth();

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@mydesignbazaar.com?subject=Refund Request - [Order Number]';
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
                Refund Policy
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Transparent, fair, and secure refund policies for all digital design purchases on MyDesignBazaar.com
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Customer satisfaction and digital integrity at our core</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">72hrs</div>
                <div className="text-gray-600">Report Window</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">3-5 Days</div>
                <div className="text-gray-600">Investigation Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">7-10 Days</div>
                <div className="text-gray-600">Refund Processing</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">100%</div>
                <div className="text-gray-600">Fair Resolution</div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Product Nature */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                📁
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nature of Our Digital Products</h2>
              <p className="text-xl text-gray-600 mb-8">
                All purchases on MyDesignBazaar.com are for digital design files that are instantly accessible after payment
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🎨</div>
                    <h4 className="font-semibold text-gray-800 mb-2">File Formats</h4>
                    <p className="text-sm text-gray-600">CDR, EPS, PSD, AI, PNG, SVG</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">⚡</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Instant Access</h4>
                    <p className="text-sm text-gray-600">Downloadable immediately after payment</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌍</div>
                    <h4 className="font-semibold text-gray-800 mb-2">International Standards</h4>
                    <p className="text-sm text-gray-600">Following global digital goods norms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Eligibility */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🔄 Refund Eligibility</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Refunds are issued under specific conditions to ensure fair treatment for all users
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Eligible Conditions */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      ✅
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Eligible for Refund</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-lg flex-shrink-0">
                          🔧
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">File Corruption or Technical Issues</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• File is corrupted and cannot be opened</li>
                            <li>• Missing essential elements (layers, editable objects)</li>
                            <li>• Not matching description or preview</li>
                          </ul>
                          <p className="text-xs text-orange-600 mt-2 font-medium">
                            Must report within 72 hours with valid proof
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg flex-shrink-0">
                          📋
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Duplicate Purchase</h4>
                          <p className="text-gray-600 text-sm">
                            If same design purchased more than once in error and not downloaded, 
                            refund or credit issued after verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-Eligible Conditions */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      ❌
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Non-Refundable</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Changed your mind after purchase</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">No longer need the file</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Lack of necessary software or skills</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">File has been downloaded successfully</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Design has been customized or edited</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Download via subscription (not individual purchase)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dispute Resolution Process */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                🔧
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Dispute Resolution Process</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Simple 4-step process to resolve any issues with your purchase
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Contact Support</h3>
                <p className="text-gray-600 text-sm">
                  Email us within 72 hours at support@mydesignbazaar.com
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Provide Details</h3>
                <p className="text-gray-600 text-sm">
                  Share order number, issue description, and proof screenshots
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Investigation</h3>
                <p className="text-gray-600 text-sm">
                  Our team investigates within 3-5 business days
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  4
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Resolution</h3>
                <p className="text-gray-600 text-sm">
                  Refund processed via original payment method in 7-10 days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Refunds */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                  🔁
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Alternative Refund Options</h2>
                <p className="text-xl text-gray-600">
                  We may offer credits instead of monetary refunds to ensure fair use and continued access
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                      💳
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Download Credits</h3>
                    <p className="text-gray-600 mb-6">
                      Use credits to purchase another design of equivalent or lesser value from our marketplace
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-green-700 font-medium">
                        ✓ Never expire • ✓ Transferable • ✓ Full value retained
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                      ⏰
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Extended Subscription</h3>
                    <p className="text-gray-600 mb-6">
                      For active plan users, we may extend your subscription period equivalent to the refund amount
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-blue-700 font-medium">
                        ✓ Bonus time added • ✓ Full access maintained • ✓ Fair compensation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Fraud Section */}
        <section className="py-20 bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 px-4 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                🔒
              </div>
              <h2 className="text-4xl font-bold mb-6">Fraud Protection Policy</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed">
                We maintain a strict policy against fraudulent claims and refund abuse to protect our community
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🚫</div>
                  <h3 className="font-bold mb-2">Zero Tolerance</h3>
                  <p className="text-sm opacity-80">Strict action against refund abuse and unauthorized disputes</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="font-bold mb-2">Legal Action</h3>
                  <p className="text-sm opacity-80">Reserved right to pursue legal remedies for intentional fraud</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="font-bold mb-2">Account Security</h3>
                  <p className="text-sm opacity-80">Permanent ban and access revocation for fraudulent activities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📩 Need Help?</h2>
            <p className="text-xl text-gray-600 mb-12">Our support team is here to assist you</p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Contact Support</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-blue-400">📧</span>
                    <a href="mailto:support@mydesignbazaar.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                      support@mydesignbazaar.com
                    </a>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Subject Line:</strong> Refund Request - [Order Number]
                    </p>
                    <p className="text-xs text-gray-400">
                      Please include your registered email, order number, and clear description of the issue
                    </p>
                  </div>
                  <button 
                    onClick={handleContactSupport}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    Contact Support Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📘 Policy Updates</h3>
              <p className="text-gray-600">
                We reserve the right to modify, update, or terminate this Refund Policy at any time. 
                Your continued use of the platform indicates your acceptance of the most current version.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Last Updated:</strong> This policy is effective immediately upon posting
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