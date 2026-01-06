# Sakeenah - Wedding Invitation Platform Roadmap

## Overview

Platform undangan pernikahan digital dengan fitur kustomisasi tema, animasi, dan sistem manajemen undangan yang lengkap.

---

## Phase 0: Backend Refactor (Priority: CRITICAL)

### 0.1 Migrasi ke Drizzle ORM

**Tujuan**: Refactor backend dengan arsitektur yang bersih, scalable, dan maintainable menggunakan Drizzle ORM.

#### Instalasi Dependencies
```bash
bun add drizzle-orm postgres
bun add -D drizzle-kit @types/node
```

#### Drizzle Schema Definition
```typescript
// src/server/db/schema.ts
import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, date, time } from 'drizzle-orm/pg-core'

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 50 }).unique().notNull(),

  // Couple
  title: varchar('title', { length: 500 }),
  description: text('description'),
  groomName: varchar('groom_name', { length: 100 }).notNull(),
  brideName: varchar('bride_name', { length: 100 }).notNull(),
  parentGroom: varchar('parent_groom', { length: 255 }),
  parentBride: varchar('parent_bride', { length: 255 }),

  // Event
  weddingDate: date('wedding_date').notNull(),
  time: varchar('time', { length: 100 }),
  location: varchar('location', { length: 500 }),
  address: text('address'),

  // Maps
  mapsUrl: text('maps_url'),
  mapsEmbed: text('maps_embed'),

  // Media
  ogImage: varchar('og_image', { length: 500 }).default('/images/og-image.jpg'),
  favicon: varchar('favicon', { length: 500 }).default('/images/favicon.ico'),
  audio: jsonb('audio').$type<AudioConfig>(),

  // Theme & Settings
  theme: varchar('theme', { length: 50 }).default('default'),
  guestMode: varchar('guest_mode', { length: 20 }).default('public'), // 'public' | 'private'
  isActive: boolean('is_active').default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const guests = pgTable('guests', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 }).notNull().references(() => invitations.uid, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }),
  code: varchar('code', { length: 20 }).unique(),

  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  maxPersons: integer('max_persons').default(2),

  linkOpenedAt: timestamp('link_opened_at'),
  linkOpenedCount: integer('link_opened_count').default(0),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const wishes = pgTable('wishes', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 }).notNull().references(() => invitations.uid, { onDelete: 'cascade' }),
  guestId: integer('guest_id').references(() => guests.id),

  name: varchar('name', { length: 100 }).notNull(),
  message: text('message').notNull(),
  attendance: varchar('attendance', { length: 20 }).default('MAYBE'),

  createdAt: timestamp('created_at').defaultNow(),
})

export const agenda = pgTable('agenda', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 }).notNull().references(() => invitations.uid, { onDelete: 'cascade' }),

  title: varchar('title', { length: 255 }).notNull(),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  location: varchar('location', { length: 500 }),
  address: text('address'),
  orderIndex: integer('order_index').default(0),

  createdAt: timestamp('created_at').defaultNow(),
})

export const banks = pgTable('banks', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 }).notNull().references(() => invitations.uid, { onDelete: 'cascade' }),

  bank: varchar('bank', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 100 }).notNull(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
  orderIndex: integer('order_index').default(0),

  createdAt: timestamp('created_at').defaultNow(),
})

// Landing page content (editable dari admin)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: jsonb('value'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  photo: varchar('photo', { length: 500 }),
  message: text('message').notNull(),
  rating: integer('rating').default(5),
  isActive: boolean('is_active').default(true),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  price: integer('price').notNull(),
  features: jsonb('features').$type<string[]>(),
  isBestSeller: boolean('is_best_seller').default(false),
  isActive: boolean('is_active').default(true),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### 0.2 Arsitektur Backend (Clean Architecture)

**Tujuan**: Struktur backend dengan pemisahan tanggung jawab yang jelas.

#### Prinsip Utama
1. **Controller** → Hanya HTTP concern (request, response, status code)
2. **Service** → Logika bisnis, orkestrasi data
3. **Repository** → Komunikasi database murni
4. **Entity** → Representasi data domain
5. **DTO** → Kontrak data masuk/keluar
6. **Validator** → Validasi data sebelum masuk bisnis logic

#### Struktur Folder Backend
```
src/server/
├── infra/                          # Infrastruktur (framework-aware)
│   ├── http/
│   │   ├── server.ts               # Hono server setup
│   │   ├── routes.ts               # Route definitions
│   │   └── middlewares/
│   │       ├── auth.middleware.ts
│   │       ├── error.middleware.ts # Error handler terpusat
│   │       └── cors.middleware.ts
│   │
│   ├── database/
│   │   ├── client.ts               # Drizzle client setup
│   │   ├── schema.ts               # Drizzle schema
│   │   └── migrations/
│   │
│   ├── storage/
│   │   └── cloudflare-r2.ts        # File storage adapter
│   │
│   └── cache/
│       └── memory-cache.ts         # Simple in-memory cache
│
├── modules/                        # Domain modules (framework-agnostic)
│   ├── invitation/
│   │   ├── invitation.entity.ts    # Domain entity
│   │   ├── invitation.dto.ts       # DTOs (CreateInvitationDto, UpdateInvitationDto)
│   │   ├── invitation.validator.ts # Validation rules
│   │   ├── invitation.repository.ts # Database operations
│   │   ├── invitation.service.ts   # Business logic
│   │   └── invitation.controller.ts # HTTP handlers
│   │
│   ├── guest/
│   │   ├── guest.entity.ts
│   │   ├── guest.dto.ts
│   │   ├── guest.validator.ts
│   │   ├── guest.repository.ts
│   │   ├── guest.service.ts
│   │   └── guest.controller.ts
│   │
│   ├── wish/
│   │   ├── wish.entity.ts
│   │   ├── wish.dto.ts
│   │   ├── wish.validator.ts
│   │   ├── wish.repository.ts
│   │   ├── wish.service.ts
│   │   └── wish.controller.ts
│   │
│   ├── auth/
│   │   ├── auth.dto.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── session.repository.ts
│   │
│   ├── theme/
│   │   ├── theme.entity.ts
│   │   ├── theme.service.ts        # Read from filesystem
│   │   └── theme.controller.ts
│   │
│   └── site/                       # Landing page content
│       ├── site.dto.ts
│       ├── site.repository.ts
│       ├── site.service.ts
│       └── site.controller.ts
│
├── shared/                         # Shared utilities (no business logic)
│   ├── errors/
│   │   ├── base.error.ts           # Base error class
│   │   ├── not-found.error.ts
│   │   ├── validation.error.ts
│   │   └── unauthorized.error.ts
│   │
│   ├── types/
│   │   ├── pagination.type.ts
│   │   └── response.type.ts
│   │
│   └── utils/
│       ├── code-generator.ts       # Guest code generator
│       ├── slug.ts                 # Slug utilities
│       └── hash.ts                 # Password hashing
│
└── index.ts                        # Entry point
```

#### Contoh Implementasi

**1. Entity (Domain Model)**
```typescript
// src/server/modules/invitation/invitation.entity.ts
export interface InvitationEntity {
  id: number
  uid: string
  title: string | null
  description: string | null
  groomName: string
  brideName: string
  parentGroom: string | null
  parentBride: string | null
  weddingDate: Date
  time: string | null
  location: string | null
  address: string | null
  mapsUrl: string | null
  mapsEmbed: string | null
  ogImage: string
  favicon: string
  audio: AudioConfig | null
  theme: string
  guestMode: 'public' | 'private'
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations (optional, loaded when needed)
  agenda?: AgendaEntity[]
  banks?: BankEntity[]
}
```

**2. DTO (Data Transfer Object)**
```typescript
// src/server/modules/invitation/invitation.dto.ts
export interface CreateInvitationDto {
  uid: string
  groomName: string
  brideName: string
  weddingDate: string
  title?: string
  description?: string
  parentGroom?: string
  parentBride?: string
  time?: string
  location?: string
  address?: string
  mapsUrl?: string
  mapsEmbed?: string
  theme?: string
  guestMode?: 'public' | 'private'
  agenda?: CreateAgendaDto[]
  banks?: CreateBankDto[]
}

