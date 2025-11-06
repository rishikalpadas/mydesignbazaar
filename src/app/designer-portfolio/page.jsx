// pages/profiles.js
import Navbar from "../../components/Navbar";
import { Star, Globe, MapPin } from "lucide-react";

const dummyProfiles = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? `Pooja Singh ${i + 1}` : `Rahul Dey ${i + 1}`,
  company: "Boho Threads",
  location: "Delhi, NCR",
  rating: (4.5 + Math.random() * 0.5).toFixed(1), // random between 4.5-5
  reviews: 100 + i * 10,
  tags: ["Kidswear", "Minimal", "Custom"],
  projects: 50 + i * 5,
  priceRange: `₹${3000 + i * 200} - ₹${18000 - i * 500}`,
  img: `https://randomuser.me/api/portraits/${i%2===0 ? "women" : "men"}/${30 + i}.jpg`,
}));

function ProfileCard({ profile }) {
  return (
    <>
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top Section */}
      <div className="p-5 flex flex-col items-center text-center relative">
        <img
          src={profile.img}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
        />
        <div className="absolute top-5 right-5 flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg shadow-sm">
          <Star className="text-yellow-500 w-4 h-4" />
          <span className="font-semibold text-sm text-gray-700">
            {profile.rating}
          </span>
          <span className="text-xs text-gray-500">({profile.reviews})</span>
        </div>

        <h2 className="mt-4 text-lg font-bold text-gray-800">
          {profile.name}
        </h2>
        <a
          href="#"
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          {profile.company}
        </a>

        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {profile.location}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {profile.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-600 font-medium border border-purple-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{profile.projects}</p>
          <p className="text-xs text-gray-500">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-green-600 font-semibold">{profile.priceRange}</p>
          <p className="text-xs text-gray-500">Price Range</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
        <button className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition">
          <Globe className="w-4 h-4" /> Website
        </button>
        <button className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transform transition">
          View Profile
        </button>
      </div>
    </div>
    </>
  );
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default function ProfilesPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-slate-200 p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Featured Designers
      </h1>

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
    </>
  );
}
