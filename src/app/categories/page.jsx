// pages/unique-designs.js
import { Heart } from "lucide-react";

const dummyDesigns = Array.from({ length: 18 },(_,i) => ({
  id: i + 1,
  title: `Unique Design ${i + 1}`,
  category: i % 2 === 0 ? "Kidswear" : "Minimal",
  img: `https://picsum.photos/seed/unique-design-${i + 1}/600/400`,
  likes: 50 + i * 7,
}));

function DesignCard({ design }) {
  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Background Image */}
      <img
        src={design.img}
        alt={design.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition duration-500"></div>

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-lg">{design.title}</h3>
          <p className="text-sm text-gray-200">{design.category}</p>
        </div>
        <div className="flex items-center gap-1 text-pink-400 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
          <Heart className="w-4 h-4 fill-pink-400" />
          <span className="text-sm text-white">{design.likes}</span>
        </div>
      </div>
    </div>
  );
}

export default function UniqueDesignsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-slate-200 p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Our Unique Designs
      </h1>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyDesigns.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>
    </div>
  );
}