export interface UpdateInvitationDto {
  title?: string
  description?: string
  groomName?: string
  brideName?: string
  // ... partial fields
}

export interface InvitationResponseDto {
  uid: string
  title: string
  groomName: string
  brideName: string
  // ... public-safe fields (no internal IDs, etc.)
}
```

**3. Validator**
```typescript
// src/server/modules/invitation/invitation.validator.ts
import { ValidationError } from '@/shared/errors/validation.error'

export class InvitationValidator {
  static validateCreate(data: unknown): CreateInvitationDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    if (!dto.uid || typeof dto.uid !== 'string') {
      errors.push('uid is required')
    } else if (!/^[a-z0-9-]+$/.test(dto.uid)) {
      errors.push('uid must be lowercase alphanumeric with dashes')
    }

    if (!dto.groomName || typeof dto.groomName !== 'string') {
      errors.push('groomName is required')
    }

    if (!dto.brideName || typeof dto.brideName !== 'string') {
      errors.push('brideName is required')
    }

    if (!dto.weddingDate || typeof dto.weddingDate !== 'string') {
      errors.push('weddingDate is required')
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as CreateInvitationDto
  }
}
```

**4. Repository (Database Layer)**
```typescript
// src/server/modules/invitation/invitation.repository.ts
import { db } from '@/infra/database/client'
import { invitations, agenda, banks } from '@/infra/database/schema'
import { eq } from 'drizzle-orm'
import type { InvitationEntity } from './invitation.entity'

export class InvitationRepository {
  async findByUid(uid: string): Promise<InvitationEntity | null> {
    const result = await db
      .select()
      .from(invitations)
      .where(eq(invitations.uid, uid))
      .limit(1)

    return result[0] || null
  }

  async findAll(): Promise<InvitationEntity[]> {
    return db.select().from(invitations).orderBy(invitations.createdAt)
  }

  async create(data: Omit<InvitationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvitationEntity> {
    const result = await db
      .insert(invitations)
      .values(data)
      .returning()

    return result[0]
  }

  async update(uid: string, data: Partial<InvitationEntity>): Promise<InvitationEntity | null> {
    const result = await db
      .update(invitations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invitations.uid, uid))
      .returning()

    return result[0] || null
  }

  async delete(uid: string): Promise<boolean> {
    const result = await db
      .delete(invitations)
      .where(eq(invitations.uid, uid))
      .returning({ uid: invitations.uid })

    return result.length > 0
  }

