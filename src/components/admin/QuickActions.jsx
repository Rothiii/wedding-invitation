import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, QrCode, Share2, Check, Download, X, MessageCircle } from 'lucide-react'
import {
  copyToClipboard,
  generateQRCode,
  downloadQRCode,
  generateInvitationLink,
  shareToWhatsApp,
  shareViaWebShare,
  generateWhatsAppMessage,
} from '@/lib/share'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://sakeenah.id'

/**
 * Quick Actions component for invitation management
 */
export function QuickActions({ invitation, guest = null, className = '' }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const link = generateInvitationLink(BASE_URL, invitation.uid, guest)

  const handleCopy = async () => {
    const success = await copyToClipboard(link)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: invitation.title || `Undangan ${invitation.groomName} & ${invitation.brideName}`,
      text: `Anda diundang ke pernikahan ${invitation.groomName} & ${invitation.brideName}`,
      url: link,
    }

    const shared = await shareViaWebShare(shareData)
    if (!shared) {
      // Fallback to WhatsApp
      shareToWhatsApp(invitation, link, guest?.name)
    }
  }

  const handleWhatsApp = () => {
    shareToWhatsApp(invitation, link, guest?.name, guest?.phone)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="Copy Link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* QR Code */}
      <button
        onClick={() => setShowQR(true)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="QR Code"
      >
        <QrCode className="w-4 h-4" />
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* WhatsApp (if guest has phone) */}
      {guest?.phone && (
        <button
          onClick={handleWhatsApp}
          className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors"
          title="Kirim ke WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        url={link}
        title={guest?.name || invitation.title || `${invitation.groomName} & ${invitation.brideName}`}
      />
    </div>
  )
}

/**
 * QR Code Modal component
 */
export function QRCodeModal({ isOpen, onClose, url, title }) {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode(url, { width: 300 }).then(setQrDataUrl)
    }
  }, [isOpen, url])

  const handleDownload = () => {
    const filename = `qr-${title.toLowerCase().replace(/\s+/g, '-')}`
    downloadQRCode(url, filename)
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-full max-w-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-64 h-64 border border-gray-200 rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg animate-pulse" />
              )}

              <p className="mt-3 text-sm text-gray-600 text-center font-medium">
                {title}
              </p>

              <p className="mt-1 text-xs text-gray-400 text-center break-all px-4">
                {url}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Copy Link Button (standalone)
 */
export function CopyLinkButton({ link, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(link)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
        copied
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Salin Link</span>
        </>
      )}
    </button>
  )
}

export default QuickActions
