import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Default theme (elegant-rose fallback)
const defaultTheme = {
  id: 'elegant-rose',
  name: 'Elegant Rose',
  category: 'elegant',
  colors: {
    primary: '#FDA4AF',
    primaryLight: '#FECDD3',
    primaryDark: '#FB7185',
    secondary: '#FEF3F2',
    accent: '#9F1239',
    text: '#1F2937',
    textLight: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#FFFFFF',
    backgroundAlt: '#FFF1F2',
    border: '#FDE2E4',
  },
  fonts: {
    heading: { family: 'Playfair Display', weights: [400, 600, 700], style: 'serif' },
    body: { family: 'Inter', weights: [400, 500, 600], style: 'sans-serif' },
    accent: { family: 'Great Vibes', weights: [400], style: 'cursive' },
  },
  ornaments: {},
  backgrounds: {},
  animations: {
    landing: 'fade-scale',
    hero: 'parallax-scroll',
    sections: 'fade-in-view',
    gallery: 'masonry-fade',
    countdown: 'flip-clock',
  },
}

const ThemeContext = createContext({
  theme: defaultTheme,
  themeId: 'elegant-rose',
  isLoading: false,
  error: null,
  setThemeId: () => {},
  loadTheme: () => {},
})

export function ThemeProvider({ children, initialThemeId = 'elegant-rose' }) {
  const [theme, setTheme] = useState(defaultTheme)
  const [themeId, setThemeId] = useState(initialThemeId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load theme config from public folder
  const loadTheme = useCallback(async (id) => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/themes/${id}/config.json`)

      if (!response.ok) {
        throw new Error(`Theme "${id}" not found`)
      }

      const config = await response.json()
      setTheme(config)
      setThemeId(id)

      // Apply CSS variables
      applyThemeCSSVariables(config)

      // Load fonts
      loadThemeFonts(config.fonts)
    } catch (err) {
      console.error('Failed to load theme:', err)
      setError(err.message)
      // Fallback to default theme
      setTheme(defaultTheme)
      applyThemeCSSVariables(defaultTheme)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Apply theme on initial load and when themeId changes
  useEffect(() => {
    loadTheme(themeId)
  }, [themeId, loadTheme])

  const value = {
    theme,
    themeId,
    isLoading,
    error,
    setThemeId,
    loadTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook to get specific theme colors
export function useThemeColors() {
  const { theme } = useTheme()
  return theme.colors
}

// Hook to get theme fonts
export function useThemeFonts() {
  const { theme } = useTheme()
  return theme.fonts
}

// Hook to get animation presets
export function useThemeAnimations() {
  const { theme } = useTheme()
  return theme.animations
}

// Apply CSS variables to document root
function applyThemeCSSVariables(theme) {
  const root = document.documentElement
  const { colors, fonts } = theme

  // Colors
  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${camelToKebab(key)}`, value)
    })
  }

  // Font families
  if (fonts) {
    if (fonts.heading?.family) {
      root.style.setProperty('--font-heading', fonts.heading.family)
    }
    if (fonts.body?.family) {
      root.style.setProperty('--font-body', fonts.body.family)
    }
    if (fonts.accent?.family) {
      root.style.setProperty('--font-accent', fonts.accent.family)
    }
  }

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor && colors.primary) {
    metaThemeColor.setAttribute('content', colors.primary)
  }
}

// Load Google Fonts dynamically
function loadThemeFonts(fonts) {
  if (!fonts) return

  const fontFamilies = []

  if (fonts.heading?.family) {
    const weights = fonts.heading.weights?.join(';') || '400;700'
    fontFamilies.push(`${fonts.heading.family.replace(/ /g, '+')}:wght@${weights}`)
  }

  if (fonts.body?.family) {
    const weights = fonts.body.weights?.join(';') || '400;500;600'
    fontFamilies.push(`${fonts.body.family.replace(/ /g, '+')}:wght@${weights}`)
  }

  if (fonts.accent?.family) {
    const weights = fonts.accent.weights?.join(';') || '400'
    fontFamilies.push(`${fonts.accent.family.replace(/ /g, '+')}:wght@${weights}`)
  }

  if (fontFamilies.length > 0) {
    const linkId = 'theme-fonts'
    let linkElement = document.getElementById(linkId)

    const href = `https://fonts.googleapis.com/css2?${fontFamilies.map((f) => `family=${f}`).join('&')}&display=swap`

    if (linkElement) {
      linkElement.href = href
    } else {
      linkElement = document.createElement('link')
      linkElement.id = linkId
      linkElement.rel = 'stylesheet'
      linkElement.href = href
      document.head.appendChild(linkElement)
    }
  }
}

// Helper to convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export default ThemeContext