  async findWithRelations(uid: string): Promise<InvitationEntity | null> {
    const invitation = await this.findByUid(uid)
    if (!invitation) return null

    const [agendaItems, bankItems] = await Promise.all([
      db.select().from(agenda).where(eq(agenda.invitationUid, uid)),
      db.select().from(banks).where(eq(banks.invitationUid, uid)),
    ])

    return {
      ...invitation,
      agenda: agendaItems,
      banks: bankItems,
    }
  }
}
```

**5. Service (Business Logic)**
```typescript
// src/server/modules/invitation/invitation.service.ts
import { InvitationRepository } from './invitation.repository'
import { AgendaRepository } from './agenda.repository'
import { BankRepository } from './bank.repository'
import { InvitationValidator } from './invitation.validator'
import { NotFoundError } from '@/shared/errors/not-found.error'
import { ValidationError } from '@/shared/errors/validation.error'
import type { CreateInvitationDto, UpdateInvitationDto, InvitationResponseDto } from './invitation.dto'

export class InvitationService {
  constructor(
    private invitationRepo: InvitationRepository,
    private agendaRepo: AgendaRepository,
    private bankRepo: BankRepository,
  ) {}

  async getByUid(uid: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepo.findWithRelations(uid)

    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    return this.toResponseDto(invitation)
  }

  async create(data: CreateInvitationDto): Promise<InvitationResponseDto> {
    // Validate
    const validated = InvitationValidator.validateCreate(data)

    // Check if UID already exists
    const existing = await this.invitationRepo.findByUid(validated.uid)
    if (existing) {
      throw new ValidationError('UID already exists')
    }

    // Create invitation
    const invitation = await this.invitationRepo.create({
      uid: validated.uid,
      title: validated.title || null,
      groomName: validated.groomName,
      brideName: validated.brideName,
      weddingDate: new Date(validated.weddingDate),
      // ... other fields
    })

    // Create related agenda and banks
    if (validated.agenda?.length) {
      await this.agendaRepo.createMany(validated.uid, validated.agenda)
    }

    if (validated.banks?.length) {
      await this.bankRepo.createMany(validated.uid, validated.banks)
    }

    return this.toResponseDto(invitation)
  }

  async update(uid: string, data: UpdateInvitationDto): Promise<InvitationResponseDto> {
    const existing = await this.invitationRepo.findByUid(uid)
    if (!existing) {
      throw new NotFoundError('Invitation not found')
    }

    const updated = await this.invitationRepo.update(uid, data)
    return this.toResponseDto(updated!)
  }

  async delete(uid: string): Promise<void> {
    const deleted = await this.invitationRepo.delete(uid)
    if (!deleted) {
      throw new NotFoundError('Invitation not found')
    }
  }

  private toResponseDto(entity: InvitationEntity): InvitationResponseDto {
    return {
      uid: entity.uid,
      title: entity.title || `Pernikahan ${entity.groomName} & ${entity.brideName}`,
      groomName: entity.groomName,
      brideName: entity.brideName,
      // ... map to public-safe response
    }
  }
}
```

**6. Controller (HTTP Layer)**
```typescript
// src/server/modules/invitation/invitation.controller.ts
import { Hono } from 'hono'
import { InvitationService } from './invitation.service'

export function createInvitationController(service: InvitationService) {
  const router = new Hono()

  // GET /api/invitation/:uid
  router.get('/:uid', async (c) => {
    const { uid } = c.req.param()
    const invitation = await service.getByUid(uid)
    return c.json({ success: true, data: invitation })
  })

  // POST /api/admin/invitations
  router.post('/', async (c) => {
    const body = await c.req.json()
    const invitation = await service.create(body)
    return c.json({ success: true, data: invitation }, 201)
  })

  // PUT /api/admin/invitations/:uid
  router.put('/:uid', async (c) => {
    const { uid } = c.req.param()
    const body = await c.req.json()
    const invitation = await service.update(uid, body)
    return c.json({ success: true, data: invitation })
  })

  // DELETE /api/admin/invitations/:uid
  router.delete('/:uid', async (c) => {
    const { uid } = c.req.param()
    await service.delete(uid)
    return c.json({ success: true, message: 'Invitation deleted' })
  })

  return router
}
```

**7. Error Handling Middleware**
```typescript
// src/server/infra/http/middlewares/error.middleware.ts
import { Context, Next } from 'hono'
import { BaseError } from '@/shared/errors/base.error'
import { NotFoundError } from '@/shared/errors/not-found.error'
import { ValidationError } from '@/shared/errors/validation.error'
import { UnauthorizedError } from '@/shared/errors/unauthorized.error'

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)

    if (error instanceof NotFoundError) {
      return c.json({ success: false, error: error.message }, 404)
    }

    if (error instanceof ValidationError) {
      return c.json({ success: false, error: error.message }, 400)
    }

    if (error instanceof UnauthorizedError) {
      return c.json({ success: false, error: error.message }, 401)
    }

    if (error instanceof BaseError) {
      return c.json({ success: false, error: error.message }, 500)
    }

    // Unknown error
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
}
```

**8. Route Registration**
```typescript
// src/server/infra/http/routes.ts
import { Hono } from 'hono'
import { errorMiddleware } from './middlewares/error.middleware'
import { authMiddleware } from './middlewares/auth.middleware'
import { createInvitationController } from '@/modules/invitation/invitation.controller'
import { createGuestController } from '@/modules/guest/guest.controller'
import { createWishController } from '@/modules/wish/wish.controller'
import { createAuthController } from '@/modules/auth/auth.controller'
import { createSiteController } from '@/modules/site/site.controller'

// Dependency injection (simple version)
import { InvitationRepository } from '@/modules/invitation/invitation.repository'
import { InvitationService } from '@/modules/invitation/invitation.service'
// ... other imports

