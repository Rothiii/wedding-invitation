import { eq, desc, and, isNull, isNotNull, sql } from 'drizzle-orm'
import { db } from '../../infra/database/client'
import { guests, type Guest, type NewGuest } from '../../infra/database/schema'

export class GuestRepository {
  async findById(id: number): Promise<Guest | null> {
    const result = await db
      .select()
      .from(guests)
      .where(eq(guests.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByCode(code: string): Promise<Guest | null> {
    const result = await db
      .select()
      .from(guests)
      .where(eq(guests.code, code))
      .limit(1)

    return result[0] || null
  }

  async findByInvitationUid(invitationUid: string): Promise<Guest[]> {
    return db
      .select()
      .from(guests)
      .where(eq(guests.invitationUid, invitationUid))
      .orderBy(desc(guests.createdAt))
  }

  async findActiveByInvitationUid(invitationUid: string): Promise<Guest[]> {
    return db
      .select()
      .from(guests)
      .where(
        and(
          eq(guests.invitationUid, invitationUid),
          eq(guests.isActive, true)
        )
      )
      .orderBy(desc(guests.createdAt))
  }

  async create(data: NewGuest): Promise<Guest> {
    const result = await db.insert(guests).values(data).returning()
    return result[0]
  }

  async createMany(items: NewGuest[]): Promise<Guest[]> {
    if (items.length === 0) return []
    return db.insert(guests).values(items).returning()
  }

  async update(id: number, data: Partial<NewGuest>): Promise<Guest | null> {
    const result = await db
      .update(guests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(guests.id, id))
      .returning()

    return result[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(guests)
      .where(eq(guests.id, id))
      .returning({ id: guests.id })

    return result.length > 0
  }

  async deleteByInvitationUid(invitationUid: string): Promise<void> {
    await db.delete(guests).where(eq(guests.invitationUid, invitationUid))
  }

  async recordLinkOpened(id: number): Promise<Guest | null> {
    const result = await db
      .update(guests)
      .set({
        linkOpenedAt: new Date(),
        linkOpenedCount: sql`COALESCE(${guests.linkOpenedCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(guests.id, id))
      .returning()

    return result[0] || null
  }

  async getStats(invitationUid: string): Promise<{
    total: number
    opened: number
    notOpened: number
  }> {
    const [totalResult, openedResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(guests)
        .where(eq(guests.invitationUid, invitationUid)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(guests)
        .where(
          and(
            eq(guests.invitationUid, invitationUid),
            isNotNull(guests.linkOpenedAt)
          )
        ),
    ])

    const total = totalResult[0]?.count || 0
    const opened = openedResult[0]?.count || 0

    return {
      total,
      opened,
      notOpened: total - opened,
    }
  }

  async getAllCodes(invitationUid: string): Promise<Set<string>> {
    const result = await db
      .select({ code: guests.code })
      .from(guests)
      .where(
        and(
          eq(guests.invitationUid, invitationUid),
          isNotNull(guests.code)
        )
      )

    return new Set(result.map((r) => r.code!).filter(Boolean))
  }

  async codeExists(code: string): Promise<boolean> {
    const result = await db
      .select({ code: guests.code })
      .from(guests)
      .where(eq(guests.code, code))
      .limit(1)

    return result.length > 0
  }
}
