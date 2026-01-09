import { GuestRepository } from './guest.repository'
import { GuestValidator } from './guest.validator'
import { InvitationRepository } from '../invitation/invitation.repository'
import { NotFoundError, ValidationError } from '../../shared/errors'
import { generateGuestCode, generateUniqueCode } from '../../shared/utils/code-generator'
import { generateSlug } from '../../shared/utils/slug'
import type {
  CreateGuestDto,
  UpdateGuestDto,
  GuestResponseDto,
  GuestWithLinkDto,
  BulkCreateGuestDto,
  GuestStatsDto,
} from './guest.dto'
import type { Guest } from '../../infra/database/schema'

export class GuestService {
  private guestRepo: GuestRepository
  private invitationRepo: InvitationRepository

  constructor() {
    this.guestRepo = new GuestRepository()
    this.invitationRepo = new InvitationRepository()
  }

  async getByInvitationUid(invitationUid: string): Promise<GuestResponseDto[]> {
    const guests = await this.guestRepo.findByInvitationUid(invitationUid)
    return guests.map(this.toResponseDto)
  }

  async getById(id: number): Promise<GuestResponseDto> {
    const guest = await this.guestRepo.findById(id)
    if (!guest) {
      throw new NotFoundError('Guest not found')
    }
    return this.toResponseDto(guest)
  }

  async getByCode(code: string): Promise<GuestResponseDto> {
    const guest = await this.guestRepo.findByCode(code)
    if (!guest) {
      throw new NotFoundError('Guest not found')
    }
    return this.toResponseDto(guest)
  }

  async create(invitationUid: string, data: unknown): Promise<GuestResponseDto> {
    const validated = GuestValidator.validateCreate(data)

    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    // Generate unique code
    const existingCodes = await this.guestRepo.getAllCodes(invitationUid)
    const code = generateUniqueCode(existingCodes)

    // Generate slug from name
    const slug = generateSlug(validated.name)

    const guest = await this.guestRepo.create({
      invitationUid,
      name: validated.name,
      slug,
      code,
      phone: validated.phone || null,
      email: validated.email || null,
      maxPersons: validated.maxPersons || 2,
    })

    return this.toResponseDto(guest)
  }

  async bulkCreate(
    invitationUid: string,
    data: unknown
  ): Promise<GuestResponseDto[]> {
    const validated = GuestValidator.validateBulkCreate(data)

    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    // Get existing codes to avoid duplicates
    const existingCodes = await this.guestRepo.getAllCodes(invitationUid)

    // Prepare guests with unique codes
    const guestsToCreate = validated.guests.map((g) => {
      const code = generateUniqueCode(existingCodes)
      existingCodes.add(code) // Track new codes to avoid duplicates in batch
      const slug = generateSlug(g.name)

      return {
        invitationUid,
        name: g.name,
        slug,
        code,
        phone: g.phone || null,
        email: g.email || null,
        maxPersons: g.maxPersons || 2,
      }
    })

    const guests = await this.guestRepo.createMany(guestsToCreate)
    return guests.map(this.toResponseDto)
  }

  async update(id: number, data: unknown): Promise<GuestResponseDto> {
    const validated = GuestValidator.validateUpdate(data)

    const existing = await this.guestRepo.findById(id)
    if (!existing) {
      throw new NotFoundError('Guest not found')
    }

    // Update slug if name changed
    let slug = existing.slug
    if (validated.name && validated.name !== existing.name) {
      slug = generateSlug(validated.name)
    }

    const updated = await this.guestRepo.update(id, {
      name: validated.name,
      slug,
      phone: validated.phone,
      email: validated.email,
      maxPersons: validated.maxPersons,
      isActive: validated.isActive,
    })

    return this.toResponseDto(updated!)
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.guestRepo.delete(id)
    if (!deleted) {
      throw new NotFoundError('Guest not found')
    }
  }

  async recordLinkOpened(code: string): Promise<GuestResponseDto> {
    const guest = await this.guestRepo.findByCode(code)
    if (!guest) {
      throw new NotFoundError('Guest not found')
    }

    const updated = await this.guestRepo.recordLinkOpened(guest.id)
    return this.toResponseDto(updated!)
  }

  async getStats(invitationUid: string): Promise<GuestStatsDto> {
    return this.guestRepo.getStats(invitationUid)
  }

  async getGuestsWithLinks(
    invitationUid: string,
    baseUrl: string
  ): Promise<GuestWithLinkDto[]> {
    const guests = await this.guestRepo.findByInvitationUid(invitationUid)

    return guests.map((guest) => ({
      ...this.toResponseDto(guest),
      link: `${baseUrl}/${invitationUid}?g=${guest.code}`,
    }))
  }

  private toResponseDto(guest: Guest): GuestResponseDto {
    return {
      id: guest.id,
      invitationUid: guest.invitationUid,
      name: guest.name,
      slug: guest.slug,
      code: guest.code,
      phone: guest.phone,
      email: guest.email,
      maxPersons: guest.maxPersons,
      linkOpenedAt: guest.linkOpenedAt,
      linkOpenedCount: guest.linkOpenedCount,
      isActive: guest.isActive,
      createdAt: guest.createdAt,
    }
  }
}
