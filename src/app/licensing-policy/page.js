import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';

export default function LicensingPage() {
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
                📜
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Licensing Policy
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Empowering Creativity with Legal Confidence
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Clear terms for designers and buyers on www.mydesignbazaar.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to India's Premier Digital Marketplace</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              As a platform driven by innovation and artistic integrity, we are committed to maintaining a legally sound ecosystem for both design creators and design buyers. This Licensing Policy outlines the terms under which designs are uploaded, sold, licensed, and used.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <p className="text-lg text-gray-700 font-medium">
                All users (buyers and designers) agree to abide by this policy upon registering on our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Licensing Types */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🔖 Licensing Types</h2>
              <p className="text-xl text-gray-600">We offer different design types with specific licensing privileges</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Standard Commercial License */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    ✅
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Standard Commercial License</h3>
                  <p className="opacity-90">Included in All Downloads</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Permits <strong className="text-blue-600">commercial use</strong> on physical products (T-shirts, babywear, hoodies, bags, etc.)</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Allows use for up to <strong className="text-blue-600">10,000 units</strong> per design</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Buyers may <strong className="text-blue-600">modify or resize</strong> designs to suit applications</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Attribution <strong className="text-blue-600">not required but appreciated</strong></span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">License is <strong className="text-blue-600">non-exclusive</strong>, unless otherwise stated</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">10,000</div>
                      <div className="text-sm text-gray-600">Units per design</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exclusive License */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ring-2 ring-orange-200">
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    🌟
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Exclusive License</h3>
                  <p className="opacity-90">Available for Select Designs</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Buyer receives <strong className="text-orange-600">exclusive rights</strong> to the design upon purchase</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Design is <strong className="text-orange-600">automatically removed</strong> from platform after sale</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Designer retains copyright but <strong className="text-orange-600">forfeits resale rights</strong></span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Permits <strong className="text-orange-600">unlimited units</strong>, including mass production</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Customization and branding usage permitted</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">∞</div>
                      <div className="text-sm text-gray-600">Unlimited units</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Generated License */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                    🤖
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AI-Generated License</h3>
                  <p className="opacity-90">Beta Phase</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Licensed under the same <strong className="text-purple-600">commercial terms</strong> as standard license</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Designed using <strong className="text-purple-600">proprietary AI workflows</strong> exclusively</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">AI designs are <strong className="text-purple-600">limited edition</strong>; max 10 downloads per design</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Not eligible for exclusivity but <strong className="text-purple-600">priced at premium</strong></span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Cannot resell or redistribute the <strong className="text-purple-600">raw design</strong></span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">10</div>
                      <div className="text-sm text-gray-600">Max downloads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Do */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-8">📄 What You Can Do</h2>
                <p className="text-xl text-gray-600 mb-8">With any purchase or subscription, you receive a license that allows you to:</p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 bg-green-50 rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-gray-700 font-medium">Print the design on clothing and accessories</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-green-50 rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-gray-700 font-medium">Use for branding, sales, and promotions</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-green-50 rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-gray-700 font-medium">Modify elements (colors, texts, positions)</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-green-50 rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-gray-700 font-medium">Combine with other licensed assets</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-green-50 rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-gray-700 font-medium">Use on e-commerce platforms (Amazon, Flipkart, Myntra, etc.)</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-3xl p-8 h-full">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      ✅
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Full Commercial Rights</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Use our designs confidently for your business needs with clear, comprehensive licensing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Cannot Do */}
        <section className="py-20 bg-red-50 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="bg-gradient-to-br from-red-100 via-orange-100 to-pink-100 rounded-3xl p-8 h-full">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      ❌
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Important Restrictions</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Protect the integrity of our marketplace and respect designers' rights
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">❌ What You Cannot Do</h2>
                <p className="text-xl text-gray-600 mb-8">Under any license issued by MY DESIGN BAZAAR, you <strong className="text-red-600">may NOT</strong>:</p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 bg-red-100 rounded-lg p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✕</div>
                    <span className="text-gray-700 font-medium">Resell or redistribute the digital design file</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-red-100 rounded-lg p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✕</div>
                    <span className="text-gray-700 font-medium">Upload the design on stock platforms (e.g., Freepik, Shutterstock)</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-red-100 rounded-lg p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✕</div>
                    <span className="text-gray-700 font-medium">Claim the design as your own original work</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-red-100 rounded-lg p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✕</div>
                    <span className="text-gray-700 font-medium">Use designs for political, defamatory, obscene, or hate-driven content</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-red-100 rounded-lg p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">✕</div>
                    <span className="text-gray-700 font-medium">Sub-license or share the design with third-party vendors without consent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright & IP Protection */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                ⚠️
              </div>
              <h2 className="text-4xl font-bold mb-6">Copyright & Intellectual Property</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Understanding ownership, licensing, and our commitment to protecting intellectual property rights
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">🔒 Ownership & Rights</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>All uploaded designs remain the <strong>intellectual property of the designer</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>MY DESIGN BAZAAR acts only as a <strong>non-exclusive licensing agent and digital distributor</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Designers grant us the <strong>right to sell, display, and license</strong> under platform guidelines</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Buyers receive only a <strong>license to use</strong>, not ownership of the artwork</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">🚫 Copyright Infringement Disclaimer</h3>
                <div className="space-y-4">
                  <p className="font-medium">MY DESIGN BAZAAR does not assume responsibility for the originality or copyright status of user-uploaded designs.</p>
                  <div className="text-sm opacity-90">
                    <p className="mb-2">We shall not be held liable for:</p>
                    <ul className="space-y-1 pl-4">
                      <li>• Copyright infringement from designer uploads</li>
                      <li>• Misuse of licensed designs by buyers</li>
                      <li>• Third-party legal claims from IP disputes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice and Takedown Policy */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">📋 Notice-and-Takedown Policy</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🚨
                  </div>
                  <h4 className="font-semibold mb-2">Immediate Removal</h4>
                  <p className="text-sm opacity-80">Design removed upon credible complaint</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🔒
                  </div>
                  <h4 className="font-semibold mb-2">Account Suspension</h4>
                  <p className="text-sm opacity-80">Uploader's account suspended pending investigation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <h4 className="font-semibold mb-2">Proof Required</h4>
                  <p className="text-sm opacity-80">Complainant must provide proof of ownership</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    ⚖️
                  </div>
                  <h4 className="font-semibold mb-2">Legal Cooperation</h4>
                  <p className="text-sm opacity-80">Full cooperation with legal authorities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Jurisdiction */}
        <section className="py-16 bg-gray-800 text-white px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">📜 Legal Jurisdiction</h2>
              <div className="bg-gray-700 rounded-2xl p-8">
                <p className="text-lg mb-4">
                  This Licensing Policy is governed by and interpreted in accordance with the laws of <strong className="text-blue-400">India</strong>, specifically under the:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-600 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Indian Copyright Act, 1957</h4>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Information Technology Act, 2000</h4>
                  </div>
                </div>
                <p className="text-lg">
                  All legal proceedings will be subject to jurisdiction in <strong className="text-orange-400">Kolkata, West Bengal</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Licensing */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">💼 Enterprise & API Licensing</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Looking for mass usage or integration? We offer custom licensing models for large-scale operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🏢
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Fashion Aggregators</h3>
                <p className="text-gray-600 text-sm">Bulk licensing for multi-brand platforms</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🚢
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Garment Exporters</h3>
                <p className="text-gray-600 text-sm">International trade-focused licensing</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ⚙️
                </div>
                <h3 className="font-bold text-gray-800 mb-2">API Integration</h3>
                <p className="text-gray-600 text-sm">Automated manufacturing workflows</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🛍️
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Retail Chains</h3>
                <p className="text-gray-600 text-sm">International retail chain partnerships</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready for Enterprise Licensing?</h3>
              <p className="mb-6 opacity-90">Contact our team to discuss custom solutions tailored to your business needs.</p>
              <a href="mailto:info@mydesignbazaar.com" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Enterprise Team
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📞 Contact Us</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              For clarifications, disputes, or licensing questions, our support team is ready to assist you.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📧
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Email Support</h3>
                <a href="mailto:info@mydesignbazaar.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  info@mydesignbazaar.com
                </a>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🌐
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Website</h3>
                <a href="https://www.mydesignbazaar.com" className="text-green-600 hover:text-green-700 font-medium">
                  www.mydesignbazaar.com
                </a>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  📞
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Toll-Free</h3>
                <span className="text-orange-600 font-medium">1800-33-4445</span>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📋 Quick Reference Summary</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-3">✅ You CAN:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Print on products commercially</li>
                    <li>• Modify colors and elements</li>
                    <li>• Use for business branding</li>
                    <li>• Sell finished products</li>
                    <li>• Use on e-commerce platforms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">❌ You CANNOT:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Resell digital files</li>
                    <li>• Upload to stock platforms</li>
                    <li>• Claim as your own work</li>
                    <li>• Use for hate content</li>
                    <li>• Sub-license to others</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-600 mb-3">📊 License Types:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Standard: Up to 10K units</li>
                    <li>• Exclusive: Unlimited units</li>
                    <li>• AI-Generated: Limited edition</li>
                    <li>• Enterprise: Custom terms</li>
                    <li>• All include commercial rights</li>
                  </ul>
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