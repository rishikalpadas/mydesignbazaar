"use client";
import {
  Paintbrush2,
  ShoppingBag,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Sparkles,
  Crown,
} from "lucide-react";
import { useState } from "react";

const designerStats = [
  {
    label: "Avg. Monthly Earnings",
    value: "₹25,000",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    label: "Active Designers",
    value: "2,500+",
    icon: <Users className="w-4 h-4" />,
  },
  { label: "Success Rate", value: "94%", icon: <Star className="w-4 h-4" /> },
];

const buyerStats = [
  {
    label: "Premium Designs",
    value: "50,000+",
    icon: <Crown className="w-4 h-4" />,
  },
  {
    label: "Instant Downloads",
    value: "24/7",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    label: "Satisfied Buyers",
    value: "10K+",
    icon: <CheckCircle className="w-4 h-4" />,
  },
];

const designerBenefits = [
  "Earn ₹500-₹15,000 per design",
  "Global marketplace reach",
  "Retain full design rights",
  "24/7 customer support",
];

const buyerBenefits = [
  "Instant download access",
  "Commercial usage rights",
  "Premium quality designs",
  "Secure payment gateway",
];

const CTABanners = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* **Background Decorations** */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* **Header Section** */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Join Our Community
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Join the
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              MyDesignBazaar{" "}
            </span>
            Community
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Whether you're a creative designer or a business looking for premium
            designs, we have the perfect solution for you.
          </p>
        </div>

        {/* **CTA Cards Grid** */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* **Designer CTA Card** */}
          <div
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-6 lg:p-10 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]"
            onMouseEnter={() => setHoveredCard("designer")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* **Background Pattern** */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

            <div className="relative z-10">
              {/* **Header** */}
              <div className="flex items-start justify-between mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <Paintbrush2 className="w-10 h-10 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  For Creators
                </div>
              </div>

              {/* **Content** */}
              <div className="mb-8">
                <h3 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
                  Are You a Designer?
                </h3>
                <p className="text-indigo-100 text-lg leading-relaxed mb-6">
                  Transform your creativity into income. Join India's
                  fastest-growing design marketplace and start earning from your
                  artistic talents.
                </p>

                {/* **Benefits List** */}
                <div className="space-y-3 mb-8">
                  {designerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                      <span className="text-indigo-100">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* **Stats** */}
              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-8">
                {designerStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {stat.icon}
                      <span className="text-lg lg:text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-indigo-200">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* **CTA Button** */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <a
                  href="/signup?role=designer"
                  className="group/btn flex-1 bg-white text-indigo-700 font-semibold px-4 py-3 lg:px-6 lg:py-4 rounded-2xl text-center transition-all duration-300 hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    Sell Designs
                    <ArrowRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        hoveredCard === "designer" ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </a>
                <a
                  href="/designer-portfolio"
                  className="px-4 py-3 lg:px-6 lg:py-4 border-2 border-white/30 rounded-2xl text-center font-medium hover:bg-white/10 transition-all duration-300"
                >
                  View Examples
                </a>
              </div>
            </div>
          </div>

          {/* **Buyer CTA Card** */}
          <div
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 lg:p-10 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]"
            onMouseEnter={() => setHoveredCard("buyer")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* **Background Pattern** */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>

            <div className="relative z-10">
              {/* **Header** */}
              <div className="flex items-start justify-between mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  For Businesses
                </div>
              </div>

              {/* **Content** */}
              <div className="mb-8">
                <h3 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
                  Looking for Unique Designs?
                </h3>
                <p className="text-orange-100 text-lg leading-relaxed mb-6">
                  Discover premium design assets crafted by India's most
                  talented independent creators. Perfect for your brand's next
                  big project.
                </p>

                {/* **Benefits List** */}
                <div className="space-y-3 mb-8">
                  {buyerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                      <span className="text-orange-100">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* **Stats** */}
              <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-8">
                {buyerStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {stat.icon}
                      <span className="text-lg lg:text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-orange-200">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* **CTA Button** */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <a
                  href="/explore"
                  className="group/btn flex-1 bg-white text-orange-700 font-semibold px-4 py-3 lg:px-6 lg:py-4 rounded-2xl text-center transition-all duration-300 hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    Start Shopping
                    <ArrowRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        hoveredCard === "buyer" ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </a>
                <a
                  href="/categories"
                  className="px-4 py-3 lg:px-6 lg:py-4 border-2 border-white/30 rounded-2xl text-center font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Browse Categories
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* **Trust Indicators** */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-gray-600">
              Join a community that's already making a difference
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                2,500+
              </div>
              <p className="text-gray-600 text-sm">Active Designers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                50K+
              </div>
              <p className="text-gray-600 text-sm">Designs Sold</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹2.5Cr+
              </div>
              <p className="text-gray-600 text-sm">Paid to Designers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                4.9★
              </div>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
          </div>
        </div>

        {/* **Final CTA Section** */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-12 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of designers and businesses who are already part of
              India's most vibrant design community.
            </p>

            <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto lg:flex-row lg:gap-4 lg:max-w-md">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Join as Designer
              </button>
              <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanners;
