import { motion } from 'framer-motion'
import { useConfig } from '@/hooks/useConfig'
import { useInvitation } from '@/context/InvitationContext'
import { useEffect, useState } from 'react'

export default function SaveTheDate() {
    const config = useConfig()
    const { config: invitationConfig } = useInvitation()

    // Get hero photos for the collage
    const heroPhotos = invitationConfig?.heroPhotos || []

    // Parse wedding date for display
    const weddingDate = config.weddingDate ? new Date(config.weddingDate) : new Date()
    const day = weddingDate.getDate().toString().padStart(2, '0')
    const month = (weddingDate.getMonth() + 1).toString().padStart(2, '0')
    const year = weddingDate.getFullYear().toString().slice(-2)

    // Countdown state
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const calculateCountdown = () => {
            const now = new Date().getTime()
            const target = weddingDate.getTime()
            const difference = target - now

            if (difference > 0) {
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateCountdown()
        const interval = setInterval(calculateCountdown, 1000)
        return () => clearInterval(interval)
    }, [weddingDate])

    const formatNumber = (num) => num.toString().padStart(2, '0')

    return (
        <section className="bg-black py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Photo Collage with Date */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative mb-4"
                >
                    {/* Top Row - Photo 1 + Date Box + Photo 2 */}
                    <div className="flex gap-2">
                        {/* Left photo - horizontal */}
                        {heroPhotos[0] && (
                            <div className="w-2/3 aspect-[2/3] overflow-hidden">
                                <img
                                    src={heroPhotos[0].src}
                                    alt="Wedding photo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Right side - Date box + Photo 2 */}
                        <div className="w-1/3 flex flex-col gap-2">
                            {/* Date box */}
                            <div className="bg-[#f5f0e8] p-2 aspect-[2/3]">
                                <div className="w-full h-full border border-black flex flex-col items-center justify-center">
                                    <span className="text-3xl font-light text-black cormorant-infant-regular">{day}</span>
                                    <span className="text-3xl font-light text-black cormorant-infant-regular">{month}</span>
                                    <span className="text-3xl font-light text-black cormorant-infant-regular">{year}</span>
                                </div>
                            </div>

                            {/* Photo 2 - vertical */}
                            {heroPhotos[1] && (
                                <div className="flex-1 overflow-hidden">
                                    <img
                                        src={heroPhotos[1].src}
                                        alt="Wedding photo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Name Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white border-2 border-black p-2 mb-4"
                >
                    <div className="border border-black px-4 py-3">
                        <div className="flex items-center justify-center gap-4">
                            <h2 className="text-xl md:text-2xl font-medium tracking-wider text-black uppercase cormorant-infant-regular">
                                {config.groomName} & {config.brideName}
                            </h2>
                            <div className="flex-1 h-[2px] bg-black max-w-[80px]" />
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Photo */}
                {heroPhotos[2] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="aspect-[4/3] overflow-hidden mb-8"
                    >
                        <img
                            src={heroPhotos[2].src}
                            alt="Wedding photo"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}

                {/* Save The Date */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <h3 className="text-xl tracking-[0.3em] text-white mb-8 font-light cormorant-infant-regular">
                        SAVE THE DATE
                    </h3>

                    {/* Countdown */}
                    <div className="flex justify-center gap-6">
                        <div className="text-center">
                            <span className="text-3xl font-light text-white cormorant-infant-regular">{formatNumber(countdown.days)}</span>
                            <p className="text-xs text-white/70 mt-1 cormorant-infant-regular">Hari</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-light text-white cormorant-infant-regular">{formatNumber(countdown.hours)}</span>
                            <p className="text-xs text-white/70 mt-1 cormorant-infant-regular">Jam</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-light text-white cormorant-infant-regular">{formatNumber(countdown.minutes)}</span>
                            <p className="text-xs text-white/70 mt-1 cormorant-infant-regular">Menit</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-light text-white cormorant-infant-regular">{formatNumber(countdown.seconds)}</span>
                            <p className="text-xs text-white/70 mt-1 cormorant-infant-regular">Detik</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
