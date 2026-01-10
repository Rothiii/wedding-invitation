import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useVariants } from '../../context/AnimationContext'

// Wrapper component for section animations
export function AnimatedSection({
  children,
  className = '',
  variant = 'sections',
  delay = 0,
  once = true,
  amount = 0.3,
  ...props
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  const variants = useVariants()

  const sectionVariant = variants[variant] || variants.sections

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={sectionVariant}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Simple fade in animation
export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide up animation
export function SlideUp({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  distance = 30,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation
export function ScaleIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation container
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.2,
  ...props
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger item (child of StaggerContainer)
export function StaggerItem({ children, className = '', ...props }) {
  const variants = useVariants()

  return (
    <motion.div variants={variants.item} className={className} {...props}>
      {children}
    </motion.div>
  )
}

// In-view trigger animation
export function InView({
  children,
  className = '',
  variants,
  once = true,
  amount = 0.3,
  ...props
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={
        variants || {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
          },
        }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
