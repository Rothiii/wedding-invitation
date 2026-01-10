import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Sparkles,
  Users,
  Clock,
  Star,
  Check,
  ChevronRight,
  MessageCircle,
  Instagram,
  Mail,
  Phone,
  ArrowRight,
  Palette,
  Music,
  MapPin,
  Gift,
  Calendar,
  Send,
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

// Theme previews data
const FEATURED_THEMES = [
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    category: 'Elegant',
    preview: '/themes/elegant-rose/preview.jpg',
    colors: ['#be185d', '#f472b6', '#fdf2f8'],
    isBestSeller: true,
  },
  {
    id: 'rustic-garden',
    name: 'Rustic Garden',
    category: 'Nature',
    preview: '/themes/rustic-garden/preview.jpg',
    colors: ['#166534', '#86efac', '#f0fdf4'],
    isNew: true,
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    category: 'Modern',
    preview: '/themes/minimalist-white/preview.jpg',
    colors: ['#1f2937', '#9ca3af', '#ffffff'],
  },
  {
    id: 'javanese-classic',
    name: 'Javanese Classic',
    category: 'Traditional',
    preview: '/themes/javanese-classic/preview.jpg',
    colors: ['#92400e', '#fbbf24', '#fef3c7'],
  },
]

// Features data
const FEATURES = [
  {
    icon: Palette,
    title: 'Tema Premium',
    description: 'Pilihan tema elegan yang bisa dikustomisasi sesuai selera',
  },
  {
    icon: Users,
    title: 'Manajemen Tamu',
    description: 'Kelola daftar tamu dengan mudah, import dari Excel',
  },
  {
    icon: Music,
    title: 'Background Music',
    description: 'Tambahkan musik romantis untuk undangan Anda',
  },
  {
    icon: MapPin,
    title: 'Integrasi Maps',
    description: 'Lokasi acara dengan Google Maps terintegrasi',
  },
  {
    icon: Gift,
    title: 'Amplop Digital',
    description: 'Terima hadiah secara digital dengan mudah',
  },
  {
    icon: Calendar,
    title: 'RSVP & Ucapan',
    description: 'Tamu bisa konfirmasi kehadiran dan kirim ucapan',
  },
]

// Pricing packages
const PACKAGES = [
  {
    name: 'Basic',
    price: 99000,
    features: [
      '5 Pilihan Tema',
      '100 Tamu',
      'RSVP & Ucapan',
      'Background Music',
      'Masa Aktif 30 Hari',
      '1x Revisi',
    ],
    notIncluded: ['Amplop Digital', 'Galeri Foto', 'Custom Domain'],
  },
  {
    name: 'Premium',
    price: 199000,
    isBestSeller: true,
    features: [
      '15 Pilihan Tema',
      '500 Tamu',
      'RSVP & Ucapan',
      'Background Music',
      'Amplop Digital',
      '10 Foto Galeri',
      'Love Story',
      'Masa Aktif 90 Hari',
      '3x Revisi',
    ],
    notIncluded: ['Custom Domain'],
  },
  {
    name: 'Exclusive',
    price: 399000,
    features: [
      'Semua Tema',
      'Unlimited Tamu',
      'RSVP & Ucapan',
      'Background Music Custom',
      'Amplop Digital',
      '50 Foto Galeri',
      'Love Story',
      'Custom Domain',
      'Masa Aktif Selamanya',
      'Unlimited Revisi',
      'Priority Support',
    ],
    notIncluded: [],
  },
]

// Testimonials
const TESTIMONIALS = [
  {
    name: 'Ahmad & Fatimah',
    message:
      'Undangannya cantik banget! Tamu-tamu pada kagum, prosesnya cepat dan admin responsif.',
    rating: 5,
    photo: '/images/testimonials/1.jpg',
  },
  {
    name: 'Budi & Siti',
    message:
      'Sangat membantu dalam menyebarkan undangan. Fitur RSVP-nya memudahkan kami menghitung tamu.',
    rating: 5,
    photo: '/images/testimonials/2.jpg',
  },
  {
    name: 'Rizki & Anisa',
    message:
      'Tema Javanese Classic-nya keren! Sesuai dengan konsep pernikahan kami yang tradisional.',
    rating: 5,
    photo: '/images/testimonials/3.jpg',
  },
]

