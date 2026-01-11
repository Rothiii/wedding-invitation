import {
  InvitationRepository,
  AgendaRepository,
  BankRepository,
} from './invitation.repository'
import { InvitationValidator } from './invitation.validator'
import { NotFoundError, ValidationError } from '../../shared/errors'
import type {
  CreateInvitationDto,
  UpdateInvitationDto,
  InvitationResponseDto,
  InvitationListResponseDto,
} from './invitation.dto'
import type { Invitation, Agenda, Bank } from '../../infra/database/schema'

export class InvitationService {
  private invitationRepo: InvitationRepository
  private agendaRepo: AgendaRepository
  private bankRepo: BankRepository

  constructor() {
    this.invitationRepo = new InvitationRepository()
    this.agendaRepo = new AgendaRepository()
    this.bankRepo = new BankRepository()
  }

  async getByUid(uid: string): Promise<InvitationResponseDto> {
    const result = await this.invitationRepo.findWithRelations(uid)

    if (!result) {
      throw new NotFoundError('Invitation not found')
    }

    return this.toResponseDto(result, result.agendaItems, result.bankItems)
  }

  // Public API returns format compatible with frontend config
  async getPublicByUid(uid: string) {
    const result = await this.invitationRepo.findWithRelations(uid)

    if (!result) {
      throw new NotFoundError('Invitation not found')
    }

    return this.toPublicResponseDto(result, result.agendaItems, result.bankItems)
  }

  async getAll(): Promise<InvitationListResponseDto[]> {
    const invitations = await this.invitationRepo.findAll()
    return invitations.map(this.toListResponseDto)
  }

  async create(data: unknown): Promise<InvitationResponseDto> {
    const validated = InvitationValidator.validateCreate(data)

    // Check if UID already exists
    const existing = await this.invitationRepo.exists(validated.uid)
    if (existing) {
      throw new ValidationError('UID already exists')
    }

    // Create invitation
    const invitation = await this.invitationRepo.create({
      uid: validated.uid,
      title: validated.title || null,
      description: validated.description || null,
      groomName: validated.groomName,
      brideName: validated.brideName,
      parentGroom: validated.parentGroom || null,
      parentBride: validated.parentBride || null,
      weddingDate: validated.weddingDate,
      time: validated.time || null,
      location: validated.location || null,
      address: validated.address || null,
      mapsUrl: validated.mapsUrl || null,
      mapsEmbed: validated.mapsEmbed || null,
      ogImage: validated.ogImage || null,
      favicon: validated.favicon || null,
      audio: validated.audio || null,
      theme: validated.theme || 'default',
      guestMode: validated.guestMode || 'public',
    })

    // Create related agenda and banks
    let agendaItems: Agenda[] = []
    let bankItems: Bank[] = []

    if (validated.agenda?.length) {
      agendaItems = await this.agendaRepo.createMany(
        validated.uid,
        validated.agenda.map((a) => ({
          invitationUid: validated.uid,
          title: a.title,
          date: a.date,
          startTime: a.startTime || null,
          endTime: a.endTime || null,
          location: a.location || null,
          address: a.address || null,
          orderIndex: a.orderIndex || 0,
        }))
      )
    }

    if (validated.banks?.length) {
      bankItems = await this.bankRepo.createMany(
        validated.uid,
        validated.banks.map((b) => ({
          invitationUid: validated.uid,
          bank: b.bank,
          accountNumber: b.accountNumber,
          accountName: b.accountName,
          orderIndex: b.orderIndex || 0,
        }))
      )
    }

    return this.toResponseDto(invitation, agendaItems, bankItems)
  }

