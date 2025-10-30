'use client'

import { useState, useEffect } from 'react'
import {
  Crown,
  Star,
  Package,
  Check,
  Sparkles,
} from 'lucide-react'
import RazorpayButton from './RazorpayButton'

const PricingSection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [planPrices, setPlanPrices] = useState({
    basic: 600,
    premium: 5000,
    elite: 50000
  })

  // Fetch dynamic pricing and check authentication
  useEffect(() => {
    const init = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/auth/me', { credentials: 'include' })
        setIsAuthenticated(authResponse.ok)

        // Fetch dynamic pricing
        const priceResponse = await fetch('/api/admin/settings?public=true')
        const priceData = await priceResponse.json()
        if (priceData.success && priceData.settings.pricing) {
          setPlanPrices(priceData.settings.pricing.plans)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Pricing plans - using dynamic prices from admin settings
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Package,
      tagline: 'Perfect for Startups',
      price: planPrices.basic,
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
      price: planPrices.premium,
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
      price: planPrices.elite,
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
  ]

  const handlePaymentSuccess = (data) => {
    alert(`🎉 Payment Successful!\n\n${data.creditPoints} credits have been added to your account.\n\nNew Balance: ${data.newBalance} credits`)
    // Redirect to dashboard or designs page
    window.location.href = '/dashboard/credits'
  }

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Credit-Based Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase credit points and use them to download premium designs. No subscriptions, just pay once and use anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon

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
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline mb-2">
                          <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
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
                  {isAuthenticated ? (
                    <RazorpayButton
                      planType={plan.id}
                      planName={plan.name}
                      amount={plan.price}
                      credits={plan.credits}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      Get Started
                    </RazorpayButton>
                  ) : (
                    <a
                      href="/auth?view=login"
                      className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Login to Purchase
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How Credit Points Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Purchase Credits</h4>
              <p className="text-gray-600 text-sm">Choose a plan and buy credit points securely via Razorpay</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">2</div>
              <h4 className="font-bold text-gray-900 mb-2">Browse Designs</h4>
              <p className="text-gray-600 text-sm">Explore thousands of premium designs across categories</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Download & Use</h4>
              <p className="text-gray-600 text-sm">Use credits to download designs and get full commercial rights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
