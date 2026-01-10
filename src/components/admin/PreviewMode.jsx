import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Users,
} from 'lucide-react'
import { generateInvitationLink } from '@/lib/share'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://sakeenah.id'

const DEVICE_SIZES = {
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1280, height: 800, icon: Monitor, label: 'Desktop' },
}

/**
 * Preview Mode Modal
 */
export function PreviewModal({
  isOpen,
  onClose,
  invitation,
  guests = [],
}) {
  const [device, setDevice] = useState('mobile')
  const [selectedGuest, setSelectedGuest] = useState(null)

  const previewUrl = generateInvitationLink(
    window.location.origin,
    invitation.uid,
    selectedGuest
  )

  const deviceConfig = DEVICE_SIZES[device]

  const handleOpenInNewTab = () => {
    window.open(previewUrl, '_blank')
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
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 bg-gray-900 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-medium">Preview Undangan</h3>

                {/* Device Selector */}
                <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
                  {Object.entries(DEVICE_SIZES).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <button
                        key={key}
                        onClick={() => setDevice(key)}
                        className={`p-2 rounded-md transition-colors ${
                          device === key
                            ? 'bg-rose-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        title={config.label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  })}
                </div>

                {/* Guest Selector */}
                {guests.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedGuest?.id || ''}
                      onChange={(e) => {
                        const guest = guests.find(
                          (g) => g.id === parseInt(e.target.value)
                        )
                        setSelectedGuest(guest || null)
                      }}
                      className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="">Tanpa Nama Tamu</option>
                      {guests.slice(0, 20).map((guest) => (
                        <option key={guest.id} value={guest.id}>
                          {guest.name}
                        </option>
                      ))}
                      {guests.length > 20 && (
                        <option disabled>
                          ... dan {guests.length - 20} lainnya
                        </option>
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Buka di Tab Baru</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-900">
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: device === 'desktop' ? '100%' : deviceConfig.width,
                  maxWidth: deviceConfig.width,
                  height: device === 'desktop' ? '100%' : deviceConfig.height,
                  maxHeight: '100%',
                }}
              >
                {/* Device Frame (Mobile) */}
                {device === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-10" />
                )}

                {/* iFrame */}
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Preview Undangan"
                />
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center truncate">
                {previewUrl}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Preview Button
 */
export function PreviewButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors ${className}`}
    >
      <Eye className="w-4 h-4" />
      <span>Preview</span>
    </button>
  )
}

/**
 * Inline Preview (smaller, embedded version)
 */
export function InlinePreview({ invitation, device = 'mobile', className = '' }) {
  const previewUrl = generateInvitationLink(
    window.location.origin,
    invitation.uid
  )
  const deviceConfig = DEVICE_SIZES[device]

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      style={{
        width: deviceConfig.width * 0.5,
        height: deviceConfig.height * 0.5,
      }}
    >
      <iframe
        src={previewUrl}
        className="w-full h-full border-0 pointer-events-none"
        style={{
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
          width: deviceConfig.width,
          height: deviceConfig.height,
        }}
        title="Preview"
      />
    </div>
  )
}

export default PreviewModal
