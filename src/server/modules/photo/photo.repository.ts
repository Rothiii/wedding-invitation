import { eq, asc } from 'drizzle-orm'
import { db } from '../../infra/database/client'
import { photos, type Photo, type NewPhoto } from '../../infra/database/schema'

export class PhotoRepository {
  async findByInvitationUid(invitationUid: string): Promise<Photo[]> {
    return db
      .select()
      .from(photos)
      .where(eq(photos.invitationUid, invitationUid))
      .orderBy(asc(photos.orderIndex))
  }

  async create(data: NewPhoto): Promise<Photo> {
    const [photo] = await db.insert(photos).values(data).returning()
    return photo
  }

  async createMany(
    invitationUid: string,
    data: Omit<NewPhoto, 'invitationUid'>[]
  ): Promise<Photo[]> {
    if (data.length === 0) return []

    const photosToCreate = data.map((p) => ({
      ...p,
      invitationUid,
    }))

    return db.insert(photos).values(photosToCreate).returning()
  }

  async update(id: number, data: Partial<NewPhoto>): Promise<Photo | null> {
    const [photo] = await db
      .update(photos)
      .set(data)
      .where(eq(photos.id, id))
      .returning()
    return photo || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(photos).where(eq(photos.id, id)).returning()
    return result.length > 0
  }

  async deleteByInvitationUid(invitationUid: string): Promise<void> {
    await db.delete(photos).where(eq(photos.invitationUid, invitationUid))
  }

  async replaceAll(
    invitationUid: string,
    data: Omit<NewPhoto, 'invitationUid'>[]
  ): Promise<Photo[]> {
    await this.deleteByInvitationUid(invitationUid)
    if (data.length === 0) return []
    return this.createMany(invitationUid, data)
  }
}
