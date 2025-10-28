'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Star,
  Package,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const PricingPreview = () => {
  const [loading, setLoading] = useState(true);
  const [planPrices, setPlanPrices] = useState({
    basic: 600,
    premium: 5000,
    elite: 50000
  });

  // Fetch pricing from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings?public=true');
        const data = await response.json();
        if (data.success && data.settings.pricing) {
          setPlanPrices(data.settings.pricing.plans);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Keep defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Package,
      tagline: 'Perfect for Startups',
      priceKey: 'basic',
      credits: 10,
      validity: '15 days',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      popular: false,
      features: [
        '10 download credits',
        'Valid for 15 days',
        'Commercial rights',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Star,
      tagline: 'Best for Growing Business',
      priceKey: 'premium',
      credits: 100,
      validity: '90 days',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        '100 download credits',
        'Valid for 90 days',
        'AI designs access',
        'Priority support',
        '10% off extras'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: Crown,
      tagline: 'For Large Enterprises',
      priceKey: 'elite',
      credits: 1200,
      validity: '365 days',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      popular: false,
      features: [
        '1200 download credits',
        'Valid for 365 days',
        'Full AI access',
        'Dedicated manager',
        'Custom requests'
      ]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Unlock Your Creativity</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Creating Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One-time purchase plans with credit-based downloads. Credits valid for the specified period - no recurring charges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                  plan.popular ? 'ring-2 ring-purple-500 transform md:-translate-y-2' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-32 mb-2"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline mb-2">
                          <span className="text-4xl font-bold text-gray-900">₹{planPrices[plan.priceKey].toLocaleString()}</span>
                          <span className="text-orange-600 text-xl font-bold ml-1">*</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">{plan.credits} credits</span>
                          <span className="mx-2">•</span>
                          <span>{plan.validity}</span>
                        </div>
                        <div className="text-xs text-orange-600 italic">* Prices exclude GST</div>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/pricing"
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Not sure which plan to choose?
              </h3>
              <p className="text-gray-600">
                View detailed comparison and pay-per-download options
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              View All Plans
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
