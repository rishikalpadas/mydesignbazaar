"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch("/api/sliders/add-slider");

        if (response.ok) {
          const data = await response.json();
          const activeSliders = data.sliders.filter(slider => slider.isActive);

          // Transform API data to match the expected slide format
          const transformedSlides = activeSliders.map(slider => ({
            id: slider._id,
            image: slider.image,
            title: slider.title,
            subtitle: slider.theme?.name || "Featured Collection",
            description: slider.description,
            cta: slider.cta || "Explore Now",
            theme: slider.theme || {
              primary: "from-orange-500 to-amber-600",
              accent: "text-orange-600",
              bg: "from-orange-50/80 to-amber-50/80",
              badge: "bg-orange-100 text-orange-800",
            },
            stats: slider.stats || { designs: "1K+", rating: "4.8", downloads: "10K+" },
            trending: slider.trending || false,
          }));

          setSlides(transformedSlides);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
        // Fallback to default slides on error
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Default fallback slides (same as before)
  const defaultSlides = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/6311395/pexels-photo-6311395.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Authentic Indian Designs",
      subtitle: "Heritage Collection",
      description:
        "Discover premium traditional patterns crafted by master artisans",
      cta: "Explore Heritage",
      theme: {
        primary: "from-orange-500 to-amber-600",
        accent: "text-orange-600",
        bg: "from-orange-50/80 to-amber-50/80",
        badge: "bg-orange-100 text-orange-800",
      },
      stats: { designs: "2.5K+", rating: "4.9", downloads: "50K+" },
      trending: true,
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/6457571/pexels-photo-6457571.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Modern Minimalist",
      subtitle: "Contemporary Studio",
      description:
        "Clean, sophisticated designs for modern brands and startups",
      cta: "Browse Modern",
      theme: {
        primary: "from-blue-500 to-indigo-600",
        accent: "text-blue-600",
        bg: "from-blue-50/80 to-indigo-50/80",
        badge: "bg-blue-100 text-blue-800",
      },
      stats: { designs: "1.8K+", rating: "4.8", downloads: "35K+" },
      trending: false,
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Festival Specials",
      subtitle: "Celebration Collection",
      description: "Vibrant designs for Diwali, Holi, and special occasions",
      cta: "Shop Festival",
      theme: {
        primary: "from-pink-500 to-rose-600",
        accent: "text-pink-600",
        bg: "from-pink-50/80 to-rose-50/80",
        badge: "bg-pink-100 text-pink-800",
      },
      stats: { designs: "3.2K+", rating: "4.9", downloads: "75K+" },
      trending: true,
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Business Branding",
      subtitle: "Professional Identity",
      description: "Corporate designs that build trust and credibility",
      cta: "View Corporate",
      theme: {
        primary: "from-slate-600 to-gray-700",
        accent: "text-slate-600",
        bg: "from-slate-50/80 to-gray-50/80",
        badge: "bg-slate-100 text-slate-800",
      },
      stats: { designs: "1.5K+", rating: "4.7", downloads: "25K+" },
      trending: false,
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/4473497/pexels-photo-4473497.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Custom Solutions",
      subtitle: "Bespoke Service",
      description: "Personalized designs tailored for your unique brand",
      cta: "Get Custom",
      theme: {
        primary: "from-emerald-500 to-teal-600",
        accent: "text-emerald-600",
        bg: "from-emerald-50/80 to-teal-50/80",
        badge: "bg-emerald-100 text-emerald-800",
      },
      stats: { designs: "Unlimited", rating: "5.0", downloads: "10K+" },
      trending: true,
    },
  ];

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading sliders...</p>
        </div>
      </div>
    );
  }

  // Show message if no slides available
  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Sliders Available</h2>
          <p className="text-gray-600 mb-6">Please check back later for exciting content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        pagination={{
          el: ".hero-pagination",
          clickable: true,
          bulletClass:
            "w-2 h-2 bg-gray-300 rounded-full cursor-pointer transition-all duration-300",
          bulletActiveClass: "!bg-gray-800 !w-8",
        }}
        autoplay={
          isPlaying
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className={`h-full relative`}>
              {/* Mobile: Background image with dark overlay */}
              <div
                className="absolute inset-0 lg:hidden"
                style={{
                  background: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.65)), url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              {/* Desktop: Original gradient background */}
              <div
                className={`absolute inset-0 hidden lg:block bg-gradient-to-br ${slide.theme.bg}`}
              ></div>
              <div className="container mx-auto px-4 lg:px-8 h-full relative z-10">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
                  {/* Content Section */}
                  <div className="space-y-4 lg:space-y-8 lg:pr-8 relative z-10 text-white lg:text-inherit mt-8 lg:mt-0">
                    {/* Badge & Category */}
                    {/* <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${slide.theme.badge}`}
                      >
                        {slide.subtitle}
                      </span>
                      {slide.trending && (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                          Trending
                        </span>
                      )}
                    </div> */}

                    {/* Main Title */}
                    <div className="space-y-4">
                      <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white lg:text-gray-900 leading-tight tracking-tight">
                        {slide.title}
                      </h1>
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-100 lg:text-gray-600 leading-relaxed max-w-lg">
                        {slide.description}
                      </p>
                    </div>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-8 py-4 lg:py-6">
                      <div className="text-center">
                        <div className="text-lg lg:text-3xl font-bold text-white lg:text-current">
                          {slide.stats.designs}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-200 lg:text-gray-500 font-medium">
                          Designs
                        </div>
                      </div>
                      <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-lg lg:text-3xl font-bold text-white lg:text-current">
                          {slide.stats.rating}★
                        </div>
                        <div className="text-xs lg:text-sm text-gray-200 lg:text-gray-500 font-medium">
                          Rating
                        </div>
                      </div>
                      <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-lg lg:text-3xl font-bold text-white lg:text-current">
                          {slide.stats.downloads}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-200 lg:text-gray-500 font-medium">
                          Downloads
                        </div>
                      </div>
                    </div> */}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        className={`bg-gradient-to-r ${slide.theme.primary} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer`}
                      >
                        {slide.cta}
                        <svg
                          className="w-5 h-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                      <button className="bg-white/90 lg:bg-white text-gray-800 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 hover:border-gray-300 cursor-pointer">
                        View Samples
                      </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-4 lg:gap-6 pt-4 text-xs lg:text-sm text-gray-200 lg:text-gray-500 flex-wrap">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Instant Download
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        24/7 Support
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-purple-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Commercial License
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="hidden lg:block relative lg:pl-8">
                    <div className="relative group">
                      {/* Main Image Container */}
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-[400px] lg:h-[500px] xl:h-[600px] object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>

                        {/* Floating Quality Badge */}
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-700">
                              Premium Quality
                            </span>
                          </div>
                        </div>

                        {/* User Engagement Indicator */}
                        {/* <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-orange-400 rounded-full border-2 border-white"></div>
                              <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                              <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-sm">
                              <div className="font-semibold text-gray-800">
                                25K+
                              </div>
                              <div className="text-gray-600 text-xs">
                                Happy Customers
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      {/* Subtle Decorative Elements */}
                      {/* <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500"></div> */}
                      {/* <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full group-hover:scale-125 transition-transform duration-500"></div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
                <div
                  className={`h-full bg-gradient-to-r ${slide.theme.primary} transition-all ease-linear`}
                  style={{
                    width: activeIndex === index ? "100%" : "0%",
                    transitionDuration:
                      activeIndex === index && isPlaying ? "5000ms" : "0ms",
                  }}
                ></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Minimalist Navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 z-30">
        <button className="hero-prev w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group">
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-30">
        <button className="hero-next w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group">
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Clean Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="hero-pagination flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"></div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        {/* Slide Counter */}
        {/* <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-sm font-medium text-gray-700">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div> */}

        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoplay}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 group"
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4 text-gray-600 group-hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-600 group-hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Subtle Brand Watermark */}
      {/* <div className="absolute bottom-6 left-6 z-30">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">DesignBazaar</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default HeroSlider;
