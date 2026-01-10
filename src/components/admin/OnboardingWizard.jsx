import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Heart,
  Calendar,
  MapPin,
  Palette,
  Image,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react'

const THEMES = [
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    preview: '/themes/elegant-rose/preview.jpg',
    colors: ['#be185d', '#f472b6', '#fdf2f8'],
  },
  {
    id: 'rustic-garden',
    name: 'Rustic Garden',
    preview: '/themes/rustic-garden/preview.jpg',
    colors: ['#166534', '#86efac', '#f0fdf4'],
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    preview: '/themes/minimalist-white/preview.jpg',
    colors: ['#1f2937', '#9ca3af', '#ffffff'],
  },
  {
    id: 'javanese-classic',
    name: 'Javanese Classic',
    preview: '/themes/javanese-classic/preview.jpg',
    colors: ['#92400e', '#fbbf24', '#fef3c7'],
  },
]

const STEPS = [
  { id: 'couple', title: 'Data Pengantin', icon: Heart },
  { id: 'event', title: 'Acara', icon: Calendar },
  { id: 'venue', title: 'Lokasi', icon: MapPin },
  { id: 'theme', title: 'Tema', icon: Palette },
  { id: 'media', title: 'Media', icon: Image },
]

/**
 * Onboarding Wizard Modal
 */
