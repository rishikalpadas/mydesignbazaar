'use client'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import { useAuth } from '../../context/AuthContext';

export default function AboutPage() {

  const { user } = useAuth();

  const handleStartAsDesigner=()=>{
    console.log("[v0] Button clicked, user:", user) // Added debug logging
    if (!user) {
      console.log("[v0] No user, opening auth modal")
      setShowAuthModal(true)
    } else if (user.userType === "designer") {
      console.log("[v0] User is designer, redirecting to dashboard")
      router.push("/dashboard")
    } else if (user.userType === "buyer") {
      console.log("[v0] User is buyer, showing role prompt")
      setShowRolePrompt(true)
    } else {
      console.log("[v0] Unknown user type:", user.userType)
    }
  
  }
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
                Empowering Designers. <br />
                <span className="text-orange-300">Inspiring Garments.</span> <br />
                Elevating Fashion.
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                We&apos;re not just another digital marketplace — we&apos;re a revolutionary bridge between visionary garment designers and ambitious fashion manufacturers.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Founded with a clear mission to democratize design accessibility</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">2.5K+</div>
                <div className="text-gray-600">Active Designers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-gray-600">Designs Sold</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">10K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">4.9★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Who We Are */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🎯
                    </div>
                    <h2 className="text-2xl font-bold ml-4 text-gray-800">Our Vision</h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To become the <strong className="text-blue-600">leading global platform for ready-to-use garment designs</strong>, where fashion creativity meets manufacturing convenience — reducing time-to-market and eliminating the gap between concept and production.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🧵
                    </div>
                    <h2 className="text-2xl font-bold ml-4 text-gray-800">Who We Are</h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    We are a <strong className="text-orange-600">tech-driven platform</strong> based in India, built by industry insiders, graphic artists, and digital entrepreneurs who understand the complex needs of both sides.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-600 mb-2">For Designers</h4>
                      <p className="text-sm text-gray-600">Seeking recognition and monetization</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-600 mb-2">For Buyers</h4>
                      <p className="text-sm text-gray-600">Manufacturers, exporters, boutiques</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 rounded-3xl p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      🌍
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Global Reach</h3>
                    <p className="text-gray-600 max-w-sm">
                      Connecting creative talent with manufacturing excellence across continents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🌍 What We Offer</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A curated, layered, vector-based digital design library exclusively tailored for the garment and fashion industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Standard Premium Designs</h3>
                <p className="text-gray-600 leading-relaxed">For day-to-day production needs with high-quality, ready-to-use designs.</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Generated Beta Designs</h3>
                <p className="text-gray-600 leading-relaxed">For futuristic, trend-driven innovation with cutting-edge technology.</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🧵
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Exclusive One-Time Purchase</h3>
                <p className="text-gray-600 leading-relaxed">Signature collections with full commercial licensing rights.</p>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  💡
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Customizable Vectors</h3>
                <p className="text-gray-600 leading-relaxed">With color-changing and layering options for maximum flexibility.</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📥
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Formats</h3>
                <p className="text-gray-600 leading-relaxed">Downloadable in PSD, CDR, AI, SVG, PNG & EPS formats.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🔐
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Commercial Licensing</h3>
                <p className="text-gray-600 leading-relaxed">Copyright-safe usability with transparent licensing terms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* For Designers & Buyers */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    💼
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">For Designers</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">We offer complete creative autonomy and monetization:</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Upload designs and earn up to <strong className="text-blue-600">50% revenue per sale</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Monetize via <strong className="text-purple-600">subscriptions and exclusive downloads</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Retain <strong className="text-orange-600">full copyright ownership</strong> of your artwork</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Sell your work to thousands of manufacturers globally</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">We handle marketing, hosting, customer acquisition, and payment</span>
                  </div>
                </div>
                <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  Join as Designer
                </button>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🛒
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">For Buyers</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">Say goodbye to long design cycles, endless revisions, or risky downloads:</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">A <strong className="text-orange-600">cost-effective alternative to hiring designers</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">Instant access to <strong className="text-pink-600">commercially-licensed, production-ready</strong> designs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Search by <strong className="text-red-600">category, gender, occasion, and trend</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Fast, secure downloads in editable formats</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Full usage rights with transparent pricing</span>
                  </div>
                </div>
                <button className="mt-6 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  Start Buying
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* IP Protection */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                🔐
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment to IP Protection</h2>
              <p className="text-xl text-gray-600 mb-8">We take copyright infringement seriously.</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-3">🔍</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Manual Review</h4>
                  <p className="text-sm text-gray-600">All designs undergo manual and digital review</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Legal Responsibility</h4>
                  <p className="text-sm text-gray-600">Designers are held legally responsible for originality</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-3">🚫</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Quick Removal</h4>
                  <p className="text-sm text-gray-600">Immediate removal of reported violations</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h4 className="font-semibold text-gray-800 mb-2">No Liability</h4>
                  <p className="text-sm text-gray-600">Platform retains no liability for IP misuse</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 Our Unique Revenue Model</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              My Design Bazaar operates on a subscription + pay-per-download model with flexible pricing
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">📅</div>
                <h3 className="font-bold text-gray-800 mb-2">Monthly Subscriptions</h3>
                <p className="text-gray-600 text-sm">For regular users who need consistent access</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">💰</div>
                <h3 className="font-bold text-gray-800 mb-2">Pay-Per-Download</h3>
                <p className="text-gray-600 text-sm">On-demand purchases for occasional buyers</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">🏆</div>
                <h3 className="font-bold text-gray-800 mb-2">Tiered Monetization</h3>
                <p className="text-gray-600 text-sm">Rewarding top-performing designers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">🔗 Our Ecosystem</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed">
                We&apos;re more than a marketplace. We&apos;re building a <strong>community</strong> of creators, innovators, and entrepreneurs. Whether you&apos;re a fashion startup, a mass production unit, or an independent illustrator, My Design Bazaar offers the digital tools, exposure, and ecosystem to elevate your fashion business.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-bold mb-2">Fashion Startups</h3>
                  <p className="text-sm opacity-80">Quick access to professional designs</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🏭</div>
                  <h3 className="font-bold mb-2">Mass Production</h3>
                  <p className="text-sm opacity-80">Scalable design solutions for bulk orders</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="font-bold mb-2">Independent Artists</h3>
                  <p className="text-sm opacity-80">Platform to showcase and monetize creativity</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📩 Get Involved</h2>
            <p className="text-xl text-gray-600 mb-12">Ready to join the design revolution?</p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-bold text-gray-800 mb-2">Designers</h3>
                <p className="text-gray-600 text-sm mb-4">Apply now to join our platform and start earning</p>
                <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="font-bold text-gray-800 mb-2">Buyers</h3>
                <p className="text-gray-600 text-sm mb-4">Subscribe or download as you go, with confidence</p>
                <button className="bg-orange-600  text-white px-4 py-2 rounded-lg cursor-pointer font-medium cursor-pointer hover:bg-orange-700 transition-colors" onClick={handleStartAsDesigner}>
                  Start Shopping
                </button>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="font-bold text-gray-800 mb-2">Partners & Investors</h3>
                <p className="text-gray-600 text-sm mb-4">Reach out to join this scalable revolution</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 cursor-pointer transition-colors">
                  Get in Touch
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-blue-400">📧</span>
                  <a href="mailto:info@mydesignbazaar.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                    info@mydesignbazaar.com
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-green-400">🌐</span>
                  <a href="http://www.mydesignbazaar.com" className="text-green-300 hover:text-green-200 transition-colors">
                    www.mydesignbazaar.com
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-yellow-400">📞</span>
                  <span className="text-yellow-300">Toll-Free: 1800-33-4445</span>
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