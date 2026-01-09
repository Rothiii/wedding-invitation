import { WishRepository } from './wish.repository'
import { WishValidator } from './wish.validator'
import { InvitationRepository } from '../invitation/invitation.repository'
import { NotFoundError } from '../../shared/errors'
import type {
  CreateWishDto,
  WishResponseDto,
  WishStatsDto,
  PaginatedWishesDto,
} from './wish.dto'
import type { Wish } from '../../infra/database/schema'

export class WishService {
  private wishRepo: WishRepository
  private invitationRepo: InvitationRepository

  constructor() {
    this.wishRepo = new WishRepository()
    this.invitationRepo = new InvitationRepository()
  }

  async getByInvitationUid(
    invitationUid: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedWishesDto> {
    const offset = (page - 1) * limit

    const [wishes, total] = await Promise.all([
      this.wishRepo.findByInvitationUid(invitationUid, limit, offset),
      this.wishRepo.countByInvitationUid(invitationUid),
    ])

    return {
      wishes: wishes.map(this.toResponseDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async create(invitationUid: string, data: unknown): Promise<WishResponseDto> {
    const validated = WishValidator.validateCreate(data)

    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    const wish = await this.wishRepo.create({
      invitationUid,
      name: validated.name,
      message: validated.message,
      attendance: validated.attendance || 'MAYBE',
      guestId: validated.guestId || null,
    })

    return this.toResponseDto(wish)
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.wishRepo.delete(id)
    if (!deleted) {
      throw new NotFoundError('Wish not found')
    }
  }

  async getStats(invitationUid: string): Promise<WishStatsDto> {
    return this.wishRepo.getStats(invitationUid)
  }

  private toResponseDto(wish: Wish): WishResponseDto {
    return {
      id: wish.id,
      invitationUid: wish.invitationUid,
      guestId: wish.guestId,
      name: wish.name,
      message: wish.message,
      attendance: wish.attendance,
      createdAt: wish.createdAt,
    }
  }
}
