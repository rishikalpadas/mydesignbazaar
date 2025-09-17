"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { 
  Star, 
  Quote, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Verified,
  TrendingUp,
  Heart,
  Award,
  Users
} from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Payal Das',
    role: 'Fashion Brand Owner',
    company: 'Ethereal Designs',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    isVerified: true,
    quote:
      'MyDesignBazaar has completely transformed how I source patterns for my fashion line. The quality is exceptional and the licensing process is incredibly straightforward. I\'ve saved months of design time!',
    designsPurchased: 45,
    memberSince: '2023',
    category: 'Fashion',
  },
  {
    id: 2,
    name: 'Amit Roy',
    role: 'Freelance Designer',
    company: 'Creative Studio',
    location: 'Bangalore, Karnataka',
    avatar: 'https://i.pravatar.cc/150?img=36',
    rating: 5,
    isVerified: true,
    quote:
      'As a designer, this platform gives me complete control over my work while providing excellent exposure. The revenue sharing is fair and the community is incredibly supportive. Best decision I made for my career!',
    designsPurchased: 0,
    designsSold: 127,
    memberSince: '2022',
    category: 'Digital Art',
  },
  {
    id: 3,
    name: 'Sneha Kapoor',
    role: 'Boutique Owner',
    company: 'Kapoor Couture',
    location: 'Delhi, NCR',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    isVerified: false,
    quote:
      'The hassle-free experience and premium quality designs have made this my go-to marketplace. Customer service is outstanding and the variety of Indian-inspired patterns is unmatched.',
    designsPurchased: 78,
    memberSince: '2023',
    category: 'Traditional Wear',
  },
  {
    id: 4,
    name: 'Harshit Singh',
    role: 'Menswear Designer',
    company: 'Urban Threads',
    location: 'Pune, Maharashtra',
    avatar: 'https://i.pravatar.cc/150?img=22',
    rating: 5,
    isVerified: true,
    quote:
      'Uploading and managing my designs is effortless. The platform\'s reach has helped me connect with buyers I never would have found otherwise. Great for emerging creators like myself!',
    designsPurchased: 12,
    designsSold: 89,
    memberSince: '2023',
    category: 'Menswear',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    role: 'Textile Manufacturer',
    company: 'Sharma Textiles',
    location: 'Jaipur, Rajasthan',
    avatar: 'https://i.pravatar.cc/150?img=25',
    rating: 5,
    isVerified: true,
    quote:
      'The authentic Indian designs and patterns available here are perfect for our traditional textile business. Quality is consistent and the designers are incredibly talented.',
    designsPurchased: 156,
    memberSince: '2022',
    category: 'Traditional Textiles',
  },
];

const stats = [
  { label: 'Happy Customers', value: '10K+', icon: <Users className="w-5 h-5" /> },
  { label: 'Average Rating', value: '4.9★', icon: <Star className="w-5 h-5" /> },
  { label: 'Success Stories', value: '2.5K+', icon: <Award className="w-5 h-5" /> },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* **Background Decorations** */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* **Header Section** */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Customer Love
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            What People Are
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Saying</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Real stories from designers and businesses who've transformed their creative journey with MyDesignBazaar
          </p>
        </div>

        {/* **Stats Section** */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4 text-white">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* **Testimonials Carousel** */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            slidesPerView={1}
            spaceBetween={24}
            autoplay={{ 
              delay: 6000,
              disableOnInteraction: false,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: '.testimonial-button-next',
              prevEl: '.testimonial-button-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 1.1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 3 },
            }}
            loop
            className="pb-16"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 overflow-hidden h-full">
                  {/* **Quote Icon** */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <div className="p-6 md:p-8">
                    {/* **Rating Stars** */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 font-medium">
                        {testimonial.rating}.0
                      </span>
                    </div>

                    {/* **Quote Text** */}
                    <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* **User Info** */}
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="relative">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                        />
                        {testimonial.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <Verified className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-blue-600 font-medium text-sm mb-1">
                          {testimonial.role}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          {testimonial.company}
                        </p>
                        
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>{testimonial.location}</span>
                        </div>

                        {/* **Category Badge** */}
                        <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                          {testimonial.category}
                        </span>
                      </div>
                    </div>

                    {/* **Stats Footer** */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 text-center">
                        {testimonial.designsSold ? (
                          <>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{testimonial.designsSold}</p>
                              <p className="text-xs text-gray-500">Designs Sold</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Since {testimonial.memberSince}</p>
                              <p className="text-xs text-gray-500">Member Since</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{testimonial.designsPurchased}</p>
                              <p className="text-xs text-gray-500">Designs Bought</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Since {testimonial.memberSince}</p>
                              <p className="text-xs text-gray-500">Member Since</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* **Custom Navigation Buttons** */}
          <div className="testimonial-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </div>
          <div className="testimonial-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* **Trust Indicators** */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Join Our Success Stories</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Be part of a community that's already transforming the design industry in India
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 mb-8">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold mb-1">₹2.5Cr+</div>
              <p className="text-blue-200 text-sm">Paid to Designers</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold mb-1">12K+</div>
              <p className="text-blue-200 text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold mb-1">50K+</div>
              <p className="text-blue-200 text-sm">Designs Sold</p>
            </div>
                        <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold mb-1">4.9★</div>
              <p className="text-blue-200 text-sm">Customer Rating</p>
            </div>
          </div>

          {/* **CTA Buttons** */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button className="bg-white text-blue-600 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
                Share Your Story
              </button>
              <button className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl border-2 border-blue-400 cursor-pointer">
                Join Community
              </button>
            </div>
          </div>
        </div>

        {/* **Featured Review Section** */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/200?img=47"
                  alt="Featured customer"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover mx-auto shadow-xl"
                />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 fill-current" />
                Featured Review of the Month
              </div>
              
              <blockquote className="text-lg lg:text-2xl font-semibold text-gray-900 leading-relaxed mb-6">
                "MyDesignBazaar didn't just give me a platform to sell my designs - it gave me a career. 
                In just 18 months, I've earned over ₹8 lakhs and built relationships with amazing brands across India."
              </blockquote>

              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">Kavya Mehra</h4>
                  <p className="text-blue-600 font-medium text-sm">Top Rated Designer</p>
                  <p className="text-gray-500 text-sm">Chennai, Tamil Nadu</p>
                </div>
                
                <div className="border-l border-gray-300 pl-4">
                  <div className="text-2xl font-bold text-green-600">₹8L+</div>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
