import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  ChevronLeft,
  Smartphone,
  Tablet,
  Monitor,
  MessageCircle,
  Check,
  Palette,
  Music,
  MapPin,
  Gift,
  Calendar,
  Users,
} from 'lucide-react'
import { DemoInvitation } from '@/components/demo'

// Theme data - in production this would come from API
const THEMES = {
  'elegant-rose': {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    category: 'elegant',
    price: 150000,
    colors: ['#be185d', '#f472b6', '#fdf2f8'],
    isBestSeller: true,
    description: 'Tema elegan dengan nuansa rose yang romantis, cocok untuk pasangan yang menyukai kesan mewah dan feminin.',
    features: [
      'Animasi pembukaan mewah',
      'Ornamen bunga mawar',
      'Font serif elegan',
      'Background pattern floral',
      'Countdown timer animasi',
      'Gallery dengan lightbox',
    ],
  },
  'rustic-garden': {
    id: 'rustic-garden',
    name: 'Rustic Garden',
    category: 'nature',
    price: 150000,
    colors: ['#166534', '#86efac', '#f0fdf4'],
    isNew: true,
    description: 'Tema dengan nuansa alam dan garden party, sempurna untuk outdoor wedding atau pasangan yang mencintai alam.',
    features: [
      'Ornamen daun dan tanaman',
      'Warna natural earth tone',
      'Animasi daun berjatuhan',
      'Background watercolor',
      'Font casual elegan',
      'Section galeri grid',
    ],
  },
  'minimalist-white': {
    id: 'minimalist-white',
    name: 'Minimalist White',
    category: 'modern',
    price: 100000,
    colors: ['#1f2937', '#9ca3af', '#ffffff'],
    description: 'Desain bersih dan modern dengan fokus pada tipografi dan white space, cocok untuk pasangan yang menyukai kesederhanaan.',
    features: [
      'Desain clean minimalis',
      'Typography modern',
      'Animasi halus dan subtle',
      'White space balance',
      'Sans-serif font',
      'Layout grid modern',
    ],
  },
  'javanese-classic': {
    id: 'javanese-classic',
    name: 'Javanese Classic',
    category: 'traditional',
    price: 200000,
    colors: ['#92400e', '#fbbf24', '#fef3c7'],
    description: 'Tema tradisional Jawa dengan ornamen batik dan wayang, sempurna untuk pernikahan adat Jawa yang elegan.',
    features: [
      'Ornamen batik Jawa',
      'Pattern wayang',
      'Warna emas dan coklat',
      'Font tradisional',
      'Background songket',
      'Animasi reveal tradisional',
    ],
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    category: 'modern',
    price: 150000,
    colors: ['#0EA5E9', '#7DD3FC', '#F0F9FF'],
    isNew: true,
    description: 'Tema modern dengan nuansa biru laut yang menenangkan dan elegan, cocok untuk beach wedding atau pasangan yang menyukai warna biru.',
    features: [
      'Animasi gelombang laut',
      'Ornamen nautical',
      'Font serif elegan',
      'Background wave pattern',
      'Countdown timer animasi',
      'Gallery dengan lightbox',
    ],
  },
  'golden-luxury': {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    category: 'luxury',
    price: 250000,
    colors: ['#D4AF37', '#F5E6A3', '#FFFBF5'],
    isNew: true,
    description: 'Tema mewah dengan sentuhan emas yang glamor dan berkelas, sempurna untuk pernikahan dengan kesan premium.',
    features: [
      'Animasi pembukaan mewah',
      'Ornamen emas detail',
      'Font klasik premium',
      'Background marble texture',
      '3D carousel gallery',
      'Efek glitter/sparkle',
    ],
  },
}

const DEVICE_SIZES = {
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1280, height: 800, icon: Monitor, label: 'Desktop' },
}

const INCLUDED_FEATURES = [
  { icon: Palette, label: 'Kustomisasi Warna' },
  { icon: Music, label: 'Background Music' },
  { icon: MapPin, label: 'Integrasi Maps' },
  { icon: Gift, label: 'Amplop Digital' },
  { icon: Calendar, label: 'RSVP Online' },
  { icon: Users, label: 'Manajemen Tamu' },
]

export default function ThemePreview() {
  const { themeId } = useParams()
  const [device, setDevice] = useState('mobile')
  const [isScrolled, setIsScrolled] = useState(false)

  const theme = THEMES[themeId]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-800 mb-2">Tema Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Tema yang Anda cari tidak tersedia</p>
          <Link
            to="/katalog"
            className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsAppOrder = () => {
    const phone = '6281234567890'
    const message = encodeURIComponent(
      `Halo Sakeenah! Saya ingin memesan undangan dengan tema "${theme.name}". Mohon info lebih lanjut.`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const deviceConfig = DEVICE_SIZES[device]

  return (
    <div className="min-h-screen bg-gray-100">
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
                to="/katalog"
                className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Katalog</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <Link to="/" className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span className="text-xl font-serif font-semibold text-gray-800">Sakeenah</span>
              </Link>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Pesan Tema Ini</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Preview Area */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Device Selector */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {Object.entries(DEVICE_SIZES).map(([key, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    device === key
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </button>
              )
            })}
          </div>

          {/* Preview Frame */}
          <div className="flex items-center justify-center">
            <motion.div
              key={device}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{
                width: device === 'desktop' ? '100%' : deviceConfig.width,
                maxWidth: deviceConfig.width,
                height: device === 'desktop' ? 'calc(100vh - 200px)' : deviceConfig.height,
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              {/* Device Frame (Mobile) */}
              {device === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
              )}

              {/* Preview Content - Demo Invitation */}
              <div className="w-full h-full">
                <DemoInvitation theme={theme} guestName="Budi & Keluarga" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-6 overflow-y-auto">
          {/* Theme Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {theme.isBestSeller && (
                <span className="px-2 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full">
                  Best Seller
                </span>
              )}
              {theme.isNew && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                  New
                </span>
              )}
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-1">{theme.name}</h1>
            <p className="text-rose-500 text-xl font-semibold">{formatPrice(theme.price)}</p>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Warna Tema</h3>
            <div className="flex gap-2">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Deskripsi</h3>
            <p className="text-gray-600 text-sm">{theme.description}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fitur Tema</h3>
            <ul className="space-y-2">
              {theme.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Included Features */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sudah Termasuk</h3>
            <div className="grid grid-cols-2 gap-2">
              {INCLUDED_FEATURES.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600"
                  >
                    <Icon className="w-4 h-4 text-rose-500" />
                    <span>{feature.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Pesan Tema Ini
            </button>
            <Link
              to="/katalog"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Lihat Tema Lain
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-rose-50 rounded-xl">
            <p className="text-sm text-rose-700">
              <strong>Butuh bantuan?</strong> Tim kami siap membantu Anda memilih tema yang tepat.
              Hubungi kami via WhatsApp untuk konsultasi gratis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
