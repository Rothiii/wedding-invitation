import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Play,
  Pause,
  Grid,
  Maximize2,
} from 'lucide-react'

/**
 * PhotoGallery Component
 * Displays photos in a masonry grid with lightbox view
 *
 * @param {Object} props
 * @param {Array} props.photos - Array of photo objects with src, alt, caption
 * @param {Object} props.theme - Theme colors object
 * @param {string} props.layout - Layout type: 'masonry' | 'grid' | 'carousel'
 */
export default function PhotoGallery({
  photos = [],
  theme = {},
  layout = 'masonry',
  title = 'Galeri Foto',
  subtitle = 'Momen-momen indah perjalanan cinta kami',
  columns = 3,
  showLightbox = true,
  enableSlideshow = true,
  slideshowInterval = 4000,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSlideshow, setIsSlideshow] = useState(false)

  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
    background: theme?.colors?.[2] || '#fdf2f8',
  }

  // Default photos if none provided
  const defaultPhotos = [
    { id: 1, src: '', alt: 'Prewed 1', caption: 'Foto Prewed di Taman' },
    { id: 2, src: '', alt: 'Prewed 2', caption: 'Sunset Photography' },
    { id: 3, src: '', alt: 'Prewed 3', caption: 'Studio Session' },
    { id: 4, src: '', alt: 'Prewed 4', caption: 'Outdoor Shoot' },
    { id: 5, src: '', alt: 'Prewed 5', caption: 'Romantic Moment' },
    { id: 6, src: '', alt: 'Prewed 6', caption: 'Together Forever' },
  ]

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos

  // Slideshow effect
  useEffect(() => {
    if (!isSlideshow || !lightboxOpen) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayPhotos.length)
    }, slideshowInterval)

    return () => clearInterval(interval)
  }, [isSlideshow, lightboxOpen, displayPhotos.length, slideshowInterval])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') navigatePrev()
      if (e.key === 'ArrowRight') navigateNext()
      if (e.key === ' ') {
        e.preventDefault()
        setIsSlideshow((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  const openLightbox = useCallback((index) => {
    if (!showLightbox) return
    setActiveIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [showLightbox])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setIsSlideshow(false)
    document.body.style.overflow = ''
  }, [])

  const navigatePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length)
  }, [displayPhotos.length])

  const navigateNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % displayPhotos.length)
  }, [displayPhotos.length])

  // Masonry layout helper - distribute photos into columns
  const getMasonryColumns = () => {
    const cols = Array.from({ length: columns }, () => [])
    displayPhotos.forEach((photo, i) => {
      cols[i % columns].push({ ...photo, index: i })
    })
    return cols
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-10"
        >
          <ImageIcon
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: colors.primary }}
          />
          <h2 className="text-2xl sm:text-3xl font-serif mb-3" style={{ color: colors.primary }}>
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {layout === 'masonry' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="flex gap-3 sm:gap-4"
          >
            {getMasonryColumns().map((column, colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col gap-3 sm:gap-4">
                {column.map((photo) => (
                  <PhotoItem
                    key={photo.id || photo.index}
                    photo={photo}
                    colors={colors}
                    onClick={() => openLightbox(photo.index)}
                    variants={itemVariants}
                    aspectRatio={colIndex % 2 === 0 ? 'portrait' : 'landscape'}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        ) : layout === 'grid' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={`grid grid-cols-2 sm:grid-cols-${columns} gap-3 sm:gap-4`}
          >
            {displayPhotos.map((photo, index) => (
              <PhotoItem
                key={photo.id || index}
                photo={photo}
                colors={colors}
                onClick={() => openLightbox(index)}
                variants={itemVariants}
                aspectRatio="square"
              />
            ))}
          </motion.div>
        ) : (
          // Carousel layout
          <div className="relative overflow-hidden rounded-2xl">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {displayPhotos.map((photo, index) => (
                <div key={photo.id || index} className="w-full shrink-0">
                  <PhotoItem
                    photo={photo}
                    colors={colors}
                    onClick={() => openLightbox(index)}
                    aspectRatio="video"
                  />
                </div>
              ))}
            </motion.div>

            {/* Carousel Controls */}
            <button
              onClick={navigatePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: colors.primary }} />
            </button>
            <button
              onClick={navigateNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" style={{ color: colors.primary }} />
            </button>

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {displayPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index ? 'w-6' : ''
                  }`}
                  style={{
                    backgroundColor: activeIndex === index ? colors.primary : 'white',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {displayPhotos.length > 6 && layout !== 'carousel' && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <button
              onClick={() => openLightbox(0)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
              }}
            >
              <Grid className="w-4 h-4" />
              Lihat Semua Foto
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            photos={displayPhotos}
            activeIndex={activeIndex}
            colors={colors}
            isSlideshow={isSlideshow}
            enableSlideshow={enableSlideshow}
            onClose={closeLightbox}
            onPrev={navigatePrev}
            onNext={navigateNext}
            onToggleSlideshow={() => setIsSlideshow((prev) => !prev)}
            onSelectPhoto={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// Photo Item Component
function PhotoItem({ photo, colors, onClick, variants, aspectRatio = 'square' }) {
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    video: 'aspect-video',
  }

  return (
    <motion.div
      variants={variants}
      className={`relative group cursor-pointer rounded-xl overflow-hidden ${aspectClasses[aspectRatio]}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt || 'Gallery photo'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}10` }}
        >
          <ImageIcon className="w-8 h-8" style={{ color: colors.secondary }} />
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ZoomIn className="w-8 h-8 text-white" />
      </div>

      {/* Caption */}
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm truncate">{photo.caption}</p>
        </div>
      )}
    </motion.div>
  )
}

// Lightbox Component
function Lightbox({
  photos,
  activeIndex,
  colors,
  isSlideshow,
  enableSlideshow,
  onClose,
  onPrev,
  onNext,
  onToggleSlideshow,
  onSelectPhoto,
}) {
  const activePhoto = photos[activeIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-sm">
          {activeIndex + 1} / {photos.length}
        </div>
        <div className="flex items-center gap-2">
          {enableSlideshow && (
            <button
              onClick={onToggleSlideshow}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              {isSlideshow ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="flex-1 flex items-center justify-center px-4 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-full max-h-full"
        >
          {activePhoto.src ? (
            <img
              src={activePhoto.src}
              alt={activePhoto.alt || 'Gallery photo'}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          ) : (
            <div
              className="w-80 h-80 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <ImageIcon className="w-16 h-16" style={{ color: colors.secondary }} />
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Caption */}
      {activePhoto.caption && (
        <div className="text-center p-4">
          <p className="text-white/90">{activePhoto.caption}</p>
        </div>
      )}

      {/* Thumbnails */}
      <div
        className="flex gap-2 p-4 overflow-x-auto justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id || index}
            onClick={() => onSelectPhoto(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all ${
              activeIndex === index
                ? 'ring-2 ring-white scale-110'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            {photo.src ? (
              <img
                src={photo.src}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}30` }}
              >
                <ImageIcon className="w-4 h-4 text-white/50" />
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export { PhotoItem, Lightbox }
