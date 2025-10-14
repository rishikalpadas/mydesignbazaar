'use client'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import {
  Mail,
  PhoneCall,
  MapPin,
  Globe,
  MessageCircle,
  Clock,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2,
  Briefcase,
  Users,
  HeadphonesIcon
} from 'lucide-react';
import { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you within 24-48 hours.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                📞
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Contact Us
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                We&apos;re Here to Help You Create, Collaborate, and Conquer the Fashion World.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Available Monday to Saturday, 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                At My Design Bazaar, we believe that every great design begins with a meaningful connection. Whether you&apos;re a fashion designer, a garment manufacturer, or a creative entrepreneur, our team is here to assist you at every step — from design downloads to uploads, subscriptions, and creative collaborations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">25,000+ Designers</h3>
                <p className="text-gray-600 text-sm">Trusted by a growing creative community</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">24-48 Hour Response</h3>
                <p className="text-gray-600 text-sm">Quick and efficient customer support</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Global Platform</h3>
                <p className="text-gray-600 text-sm">India&apos;s first AI-powered marketplace</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📨 Contact Information</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple ways to reach us. Choose what works best for you.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Email Us</h3>
                  <p className="opacity-90 text-sm">For general inquiries & support</p>
                </div>
                <div className="p-6">
                  <a href="mailto:info@mydesignbazaar.com" className="text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5" />
                    info@mydesignbazaar.com
                  </a>
                  <a href="mailto:mydesignbazaarindia@gmail.com" className="text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    mydesignbazaarindia@gmail.com
                  </a>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      General inquiries
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Technical support
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Partnership opportunities
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Call Us</h3>
                  <p className="opacity-90 text-sm">Speak with our support team</p>
                </div>
                <div className="p-6">
                  <a href="tel:03340614021" className="text-green-600 hover:text-green-700 font-semibold text-lg flex items-center gap-2 mb-6">
                    <PhoneCall className="w-5 h-5" />
                    033 40614021
                  </a>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-sm">Business Hours</span>
                    </div>
                    <p className="text-sm text-gray-700">Monday to Saturday</p>
                    <p className="text-sm text-gray-700">10:00 AM – 7:00 PM IST</p>
                    <p className="text-xs text-gray-500 mt-2">Closed on Sundays and public holidays</p>
                  </div>
                </div>
              </div>

              {/* Office */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
                  <p className="opacity-90 text-sm">Corporate office location</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">Printing Made Easy</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      666, Jogendra Garden<br />
                      Kolkata, West Bengal<br />
                      India - PIN 700 078
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-700 mt-4">
                    <p className="font-semibold mb-1">Official Partner & Operator</p>
                    <p>MyDesignBazaar.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="max-w-6xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl">
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Visit Our Website</h3>
                <a href="https://www.mydesignbazaar.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 font-semibold text-xl underline">
                  www.mydesignbazaar.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Support */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">💬 Customer Support</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our dedicated support team ensures that your creative experience on My Design Bazaar remains smooth and secure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  💡
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Subscription & Account</h3>
                <p className="text-gray-600 text-xs">Setup assistance</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🎨
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Design Assistance</h3>
                <p className="text-gray-600 text-xs">Upload or download help</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ⚙️
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Technical Support</h3>
                <p className="text-gray-600 text-xs">Troubleshooting</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  💰
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Payment Queries</h3>
                <p className="text-gray-600 text-xs">Refund & monetization</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🧾
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Legal Concerns</h3>
                <p className="text-gray-600 text-xs">Copyright issues</p>
              </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800">Response Guarantee</h3>
              </div>
              <p className="text-lg text-gray-700">
                We respond to all inquiries within <span className="font-bold text-green-600">24–48 business hours</span>
              </p>
            </div>
          </div>
        </section>

        {/* Partner with Us */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
                🤝
              </div>
              <h2 className="text-4xl font-bold mb-6">Partner with Us</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Are you a designer looking to showcase your creativity to the global apparel industry? Or a manufacturer searching for ready-to-print, royalty-safe garment graphics?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-full mb-6 flex items-center justify-center text-3xl">
                  🎨
                </div>
                <h3 className="text-2xl font-bold mb-4">For Designers</h3>
                <p className="mb-6 opacity-90">Showcase your creativity to the global apparel industry and monetize your designs</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Earn up to 50% revenue per sale</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Retain full copyright ownership</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Global exposure to manufacturers</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-full mb-6 flex items-center justify-center text-3xl">
                  🏭
                </div>
                <h3 className="text-2xl font-bold mb-4">For Manufacturers</h3>
                <p className="mb-6 opacity-90">Access ready-to-print, royalty-safe garment graphics instantly</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>100% verified vector artwork</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Commercial licensing included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Instant download in multiple formats</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Join our fast-growing creative ecosystem today!</h3>
              <a
                href="mailto:mydesignbazaarindia@gmail.com"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                Write to us at mydesignbazaarindia@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📱 Follow Us for Updates</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay inspired and informed about new design launches, offers, and industry insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <a href="https://instagram.com/mydesignbazaar" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Instagram className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Instagram</h3>
                <p className="text-gray-600 text-sm">@mydesignbazaar</p>
              </a>

              <a href="https://facebook.com/mydesignbazaar" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Facebook</h3>
                <p className="text-gray-600 text-sm">facebook.com/mydesignbazaar</p>
              </a>

              <a href="https://linkedin.com/company/mydesignbazaar" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Linkedin className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">LinkedIn</h3>
                <p className="text-gray-600 text-sm">linkedin.com/company/mydesignbazaar</p>
              </a>

              <a href="https://youtube.com/@mydesignbazaar" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Youtube className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">YouTube</h3>
                <p className="text-gray-600 text-sm">youtube.com/@mydesignbazaar</p>
              </a>
            </div>
          </div>
        </section>

        {/* Why Contact Us */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🧭 Why Contact My Design Bazaar?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We&apos;re not just a platform — we&apos;re your creative business partner.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  🌍
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">India&apos;s First AI-Powered Marketplace</h3>
                <p className="text-gray-600 text-sm">Leading the future of digital garment design</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  💼
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">100% Verified Artwork</h3>
                <p className="text-gray-600 text-sm">Layered vector designs ready for production</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  🧠
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Built for Professionals</h3>
                <p className="text-gray-600 text-sm">Designed for designers, loved by manufacturers</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  💳
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Easy Global Payments</h3>
                <p className="text-gray-600 text-sm">UPI, Razorpay, Stripe, PayPal, Credit & Debit Cards</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  ⚖️
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Transparent Policies</h3>
                <p className="text-gray-600 text-sm">Fair monetization model for creators</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                  🛡️
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Secure & Licensed</h3>
                <p className="text-gray-600 text-sm">Copyright-safe with commercial licensing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🧾 Quick Links</h2>
              <p className="text-xl text-gray-600">Explore more about our platform</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a href="/about-us" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">About Us</h3>
                <p className="text-gray-600 text-sm">Learn about our mission and vision</p>
              </a>

              <a href="/privacy-policy" className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Privacy Policy</h3>
                <p className="text-gray-600 text-sm">How we protect your data</p>
              </a>

              <a href="/refund-policy" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">Refund Policy</h3>
                <p className="text-gray-600 text-sm">Our refund terms and conditions</p>
              </a>

              <a href="/licensing-policy" className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Licensing & Copyright</h3>
                <p className="text-gray-600 text-sm">Understand usage rights</p>
              </a>

              <a href="/dashboard" className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">Join as Designer</h3>
                <p className="text-gray-600 text-sm">Start uploading your designs</p>
              </a>

              <a href="/pricing" className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">Pricing</h3>
                <p className="text-gray-600 text-sm">View subscription plans</p>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12 text-white">
              <Send className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-xl opacity-90">Have a question? Fill out the form below and we&apos;ll get back to you soon.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