// Trust signals / stats
const STATS = [
  { value: '500+', label: 'Pasangan Bahagia' },
  { value: '4.9/5', label: 'Rating Kepuasan' },
  { value: '<1 Jam', label: 'Response Time' },
]

export default function PublicLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsAppClick = () => {
    const phone = '6281234567890' // Ganti dengan nomor WhatsApp bisnis
    const message = encodeURIComponent(
      `Halo Sakeenah! Saya tertarik dengan undangan digital untuk pernikahan saya. Mohon info lebih lanjut.`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              <span className="text-xl font-serif font-semibold text-gray-800">
                Sakeenah
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#themes" className="text-gray-600 hover:text-rose-500 transition-colors">
                Tema
              </a>
              <a href="#features" className="text-gray-600 hover:text-rose-500 transition-colors">
                Fitur
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-rose-500 transition-colors">
                Harga
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-rose-500 transition-colors">
                Testimoni
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Hubungi Kami</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Undangan Digital Premium
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-800 mb-6"
            >
              Undangan Pernikahan Digital
              <br />
              <span className="text-rose-500">yang Elegan & Personal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            >
              Buat undangan pernikahan digital yang cantik, mudah dibagikan, dan
              berkesan untuk hari spesial Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#themes"
                className="flex items-center gap-2 px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/25"
              >
                <span>Lihat Katalog Tema</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-full hover:border-rose-300 hover:text-rose-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Gratis</span>
              </button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-rose-500">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-4">
              Pilihan Tema Premium
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tema-tema cantik yang dirancang khusus untuk momen spesial Anda
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURED_THEMES.map((theme) => (
              <motion.div
                key={theme.id}
                variants={fadeInUp}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
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
                  {theme.isBestSeller && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                      Best Seller
                    </span>
                  )}
                  {theme.isNew && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Link
                      to={`/preview/${theme.id}`}
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-800 rounded-full font-medium transition-opacity"
                    >
                      Lihat Preview
                    </Link>
                  </div>
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <p className="text-xs text-rose-500 font-medium mb-1">{theme.category}</p>
                  <h3 className="font-medium text-gray-800">{theme.name}</h3>
                  {/* Color Preview */}
                  <div className="flex gap-1 mt-2">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium"
            >
              Lihat Semua Tema
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk undangan pernikahan digital yang sempurna
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-4">
              Pilihan Paket
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {PACKAGES.map((pkg, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative p-6 bg-white rounded-2xl border-2 transition-all ${
                  pkg.isBestSeller
                    ? 'border-rose-500 shadow-xl scale-105'
                    : 'border-gray-100 hover:border-rose-200'
                }`}
              >
                {pkg.isBestSeller && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-500 text-white text-sm font-medium rounded-full">
                    Best Seller
                  </span>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-800">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {pkg.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 opacity-50">
                      <span className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">-</span>
                      <span className="text-gray-400 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleWhatsAppClick}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    pkg.isBestSeller
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Pilih Paket
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-4">
              Apa Kata Mereka
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Testimoni dari pasangan yang telah menggunakan layanan kami
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&quot;{testimonial.message}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="font-medium text-gray-800">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Siap Membuat Undangan Impian Anda?
            </h2>
            <p className="text-rose-100 text-lg mb-8">
              Konsultasikan kebutuhan undangan pernikahan Anda dengan tim kami
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-500 rounded-full font-semibold hover:bg-rose-50 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Chat via WhatsApp
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-rose-400" />
                <span className="text-xl font-serif font-semibold text-white">Sakeenah</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Platform undangan pernikahan digital premium dengan desain elegan dan fitur lengkap
                untuk hari spesial Anda.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/sakeenah_wedding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-400 hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:hello@sakeenah.id"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-400 hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Menu</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#themes" className="text-gray-400 hover:text-rose-400 transition-colors">
                    Katalog Tema
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-rose-400 transition-colors">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-rose-400 transition-colors">
                    Testimoni
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>hello@sakeenah.id</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>09:00 - 21:00 WIB</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} Sakeenah. Made with{' '}
              <Heart className="w-4 h-4 inline text-rose-400" /> in Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
