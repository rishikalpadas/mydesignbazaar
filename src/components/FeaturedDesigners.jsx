"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Instagram, Globe, Star, MapPin, ArrowRight, Verified } from "lucide-react";

const featuredDesigners = [
  {
    id: 1,
    name: "Aanya Mehta",
    brand: "Textura Studio",
    avatar: "https://i.pravatar.cc/150?img=52",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    specializations: ["Womenswear", "Floral", "Festival"],
    instagram: "https://instagram.com/textura_studio",
    behance: "https://behance.net/aanyamehta",
    completedProjects: 89,
    priceRange: "₹2,500 - ₹15,000",
  },
  {
    id: 2,
    name: "Rahul Iyer",
    brand: "TypoTribe",
    avatar: "https://i.pravatar.cc/150?img=33",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    specializations: ["Typography", "AI-Generated"],
    instagram: "https://instagram.com/rahultypo",
    behance: "",
    completedProjects: 156,
    priceRange: "₹1,800 - ₹12,000",
  },
  {
    id: 3,
    name: "Pooja Singh",
    brand: "Boho Threads",
    avatar: "https://i.pravatar.cc/150?img=47",
    location: "Delhi, NCR",
    rating: 4.7,
    reviewCount: 203,
    isVerified: false,
    specializations: ["Kidswear", "Minimal", "Custom"],
    instagram: "",
    behance: "https://behance.net/poojasingh",
    completedProjects: 78,
    priceRange: "₹3,000 - ₹18,000",
  },
  {
    id: 4,
    name: "Aditya Ghosh",
    brand: "PatternLab",
    avatar: "https://i.pravatar.cc/150?img=24",
    location: "Kolkata, West Bengal",
    rating: 4.9,
    reviewCount: 145,
    isVerified: true,
    specializations: ["Menswear", "Abstract", "Ethnic"],
    instagram: "https://instagram.com/patternlab",
    behance: "",
    completedProjects: 112,
    priceRange: "₹2,200 - ₹14,500",
  },
];

const FeaturedDesigners = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* **Header Section** */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Top Rated Designers
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Meet Our
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Featured </span>
            Designers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover talented designers from across India, creating stunning patterns and designs for your brand
          </p>
        </div>

        {/* **Swiper Carousel** */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3.2 },
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{ 
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop
            className="pb-12"
          >
            {featuredDesigners.map((designer) => (
              <SwiperSlide key={designer.id}>
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-500 overflow-hidden">
                  {/* **Card Header** */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          src={designer.avatar}
                          alt={designer.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                        />
                        {designer.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <Verified className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{designer.rating}</span>
                        <span className="text-xs text-gray-500">({designer.reviewCount})</span>
                      </div>
                    </div>

                    {/* **Designer Info** */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {designer.name}
                      </h3>
                      <p className="text-indigo-600 font-medium text-sm mb-2">{designer.brand}</p>
                      
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{designer.location}</span>
                      </div>

                      {/* **Specializations** */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {designer.specializations.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* **Card Stats** */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{designer.completedProjects}</p>
                        <p className="text-xs text-gray-500">Projects</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-600">{designer.priceRange}</p>
                        <p className="text-xs text-gray-500">Price Range</p>
                      </div>
                    </div>
                  </div>

                  {/* **Card Footer** */}
                  <div className="p-6 pt-4">
                    <div className="flex items-center justify-between">
                      {/* **Social Links** */}
                      <div className="flex gap-3">
                        {designer.instagram && (
                          <a
                            href={designer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                          >
                            <Instagram className="w-4 h-4 text-white" />
                          </a>
                        )}
                        {designer.behance && (
                          <a
                            href={designer.behance}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                          >
                            <Globe className="w-4 h-4 text-white" />
                          </a>
                        )}
                      </div>

                      {/* **View Profile Button** */}
                      <button className="group/btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                        View Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* **Custom Navigation Buttons** */}
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </div>
          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* **Call to Action** */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Explore All Designers
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigners;
