/**
 * Sitemap Generator Utilities
 * Generates sitemap.xml for SEO optimization
 */

const BASE_URL = 'https://sakeenah.id'

/**
 * Generate XML sitemap string
 * @param {Array} pages - Array of page objects with url, lastmod, changefreq, priority
 * @returns {string} XML sitemap string
 */
export function generateSitemap(pages) {
  const urlset = pages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`
}

/**
 * Generate static pages for sitemap
 * @returns {Array} Array of static page objects
 */
export function getStaticPages() {
  return [
    {
      url: `${BASE_URL}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      url: `${BASE_URL}/katalog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9',
    },
  ]
}

/**
 * Generate theme preview pages for sitemap
 * @param {Array} themes - Array of theme objects with id
 * @returns {Array} Array of theme page objects
 */
export function getThemePages(themes) {
  return themes.map((theme) => ({
    url: `${BASE_URL}/preview/${theme.id}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.7',
  }))
}

/**
 * Generate invitation pages for sitemap (public ones only)
 * @param {Array} invitations - Array of invitation objects with uid and updated_at
 * @returns {Array} Array of invitation page objects
 */
export function getInvitationPages(invitations) {
  return invitations
    .filter((inv) => inv.is_active)
    .map((inv) => ({
      url: `${BASE_URL}/${inv.uid}`,
      lastmod: inv.updated_at
        ? new Date(inv.updated_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.6',
    }))
}

/**
 * Generate robots.txt content
 * @returns {string} robots.txt content
 */
export function generateRobotsTxt() {
  return `# Robots.txt for Sakeenah Wedding
User-agent: *
Allow: /
Allow: /katalog
Allow: /preview/

# Disallow admin routes
Disallow: /admin
Disallow: /admin/*

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay
Crawl-delay: 1`
}

/**
 * Default themes for sitemap generation
 */
export const DEFAULT_THEMES = [
  { id: 'elegant-rose' },
  { id: 'rustic-garden' },
  { id: 'minimalist-white' },
  { id: 'javanese-classic' },
]

/**
 * Generate complete sitemap with all pages
 * @param {Object} options - Options object
 * @param {Array} options.themes - Array of theme objects
 * @param {Array} options.invitations - Array of invitation objects
 * @returns {string} Complete sitemap XML
 */
export function generateCompleteSitemap({ themes = DEFAULT_THEMES, invitations = [] } = {}) {
  const pages = [
    ...getStaticPages(),
    ...getThemePages(themes),
    ...getInvitationPages(invitations),
  ]

  return generateSitemap(pages)
}
