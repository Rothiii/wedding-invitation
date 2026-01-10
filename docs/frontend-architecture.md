# Frontend Architecture

Dokumentasi arsitektur frontend Sakeenah Wedding Platform menggunakan React dengan Vite.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| React Router v7 | Routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Query | Server State |
| Lucide React | Icons |

## Struktur Folder

```
src/
├── components/
│   ├── ui/                    # Shared UI components
│   │   └── marquee.jsx
│   │
│   ├── sections/              # Invitation section components
│   │   ├── LoveStoryTimeline.jsx
│   │   ├── PhotoGallery.jsx
│   │   ├── LiveStreaming.jsx
│   │   └── index.js
│   │
│   ├── admin/                 # Admin-specific components
│   │   ├── QuickActions.jsx
│   │   ├── GuestImportExport.jsx
│   │   ├── PreviewMode.jsx
│   │   ├── OnboardingWizard.jsx
│   │   ├── SectionManager.jsx
│   │   ├── MediaManager.jsx
│   │   └── index.js
│   │
│   ├── animations/            # Animation components
│   │   ├── AnimatedSection.jsx
│   │   └── index.js
│   │
│   ├── demo/                  # Demo components
│   │   ├── DemoInvitation.jsx
│   │   └── index.js
│   │
│   ├── seo/                   # SEO components
│   │   ├── SEOHead.jsx
│   │   └── index.js
│   │
│   ├── Layout.jsx
│   ├── BottomBar.jsx
│   └── EventsCard.jsx
│
├── pages/
│   ├── admin/                 # Admin pages
│   │   ├── LoginPage.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InvitationsPage.jsx
│   │   ├── InvitationForm.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   └── index.js
│   │
│   └── public/                # Public pages
│       ├── PublicLandingPage.jsx
│       ├── ThemeCatalog.jsx
│       ├── ThemePreview.jsx
│       └── index.js
│
├── context/
│   └── InvitationContext.jsx
│
├── services/
│   ├── api.js                 # Public API calls
│   └── adminApi.js            # Admin API calls
│
├── lib/
│   ├── performance/           # Performance utilities
│   │   ├── lazyLoad.jsx
│   │   └── index.js
│   │
│   └── seo/                   # SEO utilities
│       ├── sitemap.js
│       └── index.js
│
├── App.jsx
├── main.jsx
└── index.css
```

## State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SERVER STATE (data dari API)          CLIENT STATE         │
│  ─────────────────────────────         ────────────────     │
│  React Query / TanStack Query          React Context        │
│                                                              │
│  • Invitation data                     • Guest info (URL)   │
│  • Wishes list                         • Auth token         │
│  • Guest list                          • UI state (modal)   │
│  • Theme config                        • Form state         │
│  • Site settings                                            │
│                                                              │
│  Benefits:                             Benefits:            │
│  • Auto caching                        • Simple & native    │
│  • Background refetch                  • No extra library   │
│  • Loading/error states                • Familiar API       │
│  • Optimistic updates                                       │
│  • Pagination support                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Routing Structure

```jsx
// src/main.jsx
<Routes>
  {/* Public Landing Page */}
  <Route path="/" element={<PublicLandingPage />} />
  <Route path="/katalog" element={<ThemeCatalog />} />
  <Route path="/preview/:themeId" element={<ThemePreview />} />

  {/* Admin Routes */}
  <Route path="/admin" element={<LoginPage />} />
  <Route path="/admin/dashboard" element={<DashboardPage />} />
  <Route path="/admin/invitations" element={<InvitationsPage />} />
  <Route path="/admin/invitations/new" element={<InvitationForm />} />
  <Route path="/admin/invitations/:uid" element={<InvitationForm />} />
  <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
  <Route path="/admin/analytics/:uid" element={<AnalyticsDashboard />} />

  {/* Invitation Routes - matches /:uid pattern */}
  <Route path="/:uid/*" element={<InvitationApp />} />
</Routes>
```

## Component Patterns