  async update(uid: string, data: unknown): Promise<InvitationResponseDto> {
    const validated = InvitationValidator.validateUpdate(data)

    const existing = await this.invitationRepo.findByUid(uid)
    if (!existing) {
      throw new NotFoundError('Invitation not found')
    }

    // Update invitation
    const updated = await this.invitationRepo.update(uid, {
      title: validated.title,
      description: validated.description,
      groomName: validated.groomName,
      brideName: validated.brideName,
      parentGroom: validated.parentGroom,
      parentBride: validated.parentBride,
      weddingDate: validated.weddingDate,
      time: validated.time,
      location: validated.location,
      address: validated.address,
      mapsUrl: validated.mapsUrl,
      mapsEmbed: validated.mapsEmbed,
      ogImage: validated.ogImage,
      favicon: validated.favicon,
      audio: validated.audio,
      theme: validated.theme,
      guestMode: validated.guestMode,
      isActive: validated.isActive,
    })

    // Update agenda if provided
    let agendaItems: Agenda[] = []
    if (validated.agenda !== undefined) {
      agendaItems = await this.agendaRepo.replaceAll(
        uid,
        validated.agenda.map((a) => ({
          invitationUid: uid,
          title: a.title,
          date: a.date,
          startTime: a.startTime || null,
          endTime: a.endTime || null,
          location: a.location || null,
          address: a.address || null,
          orderIndex: a.orderIndex || 0,
        }))
      )
    } else {
      agendaItems = await this.agendaRepo.findByInvitationUid(uid)
    }

    // Update banks if provided
    let bankItems: Bank[] = []
    if (validated.banks !== undefined) {
      bankItems = await this.bankRepo.replaceAll(
        uid,
        validated.banks.map((b) => ({
          invitationUid: uid,
          bank: b.bank,
          accountNumber: b.accountNumber,
          accountName: b.accountName,
          orderIndex: b.orderIndex || 0,
        }))
      )
    } else {
      bankItems = await this.bankRepo.findByInvitationUid(uid)
    }

    return this.toResponseDto(updated!, agendaItems, bankItems)
  }

  async delete(uid: string): Promise<void> {
    const deleted = await this.invitationRepo.delete(uid)
    if (!deleted) {
      throw new NotFoundError('Invitation not found')
    }
  }

  private toResponseDto(
    invitation: Invitation,
    agendaItems: Agenda[],
    bankItems: Bank[]
  ): InvitationResponseDto {
    return {
      uid: invitation.uid,
      title:
        invitation.title ||
        `Pernikahan ${invitation.groomName} & ${invitation.brideName}`,
      description: invitation.description,
      groomName: invitation.groomName,
      brideName: invitation.brideName,
      parentGroom: invitation.parentGroom,
      parentBride: invitation.parentBride,
      weddingDate: invitation.weddingDate,
      time: invitation.time,
      location: invitation.location,
      address: invitation.address,
      mapsUrl: invitation.mapsUrl,
      mapsEmbed: invitation.mapsEmbed,
      ogImage: invitation.ogImage,
      favicon: invitation.favicon,
      audio: invitation.audio,
      theme: invitation.theme,
      guestMode: invitation.guestMode,
      isActive: invitation.isActive,
      createdAt: invitation.createdAt,
      updatedAt: invitation.updatedAt,
      agenda: agendaItems.map((a) => ({
        id: a.id,
        title: a.title,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        location: a.location,
        address: a.address,
        orderIndex: a.orderIndex || 0,
      })),
      banks: bankItems.map((b) => ({
        id: b.id,
        bank: b.bank,
        accountNumber: b.accountNumber,
        accountName: b.accountName,
        orderIndex: b.orderIndex || 0,
      })),
    }
  }

  private toListResponseDto(invitation: Invitation): InvitationListResponseDto {
    return {
      uid: invitation.uid,
      title:
        invitation.title ||
        `Pernikahan ${invitation.groomName} & ${invitation.brideName}`,
      groomName: invitation.groomName,
      brideName: invitation.brideName,
      weddingDate: invitation.weddingDate,
      theme: invitation.theme,
      isActive: invitation.isActive,
      createdAt: invitation.createdAt,
    }
  }

  // Format compatible with frontend config.js structure
  private toPublicResponseDto(
    invitation: Invitation,
    agendaItems: Agenda[],
    bankItems: Bank[]
  ) {
    return {
      title:
        invitation.title ||
        `Pernikahan ${invitation.groomName} & ${invitation.brideName}`,
      description: invitation.description,
      groomName: invitation.groomName,
      brideName: invitation.brideName,
      parentGroom: invitation.parentGroom,
      parentBride: invitation.parentBride,
      date: invitation.weddingDate, // Frontend expects 'date' not 'weddingDate'
      time: invitation.time,
      location: invitation.location,
      address: invitation.address,
      maps_url: invitation.mapsUrl, // Frontend expects snake_case
      maps_embed: invitation.mapsEmbed, // Frontend expects snake_case
      ogImage: invitation.ogImage,
      favicon: invitation.favicon,
      audio: invitation.audio,
      theme: invitation.theme,
      guestMode: invitation.guestMode,
      agenda: agendaItems.map((a) => ({
        title: a.title,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        location: a.location,
        address: a.address,
      })),
      banks: bankItems.map((b) => ({
        bank: b.bank,
        accountNumber: b.accountNumber,
        accountName: b.accountName,
      })),
    }
  }
}
