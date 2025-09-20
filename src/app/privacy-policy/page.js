import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer';
export default function PrivacyPolicyPage() {
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
                🔒
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Your privacy, transparency, and data rights matter. Safeguarding your privacy is our highest priority.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Compliant with IT Act 2000, GDPR, and global data protection laws</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Transparent Data Practices</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                At MY DESIGN BAZAAR, accessible from www.mydesignbazaar.com, we outline how we collect, use, process, and protect your personal data when you engage with our platform—whether as a designer, subscriber, buyer, or visitor.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🛡️
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Data Protection</h3>
                <p className="text-gray-600 text-sm">State-of-the-art encryption and security measures</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Full Compliance</h3>
                <p className="text-gray-600 text-sm">Adheres to IT Act 2000, GDPR, and global standards</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🔍
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">Clear communication about data collection and usage</p>
              </div>
            </div>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🧾 Information We Collect</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We collect only essential and purposeful data for business functionality and to enhance your experience on our platform.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    🔹
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Personal Identification</h3>
                  <p className="opacity-90">Basic identity information for account management</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Full Name</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Email Address</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Contact Number</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Business Name (if applicable)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Billing/Shipping Address</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">GSTIN/PAN (for designers/businesses)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account & Transactional */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    💼
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Account & Transactional</h3>
                  <p className="opacity-90">Data for secure transactions and account management</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">User ID and encrypted password</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Purchase history</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Uploaded designs and profiles</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Payout and banking details</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">(for design sellers only)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical & Usage */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Technical & Usage</h3>
                  <p className="opacity-90">Data to optimize platform performance</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Device type, browser, IP address</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Log-in sessions and timestamps</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Pages visited and interactions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">Cookies and cache preferences</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Collect */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🔍 Why We Collect This Information</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                MY DESIGN BAZAAR collects and processes user data for legitimate business purposes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Account Management</h3>
                <p className="text-gray-600 text-sm">Create and manage your account securely with proper authentication</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Transactions</h3>
                <p className="text-gray-600 text-sm">Facilitate design downloads, purchases, and uploads seamlessly</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Secure Payments</h3>
                <p className="text-gray-600 text-sm">Process payments through UPI, Razorpay, Stripe, PayPal, and more</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">User Experience</h3>
                <p className="text-gray-600 text-sm">Improve experience through personalized dashboards and recommendations</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Customer Support</h3>
                <p className="text-gray-600 text-sm">Respond to queries, support requests, or disputes effectively</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Legal Compliance</h3>
                <p className="text-gray-600 text-sm">Ensure legal compliance, fraud detection, and platform safety</p>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Marketing Communications</h3>
              <p className="text-gray-600">
                Send newsletters, offers, or platform updates <strong className="text-blue-600">(only with your consent)</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                🔐
              </div>
              <h2 className="text-4xl font-bold mb-6">How Your Data is Protected</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                We deploy state-of-the-art encryption, SSL certificates, and firewalls to protect your data from unauthorized access, loss, misuse, or theft.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Advanced Encryption</h3>
                <ul className="space-y-2 text-sm">
                  <li>• All passwords encrypted using advanced hashing algorithms</li>
                  <li>• SSL certificates for secure data transmission</li>
                  <li>• End-to-end encryption for sensitive data</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  💳
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Payment Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>• No financial data stored on our servers</li>
                  <li>• Processed via secure third-party gateways</li>
                  <li>• PCI DSS compliant payment processing</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Secure Infrastructure</h3>
                <ul className="space-y-2 text-sm">
                  <li>• ISO/IEC 27001 compliant cloud storage</li>
                  <li>• Designer uploads watermarked during review</li>
                  <li>• Advanced firewalls and intrusion detection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="py-20 bg-gray-100 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🛠️ Cookies and Tracking Technologies</h2>
              <p className="text-xl text-gray-600">MY DESIGN BAZAAR uses cookies to enhance your browsing experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🍪 What Cookies Help Us Do</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Identify returning users</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Remember user preferences</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Optimize page load speed</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Measure site analytics and design trends</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Cookie Control</h3>
                <p className="text-gray-600 mb-4">
                  You may disable cookies in your browser settings; however, this may affect the website&apos;s full functionality.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Disabling cookies may limit some features of our platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Data Sharing */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📤 Third-Party Data Sharing</h2>
              <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3 mb-6">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-800 font-semibold">We strictly do NOT sell or rent your personal data</span>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                However, we may share necessary information with trusted partners under strict agreements
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  💳
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Payment Processors</h3>
                <p className="text-gray-600 text-sm mb-3">Trusted partners like Razorpay, Stripe, PayPal</p>
                <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">Secure & Encrypted</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ⚖️
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Legal Authorities</h3>
                <p className="text-gray-600 text-sm mb-3">Only when required by law</p>
                <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">Legal Compliance</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📞
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Support Partners</h3>
                <p className="text-gray-600 text-sm mb-3">Customer support and mailing services</p>
                <div className="text-xs text-green-600 bg-green-50 rounded px-2 py-1">Confidential</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🔐
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Security Platforms</h3>
                <p className="text-gray-600 text-sm mb-3">Anti-fraud and security services</p>
                <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">Protected</div>
              </div>
            </div>

            <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔒 Partner Protection</h3>
              <p className="text-gray-600">
                All partners are bound by strict <strong className="text-blue-600">data-sharing agreements and NDAs</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Designers' Privacy */}
        <section className="py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🧑‍🎨 Designers&apos; Privacy Consideration</h2>
              <p className="text-xl text-gray-600">Special privacy protections for our creative community</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-4">✅ What&apos;s Visible to Buyers</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Display name</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Brand name (if provided)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Design previews</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-4">🔒 What Remains Confidential</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Email address</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Payment details</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Personal identity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700">
                  <strong className="text-blue-600">Important:</strong> Designs uploaded remain your intellectual property, and buyers receive only the right to use, not ownership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🧾 Data Retention Policy</h2>
              <p className="text-xl text-gray-600">We retain personal data only as long as necessary to fulfill legal and operational purposes</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Account Data</h3>
                <p className="text-gray-600 text-sm mb-2">Active until the account is deleted</p>
                <div className="bg-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  User-controlled retention period
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Transactional Records</h3>
                <p className="text-gray-600 text-sm mb-2">Retained for a minimum of 7 years</p>
                <div className="bg-green-100 rounded-lg p-3 text-xs text-green-700">
                  As per Indian accounting law
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Marketing Data</h3>
                <p className="text-gray-600 text-sm mb-2">Retained until user unsubscribes</p>
                <div className="bg-purple-100 rounded-lg p-3 text-xs text-purple-700">
                  Opt-out anytime
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-4">Uploaded Designs</h3>
                <p className="text-gray-600 text-sm mb-2">Until removed by designer or deactivated</p>
                <div className="bg-orange-100 rounded-lg p-3 text-xs text-orange-700">
                  Designer-controlled
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                🧳
              </div>
              <h2 className="text-4xl font-bold mb-6">User Rights & Control</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                As a valued user, you have full rights to control your personal data
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  📥
                </div>
                <h3 className="font-bold mb-3">Request Access</h3>
                <p className="text-sm opacity-80">Get a copy of your personal data</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🧹
                </div>
                <h3 className="font-bold mb-3">Request Changes</h3>
                <p className="text-sm opacity-80">Rectification or deletion of data</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  ❌
                </div>
                <h3 className="font-bold mb-3">Opt Out</h3>
                <p className="text-sm opacity-80">Marketing communications anytime</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  ⛔
                </div>
                <h3 className="font-bold mb-3">Withdraw Consent</h3>
                <p className="text-sm opacity-80">Where applicable, anytime</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🔍
                </div>
                <h3 className="font-bold mb-3">Data Usage Info</h3>
                <p className="text-sm opacity-80">How your data is used or shared</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  📋
                </div>
                <h3 className="font-bold mb-3">Data Portability</h3>
                <p className="text-sm opacity-80">Transfer data to another service</p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Exercise Your Rights</h3>
              <p className="mb-6 opacity-90">All requests can be submitted via email</p>
              <a href="mailto:info@mydesignbazaar.com" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Data Protection Team
              </a>
            </div>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="py-20 bg-gray-100 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🔄 Updates to this Privacy Policy</h2>
            <p className="text-xl text-gray-600 mb-12">
              We may update this policy periodically to reflect changes in our platform, laws, or technology.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📧
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Email Notification</h3>
                <p className="text-gray-600 text-sm">We will notify users via email when updates are made</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Effective Date</h3>
                <p className="text-gray-600 text-sm">The &quot;Effective Date&quot; at the top will be updated</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ✅
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Implied Acceptance</h3>
                <p className="text-gray-600 text-sm">Continued use implies acceptance of revised terms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📬 Contact Us</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              We take your privacy very seriously. If you have any questions or concerns regarding this policy or your data, please get in touch.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📧
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Email Support</h3>
                <a href="mailto:info@mydesignbazaar.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  info@mydesignbazaar.com
                </a>
                <p className="text-xs text-gray-500 mt-2">For privacy inquiries and data requests</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🌐
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Website</h3>
                <a href="http://www.mydesignbazaar.com" className="text-green-600 hover:text-green-700 font-medium">
                  www.mydesignbazaar.com
                </a>
                <p className="text-xs text-gray-500 mt-2">Visit our main platform</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📞
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Toll-Free Support</h3>
                <span className="text-orange-600 font-medium text-lg">1800-33-4445</span>
                <p className="text-xs text-gray-500 mt-2">Call for immediate assistance</p>
              </div>
            </div>

            {/* Privacy Summary Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">🔒 Privacy at a Glance</h3>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 text-2xl mb-2">🛡️</div>
                  <div className="font-semibold mb-1">Data Protection</div>
                  <div className="text-gray-300">Advanced encryption & security</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-2xl mb-2">🚫</div>
                  <div className="font-semibold mb-1">No Data Sales</div>
                  <div className="text-gray-300">We never sell your information</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 text-2xl mb-2">✅</div>
                  <div className="font-semibold mb-1">Full Control</div>
                  <div className="text-gray-300">You control your data</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 text-2xl mb-2">📋</div>
                  <div className="font-semibold mb-1">Compliance</div>
                  <div className="text-gray-300">GDPR & IT Act compliant</div>
                </div>
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
