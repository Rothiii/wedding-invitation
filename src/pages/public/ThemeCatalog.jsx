import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Search,
  Filter,
  Eye,
  MessageCircle,
  ChevronLeft,
  Sparkles,
  Check,
} from 'lucide-react'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Theme data - in production this would come from API
const ALL_THEMES = [
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    category: 'elegant',
    price: 150000,
    colors: ['#be185d', '#f472b6', '#fdf2f8'],
    isBestSeller: true,
    isNew: false,
    features: ['Animasi Mewah', 'Ornamen Bunga', 'Font Serif Elegan'],
  },
  {
    id: 'rustic-garden',
    name: 'Rustic Garden',
    category: 'nature',
    price: 150000,
    colors: ['#166534', '#86efac', '#f0fdf4'],
    isBestSeller: false,
    isNew: true,
    features: ['Nuansa Alam', 'Ornamen Daun', 'Warna Natural'],
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    category: 'modern',
    price: 100000,
    colors: ['#1f2937', '#9ca3af', '#ffffff'],
    isBestSeller: false,
    isNew: false,
    features: ['Desain Bersih', 'Typography Modern', 'Animasi Halus'],
  },
  {
    id: 'javanese-classic',
    name: 'Javanese Classic',
    category: 'traditional',
    price: 200000,
    colors: ['#92400e', '#fbbf24', '#fef3c7'],
    isBestSeller: false,
    isNew: false,
    features: ['Ornamen Jawa', 'Batik Pattern', 'Nuansa Tradisional'],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'modern', label: 'Modern' },
  { id: 'nature', label: 'Nature' },
  { id: 'traditional', label: 'Traditional' },
]

export default function ThemeCatalog() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredThemes = ALL_THEMES.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || theme.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsAppOrder = (theme) => {
    const phone = '6281234567890'
    const message = encodeURIComponent(
      `Halo Sakeenah! Saya tertarik dengan tema "${theme.name}" untuk undangan pernikahan saya. Mohon info lebih lanjut.`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <Link to="/" className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span className="text-xl font-serif font-semibold text-gray-800">Sakeenah</span>
              </Link>
            </div>

            <Link
              to="/admin"
              className="text-gray-600 hover:text-rose-500 transition-colors text-sm"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2">
              Katalog Tema
            </h1>
            <p className="text-gray-600">
              Pilih tema yang sesuai dengan gaya pernikahan Anda
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari tema..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredThemes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Tidak ada tema yang cocok dengan pencarian Anda</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredThemes.map((theme) => (
              <motion.div
                key={theme.id}
                variants={fadeInUp}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Theme Preview */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors[2]} 0%, ${theme.colors[1]} 50%, ${theme.colors[0]} 100%)`,
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {theme.isBestSeller && (
                      <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                        Best Seller
                      </span>
                    )}
                    {theme.isNew && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Link
                      to={`/preview/${theme.id}`}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-full font-medium transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Link>
                  </div>
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-rose-500 font-medium capitalize mb-1">
                        {theme.category}
                      </p>
                      <h3 className="font-semibold text-gray-800">{theme.name}</h3>
                    </div>
                    <p className="text-rose-500 font-semibold text-sm">
                      {formatPrice(theme.price)}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {theme.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-gray-500">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color Preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleWhatsAppOrder(theme)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Pesan
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-rose-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            Butuh Tema Custom?
          </h2>
          <p className="text-gray-600 mb-6">
            Kami bisa membuat tema khusus sesuai keinginan Anda
          </p>
          <button
            onClick={() => {
              const phone = '6281234567890'
              const message = encodeURIComponent(
                'Halo Sakeenah! Saya tertarik membuat tema custom untuk undangan pernikahan saya. Mohon info lebih lanjut.'
              )
              window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Konsultasi Tema Custom
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-lg font-serif font-semibold text-gray-800">Sakeenah</span>
          </Link>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sakeenah. Made with{' '}
            <Heart className="w-3 h-3 inline text-rose-400" /> in Indonesia
          </p>
        </div>
      </footer>
    </div>
  )
}
