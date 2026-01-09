import { eq, asc, and } from 'drizzle-orm'
import { db } from '../../infra/database/client'
import {
  siteSettings,
  testimonials,
  packages,
  type SiteSetting,
  type NewSiteSetting,
  type Testimonial,
  type NewTestimonial,
  type Package,
  type NewPackage,
} from '../../infra/database/schema'

export class SiteSettingsRepository {
  async get(key: string): Promise<SiteSetting | null> {
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)

    return result[0] || null
  }

  async getAll(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings)
  }

  async set(key: string, value: unknown): Promise<SiteSetting> {
    const existing = await this.get(key)

    if (existing) {
      const result = await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning()
      return result[0]
    }

    const result = await db
      .insert(siteSettings)
      .values({ key, value })
      .returning()
    return result[0]
  }

  async delete(key: string): Promise<boolean> {
    const result = await db
      .delete(siteSettings)
      .where(eq(siteSettings.key, key))
      .returning({ key: siteSettings.key })

    return result.length > 0
  }
}

export class TestimonialRepository {
  async findAll(activeOnly: boolean = false): Promise<Testimonial[]> {
    if (activeOnly) {
      return db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(asc(testimonials.orderIndex))
    }

    return db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.orderIndex))
  }

  async findById(id: number): Promise<Testimonial | null> {
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1)

    return result[0] || null
  }

  async create(data: NewTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(data).returning()
    return result[0]
  }

  async update(
    id: number,
    data: Partial<NewTestimonial>
  ): Promise<Testimonial | null> {
    const result = await db
      .update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning()

    return result[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning({ id: testimonials.id })

    return result.length > 0
  }
}

export class PackageRepository {
  async findAll(activeOnly: boolean = false): Promise<Package[]> {
    if (activeOnly) {
      return db
        .select()
        .from(packages)
        .where(eq(packages.isActive, true))
        .orderBy(asc(packages.orderIndex))
    }

    return db.select().from(packages).orderBy(asc(packages.orderIndex))
  }

  async findById(id: number): Promise<Package | null> {
    const result = await db
      .select()
      .from(packages)
      .where(eq(packages.id, id))
      .limit(1)

    return result[0] || null
  }

  async create(data: NewPackage): Promise<Package> {
    const result = await db.insert(packages).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewPackage>): Promise<Package | null> {
    const result = await db
      .update(packages)
      .set(data)
      .where(eq(packages.id, id))
      .returning()

    return result[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(packages)
      .where(eq(packages.id, id))
      .returning({ id: packages.id })

    return result.length > 0
  }
}
