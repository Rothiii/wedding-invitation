import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Video,
  Play,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Radio,
  Wifi,
  WifiOff,
} from 'lucide-react'

/**
 * LiveStreaming Component
 * Displays live streaming embed with countdown to event
 *
 * @param {Object} props
 * @param {string} props.streamUrl - YouTube, Zoom, or other streaming URL
 * @param {string} props.streamType - Type of stream: 'youtube' | 'zoom' | 'custom'
 * @param {string} props.eventDate - Event date/time for countdown
 * @param {Object} props.theme - Theme colors object
 */
export default function LiveStreaming({
  streamUrl = '',
  streamType = 'youtube',
  eventDate,
  theme = {},
  title = 'Saksikan Live',
  subtitle = 'Tidak bisa hadir? Saksikan momen bahagia kami secara online',
  showCountdown = true,
  autoEmbed = true,
}) {
  const [isLive, setIsLive] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [showEmbed, setShowEmbed] = useState(false)

  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
    background: theme?.colors?.[2] || '#fdf2f8',
  }

  // Parse stream URL to get embed URL
  const embedUrl = useMemo(() => {
    if (!streamUrl) return null

    // YouTube
    if (streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be')) {
      let videoId = ''
      if (streamUrl.includes('youtu.be')) {
        videoId = streamUrl.split('youtu.be/')[1]?.split('?')[0]
      } else if (streamUrl.includes('watch?v=')) {
        videoId = streamUrl.split('watch?v=')[1]?.split('&')[0]
      } else if (streamUrl.includes('/live/')) {
        videoId = streamUrl.split('/live/')[1]?.split('?')[0]
      } else if (streamUrl.includes('/embed/')) {
        videoId = streamUrl.split('/embed/')[1]?.split('?')[0]
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null
    }

    // Zoom (display link button instead of embed)
    if (streamUrl.includes('zoom.us')) {
      return null // Zoom doesn't support embedding
    }

    // Custom embed URL
    return streamUrl
  }, [streamUrl])

  // Countdown calculation
  useEffect(() => {
    if (!eventDate || !showCountdown) return

    const calculateCountdown = () => {
      const now = new Date()
      const target = new Date(eventDate)
      const diff = target - now

      if (diff <= 0) {
        setIsLive(true)
        setCountdown(null)
        return
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [eventDate, showCountdown])

  const handleWatchClick = () => {
    if (embedUrl && autoEmbed) {
      setShowEmbed(true)
    } else if (streamUrl) {
      window.open(streamUrl, '_blank')
    }
  }

  const formatEventDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <section
      className="py-16 px-4 sm:px-6"
      style={{ backgroundColor: `${colors.primary}08` }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Video className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif mb-3" style={{ color: colors.primary }}>
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Live Status Badge */}
        {isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-medium">LIVE NOW</span>
            </div>
          </motion.div>
        )}

        {/* Countdown */}
        {showCountdown && countdown && !isLive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-center text-gray-600 mb-4 text-sm">
              Live streaming dimulai dalam:
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-xl sm:text-2xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.div>
                  <p className="text-xs text-gray-500 mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stream Embed or Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {showEmbed && embedUrl ? (
            // Embedded Video
            <div className="relative aspect-video">
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Live Stream"
              />
            </div>
          ) : (
            // Preview Card
            <div
              className="aspect-video flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(${colors.secondary} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative z-10 text-center p-6">
                {isLive ? (
                  <>
                    <div className="mb-4">
                      <Radio className="w-16 h-16 mx-auto animate-pulse" style={{ color: colors.primary }} />
                    </div>
                    <p className="text-lg font-medium mb-2" style={{ color: colors.primary }}>
                      Siaran Langsung Tersedia
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Klik tombol di bawah untuk menonton
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <Video className="w-16 h-16 mx-auto" style={{ color: colors.secondary }} />
                    </div>
                    <p className="text-gray-600 mb-2">
                      {eventDate ? 'Live streaming akan dimulai pada:' : 'Siaran langsung belum tersedia'}
                    </p>
                    {eventDate && (
                      <p className="font-medium" style={{ color: colors.primary }}>
                        {formatEventDate(eventDate)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-5">
            {/* Event Info */}
            {eventDate && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>
                    {new Date(eventDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>
                    {new Date(eventDate).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Watch Button */}
            {streamUrl && (
              <button
                onClick={handleWatchClick}
                disabled={!isLive && !embedUrl}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all ${
                  isLive
                    ? 'text-white shadow-lg'
                    : embedUrl
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: isLive || embedUrl ? colors.primary : undefined,
                }}
              >
                {isLive ? (
                  <>
                    <Play className="w-5 h-5" />
                    Tonton Sekarang
                  </>
                ) : embedUrl ? (
                  <>
                    <Play className="w-5 h-5" />
                    Preview Video
                  </>
                ) : streamUrl.includes('zoom.us') ? (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Buka Link Zoom
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5" />
                    Belum Tersedia
                  </>
                )}
              </button>
            )}

            {/* External Link for Zoom or additional link */}
            {streamUrl && streamUrl.includes('zoom.us') && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 rounded-xl font-medium transition-colors"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                <ExternalLink className="w-5 h-5" />
                Buka Link Zoom
              </a>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Wifi className="w-4 h-4" />
            <span>Pastikan koneksi internet stabil untuk pengalaman terbaik</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Compact version for inline use
export function LiveStreamingBadge({ streamUrl, isLive, theme }) {
  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
  }

  if (!streamUrl) return null

  return (
    <a
      href={streamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isLive
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {isLive ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE
        </>
      ) : (
        <>
          <Video className="w-4 h-4" />
          Live Stream
        </>
      )}
    </a>
  )
}
