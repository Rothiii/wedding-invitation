import { useEffect } from 'react'

/**
 * SEOHead Component
 * Manages document head for SEO optimization
 * Updates title, meta tags, and Open Graph data dynamically
 */
export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  structuredData,
}) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Helper function to update or create meta tags
    const updateMeta = (name, content, isProperty = false) => {
      if (!content) return

      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMeta('description', description)
    updateMeta('keywords', keywords)

    // Robots meta
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow')
    } else {
      updateMeta('robots', 'index, follow')
    }

    // Open Graph tags
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:image', ogImage, true)
    updateMeta('og:url', ogUrl || window.location.href, true)
    updateMeta('og:type', ogType, true)
    updateMeta('og:site_name', 'Sakeenah Wedding', true)

    // Twitter Card tags
    updateMeta('twitter:card', twitterCard)
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    updateMeta('twitter:image', ogImage)

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]')
    if (canonicalUrl) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link')
        canonicalElement.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalElement)
      }
      canonicalElement.setAttribute('href', canonicalUrl)
    } else if (canonicalElement) {
      canonicalElement.remove()
    }

    // Structured Data (JSON-LD)
    let scriptElement = document.querySelector('script[type="application/ld+json"]')
    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement('script')
        scriptElement.setAttribute('type', 'application/ld+json')
        document.head.appendChild(scriptElement)
      }
      scriptElement.textContent = JSON.stringify(structuredData)
    } else if (scriptElement) {
      scriptElement.remove()
    }

    // Cleanup function
    return () => {
      // Reset title on unmount if needed
      // document.title = 'Sakeenah Wedding'
    }
  }, [
    title,
    description,
    keywords,
    ogImage,
    ogUrl,
    ogType,
    twitterCard,
    canonicalUrl,
    noIndex,
    structuredData,
  ])

  return null // This component doesn't render anything
}

/**
 * Generate structured data for a wedding invitation
 */
export function generateInvitationStructuredData(invitation) {
  if (!invitation) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
    description: invitation.description || `Undangan pernikahan ${invitation.groom_name} dan ${invitation.bride_name}`,
    startDate: invitation.wedding_date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: invitation.location
      ? {
          '@type': 'Place',
          name: invitation.location,
          address: invitation.address,
        }
      : undefined,
    organizer: {
      '@type': 'Person',
      name: `${invitation.groom_name} & ${invitation.bride_name}`,
    },
    image: invitation.og_image || '/images/og-image.jpg',
  }
}

/**
 * Generate structured data for the business (landing page)
 */
export function generateBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sakeenah Wedding',
    description: 'Platform undangan pernikahan digital yang elegan dan personal',
    url: 'https://sakeenah.id',
    logo: 'https://sakeenah.id/logo.png',
    image: 'https://sakeenah.id/images/og-image.jpg',
    priceRange: 'Rp 99.000 - Rp 399.000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+6281234567890',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [
      'https://instagram.com/sakeenah_wedding',
      'https://tiktok.com/@sakeenah',
    ],
  }
}

/**
 * Generate structured data for FAQ
 */
export function generateFAQStructuredData(faqs) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items) {
  if (!items || items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
