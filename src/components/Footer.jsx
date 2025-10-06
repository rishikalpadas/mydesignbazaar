"use client";
import { useState } from "react";
import {
  Mail,
  PhoneCall,
  MessageCircle,
  Instagram,
  Linkedin,
  Globe,
  ArrowUp,
  ExternalLink,
  Heart,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Brand Guidelines", href: "/brand-guidelines" },
    { name: "Copyright Terms", href: "/copyright-terms" },
    { name: "Licensing Policy", href: "/licensing-policy" },
    { name: "Monetization Policy", href: "/monetization-policy" },
    { name: "Philosophy", href: "/philosophy" },
    { name: "Pricing", href: "/pricing" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Why Choose Us", href: "/why-choose-us" },
  ];

  // Split links into two columns
  const midPoint = Math.ceil(quickLinks.length / 2.2);
  const firstColumn = quickLinks.slice(0, midPoint);
  const secondColumn = quickLinks.slice(midPoint);

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Portfolio",
      icon: Globe,
      href: "https://behance.net",
      color: "hover:text-purple-400",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute top-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-10"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="relative py-20 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Logo + Brand Section */}
            <div className="lg:col-span-1">
              <div className="group mb-8">
                <img
                  src="/logo.png"
                  alt="MyDesignBazaar"
                  className="w-64 md:w-72 mb-6 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your Brand. Your Identity. Buy & sell unique textile and surface pattern designs with full licensing support.
              </p> */}

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Trusted by 25,000+ Designers</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <MapPin className="w-3 h-3" />
                <span>Made in India 🇮🇳</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-bold mb-6 text-base flex items-center gap-2">
                Quick Links
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </h3>
              <div className="grid grid-cols-2 gap-x-4">
                {/* First Column */}
                <ul className="space-y-3">
                  {firstColumn.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                
                {/* Second Column */}
                <ul className="space-y-3">
                  {secondColumn.map((link, index) => (
                    <li key={index + firstColumn.length}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-bold mb-6 text-base flex items-center gap-2">
                Contact
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li className="group">
                  <a
                    href="mailto:support@mydesignbazaar.com"
                    className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-300"
                  >
                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-indigo-600 transition-colors duration-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>Email: info@mydesignbazaar.com</span>
                  </a>
                </li>
                {/* <li className="group">
                  <a
                    href="tel:18001234567"
                    className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-300"
                  >
                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-green-600 transition-colors duration-300">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span>Call or WhatsApp: +919831147445</span>
                  </a>
                </li> */}
                {/* <li className="group">
                  <a
                    href="https://wa.me/919876543210"
                    className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-300"
                  >
                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-green-500 transition-colors duration-300">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span>WhatsApp: +91 98765 43210</span>
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Social & CTA */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-bold mb-6 text-base flex items-center gap-2">
                Connect
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </h3>

              {/* Social Links */}
              <div className="flex gap-4 mb-8">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6 ${social.color} group`}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <ExternalLink
                        className={`w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                    </a>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <a
                 
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Become a Designer ✨
                </a>
                <a
                  href="/categories"
                  className="block w-full border border-gray-600 text-gray-300 text-sm font-medium px-6 py-3 rounded-xl hover:border-indigo-500 hover:text-white transition-all duration-300 text-center cursor-pointer"
                >
                  Browse Designs
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 pt-12 border-t border-gray-700">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-3">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Get the latest design trends and marketplace updates
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-400 transition-all duration-300"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              © {new Date().getFullYear()} MyDesignBazaar. All rights reserved.
              <span className="flex items-center gap-1">
                Made with{" "}
                <Heart className="w-3 h-3 text-red-500 animate-pulse" /> in
                India
              </span>
            </div>
            {/* <div className="flex items-center gap-6 text-xs text-gray-500">
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
              <a href="/careers" className="hover:text-white transition-colors">Careers</a>
              <a href="/press" className="hover:text-white transition-colors">Press</a>
            </div> */}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <p className="text-sm text-gray-500 flex items-center gap-2">A unit of PRINTING MADE EASY</p>
              </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;