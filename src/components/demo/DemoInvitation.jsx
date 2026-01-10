import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Gift,
  MessageCircle,
  ChevronDown,
  Navigation,
  Copy,
  Check,
  Send,
  User,
  Image,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react'

// Dummy data for demo
const DEMO_DATA = {
  groomName: 'Ahmad',
  brideName: 'Fatimah',
  groomFullName: 'Ahmad Fauzi, S.T.',
  brideFullName: 'Fatimah Azzahra, S.Pd.',
  groomParents: 'Bpk. Hasan & Ibu Aminah',
  brideParents: 'Bpk. Abdullah & Ibu Khadijah',
  date: '2025-03-15',
  time: '08:00 - 11:00 WIB',
  akadTime: '08:00 WIB',
  receptionTime: '11:00 - 14:00 WIB',
  venue: 'Masjid Al-Ikhlas',
  address: 'Jl. Mawar No. 123, Kelurahan Sukamaju, Kota Bandung',
  loveStory: [
    { year: '2020', title: 'Pertama Bertemu', description: 'Kami bertemu di acara kajian kampus' },
    { year: '2021', title: 'Mulai Dekat', description: 'Sering mengobrol dan sharing tentang kehidupan' },
    { year: '2023', title: 'Khitbah', description: 'Ahmad melamar Fatimah di hadapan keluarga' },
    { year: '2025', title: 'Akad Nikah', description: 'Hari bahagia yang dinanti' },
  ],
  gallery: [
    { id: 1, placeholder: 'Foto Prewed 1' },
    { id: 2, placeholder: 'Foto Prewed 2' },
    { id: 3, placeholder: 'Foto Prewed 3' },
    { id: 4, placeholder: 'Foto Prewed 4' },
    { id: 5, placeholder: 'Foto Prewed 5' },
    { id: 6, placeholder: 'Foto Prewed 6' },
  ],
  wishes: [
    { name: 'Budi Santoso', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga sakinah mawaddah warahmah.', attendance: 'ATTENDING' },
    { name: 'Siti Rahayu', message: 'Barakallahu lakuma wa baraka alaikuma. Semoga langgeng sampai Jannah!', attendance: 'ATTENDING' },
    { name: 'Pak Haji Ahmad', message: 'Semoga Allah memberikan keberkahan dalam rumah tangga kalian.', attendance: 'MAYBE' },
  ],
  banks: [
    { bank: 'Bank BCA', accountNumber: '1234567890', accountName: 'Ahmad Fauzi' },
    { bank: 'Bank Mandiri', accountNumber: '0987654321', accountName: 'Fatimah Azzahra' },
  ],
}

// Countdown calculation
function calculateCountdown(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export default function DemoInvitation({ theme, guestName = 'Budi & Keluarga' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [countdown, setCountdown] = useState(calculateCountdown(DEMO_DATA.date))
  const [copiedBank, setCopiedBank] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [formData, setFormData] = useState({ name: '', message: '', attendance: 'ATTENDING' })
  const scrollContainerRef = useRef(null)

  // Theme colors
  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
    background: theme?.colors?.[2] || '#fdf2f8',
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(DEMO_DATA.date))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyBank = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedBank(accountNumber)
    setTimeout(() => setCopiedBank(null), 2000)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleOpenInvitation = () => {
    setIsOpen(true)
    // Scroll to top when opening
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }, 100)
  }

  // Landing Page (Before Open)
  if (!isOpen) {
    return (
      <div
        className="h-full w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm w-full"
        >
          {/* Ornament Top */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }} />
            <Heart className="w-5 h-5" style={{ color: colors.primary }} fill={colors.primary} />
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }} />
          </div>

          {/* Date */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              {formatDate(DEMO_DATA.date)}
            </span>
          </div>

          {/* Guest Name */}
          {guestName && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Kepada Yth.</p>
              <p className="text-lg font-medium text-gray-700">{guestName}</p>
            </div>
          )}

          {/* Couple Names */}
          <h1 className="text-4xl font-serif mb-2" style={{ color: colors.primary }}>
            {DEMO_DATA.groomName}
          </h1>
          <p className="text-2xl font-serif mb-2" style={{ color: colors.secondary }}>
            &
          </p>
          <h1 className="text-4xl font-serif mb-6" style={{ color: colors.primary }}>
            {DEMO_DATA.brideName}
          </h1>

          {/* Ornament Bottom */}
          <div className="h-px w-24 mx-auto mb-8" style={{ backgroundColor: colors.secondary }} />

          {/* Open Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenInvitation}
            className="w-full py-3 px-8 rounded-full font-medium text-white shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <span className="flex items-center justify-center gap-2">
              Buka Undangan
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Main Invitation Content
  return (
    <div
      ref={scrollContainerRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Music Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ backgroundColor: colors.primary }}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Hero Section with Prewed Photo */}
      <section className="min-h-[100vh] relative flex flex-col items-center justify-center p-6 text-center">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${colors.secondary} 0%, transparent 50%),
                         radial-gradient(circle at 70% 80%, ${colors.primary} 0%, transparent 50%)`,
          }}
        />

        {/* Prewed Photo Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mb-8"
        >
          <div
            className="w-48 h-48 rounded-full mx-auto flex items-center justify-center border-4 shadow-xl"
            style={{
              backgroundColor: `${colors.primary}10`,
              borderColor: colors.primary
            }}
          >
            <div className="text-center">
              <Image className="w-12 h-12 mx-auto mb-2" style={{ color: colors.primary }} />
              <p className="text-xs" style={{ color: colors.primary }}>Foto Prewed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: colors.secondary }}>
            The Wedding Of
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif mb-2" style={{ color: colors.primary }}>
            {DEMO_DATA.groomName}
          </h1>
          <p className="text-2xl font-serif mb-2" style={{ color: colors.secondary }}>
            &
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif mb-6" style={{ color: colors.primary }}>
            {DEMO_DATA.brideName}
          </h1>

          <div className="h-px w-32 mx-auto mb-4" style={{ backgroundColor: colors.secondary }} />

          <p className="text-base font-medium text-gray-700">{formatDate(DEMO_DATA.date)}</p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8"
        >
          <ChevronDown className="w-6 h-6" style={{ color: colors.primary }} />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${colors.primary}08` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-serif mb-8" style={{ color: colors.primary }}>
            Menuju Hari Bahagia
          </h2>

          <div className="flex justify-center gap-3 sm:gap-4">
            {[
              { value: countdown.days, label: 'Hari' },
              { value: countdown.hours, label: 'Jam' },
              { value: countdown.minutes, label: 'Menit' },
              { value: countdown.seconds, label: 'Detik' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-xl sm:text-2xl font-bold text-white mb-2 shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  {String(item.value).padStart(2, '0')}
                </div>
                <p className="text-xs text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Couple Section with Photos */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-serif mb-10" style={{ color: colors.primary }}>
            Mempelai
          </h2>

          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div
              className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center border-4 shadow-lg"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderColor: colors.secondary
              }}
            >
              <User className="w-16 h-16" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-1" style={{ color: colors.primary }}>
              {DEMO_DATA.groomFullName}
            </h3>
            <p className="text-sm text-gray-600">Putra dari</p>
            <p className="text-sm text-gray-700 font-medium">{DEMO_DATA.groomParents}</p>
          </motion.div>

          <Heart className="w-8 h-8 mx-auto mb-10" style={{ color: colors.secondary }} fill={colors.secondary} />

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center border-4 shadow-lg"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderColor: colors.secondary
              }}
            >
              <User className="w-16 h-16" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-1" style={{ color: colors.primary }}>
              {DEMO_DATA.brideFullName}
            </h3>
            <p className="text-sm text-gray-600">Putri dari</p>
            <p className="text-sm text-gray-700 font-medium">{DEMO_DATA.brideParents}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Love Story Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${colors.primary}08` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <BookOpen className="w-8 h-8 mx-auto mb-4" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-serif" style={{ color: colors.primary }}>
              Kisah Cinta Kami
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: colors.secondary }}
            />

            {/* Timeline Items */}
            {DEMO_DATA.loveStory.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 pb-8 last:pb-0"
              >
                {/* Dot */}
                <div
                  className="absolute left-2 w-5 h-5 rounded-full border-4 bg-white"
                  style={{ borderColor: colors.primary }}
                />

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                  >
                    {story.year}
                  </span>
                  <h4 className="font-semibold text-gray-800 mt-2">{story.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{story.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <Image className="w-8 h-8 mx-auto mb-4" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-serif" style={{ color: colors.primary }}>
              Galeri Foto
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DEMO_DATA.gallery.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`aspect-square rounded-xl overflow-hidden shadow-sm ${
                  i === 0 ? 'col-span-2 aspect-video' : ''
                }`}
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-1" style={{ color: colors.primary }} />
                    <p className="text-xs" style={{ color: colors.primary }}>{photo.placeholder}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Event Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${colors.primary}08` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-md mx-auto"
        >
          <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: colors.primary }} />
          <h2 className="text-2xl font-serif mb-10" style={{ color: colors.primary }}>
            Waktu & Tempat
          </h2>

          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-4"
          >
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Akad Nikah</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{formatDate(DEMO_DATA.date)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{DEMO_DATA.akadTime}</span>
              </div>
            </div>
          </motion.div>

          {/* Reception */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-4"
          >
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Resepsi</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{formatDate(DEMO_DATA.date)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{DEMO_DATA.receptionTime}</span>
              </div>
            </div>
          </motion.div>

          {/* Venue with Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Map Placeholder */}
            <div
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-1" style={{ color: colors.primary }} />
                <p className="text-xs" style={{ color: colors.primary }}>Google Maps</p>
              </div>
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-1">{DEMO_DATA.venue}</h4>
              <p className="text-sm text-gray-600 mb-4">{DEMO_DATA.address}</p>
              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white shadow-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Navigation className="w-4 h-4" />
                Buka Google Maps
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Gift Section */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-md mx-auto"
        >
          <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: colors.primary }} />
          <h2 className="text-2xl font-serif mb-2" style={{ color: colors.primary }}>
            Amplop Digital
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika berkenan, Anda dapat memberikan hadiah melalui:
          </p>

          <div className="space-y-4">
            {DEMO_DATA.banks.map((bank, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-800 mb-2">{bank.bank}</p>
                <p className="text-2xl font-mono font-bold mb-1" style={{ color: colors.primary }}>
                  {bank.accountNumber}
                </p>
                <p className="text-sm text-gray-600 mb-4">a.n. {bank.accountName}</p>
                <button
                  onClick={() => handleCopyBank(bank.accountNumber)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                  style={{
                    borderColor: colors.primary,
                    color: copiedBank === bank.accountNumber ? 'white' : colors.primary,
                    backgroundColor: copiedBank === bank.accountNumber ? colors.primary : 'transparent'
                  }}
                >
                  {copiedBank === bank.accountNumber ? (
                    <>
                      <Check className="w-4 h-4" />
                      Nomor Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Salin Nomor Rekening
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RSVP & Wishes Section */}
      <section className="py-16 px-6" style={{ backgroundColor: `${colors.primary}08` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <MessageCircle className="w-8 h-8 mx-auto mb-4" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-serif" style={{ color: colors.primary }}>
              RSVP & Ucapan
            </h2>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kehadiran</label>
                <select
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent text-sm"
                >
                  <option value="ATTENDING">Hadir</option>
                  <option value="NOT_ATTENDING">Tidak Hadir</option>
                  <option value="MAYBE">Masih Ragu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ucapan & Doa</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent resize-none text-sm"
                />
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium shadow-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Send className="w-4 h-4" />
                Kirim Ucapan
              </button>
            </div>
          </div>

          {/* Wishes List */}
          <h3 className="font-medium text-gray-800 mb-4">Ucapan ({DEMO_DATA.wishes.length})</h3>
          <div className="space-y-4">
            {DEMO_DATA.wishes.map((wish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <span className="text-sm font-bold" style={{ color: colors.primary }}>
                      {wish.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-gray-800 text-sm">{wish.name}</h4>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor:
                            wish.attendance === 'ATTENDING'
                              ? '#dcfce7'
                              : wish.attendance === 'NOT_ATTENDING'
                              ? '#fee2e2'
                              : '#fef3c7',
                          color:
                            wish.attendance === 'ATTENDING'
                              ? '#166534'
                              : wish.attendance === 'NOT_ATTENDING'
                              ? '#991b1b'
                              : '#92400e',
                        }}
                      >
                        {wish.attendance === 'ATTENDING'
                          ? 'Hadir'
                          : wish.attendance === 'NOT_ATTENDING'
                          ? 'Tidak Hadir'
                          : 'Ragu'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{wish.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="w-10 h-10 mx-auto mb-6" style={{ color: colors.primary }} fill={colors.primary} />

          <p className="text-gray-600 max-w-xs mx-auto mb-6 leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>

          <p className="text-sm text-gray-500 italic mb-4">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..."
          </p>
          <p className="text-xs text-gray-400 mb-8">- QS. Ar-Rum: 21</p>

          <div className="h-px w-24 mx-auto mb-6" style={{ backgroundColor: colors.secondary }} />

          <p className="font-serif text-2xl" style={{ color: colors.primary }}>
            {DEMO_DATA.groomName} & {DEMO_DATA.brideName}
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: `${colors.primary}15` }}>
        <p className="text-xs text-gray-400">
          Made with <Heart className="w-3 h-3 inline mx-1" style={{ color: colors.primary }} fill={colors.primary} /> by Sakeenah
        </p>
      </footer>
    </div>
  )
}