export function createRoutes() {
  const app = new Hono()

  // Global error handler
  app.use('*', errorMiddleware)

  // Initialize dependencies
  const invitationRepo = new InvitationRepository()
  const invitationService = new InvitationService(invitationRepo, /* ... */)

  // Public routes
  app.route('/api/invitation', createInvitationController(invitationService))
  app.route('/api/wishes', createWishController(/* ... */))
  app.route('/api/site', createSiteController(/* ... */))

  // Auth routes
  app.route('/api/admin/auth', createAuthController(/* ... */))

  // Protected admin routes
  const admin = new Hono()
  admin.use('*', authMiddleware)
  admin.route('/invitations', createInvitationController(invitationService))
  admin.route('/guests', createGuestController(/* ... */))
  admin.route('/site', createSiteController(/* ... */))

  app.route('/api/admin', admin)

  return app
}
```

#### Diagram Dependency Flow
```
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Request                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  infra/http/middlewares                      │
│              (error handling, auth, cors)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLER                              │
│            (HTTP concern only: req/res/status)              │
│                                                              │
│   - Parse request params, body, query                       │
│   - Call service method                                      │
│   - Return JSON response with status code                   │
│   - NO business logic here                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICE                                │
│              (Business logic & orchestration)                │
│                                                              │
│   - Validate input (call validator)                         │
│   - Business rules & decisions                              │
│   - Orchestrate repository calls                            │
│   - Transform data (entity → DTO)                           │
│   - Throw domain errors (not HTTP errors)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     REPOSITORY                               │
│               (Database operations only)                     │
│                                                              │
│   - CRUD operations                                         │
│   - Query building                                          │
│   - No business logic                                       │
│   - Returns entity or null                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              infra/database (Drizzle ORM)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
└─────────────────────────────────────────────────────────────┘
```

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

#### Struktur Folder Tema
```
public/themes/
├── elegant-rose/
│   ├── config.json          # Konfigurasi tema (warna, font, spacing)
│   ├── preview.jpg           # Preview untuk katalog (800x600)
│   ├── thumbnail.jpg         # Thumbnail kecil (400x300)
│   ├── assets/
│   │   ├── ornaments/        # Ornamen dekoratif (SVG/PNG)
│   │   │   ├── corner-1.svg
│   │   │   ├── divider.svg
│   │   │   └── frame.svg
│   │   ├── backgrounds/      # Background patterns/images
│   │   └── icons/            # Custom icons untuk tema
│   └── animations.json       # Preset animasi untuk tema ini
├── rustic-garden/
├── minimalist-white/
├── javanese-classic/
└── modern-geometric/
```

#### Config.json Structure
```json
{
  "id": "elegant-rose",
  "name": "Elegant Rose",
  "category": "elegant",
  "price": 150000,
  "isBestSeller": true,
  "isNew": false,

  "colors": {
    "primary": "#FDA4AF",
    "secondary": "#FEF3F2",
    "accent": "#9F1239",
    "text": "#1F2937",
    "textLight": "#6B7280",
    "background": "#FFFFFF",
    "backgroundAlt": "#FFF1F2"
  },

  "fonts": {
    "heading": {
      "family": "Playfair Display",
      "weights": [400, 600, 700]
    },
    "body": {
      "family": "Inter",
      "weights": [400, 500, 600]
    },
    "accent": {
      "family": "Great Vibes",
      "weights": [400]
    }
  },

  "ornaments": {
    "cornerTopLeft": "/themes/elegant-rose/assets/ornaments/corner-tl.svg",
    "cornerTopRight": "/themes/elegant-rose/assets/ornaments/corner-tr.svg",
    "divider": "/themes/elegant-rose/assets/ornaments/divider.svg",
    "frame": "/themes/elegant-rose/assets/ornaments/frame.svg"
  },

  "customizableImages": [
    { "id": "hero_bg", "label": "Background Pembuka", "default": "/themes/elegant-rose/assets/backgrounds/hero.jpg" },
    { "id": "couple_frame", "label": "Frame Foto Pasangan", "default": "/themes/elegant-rose/assets/ornaments/frame.svg" },
    { "id": "section_divider", "label": "Pembatas Section", "default": "/themes/elegant-rose/assets/ornaments/divider.svg" }
  ]
}
```

### 1.2 Animation System

**Tujuan**: Sistem animasi yang dapat dipilih dan dikustomisasi per section.

#### Animation Presets (animations.json)
```json
{
  "landing": {
    "options": [
      {
        "id": "fade-scale",
        "name": "Fade & Scale",
        "description": "Elemen muncul dengan efek fade dan membesar",
        "preview": "/animations/previews/fade-scale.gif"
      },
      {
        "id": "slide-up",
        "name": "Slide Up",
        "description": "Elemen masuk dari bawah ke atas"
      },
      {
        "id": "curtain-reveal",
        "name": "Curtain Reveal",
        "description": "Efek tirai terbuka"
      },
      {
        "id": "particle-bloom",
        "name": "Particle Bloom",
        "description": "Partikel bunga bertebaran"
      }
    ],
    "default": "fade-scale"
  },

  "hero": {
    "options": [
      {
        "id": "parallax-scroll",
        "name": "Parallax Scroll",
        "description": "Efek parallax saat scroll"
      },
      {
        "id": "text-reveal",
        "name": "Text Reveal",
        "description": "Teks muncul karakter per karakter"
      },
      {
        "id": "floating-elements",
        "name": "Floating Elements",
        "description": "Ornamen melayang-layang"
      }
    ],
    "default": "parallax-scroll"
  },

  "sections": {
    "options": [
      {
        "id": "fade-in-view",
        "name": "Fade In View",
        "description": "Muncul saat masuk viewport"
      },
      {
        "id": "slide-from-side",
        "name": "Slide From Side",
        "description": "Masuk dari kiri/kanan bergantian"
      },
      {
        "id": "stagger-children",
        "name": "Stagger Children",
        "description": "Anak elemen muncul berurutan"
      },
      {
        "id": "zoom-reveal",
        "name": "Zoom Reveal",
        "description": "Zoom in saat scroll"
      }
    ],
    "default": "fade-in-view"
  },

  "gallery": {
    "options": [
      {
        "id": "masonry-fade",
        "name": "Masonry Fade",
        "description": "Layout masonry dengan fade"
      },
      {
        "id": "carousel-3d",
        "name": "3D Carousel",
        "description": "Carousel dengan efek 3D"
      },
      {
        "id": "lightbox-zoom",
        "name": "Lightbox Zoom",
        "description": "Zoom ke lightbox saat diklik"
      }
    ],
    "default": "masonry-fade"
  },

  "countdown": {
    "options": [
      {
        "id": "flip-clock",
        "name": "Flip Clock",
        "description": "Angka berputar seperti jam flip"
      },
      {
        "id": "slide-digits",
        "name": "Slide Digits",
        "description": "Angka slide berganti"
      },
      {
        "id": "pulse-glow",
        "name": "Pulse Glow",
        "description": "Efek pulse dan glow"
      }
    ],
    "default": "flip-clock"
  }
}
```

#### Tasks:
- [ ] Buat AnimationProvider context untuk manage animasi global
- [ ] Buat komponen wrapper untuk setiap jenis animasi
- [ ] Implementasi preview animasi di admin panel
- [ ] Buat library animasi dengan Framer Motion variants

---

## Phase 2: Guest Management & Security (Priority: HIGH)

### 2.1 Guest Link System

**Tujuan**: Sistem link undangan yang aman dengan opsi private/public.

#### Link Modes

**Mode 1: Private (Secure Guest Links)**
```
Format: https://sakeenah.id/{invitation-uid}?g={guest-code}
Contoh: https://sakeenah.id/ahmad-fatimah-2025?g=XK7M2P