export function OnboardingWizard({ isOpen, onClose, onComplete, isLoading = false }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Couple data
    groomName: '',
    groomFullName: '',
    groomFatherName: '',
    groomMotherName: '',
    brideName: '',
    brideFullName: '',
    brideFatherName: '',
    brideMotherName: '',
    // Event data
    akadDate: '',
    akadTime: '',
    receptionDate: '',
    receptionTime: '',
    // Venue data
    akadVenue: '',
    akadAddress: '',
    akadMapsUrl: '',
    receptionVenue: '',
    receptionAddress: '',
    receptionMapsUrl: '',
    // Theme
    theme: 'elegant-rose',
    // Media
    heroImage: '',
    galleryImages: [],
    musicUrl: '',
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    onComplete(formData)
  }

  const handleClose = () => {
    setCurrentStep(0)
    setFormData({
      groomName: '',
      groomFullName: '',
      groomFatherName: '',
      groomMotherName: '',
      brideName: '',
      brideFullName: '',
      brideFatherName: '',
      brideMotherName: '',
      akadDate: '',
      akadTime: '',
      receptionDate: '',
      receptionTime: '',
      akadVenue: '',
      akadAddress: '',
      akadMapsUrl: '',
      receptionVenue: '',
      receptionAddress: '',
      receptionMapsUrl: '',
      theme: 'elegant-rose',
      heroImage: '',
      galleryImages: [],
      musicUrl: '',
    })
    onClose()
  }

  const isStepValid = () => {
    switch (STEPS[currentStep].id) {
      case 'couple':
        return formData.groomName && formData.brideName
      case 'event':
        return formData.akadDate && formData.akadTime
      case 'venue':
        return formData.akadVenue && formData.akadAddress
      case 'theme':
        return formData.theme
      case 'media':
        return true // Optional step
      default:
        return true
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Buat Undangan Baru
                  </h2>
                  <p className="text-sm text-gray-500">
                    Lengkapi data untuk membuat undangan digital Anda
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => index < currentStep && setCurrentStep(index)}
                        disabled={index > currentStep}
                        className={`flex flex-col items-center gap-1 transition-colors ${
                          index <= currentStep
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-rose-500 text-white'
                              : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium hidden sm:block ${
                            isActive ? 'text-rose-600' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                      </button>
                      {index < STEPS.length - 1 && (
                        <div
                          className={`w-8 md:w-16 h-0.5 mx-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 0 && (
                      <CoupleStep
                        formData={formData}
                        updateFormData={updateFormData}
                      />
                    )}
                    {currentStep === 1 && (
                      <EventStep
                        formData={formData}
                        updateFormData={updateFormData}
                      />
                    )}
                    {currentStep === 2 && (
                      <VenueStep
                        formData={formData}
                        updateFormData={updateFormData}
                      />
                    )}
                    {currentStep === 3 && (
                      <ThemeStep
                        formData={formData}
                        updateFormData={updateFormData}
                      />
                    )}
                    {currentStep === 4 && (
                      <MediaStep
                        formData={formData}
                        updateFormData={updateFormData}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-sm text-gray-500">
                Langkah {currentStep + 1} dari {STEPS.length}
              </div>

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Buat Undangan</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Step 1: Couple Data
 */
function CoupleStep({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      {/* Groom Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <User className="w-5 h-5 text-blue-500" />
          <span>Data Mempelai Pria</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.groomName}
              onChange={(e) => updateFormData('groomName', e.target.value)}
              placeholder="Contoh: Ahmad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.groomFullName}
              onChange={(e) => updateFormData('groomFullName', e.target.value)}
              placeholder="Contoh: Ahmad Fauzi, S.T."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Ayah
            </label>
            <input
              type="text"
              value={formData.groomFatherName}
              onChange={(e) => updateFormData('groomFatherName', e.target.value)}
              placeholder="Contoh: Bpk. Hasan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Ibu
            </label>
            <input
              type="text"
              value={formData.groomMotherName}
              onChange={(e) => updateFormData('groomMotherName', e.target.value)}
              placeholder="Contoh: Ibu Fatimah"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bride Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <User className="w-5 h-5 text-pink-500" />
          <span>Data Mempelai Wanita</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brideName}
              onChange={(e) => updateFormData('brideName', e.target.value)}
              placeholder="Contoh: Siti"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.brideFullName}
              onChange={(e) => updateFormData('brideFullName', e.target.value)}
              placeholder="Contoh: Siti Nurhaliza, S.Pd."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Ayah
            </label>
            <input
              type="text"
              value={formData.brideFatherName}
              onChange={(e) => updateFormData('brideFatherName', e.target.value)}
              placeholder="Contoh: Bpk. Abdullah"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Ibu
            </label>
            <input
              type="text"
              value={formData.brideMotherName}
              onChange={(e) => updateFormData('brideMotherName', e.target.value)}
              placeholder="Contoh: Ibu Aminah"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Step 2: Event Data
 */
function EventStep({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      {/* Akad Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <Calendar className="w-5 h-5 text-rose-500" />
          <span>Akad Nikah</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.akadDate}
              onChange={(e) => updateFormData('akadDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              value={formData.akadTime}
              onChange={(e) => updateFormData('akadTime', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Reception Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <Calendar className="w-5 h-5 text-amber-500" />
          <span>Resepsi (Opsional)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={formData.receptionDate}
              onChange={(e) => updateFormData('receptionDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu
            </label>
            <input
              type="time"
              value={formData.receptionTime}
              onChange={(e) => updateFormData('receptionTime', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Step 3: Venue Data
 */
function VenueStep({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      {/* Akad Venue */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <MapPin className="w-5 h-5 text-rose-500" />
          <span>Lokasi Akad Nikah</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Tempat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.akadVenue}
              onChange={(e) => updateFormData('akadVenue', e.target.value)}
              placeholder="Contoh: Masjid Al-Ikhlas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.akadAddress}
              onChange={(e) => updateFormData('akadAddress', e.target.value)}
              placeholder="Contoh: Jl. Mawar No. 123, Kelurahan Sukamaju, Kota Bandung"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Google Maps
            </label>
            <input
              type="url"
              value={formData.akadMapsUrl}
              onChange={(e) => updateFormData('akadMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Reception Venue */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <MapPin className="w-5 h-5 text-amber-500" />
          <span>Lokasi Resepsi (Opsional)</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Tempat
            </label>
            <input
              type="text"
              value={formData.receptionVenue}
              onChange={(e) => updateFormData('receptionVenue', e.target.value)}
              placeholder="Contoh: Gedung Serbaguna Merdeka"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              value={formData.receptionAddress}
              onChange={(e) => updateFormData('receptionAddress', e.target.value)}
              placeholder="Contoh: Jl. Raya Utama No. 456, Kelurahan Jayamukti, Kota Bandung"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Google Maps
            </label>
            <input
              type="url"
              value={formData.receptionMapsUrl}
              onChange={(e) => updateFormData('receptionMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Step 4: Theme Selection
 */
function ThemeStep({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800">Pilih Tema Undangan</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tema menentukan tampilan dan nuansa undangan digital Anda
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => updateFormData('theme', theme.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              formData.theme === theme.id
                ? 'border-rose-500 bg-rose-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Theme Preview */}
            <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors[2]} 0%, ${theme.colors[1]} 50%, ${theme.colors[0]} 100%)`,
                }}
              />
            </div>

            {/* Theme Name */}
            <p className="font-medium text-gray-800">{theme.name}</p>

            {/* Color Preview */}
            <div className="flex gap-1 mt-2 justify-center">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Selected Indicator */}
            {formData.theme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Step 5: Media Upload
 */
function MediaStep({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <Image className="w-5 h-5 text-rose-500" />
          <span>Foto Utama</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Foto Hero
          </label>
          <input
            type="url"
            value={formData.heroImage}
            onChange={(e) => updateFormData('heroImage', e.target.value)}
            placeholder="https://example.com/foto-prewedding.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Gunakan foto prewedding atau foto favorit pengantin
          </p>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <Image className="w-5 h-5 text-amber-500" />
          <span>Galeri Foto (Opsional)</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Foto Galeri (pisahkan dengan enter)
          </label>
          <textarea
            value={formData.galleryImages.join('\n')}
            onChange={(e) =>
              updateFormData(
                'galleryImages',
                e.target.value.split('\n').filter((url) => url.trim())
              )
            }
            placeholder="https://example.com/foto-1.jpg&#10;https://example.com/foto-2.jpg&#10;https://example.com/foto-3.jpg"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Background Music */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <span className="text-xl">🎵</span>
          <span>Musik Latar (Opsional)</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL File Musik (MP3)
          </label>
          <input
            type="url"
            value={formData.musicUrl}
            onChange={(e) => updateFormData('musicUrl', e.target.value)}
            placeholder="https://example.com/background-music.mp3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Pastikan Anda memiliki hak untuk menggunakan musik tersebut
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-start gap-2">
          <Check className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm text-green-700 font-medium">
              Hampir selesai!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Klik &quot;Buat Undangan&quot; untuk menyimpan dan membuat undangan
              digital Anda. Anda dapat mengubah semua data ini nanti.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard
