"use client";
import { Apple, Download, Smartphone, Globe, Clock } from "lucide-react";

const AppPromo = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
        {/* **Left Content** */}
        <div data-aos="fade-right">
          <h2 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
            Your Designs, Anywhere.
          </h2>
          <p className="text-sm md:text-base text-indigo-100 mb-6 leading-relaxed">
            Whether you're on the go or managing your design store, access
            MyDesignBazaar easily from any device. Our mobile app is coming soon
            to make your creative journey even more seamless.
          </p>

          <div className="flex flex-wrap gap-3 justify-start">
            <button className="flex items-center gap-2 px-4 py-3 rounded-md bg-white text-indigo-700 font-semibold hover:bg-indigo-100 transition text-xs md:text-sm shadow-md min-w-fit">
              <Globe className="w-4 h-4" />
              Web Platform
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-md bg-white text-indigo-700 font-semibold hover:bg-indigo-100 transition text-xs md:text-sm shadow-md min-w-fit">
              <Clock className="w-4 h-4" />
              iOS (Coming Soon)
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-md bg-white text-indigo-700 font-semibold hover:bg-indigo-100 transition text-xs md:text-sm shadow-md min-w-fit">
              <Clock className="w-4 h-4" />
              Android (Coming Soon)
            </button>
          </div>
        </div>

        {/* **Right Image** */}
        <div
          data-aos="fade-left"
          className="flex justify-center md:justify-end"
        >
          <img
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
            alt="App Preview"
            className="w-full max-w-sm mx-auto drop-shadow-2xl rounded-xl"
          />
        </div>
      </div>

      {/* **Background Glow** */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-30 -z-10"></div>

      {/* **Call to Action** */}
      <div className="text-center mt-8 md:mt-12 px-4">
        <h3 className="text-xl md:text-3xl font-bold mb-4">
          Ready to Elevate Your Design Game?
        </h3>
        <p className="text-indigo-100 mb-6">
          Download our app and start creating stunning designs on the go!
        </p>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
          Get Notified
        </button>
      </div>
    </section>
  );
};

export default AppPromo;