Behavior:
- Kode unik per tamu (6-8 karakter)
- Validasi kode di server
- Track siapa yang buka
- Jika kode salah → tampilkan pesan error dengan nama tamu yang seharusnya
- "Link ini untuk [Nama Tamu]. Jika Anda bukan [Nama Tamu], silakan hubungi pengantin."
```

**Mode 2: Public (Open Links)**
```
Format: https://sakeenah.id/{invitation-uid}?to={guest-name-base64}
Contoh: https://sakeenah.id/ahmad-fatimah-2025?to=QnVkaSBTYW50b3Nv

Behavior:
- Nama tamu di-encode base64
- Siapa saja bisa ubah nama di URL
- Tidak ada validasi
- Cocok untuk disebar di sosial media
```

### 2.2 Admin Features for Guest Management

#### Bulk Operations dengan Template Excel
```
Excel Template (guest-template.xlsx):
┌────────────────────────────────────────────────────────────┐
│  A          │  B           │  C         │  D               │
├────────────────────────────────────────────────────────────┤
│  Nama Tamu  │  No. HP      │  Email     │  Jumlah Orang   │
├────────────────────────────────────────────────────────────┤
│  Budi       │  08123456789 │  budi@...  │  2              │
│  Siti       │  08234567890 │  siti@...  │  3              │
│  Pak Ahmad  │  08345678901 │            │  5              │
└────────────────────────────────────────────────────────────┘

Fitur:
- Download template Excel kosong
- Upload Excel → auto generate kode unik untuk setiap tamu
- Export ke Excel dengan kolom tambahan: Kode, Link Lengkap
- Preview sebelum import
```

#### Guest Management Features
- [ ] Import guests dari Excel/CSV dengan template
- [ ] Generate bulk guest codes otomatis
- [ ] Export guest list dengan link masing-masing ke Excel
- [ ] Track statistik: siapa sudah buka, berapa kali
- [ ] Deactivate/reactivate guest links
- [ ] Search & filter guests

### 2.3 Guest Code Generator

```javascript
// Contoh format kode
const codeFormats = {
  short: 6,     // XK7M2P
  medium: 8,    // XK7M2P9Q
  long: 10      // XK7M2P9Q4R
}

