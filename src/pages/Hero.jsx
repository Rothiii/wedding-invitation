import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useConfig } from '@/hooks/useConfig'
import { useInvitation } from '@/context/InvitationContext'

export default function Hero() {
    const config = useConfig()
    const { config: invitationConfig } = useInvitation()

    // Get hero photos from config (filtered by section='hero')
    const heroPhotos = invitationConfig?.heroPhotos || []

    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto slide effect - slide every 4 seconds
    useEffect(() => {
        if (heroPhotos.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroPhotos.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [heroPhotos.length])

    // Scroll to next section
    const scrollToNext = useCallback(() => {
        const nextSection = document.getElementById('events') || document.getElementById('couple')
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    return (
        <section id="home" className="min-h-screen relative overflow-hidden">
            {/* Photo Slideshow Background */}
            <div className="absolute inset-0">
                <AnimatePresence initial={false}>
                    {heroPhotos.length > 0 ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                duration: 0.8,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="absolute inset-0"
                        >
                            <img
                                src={heroPhotos[currentIndex]?.src}
                                alt={heroPhotos[currentIndex]?.alt || 'Wedding photo'}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ) : (
                        // Fallback gradient background if no photos
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50" />
                    )}
                </AnimatePresence>

                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                {/* Wedding Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center"
                >
                    <p className="text-sm tracking-[0.3em] text-white/90 uppercase mb-3 font-light">
                        The Wedding of
                    </p>
                    <h1 className="text-4xl sm:text-5xl pinyon-script-regular text-white drop-shadow-lg uppercase tracking-wide">
                        {config.groomName} & {config.brideName}
                    </h1>
                </motion.div>

                {/* Scroll Down Indicator */}
                <motion.button
                    onClick={scrollToNext}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
                    >
                        <div className="w-8 h-12 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-1 h-2 bg-white/80 rounded-full"
                            />
                        </div>
                    </motion.div>
                </motion.button>
            </div>
        </section>
    )
}
