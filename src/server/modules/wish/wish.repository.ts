import { eq, desc, sql, and } from 'drizzle-orm'
import { db } from '../../infra/database/client'
import { wishes, type Wish, type NewWish } from '../../infra/database/schema'

export class WishRepository {
  async findById(id: number): Promise<Wish | null> {
    const result = await db
      .select()
      .from(wishes)
      .where(eq(wishes.id, id))
      .limit(1)

    return result[0] || null
  }

  async findByInvitationUid(
    invitationUid: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Wish[]> {
    return db
      .select()
      .from(wishes)
      .where(eq(wishes.invitationUid, invitationUid))
      .orderBy(desc(wishes.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async countByInvitationUid(invitationUid: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(wishes)
      .where(eq(wishes.invitationUid, invitationUid))

    return result[0]?.count || 0
  }

  async create(data: NewWish): Promise<Wish> {
    const result = await db.insert(wishes).values(data).returning()
    return result[0]
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(wishes)
      .where(eq(wishes.id, id))
      .returning({ id: wishes.id })

    return result.length > 0
  }

  async deleteByInvitationUid(invitationUid: string): Promise<void> {
    await db.delete(wishes).where(eq(wishes.invitationUid, invitationUid))
  }

  async getStats(invitationUid: string): Promise<{
    total: number
    attending: number
    notAttending: number
    maybe: number
  }> {
    const result = await db
      .select({
        attendance: wishes.attendance,
        count: sql<number>`count(*)::int`,
      })
      .from(wishes)
      .where(eq(wishes.invitationUid, invitationUid))
      .groupBy(wishes.attendance)

    const stats = {
      total: 0,
      attending: 0,
      notAttending: 0,
      maybe: 0,
    }

    for (const row of result) {
      stats.total += row.count
      if (row.attendance === 'ATTENDING') {
        stats.attending = row.count
      } else if (row.attendance === 'NOT_ATTENDING') {
        stats.notAttending = row.count
      } else if (row.attendance === 'MAYBE') {
        stats.maybe = row.count
      }
    }

    return stats
  }
}