// Karakter yang digunakan (hindari yang mirip: 0/O, 1/I/L)
const charset = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
```

---

## Phase 3: Enhanced Admin Dashboard (Priority: MEDIUM)

### 3.1 Dashboard Improvements

#### Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD                                     [Ahmad-Fatimah-2025 ▼]
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 156      │  │ 89       │  │ 45       │  │ 22       │    │
│  │ Total    │  │ Hadir    │  │ Tidak    │  │ Ragu     │    │
│  │ Tamu     │  │ (57%)    │  │ (29%)    │  │ (14%)    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LINK DIBUKA (7 hari terakhir)                      │   │
│  │  ═══════════════════════════════════════════════    │   │
│  │  [Chart: Line graph showing opens per day]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │ UCAPAN TERBARU       │  │ TAMU BELUM BUKA LINK     │    │
│  │ ──────────────────── │  │ ────────────────────────  │    │
│  │ • Budi: "Selamat..." │  │ • Pak Haji Ahmad         │    │
│  │ • Siti: "Barakall.." │  │ • Ibu Siti              │    │
│  │ • Andi: "Semoga..."  │  │ • Keluarga Besar...     │    │
│  └──────────────────────┘  └──────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Guest Management Page
```
┌─────────────────────────────────────────────────────────────┐
│  DAFTAR TAMU                           [+ Tambah] [Import]  │
├─────────────────────────────────────────────────────────────┤
│  🔍 [Cari tamu...]           [Filter: Semua ▼] [Export ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ☑  NAMA              KODE      STATUS    DIBUKA   AKSI    │
│  ─────────────────────────────────────────────────────────  │
│  ☐  Budi Santoso      XK7M2P    ✅ Hadir   3x      [···]   │
│  ☐  Siti Aminah       YP3N8Q    ⏳ Ragu    1x      [···]   │
│  ☐  Pak Haji Ahmad    ZR4K9M    ─ Belum   0x      [···]   │
│  ☐  Keluarga Besar    WT6J2L    ❌ Tidak   2x      [···]   │
│                                                              │
│  [Dengan terpilih: Export ▼] [Hapus]                        │
│                                                              │
│  Showing 1-10 of 156 guests          [← 1 2 3 ... 16 →]    │
└─────────────────────────────────────────────────────────────┘
```

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

#### Visual Theme Preview
- Live preview saat edit
- Preview di berbagai device (mobile/tablet/desktop)
- Preview animasi

#### Section Manager
```
┌─────────────────────────────────────────────────────────────┐
│  SECTION MANAGER                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⋮⋮ [✓] Opening/Landing     [Animasi: Curtain ▼] [⚙️]      │
│  ⋮⋮ [✓] Hero/Countdown      [Animasi: Parallax ▼] [⚙️]     │
│  ⋮⋮ [✓] Couple Info         [Animasi: Fade ▼] [⚙️]         │
│  ⋮⋮ [✓] Agenda/Events       [Animasi: Stagger ▼] [⚙️]      │
│  ⋮⋮ [✓] Location/Maps       [Animasi: Slide ▼] [⚙️]        │
│  ⋮⋮ [ ] Gallery             [Animasi: Masonry ▼] [⚙️]      │
│  ⋮⋮ [✓] Gift/Amplop         [Animasi: Fade ▼] [⚙️]         │
│  ⋮⋮ [✓] Wishes/RSVP         [Animasi: Fade ▼] [⚙️]         │
│  ⋮⋮ [ ] Love Story          [Animasi: Timeline ▼] [⚙️]     │
│  ⋮⋮ [✓] Closing             [Animasi: Fade ▼] [⚙️]         │
│                                                              │
│  [+ Tambah Section Custom]                                  │
│                                                              │
│  💡 Drag untuk mengubah urutan section                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.6 Media Manager

#### Image Upload & Management
```
┌─────────────────────────────────────────────────────────────┐
│  MEDIA MANAGER                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [📁 Upload Gambar]  [🔗 Dari URL]                          │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ 🖼️      │ │ 🖼️      │ │ 🖼️      │ │ 🖼️      │           │
│  │ foto1   │ │ foto2   │ │ bg-hero │ │ frame   │           │
│  │ [Pakai] │ │ [Pakai] │ │ [Pakai] │ │ [Pakai] │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                              │
│  📊 Storage: 45MB / 100MB                                   │
└─────────────────────────────────────────────────────────────┘
```

**Implementasi:**
- Gunakan Cloudflare R2 atau AWS S3 untuk storage
- Compress gambar otomatis saat upload
- Generate berbagai ukuran (thumbnail, medium, large)
- Lazy loading untuk performa

---

## Phase 4: Public Landing Page (Priority: MEDIUM)

### 4.1 Landing Page Structure (Data dari Database - Editable di Admin)

```
┌─────────────────────────────────────────────────────────────┐
│  🌸 Sakeenah                    [Katalog] [Harga] [Kontak]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         ╔═══════════════════════════════════════╗           │
│         ║                                       ║           │
│         ║   [HEADLINE - dari DB]                ║           │
│         ║   [SUBHEADLINE - dari DB]             ║           │
│         ║                                       ║           │
│         ║   [Lihat Katalog]  [Hubungi Kami]     ║           │
│         ║                                       ║           │
│         ╚═══════════════════════════════════════╝           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   🏆 BEST SELLERS (dari theme config: isBestSeller)         │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   [Grid tema dengan isBestSeller: true]                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ✨ FITUR UNGGULAN (dari DB: site_settings)                │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   [Grid fitur - editable di admin]                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   💰 PILIHAN PAKET (dari DB: packages table)                │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   [Pricing cards - editable di admin]                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ⭐ TESTIMONI (dari DB: testimonials table)                │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   [Testimonial cards - editable di admin]                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   🔢 TRUST SIGNALS (dari DB: site_settings)                 │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   "500+ pasangan"  "4.9/5 rating"  "Response < 1 jam"       │
│   [Counter & stats - editable di admin]                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ❓ FAQ (dari DB: site_settings)                           │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   [FAQ items - editable di admin]                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   📞 HUBUNGI KAMI (dari DB: site_settings)                  │
│   ──────────────────────────────────────────────────────    │
│                                                              │
│   WhatsApp, Email, Response time - editable di admin        │
│                                                              │
│   [💬 Chat WhatsApp dengan template]                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   © 2025 Sakeenah. Made with 💕 in Indonesia               │
│   [Social links - editable di admin]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Site Settings Admin Panel

```
┌─────────────────────────────────────────────────────────────┐
│  PENGATURAN LANDING PAGE                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📝 HERO SECTION                                            │
│  ─────────────────────────────────────────────────────────  │
│  Headline:    [Undangan Pernikahan Digital____________]     │
│  Subheadline: [yang Elegan & Personal__________________]    │
│  Background:  [Upload] [URL]                                │
│                                                              │
│  🔢 TRUST SIGNALS                                           │
│  ─────────────────────────────────────────────────────────  │
│  Counter 1:   [500+] [pasangan sudah menggunakan]           │
│  Counter 2:   [4.9]  [rating kepuasan]                      │
│  Counter 3:   [<1jam] [response time]                       │
│                                                              │
│  📞 KONTAK                                                  │
│  ─────────────────────────────────────────────────────────  │
│  WhatsApp:    [6281234567890___________________________]    │
│  Email:       [hello@sakeenah.id______________________]    │
│  Jam Operasional: [09:00 - 21:00 WIB__________________]    │
│                                                              │
│  🔗 SOCIAL MEDIA                                            │
│  ─────────────────────────────────────────────────────────  │
│  Instagram:   [@sakeenah_wedding_____________________]      │
│  TikTok:      [@sakeenah____________________________]       │
│                                                              │
│                                          [Simpan Perubahan] │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 WhatsApp Template Messages (dengan variable)

```javascript
const whatsappTemplates = {
  // Template inquiry - editable di admin
  inquiry: {
    message: `Halo {{business_name}}! 👋

Saya tertarik dengan undangan digital untuk pernikahan saya.

📅 Tanggal pernikahan: [ISI TANGGAL]
🎨 Tema yang diminati: [ISI TEMA]
📝 Catatan: [ISI CATATAN]

Mohon info lebih lanjut ya. Terima kasih! 🙏`
  },

  // Template order
  order: {
    message: `Halo {{business_name}}! 👋

Saya ingin memesan undangan digital:

📦 Paket: [BASIC/PREMIUM/EXCLUSIVE]
🎨 Tema: [NAMA TEMA]
📅 Tanggal pernikahan: [ISI TANGGAL]

👤 Data Mempelai:
- Pria: [NAMA LENGKAP]
- Wanita: [NAMA LENGKAP]

Mohon diproses ya. Terima kasih! 🙏`
  }
}
```

### 4.4 Katalog & Preview Page

#### Theme Catalog Page
```
/katalog

- Grid tema dari database/filesystem
- Filter by category
- Search
- Preview button → /preview/{theme-id}
- Order button → WhatsApp dengan template
```

#### Theme Preview/Demo Page
```
/preview/{theme-id}

- Full working preview dengan data dummy
- Toggle device view (mobile/tablet/desktop)
- "Pesan Tema Ini" button → WhatsApp
- Info fitur yang tersedia di tema ini
```

### 4.5 SEO Optimization

- [ ] Meta tags dinamis per halaman
- [ ] Structured data (JSON-LD) untuk business
- [ ] Sitemap.xml auto-generated
- [ ] Robots.txt
- [ ] Blog/artikel tips pernikahan (future)

---

## Phase 5: Additional Features (Priority: LOW)

### 5.1 Love Story Timeline
- Section untuk cerita perjalanan cinta
- Timeline dengan foto dan caption
- Animasi scroll yang menarik

### 5.2 Photo Gallery
- Upload multiple photos
- Masonry layout
- Lightbox view
- Optional: slideshow mode

### 5.3 Live Streaming Integration
- Embed YouTube/Zoom link
- Countdown to live event
- "Saksikan Live" button

### 5.4 Digital Gift Registry
- Wishlist barang hadiah
- Link ke e-commerce
- Track yang sudah diklaim

### 5.5 Music Player Enhancements
- Multiple song options
- Playlist mode
- Volume control yang lebih baik

### 5.6 Multi-language Support
- Indonesian (default)
- English
- Arabic (untuk doa-doa)

### 5.7 Reminder Massal (Future)
- Kirim reminder ke semua tamu yang belum buka
- Integrasi WhatsApp Business API
- Scheduled reminders

---

## Phase 6: Business & Monetization

### 6.1 Pricing & Packages (Editable di Admin)

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
- Transfer Bank Manual (awal)
- Midtrans/Xendit (kemudian)
- Invoice otomatis

### 6.3 Order Management
- Status tracking (Pending → Paid → In Progress → Done)
- Auto-reminder untuk pembayaran
- Email notification

---

## Technical Architecture

### Frontend Stack
```
- React 18 + Vite
- React Router v7
- Tailwind CSS
- Framer Motion (animations)
- React Query (data fetching)
- Zustand (state management - optional)
```

### Backend Stack
```
- Hono (API framework)
- Drizzle ORM (database)
- PostgreSQL (database)
- Cloudflare Workers (deployment)
- Cloudflare R2 (file storage)
```

### Infrastructure
```
- Domain: sakeenah.id (atau .com)
- SSL: Cloudflare (free)
- CDN: Cloudflare
- Database: Neon.tech / Supabase / Railway
```

---

## File Structure (Target)

```
sakeenah/
├── public/
│   ├── themes/
│   │   ├── elegant-rose/
│   │   ├── rustic-garden/
│   │   └── ...
│   ├── animations/
│   │   └── previews/
│   └── images/
│       └── landing/
│
├── src/
│   ├── components/
│   │   ├── ui/                    # Shared UI components
│   │   ├── invitation/            # Invitation-specific components
│   │   │   ├── Landing.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Countdown.jsx
│   │   │   └── ...
│   │   ├── admin/                 # Admin-specific components
│   │   │   ├── GuestTable.jsx
│   │   │   ├── ThemeSelector.jsx
│   │   │   └── ...
│   │   └── landing/               # Public landing page components
│   │       ├── HeroSection.jsx
│   │       ├── PricingCards.jsx
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── admin/                 # Admin pages
│   │   ├── invitation/            # Invitation view pages
│   │   └── public/                # Public landing pages
│   │
│   ├── hooks/
│   │   ├── useAnimation.js
│   │   ├── useTheme.js
│   │   └── useGuest.js
│   │
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   ├── AnimationContext.jsx
│   │   └── InvitationContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── adminApi.js
│   │   └── whatsapp.js
│   │
│   ├── lib/
│   │   ├── animations/            # Animation variants & helpers
│   │   ├── utils/
│   │   └── constants/
│   │
│   └── server/                    # Backend (Clean Architecture)
│       ├── infra/
│       │   ├── http/
│       │   │   ├── server.ts
│       │   │   ├── routes.ts
│       │   │   └── middlewares/
│       │   ├── database/
│       │   │   ├── client.ts
│       │   │   ├── schema.ts
│       │   │   └── migrations/
│       │   └── storage/
│       │
│       ├── modules/
│       │   ├── invitation/
│       │   │   ├── invitation.entity.ts
│       │   │   ├── invitation.dto.ts
│       │   │   ├── invitation.validator.ts
│       │   │   ├── invitation.repository.ts
│       │   │   ├── invitation.service.ts
│       │   │   └── invitation.controller.ts
│       │   ├── guest/
│       │   ├── wish/
│       │   ├── auth/
│       │   ├── theme/
│       │   └── site/
│       │
│       ├── shared/
│       │   ├── errors/
│       │   ├── types/
│       │   └── utils/
│       │
│       └── index.ts
│
└── plan.md
```

---

## Priority Summary (Ringkasan Prioritas)

### Priority 1 - CRITICAL (Harus selesai sebelum launch)

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1.1 | Backend Refactor | Migrasi ke Drizzle ORM + Clean Architecture |
| 1.2 | Theme System | Struktur tema modular dengan config.json |
| 1.3 | Animation System Basic | Minimal 3-4 animasi per section |
| 1.4 | Guest Mode (Private/Public) | Sistem link dengan kode unik atau base64 |
| 1.5 | CRUD Undangan | Create, Read, Update, Delete undangan |
| 1.6 | CRUD Tamu | Tambah, edit, hapus tamu |
| 1.7 | Landing Page Basic | Hero, katalog tema, pricing, kontak |

### Priority 2 - HIGH (Penting untuk UX & bisnis)

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 2.1 | Import/Export Excel | Bulk import tamu dari Excel, export dengan link |
| 2.2 | Quick Actions | Copy link, QR code, share WA 1-klik |
| 2.3 | Preview Mode | Preview undangan sebagai tamu tertentu |
| 2.4 | Onboarding Wizard | Step-by-step buat undangan baru |
| 2.5 | Trust Signals | Counter, testimonial (editable di admin) |
| 2.6 | Site Settings Admin | Edit konten landing page dari admin |
| 2.7 | Analytics Dashboard | Statistik RSVP, link dibuka |

### Priority 3 - MEDIUM (Nice to have)

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 3.1 | Section Manager | Drag & drop urutan section |
| 3.2 | Media Manager | Upload & manage gambar |
| 3.3 | Theme Preview | Preview tema dengan device toggle |
| 3.4 | SEO Optimization | Meta tags, sitemap, structured data |
| 3.5 | Multi-device Preview | Mobile/tablet/desktop preview |

### Priority 4 - LOW (Future enhancement)

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 4.1 | Love Story Timeline | Section cerita perjalanan cinta |
| 4.2 | Photo Gallery | Multiple photos dengan masonry |
| 4.3 | Live Streaming | Embed YouTube/Zoom |
| 4.4 | Gift Registry | Wishlist hadiah |
| 4.5 | Reminder Massal | Kirim WA ke semua tamu yang belum buka |
| 4.6 | Payment Integration | Midtrans/Xendit |
| 4.7 | Order Management | Status tracking, invoice |
| 4.8 | Multi-language | English, Arabic |

---

## Implementation Roadmap

### Sprint 1: Foundation
- [x] Admin Dashboard Basic (selesai)
- [ ] Backend Refactor (Drizzle + Clean Architecture)
- [ ] Database migration

### Sprint 2: Core Features
- [ ] Theme System Refactor
- [ ] Animation System Basic
- [ ] Guest Management (Private/Public mode)

### Sprint 3: User Experience
- [ ] Import/Export Excel
- [ ] Quick Actions (copy, QR, WA)
- [ ] Preview Mode
- [ ] Onboarding Wizard

### Sprint 4: Landing Page
- [ ] Public Landing Page
- [ ] Site Settings Admin
- [ ] Theme Catalog & Preview
- [ ] Trust Signals & Testimonials

### Sprint 5: Polish
- [ ] Analytics Dashboard
- [ ] Section Manager
- [ ] Media Manager
- [ ] SEO Optimization

### Sprint 6+: Enhancement
- [ ] Additional features (Priority 4)
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] New themes

---

## Notes

- Fokus MVP: Backend Clean + Theme + Guest Management + Landing Page
- Jangan over-engineer di awal, mulai simple lalu iterate
- Prioritaskan mobile experience (90%+ user buka di HP)
- Collect feedback dari customer pertama untuk improvement
- Landing page content harus editable dari admin (tidak hardcode)

---

*Last updated: January 2025*
