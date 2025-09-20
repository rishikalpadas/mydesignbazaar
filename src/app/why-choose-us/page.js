'use client'
import Navbar from '../../components/Navbar';
import Newsletter from '../../components/Newsletter';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Footer from '../../components/Footer';

export default function WhyChoosePage() {
  const { user } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  const handleStartNow = () => {
    if (!user) {
      // Open auth modal or redirect to signup
      window.location.href = '/signup';
    } else {
      // Redirect based on user type
      window.location.href = '/browse-designs';
    }
  };

  const features = [
    {
      id: 0,
      title: "Instant Downloads",
      description: "Ready-to-use designs available immediately",
      details: "No waiting weeks for designers. Download professional designs instantly.",
      icon: "⚡",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 1,
      title: "Cost-Effective",
      description: "Transparent pricing with no hidden costs",
      details: "Save thousands compared to hiring individual designers.",
      icon: "💰",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      title: "High Quality",
      description: "Review-approved designs meeting industry standards",
      details: "Every design undergoes strict quality control processes.",
      icon: "✨",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "Massive Variety",
      description: "Curated categories across all garment styles",
      details: "From kidswear to street fashion, we cover every category.",
      icon: "🎨",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white py-20 px-4">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Why Choose <br />
                <span className="text-orange-300">MyDesignBazaar?</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
                In the fast-paced fashion industry, time, cost-efficiency, and creativity at scale aren&apos;t luxuries—they&apos;re necessities. We&apos;re revolutionizing how you source garment designs.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Trusted by thousands of fashion businesses worldwide</span>
              </div>
              <button 
                onClick={handleStartNow}
                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                Start Your Design Journey
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800">MyDesignBazaar vs Traditional Designers</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">Instant</div>
                <div className="text-gray-600">Download Time</div>
                <div className="text-xs text-gray-400">vs 2-3 weeks waiting</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">80% Less</div>
                <div className="text-gray-600">Cost Savings</div>
                <div className="text-xs text-gray-400">vs hiring designers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">1000+</div>
                <div className="text-gray-600">Design Options</div>
                <div className="text-xs text-gray-400">vs limited creativity</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-gray-600">Availability</div>
                <div className="text-xs text-gray-400">vs business hours only</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features Showcase */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Thousands Choose Us Over Freelancers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the advantages that make us the preferred choice for fashion businesses
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Feature Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      activeFeature === index
                        ? `bg-gradient-to-r ${feature.color} text-white shadow-xl scale-105`
                        : 'bg-white text-gray-600 hover:text-gray-800 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-2xl mr-2">{feature.icon}</span>
                    {feature.title}
                  </button>
                ))}
              </div>

              {/* Feature Content */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${features[activeFeature].color} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl`}>
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">{features[activeFeature].title}</h3>
                  <p className="text-xl text-gray-600">{features[activeFeature].description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">9 Compelling Reasons to Choose Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you wish a designer could deliver, in a frictionless, affordable, scalable digital experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Reason 1 */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Downloads</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ready-to-use designs across every category. No back-and-forth communication, no delays—just download, customize, and use immediately.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✓ No waiting weeks for delivery
                </div>
              </div>

              {/* Reason 2 */}
              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  💰
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Cost-Effective Pricing</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Transparent, affordable pricing with no hidden charges. Save thousands compared to hiring designers with unpredictable revisions and delays.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Up to 80% savings vs freelancers
                </div>
              </div>

              {/* Reason 3 */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ✨
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Guaranteed</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Every design undergoes strict digital and manual approval for layered vector quality, print-ready resolution, and industry standards.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  ✓ 100% quality-controlled designs
                </div>
              </div>

              {/* Reason 4 */}
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Massive Variety</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  From kidswear to street fashion, floral motifs to ethnic patterns—dozens of categories tailored to various garment styles and seasons.
                </p>
                <div className="text-sm text-orange-600 font-medium">
                  ✓ Unlimited creative options
                </div>
              </div>

              {/* Reason 5 */}
              <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Copyright Protection</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Original designs with clear copyright ownership. No legal headaches from lifted Google/Pinterest images. Complete peace of mind.
                </p>
                <div className="text-sm text-red-600 font-medium">
                  ✓ 100% legally safe designs
                </div>
              </div>

              {/* Reason 6 */}
              <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI Customization</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Customize colors instantly, use AI tools to generate elements, preview on mock garments—reducing printing errors and production costs.
                </p>
                <div className="text-sm text-indigo-600 font-medium">
                  ✓ Smart design visualization
                </div>
              </div>

              {/* Reason 7 */}
              <div className="group bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Flexible Options</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Monthly subscriptions, pay-per-download, or exclusive purchases. Whether you&apos;re a boutique or mass manufacturer—pay only for what you need.
                </p>
                <div className="text-sm text-teal-600 font-medium">
                  ✓ Plans for every business size
                </div>
              </div>

              {/* Reason 8 */}
              <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Your Design Library</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Build your digital design inventory. Favorite, save, and re-download purchased designs anytime, anywhere in the world.
                </p>
                <div className="text-sm text-pink-600 font-medium">
                  ✓ Lifetime access to purchases
                </div>
              </div>

              {/* Reason 9 */}
              <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Dedicated human support via email, WhatsApp, and ticketing. We&apos;re not a faceless platform—get help with downloads or design suggestions.
                </p>
                <div className="text-sm text-yellow-600 font-medium">
                  ✓ Always here to help
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">MyDesignBazaar vs Traditional Freelancers</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See why smart businesses are making the switch
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Traditional Way */}
                <div className="bg-red-900/20 rounded-2xl p-8 border border-red-500/30">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                      😤
                    </div>
                    <h3 className="text-2xl font-bold text-red-300">Traditional Freelancers</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Weeks of waiting for initial concepts</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Endless revision cycles and negotiations</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">High hourly rates with unpredictable costs</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Limited creative vision from single designer</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Copyright risks from copied content</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Inconsistent quality and availability</p>
                    </div>
                  </div>
                </div>

                {/* MyDesignBazaar Way */}
                <div className="bg-green-900/20 rounded-2xl p-8 border border-green-500/30">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                      🚀
                    </div>
                    <h3 className="text-2xl font-bold text-green-300">MyDesignBazaar</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Instant downloads, no waiting time</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">No revisions needed - ready-to-use designs</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Transparent, affordable pricing upfront</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Unlimited variety across all categories</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">100% original, copyright-safe designs</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Guaranteed quality and 24/7 availability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={handleStartNow}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                Experience the Difference Today
              </button>
            </div>
          </div>
        </section>

        {/* Business Impact Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Smart Business Tool for Fashion Creators</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                More than just a design library - we&apos;re your competitive advantage in the fashion industry
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Barriers We Remove</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">🕐</div>
                        <p className="font-semibold text-gray-700">Time Delays</p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">💸</div>
                        <p className="font-semibold text-gray-700">High Costs</p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">⚠️</div>
                        <p className="font-semibold text-gray-700">Legal Risks</p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="font-semibold text-gray-700">Quality Issues</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">What You Get Instead</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Instant Access</p>
                        <p className="text-sm text-gray-600">Download designs immediately, start production today</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Predictable Costs</p>
                        <p className="text-sm text-gray-600">Clear pricing, no budget surprises or hidden fees</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Legal Safety</p>
                        <p className="text-sm text-gray-600">100% original designs with clear ownership</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Scalable Solution</p>
                        <p className="text-sm text-gray-600">Grow your business without design bottlenecks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Design Process?
              </h2>
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Join thousands of fashion businesses who&apos;ve already discovered the MyDesignBazaar advantage. 
                Experience frictionless, affordable, scalable design sourcing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={handleStartNow}
                  className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  Start Free Today
                </button>
                <a 
                  href="/browse-designs"
                  className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 cursor-pointer"
                >
                  Browse Designs
                </a>
              </div>
              
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-white">No credit card required • Start downloading instantly</span>
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