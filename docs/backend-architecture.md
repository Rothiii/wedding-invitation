# Backend Architecture

Dokumentasi arsitektur backend Sakeenah Wedding Platform menggunakan Clean Architecture dengan Drizzle ORM.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Hono | API Framework |
| Drizzle ORM | Database ORM |
| PostgreSQL | Database |
| Cloudflare Workers | Deployment |
| Cloudflare R2 | File Storage |

## Struktur Folder

```
src/server/
├── infra/                          # Infrastruktur (framework-aware)
│   ├── http/
│   │   ├── server.ts               # Hono server setup
│   │   ├── routes.ts               # Route definitions
│   │   └── middlewares/
│   │       ├── auth.middleware.ts
│   │       ├── error.middleware.ts
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
│   │   ├── invitation.entity.ts
│   │   ├── invitation.dto.ts
│   │   ├── invitation.validator.ts
│   │   ├── invitation.repository.ts
│   │   ├── invitation.service.ts
│   │   └── invitation.controller.ts
│   │
│   ├── guest/
│   ├── wish/
│   ├── auth/
│   ├── theme/
│   └── site/
│
├── shared/                         # Shared utilities
│   ├── errors/
│   ├── types/
│   └── utils/
│
└── index.ts                        # Entry point
```

## Database Schema

### Invitations Table

```typescript
export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 50 }).unique().notNull(),

  // Couple Info
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

  // Settings
  theme: varchar('theme', { length: 50 }).default('default'),
  guestMode: varchar('guest_mode', { length: 20 }).default('public'),
  isActive: boolean('is_active').default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### Guests Table

```typescript
export const guests = pgTable('guests', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 })
    .notNull()
    .references(() => invitations.uid, { onDelete: 'cascade' }),

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
```

### Wishes Table

```typescript
export const wishes = pgTable('wishes', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 })
    .notNull()
    .references(() => invitations.uid, { onDelete: 'cascade' }),
  guestId: integer('guest_id').references(() => guests.id),

  name: varchar('name', { length: 100 }).notNull(),
  message: text('message').notNull(),
  attendance: varchar('attendance', { length: 20 }).default('MAYBE'),

  createdAt: timestamp('created_at').defaultNow(),
})
```

### Agenda Table

```typescript
export const agenda = pgTable('agenda', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 })
    .notNull()
    .references(() => invitations.uid, { onDelete: 'cascade' }),

  title: varchar('title', { length: 255 }).notNull(),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  location: varchar('location', { length: 500 }),
  address: text('address'),
  orderIndex: integer('order_index').default(0),

  createdAt: timestamp('created_at').defaultNow(),
})
```

### Banks Table

```typescript
export const banks = pgTable('banks', {
  id: serial('id').primaryKey(),
  invitationUid: varchar('invitation_uid', { length: 50 })
    .notNull()
    .references(() => invitations.uid, { onDelete: 'cascade' }),

  bank: varchar('bank', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 100 }).notNull(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
  orderIndex: integer('order_index').default(0),

  createdAt: timestamp('created_at').defaultNow(),
})
```

## Clean Architecture Layers

### 1. Entity (Domain Model)

```typescript
// src/server/modules/invitation/invitation.entity.ts
export interface InvitationEntity {
  id: number
  uid: string
  title: string | null
  groomName: string
  brideName: string
  weddingDate: Date
  theme: string
  guestMode: 'public' | 'private'
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations (optional)
  agenda?: AgendaEntity[]
  banks?: BankEntity[]
}
```

### 2. DTO (Data Transfer Object)

```typescript
// src/server/modules/invitation/invitation.dto.ts
export interface CreateInvitationDto {
  uid: string
  groomName: string
  brideName: string
  weddingDate: string
  title?: string
  description?: string
  theme?: string
  guestMode?: 'public' | 'private'
  agenda?: CreateAgendaDto[]
  banks?: CreateBankDto[]
}

export interface UpdateInvitationDto {
  title?: string
  groomName?: string
  brideName?: string
  // ... partial fields
}

