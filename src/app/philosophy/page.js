'use client'
import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function AboutUsPage() {
  const { user } = useAuth();

  const handleContactUs = () => {
    window.location.href = 'mailto:info@mydesignbazaar.com?subject=General Inquiry - About MyDesignBazaar';
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
                Philosophy Behind MyDesignBazaar
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Revolutionizing the fashion design industry by bridging the gap between affordability and creative excellence
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Where creativity meets commerce in perfect harmony</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">₹50+</div>
                <div className="text-gray-600">Fair Designer Pay</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">₹300</div>
                <div className="text-gray-600">Affordable Access</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-gray-600">Original Designs</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">AI-Powered</div>
                <div className="text-gray-600">Customization</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                ⚠️
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">The Industry Challenge</h2>
              <p className="text-xl text-gray-600 mb-8">
                A persistent paradox exists in garment manufacturing and fashion design
              </p>
              
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl mb-4">💸</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Buyers' Dilemma</h4>
                    <p className="text-gray-600">Customers hesitate to pay ₹500 or even ₹300 for quality designs, seeking affordability without compromising on excellence</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-4">😞</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Designers' Struggle</h4>
                    <p className="text-gray-600">Talented creators struggle to sustain themselves with unsustainably low prices of ₹50 per design</p>
                  </div>
                </div>
                <div className="mt-8 bg-white rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⚖️</div>
                    <h4 className="font-semibold text-gray-800 mb-2">The Result</h4>
                    <p className="text-gray-600">A frustrating bottleneck that limits access to quality designs while stifling creative potential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🚀 Our Revolutionary Solution</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                MyDesignBazaar.com bridges the fundamental disconnect with a transformative marketplace platform
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* For Buyers */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🛒
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">For Buyers</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Instant access to diverse design library</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Economical pricing without compromise</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Eliminates cost & time constraints</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Real-time garment visualization</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Designers */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🎨
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">For Designers</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Monetize creativity repeatedly</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Fair revenue-sharing model</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Sustainable & profitable earnings</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Greater reach & recognition</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Industry */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🏭
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">For Industry</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Eliminates market inefficiencies</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Fuels creative innovation</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Harmonized AI-powered ecosystem</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">Future-ready marketplace</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright Protection */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                🛡️
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Legal Security & Copyright Protection</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Eliminating the widespread issue of copyright infringement in the fashion design industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    ⚠️
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Industry Problem</h3>
                  <p className="text-gray-600 mb-6">
                    Many buyers unknowingly or deliberately ask designers to replicate designs from the internet, 
                    exposing both parties to serious legal risks and copyright violations.
                  </p>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">
                      ❌ Legal exposure • ❌ Copyright violations • ❌ Uncertain authenticity
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    ✅
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Solution</h3>
                  <p className="text-gray-600 mb-6">
                    A legally secure marketplace offering only original, high-quality designs that are 
                    authentic, copyright-compliant, and ready for commercial use.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ 100% Original • ✓ Copyright compliant • ✓ Commercial ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Innovation */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                  🤖
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Technology-Driven Innovation</h2>
                <p className="text-xl text-gray-600">
                  Cutting-edge features that revolutionize how fashion businesses interact with designs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold text-gray-800 mb-2">AI-Assisted Customization</h3>
                  <p className="text-gray-600 text-sm">
                    Smart algorithms help customize designs to match specific brand requirements and preferences
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-4">👁️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Real-Time Visualization</h3>
                  <p className="text-gray-600 text-sm">
                    See exactly how designs will look on actual garments before making a purchase decision
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-gray-800 mb-2">Dynamic Licensing</h3>
                  <p className="text-gray-600 text-sm">
                    Flexible licensing options offering both affordability and exclusivity based on your needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Models */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                💎
              </div>
              <h2 className="text-4xl font-bold mb-6">Flexible Pricing Models</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed">
                Multiple access options designed to meet different business needs and budgets
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-bold mb-2">Pay-Per-Download</h3>
                  <p className="text-sm opacity-80">Purchase individual designs as needed with instant access</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="font-bold mb-2">Subscription Plans</h3>
                  <p className="text-sm opacity-80">Monthly or annual plans for unlimited access to our design library</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="font-bold mb-2">Custom Solutions</h3>
                  <p className="text-sm opacity-80">Tailored packages for large enterprises and fashion houses</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Vision */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To redefine the economics of garment design by creating a sustainable ecosystem where 
                  fashion businesses can access premium designs affordably while ensuring designers receive 
                  fair compensation for their creative work. We're eliminating inefficiencies and building 
                  the future of fashion design accessibility.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                    🌟
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  A world where affordability and excellence coexist in perfect harmony. We envision a 
                  future where every fashion business, regardless of size, has access to world-class designs, 
                  and every creative mind is valued and compensated fairly for their artistic contributions 
                  to the fashion industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 px-4 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Join the Design Revolution</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed">
                Be part of the transformation that's reshaping how the fashion industry approaches design, 
                creativity, and commerce. Together, we're building a future where everyone wins.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={handleContactUs}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Get in Touch
                </button>
                <a 
                  href="/designs" 
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Explore Designs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🤝 Let's Connect</h2>
            <p className="text-xl text-gray-600 mb-12">Ready to transform your fashion business?</p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-blue-400">📧</span>
                    <a href="mailto:info@mydesignbazaar.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                      info@mydesignbazaar.com
                    </a>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>For Business Inquiries:</strong> partnerships@mydesignbazaar.com
                    </p>
                    <p className="text-xs text-gray-400">
                      Whether you're a designer looking to join our platform or a business seeking custom solutions
                    </p>
                  </div>
                  <button 
                    onClick={handleContactUs}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 The Future is Here</h3>
              <p className="text-gray-600 leading-relaxed">
                MyDesignBazaar.com isn't just another marketplace – we're the catalyst for a fundamental shift 
                in how the fashion industry operates. Where affordability meets excellence, and creativity is 
                finally valued as it should be. Welcome to the future of fashion design accessibility.
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