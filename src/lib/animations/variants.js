// Animation variants for Framer Motion
// These are used throughout the invitation pages

// ==================
// LANDING / OPENING
// ==================

export const landingVariants = {
  'fade-scale': {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  },

  'slide-up': {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  },

  'curtain-reveal': {
    hidden: { clipPath: 'inset(0 0 100% 0)' },
    visible: {
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 1, ease: [0.65, 0, 0.35, 1] },
    },
    exit: { clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.5 } },
  },
}

// ==================
// HERO SECTION
// ==================

export const heroVariants = {
  'parallax-scroll': {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  },

  'text-reveal': {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  },

  'floating-elements': {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  },
}

// Character animation for text-reveal
export const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ==================
// SECTION ANIMATIONS
// ==================

export const sectionVariants = {
  'fade-in-view': {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },

  'slide-from-side': {
    hidden: (isEven) => ({
      opacity: 0,
      x: isEven ? 50 : -50,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },

  'stagger-children': {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  'zoom-reveal': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
}

// Child item for stagger animations
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ==================
// GALLERY
// ==================

export const galleryVariants = {
  'masonry-fade': {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  'carousel-3d': {
    hidden: { opacity: 0, rotateY: -15 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },

  'lightbox-zoom': {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
}

export const galleryItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ==================
// COUNTDOWN
// ==================

export const countdownVariants = {
  'flip-clock': {
    hidden: { rotateX: -90, opacity: 0 },
    visible: {
      rotateX: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      rotateX: 90,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },

  'slide-digits': {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },

  'pulse-glow': {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 },
    },
  },
}

// ==================
// UTILITY ANIMATIONS
// ==================

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideDown = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Floating animation for decorative elements
export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Pulse animation
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