export interface InvitationResponseDto {
  uid: string
  title: string
  groomName: string
  brideName: string
  // ... public-safe fields
}
```

### 3. Validator

```typescript
// src/server/modules/invitation/invitation.validator.ts
export class InvitationValidator {
  static validateCreate(data: unknown): CreateInvitationDto {
    const errors: string[] = []
    const dto = data as Record<string, unknown>

    if (!dto.uid || typeof dto.uid !== 'string') {
      errors.push('uid is required')
    } else if (!/^[a-z0-9-]+$/.test(dto.uid)) {
      errors.push('uid must be lowercase alphanumeric with dashes')
    }

    if (!dto.groomName) errors.push('groomName is required')
    if (!dto.brideName) errors.push('brideName is required')
    if (!dto.weddingDate) errors.push('weddingDate is required')

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as CreateInvitationDto
  }
}
```

### 4. Repository (Database Layer)

```typescript
// src/server/modules/invitation/invitation.repository.ts
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
    const result = await db.insert(invitations).values(data).returning()
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
}
```

### 5. Service (Business Logic)

```typescript
// src/server/modules/invitation/invitation.service.ts
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
    const validated = InvitationValidator.validateCreate(data)

    const existing = await this.invitationRepo.findByUid(validated.uid)
    if (existing) {
      throw new ValidationError('UID already exists')
    }

    const invitation = await this.invitationRepo.create({
      uid: validated.uid,
      groomName: validated.groomName,
      brideName: validated.brideName,
      weddingDate: new Date(validated.weddingDate),
      // ...
    })

    return this.toResponseDto(invitation)
  }

  private toResponseDto(entity: InvitationEntity): InvitationResponseDto {
    return {
      uid: entity.uid,
      title: entity.title || `Pernikahan ${entity.groomName} & ${entity.brideName}`,
      groomName: entity.groomName,
      brideName: entity.brideName,
      // ...
    }
  }
}
```

### 6. Controller (HTTP Layer)

```typescript
// src/server/modules/invitation/invitation.controller.ts
export function createInvitationController(service: InvitationService) {
  const router = new Hono()

  router.get('/:uid', async (c) => {
    const { uid } = c.req.param()
    const invitation = await service.getByUid(uid)
    return c.json({ success: true, data: invitation })
  })

  router.post('/', async (c) => {
    const body = await c.req.json()
    const invitation = await service.create(body)
    return c.json({ success: true, data: invitation }, 201)
  })

  router.put('/:uid', async (c) => {
    const { uid } = c.req.param()
    const body = await c.req.json()
    const invitation = await service.update(uid, body)
    return c.json({ success: true, data: invitation })
  })

  router.delete('/:uid', async (c) => {
    const { uid } = c.req.param()
    await service.delete(uid)
    return c.json({ success: true, message: 'Invitation deleted' })
  })

  return router
}
```

## Error Handling

```typescript
// src/server/shared/errors/base.error.ts
export class BaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

// src/server/shared/errors/not-found.error.ts
export class NotFoundError extends BaseError {}

// src/server/shared/errors/validation.error.ts
export class ValidationError extends BaseError {}

// src/server/shared/errors/unauthorized.error.ts
export class UnauthorizedError extends BaseError {}
```

### Error Middleware

```typescript
// src/server/infra/http/middlewares/error.middleware.ts
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

    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
}
```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invitation/:uid` | Get invitation by UID |
| GET | `/api/:uid/wishes` | Get wishes for invitation |
| POST | `/api/:uid/wishes` | Create new wish |
| GET | `/api/themes` | Get available themes |

### Admin Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/verify` | Verify token |
| GET | `/api/admin/invitations` | List all invitations |
| POST | `/api/admin/invitations` | Create invitation |
| GET | `/api/admin/invitations/:uid` | Get invitation detail |
| PUT | `/api/admin/invitations/:uid` | Update invitation |
| DELETE | `/api/admin/invitations/:uid` | Delete invitation |
| GET | `/api/admin/guests/:uid` | Get guests for invitation |
| POST | `/api/admin/guests/:uid` | Add guest |
| PUT | `/api/admin/guests/:id` | Update guest |
| DELETE | `/api/admin/guests/:id` | Delete guest |

## Dependency Flow Diagram

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
│   - Throw domain errors                                     │
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

## Guest Link System

### Mode 1: Public (Open Links)

```
Format: https://sakeenah.id/{invitation-uid}?to={guest-name}
Example: https://sakeenah.id/ahmad-fatimah-2025?to=Budi Santoso

Behavior:
- Nama tamu langsung di URL (readable)
- Siapa saja bisa ubah nama di URL
- Tidak ada validasi server
- Cocok untuk disebar di sosial media
```

### Mode 2: Private (Secure Guest Links)

```
Format: https://sakeenah.id/{invitation-uid}?g={guest-code}
Example: https://sakeenah.id/ahmad-fatimah-2025?g=XK7M2P

Behavior:
- Kode unik per tamu (6-8 karakter)
- Validasi kode di server
- Track siapa yang buka, berapa kali
- Lebih eksklusif, cocok untuk acara private
```

### Guest Code Generator

```javascript
// Karakter yang digunakan (hindari mirip: 0/O, 1/I/L)
const charset = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

const codeFormats = {
  short: 6,     // XK7M2P
  medium: 8,    // XK7M2P9Q
  long: 10      // XK7M2P9Q4R
}
```