### 1. Section Components

Section components untuk undangan dengan props standar:

```jsx
// Pattern untuk section components
export default function SectionName({
  data = {},           // Data untuk section
  theme = {},          // Theme colors object
  animation = 'fade',  // Animation type
  title = 'Title',     // Section title
  subtitle = '',       // Section subtitle
}) {
  const colors = {
    primary: theme?.colors?.[0] || '#be185d',
    secondary: theme?.colors?.[1] || '#f472b6',
    background: theme?.colors?.[2] || '#fdf2f8',
  }

  return (
    <section className="py-16 px-4">
      {/* Section content */}
    </section>
  )
}
```

### 2. Admin Components

Admin components dengan action handlers:

```jsx
// Pattern untuk admin components
export default function AdminComponent({
  data,
  onSave,
  onDelete,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(data)

  const handleSubmit = async () => {
    await onSave(formData)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Form content */}
    </div>
  )
}
```

### 3. Modal Components

Reusable modal pattern:

```jsx
export function ModalComponent({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full">
        {children}
      </div>
    </div>
  )
}
```

## Animation System

### Animation Presets

```javascript
const ANIMATION_OPTIONS = [
  { id: 'none', name: 'Tanpa Animasi' },
  { id: 'fade-scale', name: 'Fade & Scale' },
  { id: 'fade-in-view', name: 'Fade In View' },
  { id: 'slide-up', name: 'Slide Up' },
  { id: 'slide-from-side', name: 'Slide From Side' },
  { id: 'stagger-children', name: 'Stagger Children' },
  { id: 'parallax-scroll', name: 'Parallax Scroll' },
  { id: 'zoom-reveal', name: 'Zoom Reveal' },
  { id: 'masonry-fade', name: 'Masonry Fade' },
]
```

### Framer Motion Variants

```jsx
// Fade In Up
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Stagger Container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

// Scale Up
const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}
```

### AnimatedSection Component

```jsx
import { motion } from 'framer-motion'

export function AnimatedSection({ children, animation = 'fade-in-view' }) {
  const variants = {
    'fade-in-view': {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    'slide-up': {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    // ... more variants
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[animation]}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

## Theme System

### Theme Config Structure

```json
{
  "id": "elegant-rose",
  "name": "Elegant Rose",
  "category": "elegant",
  "price": 150000,
  "isBestSeller": true,

  "colors": {
    "primary": "#FDA4AF",
    "primaryLight": "#FECDD3",
    "primaryDark": "#FB7185",
    "secondary": "#FEF3F2",
    "accent": "#9F1239",
    "text": "#1F2937",
    "textLight": "#6B7280",
    "background": "#FFFFFF",
    "backgroundAlt": "#FFF1F2"
  },

  "fonts": {
    "heading": { "family": "Playfair Display", "weights": [400, 600, 700] },
    "body": { "family": "Inter", "weights": [400, 500, 600] },
    "accent": { "family": "Great Vibes", "weights": [400] }
  },

  "animations": {
    "landing": "fade-scale",
    "hero": "parallax-scroll",
    "sections": "fade-in-view",
    "gallery": "masonry-fade",
    "countdown": "flip-clock"
  }
}
```

### Available Themes

| Theme | Category | Price | Status |
|-------|----------|-------|--------|
| Elegant Rose | Elegant | Rp 150.000 | Best Seller |
| Rustic Garden | Nature | Rp 150.000 | New |
| Minimalist White | Modern | Rp 100.000 | - |
| Javanese Classic | Traditional | Rp 200.000 | - |
| Ocean Blue | Modern | Rp 150.000 | New |
| Golden Luxury | Luxury | Rp 250.000 | New |

## Performance Optimization

### Lazy Loading

```jsx
import { lazyWithPreload, LazyImage, LazyRender } from '@/lib/performance'

// Lazy load components
const HeavyComponent = lazyWithPreload(
  () => import('./HeavyComponent'),
  { preload: false }
)

