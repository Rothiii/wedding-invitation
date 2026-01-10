import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin, Image as ImageIcon } from 'lucide-react'

/**
 * LoveStoryTimeline Component
 * Displays the couple's love story as an interactive timeline
 *
 * @param {Object} props
 * @param {Array} props.stories - Array of story objects with year, title, description, image, location
 * @param {Object} props.theme - Theme colors object
 * @param {string} props.animation - Animation type for the timeline
 */
export default function LoveStoryTimeline({
  stories = [],
  theme = {},
  animation = 'stagger-children',
  title = 'Kisah Cinta Kami',
  subtitle = 'Perjalanan cinta yang membawa kami ke hari bahagia ini',
}) {
  const [activeIndex, setActiveIndex] = useState(null)

  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
    background: theme?.colors?.[2] || '#fdf2f8',
  }

  // Default stories if none provided
  const defaultStories = [
    {
      year: '2020',
      title: 'Pertama Bertemu',
      description: 'Kami bertemu untuk pertama kalinya di sebuah acara yang tak terduga. Senyum dan tawa menjadi awal dari segalanya.',
      location: 'Jakarta',
    },
    {
      year: '2021',
      title: 'Mulai Dekat',
      description: 'Dari pertemanan yang biasa, kami mulai merasakan sesuatu yang berbeda. Setiap percakapan terasa istimewa.',
      location: 'Bandung',
    },
    {
      year: '2022',
      title: 'Resmi Berpacaran',
      description: 'Di bawah langit malam yang penuh bintang, kami memutuskan untuk menjalani hari-hari bersama.',
      location: 'Yogyakarta',
    },
    {
      year: '2023',
      title: 'Lamaran',
      description: 'Dengan penuh keberanian dan cinta, sebuah pertanyaan penting diucapkan dan dijawab dengan air mata kebahagiaan.',
      location: 'Bali',
    },
    {
      year: '2024',
      title: 'Akad Nikah',
      description: 'Hari yang dinanti akhirnya tiba. Dua jiwa menjadi satu dalam ikatan suci yang diberkahi.',
      location: 'Jakarta',
    },
  ]

  const displayStories = stories.length > 0 ? stories : defaultStories

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
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
          className="text-center mb-12"
        >
          <Heart
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: colors.primary }}
            fill={colors.primary}
          />
          <h2 className="text-2xl sm:text-3xl font-serif mb-3" style={{ color: colors.primary }}>
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          {/* Timeline Line */}
          <div
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: colors.secondary }}
          />

          {/* Timeline Items */}
          {displayStories.map((story, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative pl-16 sm:pl-20 pb-10 last:pb-0"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Year Badge */}
              <motion.div
                className="absolute left-0 w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center shadow-lg z-10"
                style={{
                  backgroundColor: activeIndex === index ? colors.primary : 'white',
                  borderWidth: 3,
                  borderColor: colors.primary,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span
                  className="text-xs sm:text-sm font-bold"
                  style={{ color: activeIndex === index ? 'white' : colors.primary }}
                >
                  {story.year}
                </span>
              </motion.div>

              {/* Content Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                whileHover={{ y: -4, shadow: 'lg' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Image (if available) */}
                {story.image ? (
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 50%, ${colors.primary}40 100%)`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="h-24 sm:h-32 flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}10` }}
                  >
                    <ImageIcon className="w-10 h-10" style={{ color: colors.secondary }} />
                  </div>
                )}

                {/* Text Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {story.description}
                  </p>

                  {/* Location */}
                  {story.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                      <span>{story.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector Line Dot */}
              <div
                className="absolute left-[22px] sm:left-[30px] top-6 sm:top-8 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }} />
            <Heart className="w-4 h-4" style={{ color: colors.primary }} fill={colors.primary} />
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }} />
          </div>
          <p className="text-sm text-gray-500 mt-3 italic">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan..."
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Story Item component for individual use
export function StoryItem({ story, theme, isActive, onHover }) {
  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
  }

  return (
    <div
      className="flex gap-4 items-start"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{
          backgroundColor: isActive ? colors.primary : 'white',
          borderWidth: 2,
          borderColor: colors.primary,
        }}
      >
        <span
          className="text-xs font-bold"
          style={{ color: isActive ? 'white' : colors.primary }}
        >
          {story.year}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{story.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{story.description}</p>
      </div>
    </div>
  )
}
