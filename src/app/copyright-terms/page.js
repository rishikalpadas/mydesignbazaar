import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';

export default function CopyrightTermsPage() {
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
                Copyright Terms & <br />
                <span className="text-orange-300">Licensing Agreement</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Core copyright, reporting, and platform rights policy for all designers and users on MyDesignBazaar.com
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="font-medium">📅 Effective: 10/05/2025</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="font-medium">🌐 Platform: MyDesignBazaar.com</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="font-medium">🏢 Company: Printing Made Easy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600">IP Protection</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-gray-600">Monitoring</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">0</div>
                <div className="text-gray-600">Platform Liability</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-600">Instant</div>
                <div className="text-gray-600">Takedown</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Copyright Ownership */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🎯 Copyright Ownership and Responsibility</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the legal framework that protects both designers and the platform
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Designer's Original Work */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Designer&apos;s Original Work</h3>
                <p className="text-gray-600 leading-relaxed">
                  All designers uploading artwork or design files to <strong className="text-blue-600">www.mydesignbazaar.com</strong> (the &quot;Platform&quot;) affirm and warrant that the submitted content is their own original creation, or that they hold all necessary rights, licenses, and permissions to submit and commercially distribute such content.
                </p>
              </div>

              {/* Copyright Responsibility */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚖️
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Copyright Responsibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  The <strong className="text-purple-600">designer or contributor alone</strong> bears full legal responsibility for any copyright violation, intellectual property theft, trademark misuse, or unauthorized usage of third-party content embedded within their submissions.
                </p>
              </div>

              {/* No Platform Liability */}
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Liability on Platform</h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-orange-600">MyDesignBazaar.com</strong>, operated by <strong className="text-orange-600">Printing Made Easy</strong>, expressly disclaims any liability or legal obligation arising from the unauthorized, copied, or plagiarized content uploaded by designers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Licensing Policy */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🤝 Licensing Policy and Platform Rights</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                How we balance designer ownership with platform distribution rights
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      📝
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-gray-800">Non-Exclusive Licensing to Platform</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    By uploading a design, the designer grants MyDesignBazaar.com a <strong className="text-blue-600">non-exclusive, royalty-free, worldwide license</strong> to host, display, market, and sell the design through its platform and partner networks.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      👑
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-gray-800">No Transfer of Copyright</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    The platform <strong className="text-purple-600">does not claim ownership</strong> of the uploaded content. All copyrights remain with the original designer. However, by uploading content, the designer grants the Platform the right to use, reproduce, modify (for display or listing purposes only), and sell the digital design files.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🔄
                    </div>
                    <h3 className="text-xl font-bold ml-4 text-gray-800">Revocation & Termination</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Designers may revoke this license at any time by requesting the removal of their content, provided it does not conflict with any ongoing sales or customer rights already granted.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 rounded-3xl p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl">
                      🤝
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Fair Partnership</h3>
                    <p className="text-gray-600 max-w-sm">
                      Protecting both designer rights and platform distribution needs through transparent licensing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Takedown Policy */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                🚨
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Copyright Violation and Take-Down Policy</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Swift action to protect intellectual property rights and maintain platform integrity
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    📧
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Reporting Mechanism</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Any individual, entity, or rights holder who believes their intellectual property has been infringed upon may file a complaint with verifiable evidence.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <span className="text-blue-600 font-semibold">📧 copyright@mydesignbazaar.com</span>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    ⚡
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Immediate Action</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Upon receiving a valid copyright complaint, the disputed design shall be <strong className="text-orange-600">immediately suspended</strong> from public view pending investigation.
                </p>
                <p className="text-gray-600">
                  If infringement is confirmed, the design will be <strong className="text-red-600">permanently deleted</strong> without prior notice.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🚫
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Repeat Infringer Policy</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Designers found guilty of repeat violations (2 or more confirmed instances) will face severe consequences.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Account <strong className="text-red-600">permanently banned</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Earnings <strong className="text-red-600">withheld</strong> as per policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Legal Liability */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                  🛡️
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Legal Liability Clause</h2>
                <p className="text-xl text-gray-600">
                  Clear responsibilities and protections for all parties involved
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                      📋
                    </span>
                    Indemnification
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    All designers agree to <strong className="text-blue-600">fully indemnify, defend, and hold harmless</strong> MyDesignBazaar.com and its parent company, directors, employees, affiliates, and legal representatives from any claims, losses, damages, liabilities, costs, or expenses (including legal fees) arising from or related to:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                      <span className="text-gray-700">Uploaded designs that infringe third-party rights</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
                      <span className="text-gray-700">Misuse of copyrighted material</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">3</div>
                      <span className="text-gray-700">Breach of warranty of originality</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                      ⚠️
                    </span>
                    No Legal Responsibility
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Under no circumstances shall MyDesignBazaar.com be <strong className="text-red-600">liable for any direct, indirect, incidental, or consequential damages</strong> resulting from infringement actions related to content uploaded by users.
                  </p>
                  <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                    <h4 className="font-semibold text-red-600 mb-3">Platform serves as:</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Digital distribution medium</li>
                      <li>• Non-exclusive licensing agent</li>
                      <li>• Marketplace facilitator</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4 font-medium">
                      NOT as creator or licensor of submitted content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Acceptance of Terms */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                ✅
              </div>
              <h2 className="text-4xl font-bold mb-6">Acceptance of Terms</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-3xl mx-auto">
                By uploading content or using any service on MyDesignBazaar.com, the designer acknowledges that they have <strong>read, understood, and agreed</strong> to the full terms of this Copyright and Licensing Agreement.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="font-bold mb-2">Read</h3>
                  <p className="text-sm opacity-80">Comprehensive understanding of all terms</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="font-bold mb-2">Understood</h3>
                  <p className="text-sm opacity-80">Clear comprehension of responsibilities</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="font-bold mb-2">Agreed</h3>
                  <p className="text-sm opacity-80">Full acceptance and compliance commitment</p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Need Help or Have Questions?</h3>
                <p className="text-lg mb-6 opacity-90">
                  For any questions or legal concerns, our support team is ready to assist
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <span className="text-xl font-semibold">copyright@mydesignbazaar.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Ready to Join the Design Revolution?</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Now that you understand our copyright and licensing terms, start your journey with India&apos;s premier design marketplace
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-bold text-gray-800 mb-2">For Designers</h3>
                <p className="text-gray-600 text-sm mb-4">Upload your designs and start earning with full IP protection</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Start Uploading
                </button>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="font-bold text-gray-800 mb-2">For Buyers</h3>
                <p className="text-gray-600 text-sm mb-4">Access thousands of licensed designs for your business</p>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Browse Designs
                </button>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="font-bold text-gray-800 mb-2">Have Questions?</h3>
                <p className="text-gray-600 text-sm mb-4">Our legal team is here to help clarify any concerns</p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">📞 Contact Information</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <a href="mailto:copyright@mydesignbazaar.com" className="text-blue-300 hover:text-blue-200 transition-colors font-medium">
                    copyright@mydesignbazaar.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌐</div>
                  <a href="http://www.mydesignbazaar.com" className="text-green-300 hover:text-green-200 transition-colors font-medium">
                    www.mydesignbazaar.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <span className="text-yellow-300 font-medium">1800-33-4445</span>
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