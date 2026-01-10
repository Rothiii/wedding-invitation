import { lazy, Suspense, useState, useEffect, useRef } from 'react'

/**
 * Create a lazy-loaded component with loading fallback
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Options for lazy loading
 * @returns {React.Component} Lazy loaded component
 */
export function lazyWithPreload(importFn, options = {}) {
  const {
    fallback = <DefaultLoadingSpinner />,
    preload = false,
  } = options

  const LazyComponent = lazy(importFn)

  // Preload if requested
  if (preload) {
    importFn()
  }

  // Return wrapper component
  const WrappedComponent = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )

  // Attach preload method
  WrappedComponent.preload = importFn

  return WrappedComponent
}

/**
 * Default loading spinner component
 */
function DefaultLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
    </div>
  )
}

/**
 * Skeleton loader component
 */
export function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseClass = 'animate-pulse bg-gray-200 rounded'

  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: '',
  }

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

/**
 * Lazy Image component with blur-up effect
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text
 * @param {string} props.placeholder - Low-res placeholder image or color
 * @param {string} props.className - Additional CSS classes
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  className = '',
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = (e) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  const handleError = (e) => {
    setIsError(true)
    onError?.(e)
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={
            placeholder?.startsWith('#') || placeholder?.startsWith('rgb')
              ? { backgroundColor: placeholder }
              : placeholder
              ? { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }
              : {}
          }
        />
      )}

      {/* Actual Image */}
      {isInView && !isError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  )
}

/**
 * Component that only renders when in viewport
 * @param {Object} props
 * @param {React.ReactNode} props.children - Children to render
 * @param {string} props.rootMargin - Intersection observer margin
 * @param {number} props.threshold - Intersection threshold
 * @param {React.ReactNode} props.placeholder - Placeholder while not in view
 */
export function LazyRender({
  children,
  rootMargin = '100px',
  threshold = 0.01,
  placeholder = null,
  onVisible,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          onVisible?.()
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold, onVisible])

  return (
    <div ref={containerRef}>
      {isVisible ? children : placeholder}
    </div>
  )
}

/**
 * Hook for detecting if element is in viewport
 * @param {Object} options - Intersection observer options
 * @returns {[React.RefObject, boolean]} Ref and visibility state
 */
export function useInView(options = {}) {
  const { rootMargin = '0px', threshold = 0, once = true } = options
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)

        if (inView && once) {
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return [ref, isInView]
}

/**
 * Preload images for better performance
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Promise<void[]>}
 */
export function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = reject
          img.src = url
        })
    )
  )
}

/**
 * Debounce function for performance
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle function for performance
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