// Lazy load images
<LazyImage
  src="/images/photo.jpg"
  alt="Photo"
  placeholder="#f0f0f0"
  className="w-full h-64 object-cover"
/>

// Render only when in view
<LazyRender placeholder={<Skeleton />}>
  <ExpensiveComponent />
</LazyRender>
```

### useInView Hook

```jsx
import { useInView } from '@/lib/performance'

function MyComponent() {
  const [ref, isInView] = useInView({ rootMargin: '100px' })

  return (
    <div ref={ref}>
      {isInView && <Content />}
    </div>
  )
}
```

### Image Preloading

```javascript
import { preloadImages } from '@/lib/performance'

// Preload critical images
useEffect(() => {
  preloadImages([
    '/images/hero.jpg',
    '/images/couple.jpg',
  ])
}, [])
```

## SEO Implementation

### SEOHead Component

```jsx
import { SEOHead, generateInvitationStructuredData } from '@/components/seo'

function InvitationPage({ invitation }) {
  return (
    <>
      <SEOHead
        title={`Undangan ${invitation.groomName} & ${invitation.brideName}`}
        description={invitation.description}
        ogImage={invitation.ogImage}
        ogUrl={`https://sakeenah.id/${invitation.uid}`}
        structuredData={generateInvitationStructuredData(invitation)}
      />
      {/* Page content */}
    </>
  )
}
```

### Sitemap Generation

```javascript
import { generateCompleteSitemap, generateRobotsTxt } from '@/lib/seo'

// Generate sitemap
const sitemap = generateCompleteSitemap({
  themes: [{ id: 'elegant-rose' }, { id: 'ocean-blue' }],
  invitations: [{ uid: 'ahmad-fatimah', is_active: true }],
})

// Generate robots.txt
const robotsTxt = generateRobotsTxt()
```

## API Services

### Admin API

```javascript
// src/services/adminApi.js

export async function fetchInvitations() {
  const response = await authFetch(`${API_URL}/api/admin/invitations`)
  return response.json()
}

export async function createInvitation(data) {
  const response = await authFetch(`${API_URL}/api/admin/invitations`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateInvitation(uid, data) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}
```

### Public API

```javascript
// src/services/api.js

export async function fetchInvitation(uid) {
  const response = await fetch(`${API_URL}/api/invitation/${uid}`)
  return response.json()
}

export async function fetchWishes(uid) {
  const response = await fetch(`${API_URL}/api/${uid}/wishes`)
  return response.json()
}

export async function createWish(uid, data) {
  const response = await fetch(`${API_URL}/api/${uid}/wishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
```

## Context Usage

### InvitationContext

```jsx
// src/context/InvitationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const InvitationContext = createContext()

export function InvitationProvider({ children }) {
  const [invitation, setInvitation] = useState(null)
  const [guest, setGuest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load invitation data based on URL
  useEffect(() => {
    // ...
  }, [])

  return (
    <InvitationContext.Provider value={{ invitation, guest, isLoading }}>
      {children}
    </InvitationContext.Provider>
  )
}

export function useInvitation() {
  return useContext(InvitationContext)
}
```

## Best Practices

### Component Guidelines

1. **Single Responsibility** - Setiap component memiliki satu tujuan
2. **Props Validation** - Gunakan default props untuk mencegah error
3. **Memoization** - Gunakan useMemo/useCallback untuk expensive operations
4. **Error Boundaries** - Wrap components dengan error boundaries

### Styling Guidelines

1. **Tailwind First** - Gunakan Tailwind classes untuk styling
2. **Theme Colors** - Selalu gunakan theme colors dari props
3. **Responsive** - Mobile-first approach
4. **Dark Mode Ready** - Siapkan untuk dark mode (future)

### Performance Guidelines

1. **Lazy Load** - Lazy load heavy components
2. **Image Optimization** - Gunakan LazyImage untuk gambar
3. **Bundle Splitting** - Split code per route
4. **Avoid Re-renders** - Optimize dengan React.memo
