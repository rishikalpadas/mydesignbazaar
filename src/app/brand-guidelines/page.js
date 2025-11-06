import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default function BrandGuidelinesPage() {
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
                🎨
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Brand Guidelines
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Empowering Creativity. Elevating Garment Design.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Official brand guidelines for MY DESIGN BAZAAR™</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to MY DESIGN BAZAAR™</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              India&apos;s pioneering platform for downloadable, ready-to-use, premium garment design files. These guidelines serve as the cornerstone of our visual identity, tone of voice, and brand consistency.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <p className="text-lg text-gray-700 font-medium">
                By adhering to these guidelines, you contribute to a cohesive brand narrative that reflects our core values: Creativity, Integrity, Accessibility, and Innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Essence */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🧭 Brand Essence</h2>
              <p className="text-xl text-gray-600">Core elements that define our brand identity</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    ✅
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">Brand Name</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-2xl text-blue-600 mb-2">MY DESIGN BAZAAR™</h4>
                    <p className="text-gray-600">Use in full. Avoid abbreviations (e.g., &quot;MDB&quot;) in public-facing communication unless officially stylized.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">Taglines</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-bold text-lg text-orange-600 mb-2">Primary Tagline</h4>
                    <p className="text-gray-700 font-medium">&quot;Designs that Inspire. Creativity that Converts.&quot;</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h4 className="font-bold text-lg text-pink-600 mb-2">Alternate</h4>
                    <p className="text-gray-700 font-medium">&quot;Your One-Stop Digital Market for Garment Designs.&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">Brand Mission</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To democratize access to garment designs for brands, boutiques, exporters, and garment manufacturers by creating a reliable, user-friendly, and copyright-compliant digital marketplace that empowers both designers and buyers.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🔮
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 ml-4">Brand Vision</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To become the largest and most trusted global ecosystem for AI-powered, curated, and user-generated digital design assets in the garment and fashion industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Values */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">💡 Brand Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Creative Freedom</h3>
                <p className="text-gray-600 leading-relaxed">Encouraging designers to express their individuality</p>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🏢
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Commercial Reliability</h3>
                <p className="text-gray-600 leading-relaxed">Ensuring buyers receive industry-grade designs</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚖️
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Legal Integrity</h3>
                <p className="text-gray-600 leading-relaxed">Offering copyright-safe, properly licensed assets</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  💻
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">User-Centric Technology</h3>
                <p className="text-gray-600 leading-relaxed">Simplifying the digital garment design workflow</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🌍
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Global Accessibility</h3>
                <p className="text-gray-600 leading-relaxed">Serving users across languages, regions, and industries</p>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🎨 Brand Color Palette</h2>
              <p className="text-xl text-gray-600">Our signature colors that define our visual identity</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-teal-600 h-32 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#007F8B</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Royal Teal</h3>
                  <p className="text-gray-600">Primary branding and headers</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-800 h-32 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#1C1C1C</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Charcoal Black</h3>
                  <p className="text-gray-600">Text, call-to-actions</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-50 h-32 flex items-center justify-center border">
                  <span className="text-gray-800 font-bold text-lg">#FAFAFA</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Cloud White</h3>
                  <p className="text-gray-600">Background, contrast spacing</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-red-400 h-32 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#F46464</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Sunset Coral</h3>
                  <p className="text-gray-600">Accent buttons and alerts</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-yellow-500 h-32 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#CFAE58</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Metallic Gold</h3>
                  <p className="text-gray-600">Premium design categories</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🖋️ Typography</h2>
              <p className="text-xl text-gray-600">Our carefully selected fonts for consistent communication</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Headings</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-blue-600 mb-2">Font: Poppins Bold</h4>
                    <p className="text-gray-600">Use: Titles, section headers, emphasis</p>
                    <div className="mt-3">
                      <p className="font-bold text-3xl text-gray-800">Sample Heading</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Subheadings</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-600 mb-2">Font: Poppins Medium</h4>
                    <p className="text-gray-600">Use: Feature sections, secondary emphasis</p>
                    <div className="mt-3">
                      <p className="font-medium text-xl text-gray-800">Sample Subheading</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Body Text</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-green-600 mb-2">Font: Open Sans Regular</h4>
                    <p className="text-gray-600">Use: Paragraphs, descriptions, policies</p>
                    <div className="mt-3">
                      <p className="text-gray-800">This is sample body text that shows how regular content appears.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quote or Highlight</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-orange-600 mb-2">Font: Playfair Display Italic</h4>
                    <p className="text-gray-600">Use: Testimonials, promotional banners</p>
                    <div className="mt-3">
                      <p className="italic text-xl text-gray-800">&quot;Sample quote text&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tone of Voice */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📢 Tone of Voice</h2>
              <p className="text-xl text-gray-600">How we communicate with our audience</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  👑
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Authoritative but Approachable</h3>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  ⚡
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Vibrant but Professional</h3>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  🔮
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Visionary yet Practical</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-green-600 mb-6">DO:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Use clear and enthusiastic language</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Educate your audience while being empathetic</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Highlight benefits while staying authentic</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-600 mb-6">DON&apos;T:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Overuse jargon</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Make unverifiable claims</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Mimic or copy other brands&apos; tonality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Guidelines */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">📱 Social Media Style Guide</h2>
              <p className="text-xl text-gray-600">Platform-specific guidelines for consistent social presence</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📌 Recommended Hashtags</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">#MyDesignBazaar</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">#GarmentDesignsIndia</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">#FashionDesignMarketplace</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">#DownloadAndCreate</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">#DTFDesigns</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-blue-600 mb-3">Facebook</h4>
                  <p className="text-gray-600 text-sm">Informative and community-driven</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-6">
                  <h4 className="font-bold text-pink-600 mb-3">Instagram</h4>
                  <p className="text-gray-600 text-sm">Visual-first, aesthetic-focused with design reels</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-blue-600 mb-3">LinkedIn</h4>
                  <p className="text-gray-600 text-sm">B2B-oriented, industry expertise</p>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-bold text-red-600 mb-3">YouTube Shorts</h4>
                  <p className="text-gray-600 text-sm">Snappy, behind-the-scenes previews</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-blue-600 mb-3">Twitter</h4>
                  <p className="text-gray-600 text-sm">Announcements, thought leadership, quick design tips</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🛍️ Product Categorization</h2>
              <p className="text-xl text-gray-600">Consistent buyer navigation structure</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mb-4">
                  👶
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Kidswear Collection</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl mb-4">
                  🧒
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Teens and Tweens Styles</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl mb-4">
                  👨
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Menswear Graphics</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-xl mb-4">
                  👩
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Womenswear Embellishments</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-xl mb-4">
                  🎉
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Occasion-Based Designs</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl mb-4">
                  🤖
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI-Generated Themes</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-xl mb-4">
                  ⭐
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Designer-Exclusive Uploads</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl mb-4">
                  🌸
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Cultural & Regional Motifs</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-xl mb-4">
                  📝
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Typography & Quotes</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-xl mb-4">
                  🌿
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Seasonal Trends</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Legal & Licensing */}
        <section className="py-20 bg-gray-800 text-white px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">📄 Legal & Licensing Language</h2>
              <p className="text-xl opacity-90 mb-8">Always include on downloadable files and design pages</p>
              
              <div className="bg-gray-700 rounded-2xl p-8">
                <div className="bg-gray-600 rounded-lg p-6 mb-6">
                  <p className="text-lg font-medium">
                    © Design licensed by MY DESIGN BAZAAR™. For commercial use only. 
                    Redistribution or resale of digital files is strictly prohibited.
                  </p>
                </div>
                <div className="text-sm opacity-75">
                  <p>
                    <strong>Note:</strong> All assets and content are protected by Indian Copyright Law 
                    and International IP Treaties. Legal enforcement is monitored regularly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand in Action */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">👨‍💻 Brand in Action</h2>
              <p className="text-xl text-gray-600">Use brand visuals, tone, and design philosophy consistently across</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">Website banners</h4>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">Designer upload dashboards</h4>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">Customer purchase receipts</h4>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">Press releases</h4>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">YouTube tutorials and reels</h4>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">API-integrated B2B solutions</h4>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  ✅
                </div>
                <h4 className="font-semibold text-gray-800">Digital & print ads</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Usage Guidelines */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">🎨 Logo Usage Guidelines</h2>
              <p className="text-xl text-gray-600">Proper usage ensures consistent brand recognition</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-green-600 mb-6">✅ Correct Usage</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Use across all major touchpoints including website headers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Perfect for social media, packaging mockups, and press kits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Maintain clear space equivalent to the height of letter &quot;M&quot;</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="w-32 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto flex items-center justify-center text-white font-bold">
                    MY DESIGN<br />BAZAAR™
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-red-600 mb-6">⛔ Incorrect Usage</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Do not alter proportions, colors, or font</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Do not rotate or distort the logo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Avoid low-resolution formats</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-20 h-16 bg-red-200 rounded transform rotate-12 flex items-center justify-center text-xs text-red-600">
                      Rotated ❌
                    </div>
                    <div className="w-16 h-20 bg-red-200 rounded transform scale-y-150 flex items-center justify-center text-xs text-red-600">
                      Stretched ❌
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Brand Team */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 text-white">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">📬 Contact Brand Team</h2>
              <p className="text-xl opacity-90 mb-12 leading-relaxed">
                Have questions about brand alignment or co-branding opportunities? Our team is here to help ensure consistent brand representation.
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📧
                  </div>
                  <h3 className="font-bold text-xl mb-3">Email</h3>
                  <a href="mailto:info@mydesignbazaar.com" className="text-blue-200 hover:text-white transition-colors font-medium">
                    info@mydesignbazaar.com
                  </a>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🌐
                  </div>
                  <h3 className="font-bold text-xl mb-3">Website</h3>
                  <a href="http://www.mydesignbazaar.com" className="text-green-200 hover:text-white transition-colors font-medium">
                    www.mydesignbazaar.com
                  </a>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    📞
                  </div>
                  <h3 className="font-bold text-xl mb-3">Toll-Free</h3>
                  <span className="text-yellow-200 font-medium">1800-33-4445</span>
                </div>
              </div>

              <div className="mt-12 bg-white/15 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Ready to Collaborate?</h3>
                <p className="opacity-90 mb-6">
                  Whether you&apos;re looking to partner with us or need clarification on brand usage, 
                  we&apos;re committed to maintaining the integrity and consistency of MY DESIGN BAZAAR™.
                </p>
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                  Get Brand Support
                </button>
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}