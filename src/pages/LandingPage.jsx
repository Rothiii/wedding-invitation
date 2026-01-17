// src/pages/LandingPage.jsx
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const LandingPage = ({ onOpenInvitation, guestName }) => {
  const config = useConfig();

  return (
    <motion.div
      className="mobile-view-wrapper"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100vh' }}
      transition={{
        duration: 1,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div className="mobile-view-content">
        <div className="min-h-screen relative overflow-hidden">
          {/* Full Screen Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${config.coverImage || 'public/uploads/photos/1768144084946-vzzi8d.jpg'})`
            }}
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

          {/* Main Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-between py-12 px-4">
            {/* Top Section - Wedding Title & Couple Names */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-sm tracking-[0.3em] text-gray-700 uppercase mb-2">
                The Wedding Of
              </p>
              <h1 className="text-4xl pinyon-script-regular text-gray-800">
                {config.groomName} & {config.brideName}
              </h1>
            </motion.div>

            {/* Middle Section - Spacer */}
            <div className="flex-1" />

            {/* Bottom Section - Guest Name & Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center space-y-6"
            >
              {/* Guest Name */}
              {guestName && (
                <div className="text-center">
                  <p className="text-sm text-white">Kepada Yth</p>
                  <p className="text-lg font-semibold text-white">{guestName}</p>
                </div>
              )}

              {/* Open Invitation Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInvitation}
                className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-8 py-3 rounded-lg border border-gray-300 font-medium shadow-lg hover:bg-white transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
                <span>Buka Undangan</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
