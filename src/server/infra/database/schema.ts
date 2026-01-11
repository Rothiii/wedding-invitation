import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  date,
  time,
  index,
} from 'drizzle-orm/pg-core'

// Types
export interface AudioConfig {
  src: string
  title: string
  autoplay: boolean
  loop: boolean
}

// Invitations table
export const invitations = pgTable(
  'invitations',
  {
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
  },
  (table) => [index('idx_invitations_uid').on(table.uid)]
)

// Guests table (for private mode)
export const guests = pgTable(
  'guests',
  {
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
  },
  (table) => [
    index('idx_guests_invitation_uid').on(table.invitationUid),
    index('idx_guests_code').on(table.code),
  ]
)

// Wishes table
export const wishes = pgTable(
  'wishes',
  {
    id: serial('id').primaryKey(),
    invitationUid: varchar('invitation_uid', { length: 50 })
      .notNull()
      .references(() => invitations.uid, { onDelete: 'cascade' }),
    guestId: integer('guest_id').references(() => guests.id),

    name: varchar('name', { length: 100 }).notNull(),
    message: text('message').notNull(),
    attendance: varchar('attendance', { length: 20 }).default('MAYBE'),

    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('idx_wishes_invitation_uid').on(table.invitationUid),
    index('idx_wishes_created_at').on(table.createdAt),
  ]
)

// Agenda table
export const agenda = pgTable(
  'agenda',
  {
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
  },
  (table) => [
    index('idx_agenda_invitation_uid').on(table.invitationUid),
    index('idx_agenda_order').on(table.invitationUid, table.orderIndex),
  ]
)

// Banks table
export const banks = pgTable(
  'banks',
  {
    id: serial('id').primaryKey(),
    invitationUid: varchar('invitation_uid', { length: 50 })
      .notNull()
      .references(() => invitations.uid, { onDelete: 'cascade' }),

    bank: varchar('bank', { length: 255 }).notNull(),
    accountNumber: varchar('account_number', { length: 100 }).notNull(),
    accountName: varchar('account_name', { length: 255 }).notNull(),
    orderIndex: integer('order_index').default(0),

    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('idx_banks_invitation_uid').on(table.invitationUid),
    index('idx_banks_order').on(table.invitationUid, table.orderIndex),
  ]
)

// Site settings table (for landing page content)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: jsonb('value'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Testimonials table
export const testimonials = pgTable(
  'testimonials',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    photo: varchar('photo', { length: 500 }),
    message: text('message').notNull(),
    rating: integer('rating').default(5),
    isActive: boolean('is_active').default(true),
    orderIndex: integer('order_index').default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('idx_testimonials_order').on(table.orderIndex)]
)

// Packages table
export const packages = pgTable(
  'packages',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    price: integer('price').notNull(),
    features: jsonb('features').$type<string[]>(),
    isBestSeller: boolean('is_best_seller').default(false),
    isActive: boolean('is_active').default(true),
    orderIndex: integer('order_index').default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('idx_packages_order').on(table.orderIndex)]
)

// Photos table (for gallery)
export const photos = pgTable(
  'photos',
  {
    id: serial('id').primaryKey(),
    invitationUid: varchar('invitation_uid', { length: 50 })
      .notNull()
      .references(() => invitations.uid, { onDelete: 'cascade' }),

    src: varchar('src', { length: 500 }).notNull(),
    alt: varchar('alt', { length: 255 }),
    caption: varchar('caption', { length: 500 }),
    orderIndex: integer('order_index').default(0),

    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('idx_photos_invitation_uid').on(table.invitationUid),
    index('idx_photos_order').on(table.invitationUid, table.orderIndex),
  ]
)

// Type exports
export type Invitation = typeof invitations.$inferSelect
export type NewInvitation = typeof invitations.$inferInsert
export type Guest = typeof guests.$inferSelect
export type NewGuest = typeof guests.$inferInsert
export type Wish = typeof wishes.$inferSelect
export type NewWish = typeof wishes.$inferInsert
export type Agenda = typeof agenda.$inferSelect
export type NewAgenda = typeof agenda.$inferInsert
export type Bank = typeof banks.$inferSelect
export type NewBank = typeof banks.$inferInsert
export type SiteSetting = typeof siteSettings.$inferSelect
export type NewSiteSetting = typeof siteSettings.$inferInsert
export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert
export type Package = typeof packages.$inferSelect
export type NewPackage = typeof packages.$inferInsert
export type Photo = typeof photos.$inferSelect
export type NewPhoto = typeof photos.$inferInsert
