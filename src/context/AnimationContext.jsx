import { createContext, useContext } from 'react'
import { useTheme } from './ThemeContext'
import {
  landingVariants,
  heroVariants,
  sectionVariants,
  galleryVariants,
  countdownVariants,
  itemVariants,
  charVariants,
  galleryItemVariants,
  fadeIn,
  slideUp,
  scaleIn,
} from '../lib/animations/variants'

const AnimationContext = createContext(null)

// Default animation presets
const defaultAnimations = {
  landing: 'fade-scale',
  hero: 'parallax-scroll',
  sections: 'fade-in-view',
  gallery: 'masonry-fade',
  countdown: 'flip-clock',
}

export function AnimationProvider({ children }) {
  const { theme } = useTheme()

  // Get animation presets from theme or use defaults
  const animations = theme?.animations || defaultAnimations

  // Get the appropriate variant based on animation type
  const getVariant = (section) => {
    const animationType = animations[section]

    switch (section) {
      case 'landing':
        return landingVariants[animationType] || landingVariants['fade-scale']
      case 'hero':
        return heroVariants[animationType] || heroVariants['parallax-scroll']
      case 'sections':
        return sectionVariants[animationType] || sectionVariants['fade-in-view']
      case 'gallery':
        return galleryVariants[animationType] || galleryVariants['masonry-fade']
      case 'countdown':
        return countdownVariants[animationType] || countdownVariants['flip-clock']
      default:
        return fadeIn
    }
  }

  const value = {
    animations,
    getVariant,
    // Pre-resolved variants for common use
    variants: {
      landing: getVariant('landing'),
      hero: getVariant('hero'),
      sections: getVariant('sections'),
      gallery: getVariant('gallery'),
      countdown: getVariant('countdown'),
      // Common utility variants
      item: itemVariants,
      char: charVariants,
      galleryItem: galleryItemVariants,
      fadeIn,
      slideUp,
      scaleIn,
    },
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimations() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimations must be used within an AnimationProvider')
  }
  return context
}

// Hook to get variant for a specific section
export function useSectionVariant(section) {
  const { getVariant } = useAnimations()
  return getVariant(section)
}

// Hook to get all pre-resolved variants
export function useVariants() {
  const { variants } = useAnimations()
  return variants
}

export default AnimationContext
