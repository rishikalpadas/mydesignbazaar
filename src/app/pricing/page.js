'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Check,
  Crown,
  Star,
  Zap,
  Download,
  Mail,
  Phone,
  Users,
  CreditCard,
  Package,
  Sparkles,
  ArrowRight,
  X,
  Info,
  Loader,
} from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import AuthModal from '../../components/AuthModal';


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [planPrices, setPlanPrices] = useState({
    basic: 600,
    premium: 5000,
    elite: 50000
  });
  const [downloadPrices, setDownloadPrices] = useState({
    standard: 199,
    exclusive: 399,
    ai: 499
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  // Fetch pricing from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings?public=true');
        const data = await response.json();
        if (data.success && data.settings.pricing) {
          setPlanPrices(data.settings.pricing.plans);
          setDownloadPrices(data.settings.pricing.payPerDownload);
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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchasePlan = async (plan) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    // Check if user is a buyer
    if (user.userType !== 'buyer') {
      alert('Only buyers can purchase subscription plans. Please register as a buyer.');
      return;
    }

    setProcessingPayment(true);

    try {
      // Get plan details
      const planDetails = {
        basic: { credits: 10, validityDays: 15 },
        premium: { credits: 100, validityDays: 90 },
        elite: { credits: 1200, validityDays: 365 }
      };

      const planDetail = planDetails[plan.id];
      const amount = planPrices[plan.priceKey];

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount,
          credits: planDetail.credits,
          validityDays: planDetail.validityDays
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'MyDesignBazaar',
        description: `${orderData.planDetails.planName} Subscription Plan`,
        order_id: orderData.orderId,
        prefill: {
          email: user.email,
          contact: user.mobileNumber || ''
        },
        theme: {
          color: '#F97316'
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                planName: plan.name,
                credits: planDetail.credits,
                validityDays: planDetail.validityDays,
                amount: orderData.amount
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              alert(`🎉 ${verifyData.message}\n\nYour subscription is now active!`);
              router.push('/dashboard/profile');
            } else {
              throw new Error(verifyData.error);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      icon: Package,
      description: "Perfect for small boutique owners and startups",
      priceKey: "basic",
      originalPrice: null,
      period: "month",
      color: "blue",
      popular: false,
      idealFor: "Small boutique owners, student startups, and print shops",
      features: [
        "10 premium design download credits",
        "Valid for 15 days from purchase",
        "Commercial usage rights included",
        "Email support",
        "Standard design library access"
      ],
      limitations: [
        "Credits expire after 15 days or when exhausted",
        "No access to exclusive/AI designs",
        "Requires new purchase after expiry/exhaustion"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      icon: Star,
      description: "Ideal for small-to-medium manufacturers & exporters",
      priceKey: "premium",
      originalPrice: null,
      period: "month",
      color: "purple",
      popular: true,
      idealFor: "Small-to-medium garment manufacturers & exporters",
      features: [
        "100 premium design download credits",
        "Valid for 90 days from purchase",
        "Commercial usage rights included",
        "Access to AI-generated Designs (Beta)",
        "Priority email & WhatsApp support",
        "10% off on pay-per-download items",
        "Access to seasonal collection bundles"
      ],
      limitations: [
        "Credits expire after 90 days or when exhausted",
        "Requires new purchase after expiry/exhaustion"
      ]
    },
    {
      id: "elite",
      name: "Elite",
      icon: Crown,
      description: "Perfect for larger production units and fashion brands",
      priceKey: "elite",
      originalPrice: null,
      period: "month",
      color: "orange",
      popular: false,
      idealFor: "Larger production units, online brands, and fashion aggregators",
      features: [
        "1200 premium design download credits",
        "Valid for 365 days from purchase",
        "Full access to AI-generated Designs (up to 10/month free)",
        "15% off on Exclusive Designer Uploads",
        "Direct design request once/month (customizable by selected designers)",
        "Dedicated account manager",
        "Priority access to new launches"
      ],
      limitations: [
        "Credits expire after 365 days or when exhausted",
        "Requires new purchase after expiry/exhaustion"
      ]
    }
  ];

  const payPerDownloadPrices = [
    {
      type: "Premium Standard Design",
      priceKey: "standard",
      description: "High-quality curated designs from our standard collection"
    },
    {
      type: "Exclusive Designer Upload",
      priceKey: "exclusive",
      description: "Unique designs from featured designers"
    },
    {
      type: "AI-Generated Designs (Beta)",
      priceKey: "ai",
      description: "Cutting-edge AI-Generated designs"
    }
  ];

  const getColorClasses = (color, variant = "primary") => {
    const colors = {
      blue: {
        primary: "bg-blue-600 hover:bg-blue-700 border-blue-600",
        secondary: "border-blue-200 hover:border-blue-300",
        accent: "bg-blue-100 text-blue-800",
        gradient: "from-blue-600 to-blue-700"
      },
      purple: {
        primary: "bg-purple-600 hover:bg-purple-700 border-purple-600",
        secondary: "border-purple-200 hover:border-purple-300",
        accent: "bg-purple-100 text-purple-800",
        gradient: "from-purple-600 to-purple-700"
      },
      orange: {
        primary: "bg-orange-600 hover:bg-orange-700 border-orange-600",
        secondary: "border-orange-200 hover:border-orange-300",
        accent: "bg-orange-100 text-orange-800",
        gradient: "from-orange-600 to-orange-700"
      }
    };
    return colors[color]?.[variant] || colors.blue[variant];
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
                Simple, Transparent
                <br />
                <span className="text-orange-300">Pricing</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Choose the perfect plan for your design needs. All plans include commercial usage rights and premium support.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Commercial license included</span>
              </div>
              {/* <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3">
                <Info className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">
                  * All prices exclude GST
                </span>
              </div> */}
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Subscription Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-3">
                One-time purchase plans with credit-based downloads. Credits are valid for the specified period - no recurring charges.
              </p>
              {/* <p className="text-sm text-orange-600 italic">* Prices exclude GST</p> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {subscriptionPlans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-2xl ${
                      plan.popular
                        ? `${getColorClasses(plan.color, "secondary")} shadow-2xl transform hover:scale-105`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {plan.popular && (
                      <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${getColorClasses(plan.color, "accent")} px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
                        🌟 Most Popular
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${getColorClasses(plan.color, "gradient")} text-white mb-6`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      {/* <div className="mb-4">
                        <span className="text-sm text-gray-500 font-medium">Ideal for:</span>
                        <p className="text-sm text-gray-700 mt-1">{plan.idealFor}</p>
                      </div> */}

                      {/* Pricing */}
                      <div className="mb-6">
                        {loading ? (
                          <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="flex items-baseline justify-center">
                              <span className="text-5xl font-bold text-gray-900">
                                ₹{planPrices[plan.priceKey].toLocaleString()}
                              </span>
                              <span className="text-orange-600 text-2xl font-bold ml-1">*</span>
                            </div>
                            {/* <div className="text-sm text-gray-500 mt-2">One-time payment</div> */}
              <p className="text-sm text-orange-600 italic mt-2">* Prices exclude GST</p>

                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6 mb-8">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-2" />
                          What&apos;s Included
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {plan.limitations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                            <X className="w-5 h-5 text-red-500 mr-2" />
                            Limitations
                          </h4>
                          <ul className="space-y-3">
                            {plan.limitations.map((limitation, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <X className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePurchasePlan(plan)}
                      disabled={processingPayment}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                        plan.popular
                          ? `text-white ${getColorClasses(plan.color, "primary")} shadow-lg hover:shadow-xl`
                          : "text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Get Started with ${plan.name}`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pay-Per-Download Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pay-Per-Download
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-3">
                No subscription? No problem. Get flexible pricing without any commitment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-4">
              {payPerDownloadPrices.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 text-white mb-6">
                      <Download className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.type}</h3>
                    <p className="text-gray-600 text-sm mb-6">{item.description}</p>

                    {/* Price */}
                    {loading ? (
                      <div className="animate-pulse mb-6">
                        <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">
                            ₹{downloadPrices[item.priceKey]}
                          </span>
                          <span className="text-orange-600 text-xl font-bold ml-1">*</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          per design
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Single-use license
                      </div>
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Commercial usage rights
                      </div>
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Instant download
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

              <p className="text-sm text-orange-600 italic text-center mb-4">* Prices exclude GST</p>


            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Sparkles className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> No rollovers or refunds once designs are downloaded. All designs come with standard commercial license. Single-use license means one project per download.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                <Users className="w-10 h-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise & Bulk Solutions</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Need 200+ downloads per month or want to integrate with your internal design system?
                We offer enterprise licensing, API access, and bulk pricing tailored to your business needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Custom API Integration</h3>
                  <p className="text-gray-300">Seamlessly integrate our design library with your existing workflow and systems.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Volume Discounts</h3>
                  <p className="text-gray-300">Significant savings for high-volume usage with flexible licensing terms.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="text-lg">info@mydesignbazaar.com</span>
                </div>
                <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                  Contact Sales Team
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment & Support Info */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Payment & Support
              </h2>
              <p className="text-lg text-gray-600">
                We make it easy to get started and provide support when you need it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  Secure Payment Methods
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">UPI & Digital Wallets (PhonePe, Paytm, GPay)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Razorpay & Stripe Gateway</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">PayPal International</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">All Major Credit/Debit Cards</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-purple-600" />
                  Customer Support
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Email support for all plans</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">WhatsApp support (Premium & Elite)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dedicated account manager (Elite)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">No recurring charges or auto-renewal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}