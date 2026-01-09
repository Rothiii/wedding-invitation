import { eq, desc } from 'drizzle-orm'
import { db } from '../../infra/database/client'
import {
  invitations,
  agenda,
  banks,
  type Invitation,
  type NewInvitation,
  type Agenda,
  type NewAgenda,
  type Bank,
  type NewBank,
} from '../../infra/database/schema'

export class InvitationRepository {
  async findByUid(uid: string): Promise<Invitation | null> {
    const result = await db
      .select()
      .from(invitations)
      .where(eq(invitations.uid, uid))
      .limit(1)

    return result[0] || null
  }

  async findAll(): Promise<Invitation[]> {
    return db.select().from(invitations).orderBy(desc(invitations.createdAt))
  }

  async create(data: NewInvitation): Promise<Invitation> {
    const result = await db.insert(invitations).values(data).returning()
    return result[0]
  }

  async update(uid: string, data: Partial<NewInvitation>): Promise<Invitation | null> {
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

  async findWithRelations(uid: string): Promise<
    | (Invitation & {
        agendaItems: Agenda[]
        bankItems: Bank[]
      })
    | null
  > {
    const invitation = await this.findByUid(uid)
    if (!invitation) return null

    const [agendaItems, bankItems] = await Promise.all([
      db
        .select()
        .from(agenda)
        .where(eq(agenda.invitationUid, uid))
        .orderBy(agenda.orderIndex),
      db
        .select()
        .from(banks)
        .where(eq(banks.invitationUid, uid))
        .orderBy(banks.orderIndex),
    ])

    return {
      ...invitation,
      agendaItems,
      bankItems,
    }
  }

  async exists(uid: string): Promise<boolean> {
    const result = await db
      .select({ uid: invitations.uid })
      .from(invitations)
      .where(eq(invitations.uid, uid))
      .limit(1)

    return result.length > 0
  }
}

export class AgendaRepository {
  async findByInvitationUid(uid: string): Promise<Agenda[]> {
    return db
      .select()
      .from(agenda)
      .where(eq(agenda.invitationUid, uid))
      .orderBy(agenda.orderIndex)
  }

  async create(data: NewAgenda): Promise<Agenda> {
    const result = await db.insert(agenda).values(data).returning()
    return result[0]
  }

  async createMany(uid: string, items: NewAgenda[]): Promise<Agenda[]> {
    if (items.length === 0) return []

    const dataWithUid = items.map((item, index) => ({
      ...item,
      invitationUid: uid,
      orderIndex: item.orderIndex ?? index,
    }))

    return db.insert(agenda).values(dataWithUid).returning()
  }

  async deleteByInvitationUid(uid: string): Promise<void> {
    await db.delete(agenda).where(eq(agenda.invitationUid, uid))
  }

  async replaceAll(uid: string, items: NewAgenda[]): Promise<Agenda[]> {
    await this.deleteByInvitationUid(uid)
    return this.createMany(uid, items)
  }
}

export class BankRepository {
  async findByInvitationUid(uid: string): Promise<Bank[]> {
    return db
      .select()
      .from(banks)
      .where(eq(banks.invitationUid, uid))
      .orderBy(banks.orderIndex)
  }

  async create(data: NewBank): Promise<Bank> {
    const result = await db.insert(banks).values(data).returning()
    return result[0]
  }

  async createMany(uid: string, items: NewBank[]): Promise<Bank[]> {
    if (items.length === 0) return []

    const dataWithUid = items.map((item, index) => ({
      ...item,
      invitationUid: uid,
      orderIndex: item.orderIndex ?? index,
    }))

    return db.insert(banks).values(dataWithUid).returning()
  }

  async deleteByInvitationUid(uid: string): Promise<void> {
    await db.delete(banks).where(eq(banks.invitationUid, uid))
  }

  async replaceAll(uid: string, items: NewBank[]): Promise<Bank[]> {
    await this.deleteByInvitationUid(uid)
    return this.createMany(uid, items)
  }
}
