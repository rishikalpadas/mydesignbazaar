"use client";

import { useState } from 'react';
import { Mail, CheckCircle, Sparkles, Gift, Bell } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 md:py-20 px-4 md:px-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-600 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12" data-aos="fade-up">
          {/* Icon with animation */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 leading-tight">
            Join Our Design Community
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-2 max-w-2xl mx-auto leading-relaxed">
            Get exclusive access to premium design resources, early bird offers, and insider updates from India's fastest-growing design marketplace.
          </p>
          
          {/* Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Premium Resources</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <Gift className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Exclusive Offers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
              <Bell className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">Early Access</span>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-lg mx-auto" data-aos="fade-up" data-aos-delay="200">
          {!isSubmitted ? (
            <div className="relative">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 pr-28 md:pr-32 text-base rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 placeholder-gray-400 shadow-lg hover:shadow-xl"
                  required
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !email}
                  className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 px-4 md:px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Subscribe
                      <Mail className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 px-4 md:px-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Welcome Aboard! 🎉</h3>
              <p className="text-green-700">Thank you for joining our design community. Check your inbox for a special welcome offer!</p>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="400">
          <div className="flex items-center justify-center gap-4 md:gap-6 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>25,000+ Designers Trust Us</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>Made in India 🇮🇳</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            We respect your privacy. No spam, unsubscribe anytime. By subscribing, you agree to receive design updates and promotional content.
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '2s'}}></div>
      </div>
    </section>
  );
};

export default Newsletter;