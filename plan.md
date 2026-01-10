# Sakeenah - Wedding Invitation Platform Roadmap

## Overview

Platform undangan pernikahan digital dengan fitur kustomisasi tema, animasi, dan sistem manajemen undangan yang lengkap.

> **Dokumentasi Lengkap:**
> - [Backend Architecture](docs/backend-architecture.md) - Arsitektur backend, database schema, API endpoints
> - [Frontend Architecture](docs/frontend-architecture.md) - Arsitektur frontend, component patterns, state management
> - [UI Mockups](docs/ui-mockups.md) - Mockups dan wireframes UI/UX

---

## Phase 0: Backend Refactor (Priority: CRITICAL)

### 0.1 Migrasi ke Drizzle ORM

**Tujuan**: Refactor backend dengan arsitektur yang bersih, scalable, dan maintainable menggunakan Drizzle ORM.

> Detail implementasi: lihat [Backend Architecture - Database Schema](docs/backend-architecture.md#database-schema)

#### Tasks Phase 0:
- [ ] Install Drizzle ORM dependencies
- [ ] Create Drizzle schema definitions
- [ ] Setup Drizzle client & migrations
- [ ] Migrate raw SQL queries to Drizzle
- [ ] Create folder structure (modules, infra, shared)
- [ ] Implement base error classes
- [ ] Create invitation module (entity, dto, validator, repo, service, controller)
- [ ] Create guest module
- [ ] Create wish module
- [ ] Create auth module
- [ ] Create site module (for landing page content)
- [ ] Setup centralized error handling middleware
- [ ] Setup route registration
- [ ] Test all endpoints
- [ ] Remove old index.js structure

---

## Phase 1: Foundation & Theme System (Priority: HIGH)

### 1.1 Refactor Theme Architecture

**Tujuan**: Membuat sistem tema yang modular dan mudah dikustomisasi.

> Detail struktur: lihat [Frontend Architecture - Theme System](docs/frontend-architecture.md#theme-system)

#### Tasks:
- [x] Create theme folder structure
- [x] Define config.json schema
- [x] Create elegant-rose theme
- [x] Create ocean-blue theme
- [x] Create golden-luxury theme

### 1.2 Animation System

**Tujuan**: Sistem animasi yang dapat dipilih dan dikustomisasi per section.

> Detail animasi: lihat [Frontend Architecture - Animation System](docs/frontend-architecture.md#animation-system)

#### Tasks:
- [x] Buat AnimatedSection component
- [x] Implement animation presets (fade, slide, stagger, parallax)
- [ ] Buat AnimationProvider context untuk manage animasi global
- [ ] Implementasi preview animasi di admin panel

---

## Phase 2: Guest Management & Security (Priority: HIGH)

### 2.1 Guest Link System

**Tujuan**: Sistem link undangan yang aman dengan opsi private/public.

#### Link Modes:
- **Public Mode**: `https://sakeenah.id/{uid}?to={guest-name}`
- **Private Mode**: `https://sakeenah.id/{uid}?g={guest-code}`

> Detail mockup: lihat [UI Mockups - Guest Management](docs/ui-mockups.md#guest-management-page)

### 2.2 Admin Features for Guest Management

#### Tasks:
- [ ] Import guests dari Excel/CSV dengan template
- [ ] Generate bulk guest codes otomatis
- [ ] Export guest list dengan link masing-masing ke Excel
- [ ] Track statistik: siapa sudah buka, berapa kali
- [ ] Deactivate/reactivate guest links
- [ ] Search & filter guests

---

## Phase 3: Enhanced Admin Dashboard (Priority: MEDIUM)

### 3.1 Dashboard Improvements

> Detail mockup: lihat [UI Mockups - Admin Dashboard](docs/ui-mockups.md#admin-dashboard)

### 3.2 Quick Actions

- [ ] Copy link undangan dengan 1 klik
- [ ] Generate QR Code untuk undangan
- [ ] Share langsung ke WhatsApp dengan template message

### 3.3 Preview Mode

- [ ] Preview sebagai tamu tertentu
- [ ] Preview di berbagai device (mobile/tablet/desktop)
- [ ] Preview dengan/tanpa animasi

### 3.4 Onboarding Flow

- [ ] Wizard step-by-step saat buat undangan baru
- [ ] Template pre-filled dengan contoh data
- [ ] Tips/hints di setiap field

### 3.5 Invitation Editor Improvements

> Detail mockup: lihat [UI Mockups - Section Manager](docs/ui-mockups.md#section-manager)

### 3.6 Media Manager

> Detail mockup: lihat [UI Mockups - Media Manager](docs/ui-mockups.md#media-manager)

---

## Phase 4: Public Landing Page (Priority: MEDIUM)

### 4.1 Landing Page Structure

> Detail mockup: lihat [UI Mockups - Landing Page](docs/ui-mockups.md#landing-page)

### 4.2 Site Settings Admin Panel

#### Tasks:
- [ ] Create admin panel untuk edit konten landing page
- [ ] Hero section editable
- [ ] Trust signals editable
- [ ] Contact info editable
- [ ] Social media links editable

### 4.3 WhatsApp Template Messages

- [ ] Template inquiry message
- [ ] Template order message
- [ ] Variable substitution

### 4.4 Katalog & Preview Page

> Detail mockup: lihat [UI Mockups - Theme Catalog](docs/ui-mockups.md#theme-catalog)

### 4.5 SEO Optimization

- [x] Meta tags dinamis per halaman
- [x] Structured data (JSON-LD) untuk business
- [x] Sitemap.xml auto-generated
- [ ] Robots.txt
- [ ] Blog/artikel tips pernikahan (future)

---

## Phase 5: Additional Features (Priority: LOW)

### 5.1 Love Story Timeline
- [x] Section untuk cerita perjalanan cinta
- [x] Timeline dengan foto dan caption
- [x] Animasi scroll yang menarik

### 5.2 Photo Gallery
- [x] Upload multiple photos
- [x] Masonry/Grid/Carousel layout
- [x] Lightbox view
- [x] Slideshow mode

### 5.3 Live Streaming Integration
- [x] Embed YouTube/Zoom link
- [x] Countdown to live event
- [x] "Saksikan Live" button

### 5.4 Digital Gift Registry
- [ ] Wishlist barang hadiah
- [ ] Link ke e-commerce
- [ ] Track yang sudah diklaim

### 5.5 Music Player Enhancements
- [ ] Multiple song options
- [ ] Playlist mode
- [ ] Volume control yang lebih baik

### 5.6 Multi-language Support
- [ ] Indonesian (default)
- [ ] English
- [ ] Arabic (untuk doa-doa)

### 5.7 Reminder Massal (Future)
- [ ] Kirim reminder ke semua tamu yang belum buka
- [ ] Integrasi WhatsApp Business API
- [ ] Scheduled reminders

---

## Phase 6: Business & Monetization

### 6.1 Pricing & Packages

| Feature | Basic | Premium | Exclusive |
|---------|-------|---------|-----------|
| Harga | Rp 99.000 | Rp 199.000 | Rp 399.000 |
| Pilihan Tema | 5 tema | 15 tema | Semua tema |
| Guest Mode | Public only | Private + Public | Private + Public |
| Jumlah Tamu | 100 | 500 | Unlimited |
| Masa Aktif | 30 hari | 90 hari | Selamanya |
| RSVP | ✓ | ✓ | ✓ |
| Amplop Digital | ✗ | ✓ | ✓ |
| Galeri Foto | ✗ | 10 foto | 50 foto |
| Background Music | Default | Pilihan | Custom upload |
| Love Story | ✗ | ✓ | ✓ |
| Custom Domain | ✗ | ✗ | ✓ |
| Revisi | 1x | 3x | Unlimited |
| Support | Email | WA + Email | Priority WA |

### 6.2 Payment Integration
- [ ] Transfer Bank Manual (awal)
- [ ] Midtrans/Xendit (kemudian)
- [ ] Invoice otomatis

### 6.3 Order Management
- [ ] Status tracking (Pending → Paid → In Progress → Done)
- [ ] Auto-reminder untuk pembayaran
- [ ] Email notification

---

## Technical Architecture

> Detail lengkap: lihat [Backend Architecture](docs/backend-architecture.md) dan [Frontend Architecture](docs/frontend-architecture.md)

### Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | React Query (server), React Context (client) |
| Backend | Hono, Drizzle ORM |
| Database | PostgreSQL |
| Deployment | Cloudflare Workers |
| Storage | Cloudflare R2 |

---

## Priority Summary

### Priority 1 - CRITICAL
1. Backend Refactor (Drizzle + Clean Architecture)
2. Theme System modular
3. Animation System basic
4. Guest Mode (Private/Public)
5. CRUD Undangan & Tamu
6. Landing Page basic

### Priority 2 - HIGH
1. Import/Export Excel
2. Quick Actions (copy, QR, WA)
3. Preview Mode
4. Analytics Dashboard

### Priority 3 - MEDIUM
1. Section Manager
2. Media Manager
3. Theme Preview dengan device toggle
4. SEO Optimization

### Priority 4 - LOW
1. Love Story Timeline ✓
2. Photo Gallery ✓
3. Live Streaming ✓
4. Gift Registry
5. Payment Integration
6. Multi-language

---

## Implementation Roadmap

### Sprint 1: Foundation
- [x] Admin Dashboard Basic
- [x] Backend Refactor (Drizzle + Clean Architecture)
- [x] Database migration

### Sprint 2: Core Features
- [x] Theme System Refactor
- [x] Animation System Basic
- [x] Guest Management (Private/Public mode)

### Sprint 3: User Experience
- [x] Import/Export Excel
- [x] Quick Actions (copy, QR, WA)
- [x] Preview Mode
- [x] Onboarding Wizard

### Sprint 4: Landing Page
- [x] Public Landing Page
- [ ] Site Settings Admin
- [x] Theme Catalog & Preview
- [x] Trust Signals & Testimonials

### Sprint 5: Polish
- [x] Analytics Dashboard
- [x] Section Manager
- [x] Media Manager
- [x] SEO Optimization

### Sprint 6: Enhancement
- [x] Love Story Timeline section
- [x] Photo Gallery with masonry layout & lightbox
- [x] Live Streaming integration (YouTube/Zoom)
- [x] Performance optimization (lazy loading, code splitting)
- [x] New themes (Ocean Blue, Golden Luxury)

### Sprint 7+: Future
- [ ] Digital Gift Registry
- [ ] Music Player enhancements
- [ ] Multi-language support
- [ ] Reminder massal (WhatsApp API)
- [ ] Payment integration

---

## Notes

- Fokus MVP: Backend Clean + Theme + Guest Management + Landing Page
- Jangan over-engineer di awal, mulai simple lalu iterate
- Prioritaskan mobile experience (90%+ user buka di HP)
- Collect feedback dari customer pertama untuk improvement
- Landing page content harus editable dari admin (tidak hardcode)

---

*Last updated: January 2025*
