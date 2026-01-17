import { PhotoRepository } from './photo.repository'
import { InvitationRepository } from '../invitation/invitation.repository'
import { NotFoundError, ValidationError } from '../../shared/errors'
import type { Photo, NewPhoto } from '../../infra/database/schema'

export interface PhotoDto {
  src: string
  alt?: string
  caption?: string
  section?: string
  orderIndex?: number
}

export interface PhotoResponseDto {
  id: number
  src: string
  alt: string | null
  caption: string | null
  section: string | null
  orderIndex: number
}

export class PhotoService {
  private photoRepo: PhotoRepository
  private invitationRepo: InvitationRepository

  constructor() {
    this.photoRepo = new PhotoRepository()
    this.invitationRepo = new InvitationRepository()
  }

  async getByInvitationUid(invitationUid: string, section?: string): Promise<PhotoResponseDto[]> {
    const photos = await this.photoRepo.findByInvitationUid(invitationUid, section)
    return photos.map(this.toResponseDto)
  }

  async create(invitationUid: string, data: PhotoDto): Promise<PhotoResponseDto> {
    // Validate
    if (!data.src) {
      throw new ValidationError('Photo src is required')
    }

    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    const photo = await this.photoRepo.create({
      invitationUid,
      src: data.src,
      alt: data.alt || null,
      caption: data.caption || null,
      section: data.section || 'gallery',
      orderIndex: data.orderIndex || 0,
    })

    return this.toResponseDto(photo)
  }

  async createMany(
    invitationUid: string,
    data: PhotoDto[],
    section?: string
  ): Promise<PhotoResponseDto[]> {
    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    const photos = await this.photoRepo.createMany(
      invitationUid,
      data.map((p, index) => ({
        src: p.src,
        alt: p.alt || null,
        caption: p.caption || null,
        section: p.section || section || 'gallery',
        orderIndex: p.orderIndex ?? index,
      }))
    )

    return photos.map(this.toResponseDto)
  }

  async update(id: number, data: Partial<PhotoDto>): Promise<PhotoResponseDto> {
    const photo = await this.photoRepo.update(id, {
      src: data.src,
      alt: data.alt,
      caption: data.caption,
      section: data.section,
      orderIndex: data.orderIndex,
    })

    if (!photo) {
      throw new NotFoundError('Photo not found')
    }

    return this.toResponseDto(photo)
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.photoRepo.delete(id)
    if (!deleted) {
      throw new NotFoundError('Photo not found')
    }
  }

  async replaceAll(
    invitationUid: string,
    data: PhotoDto[],
    section?: string
  ): Promise<PhotoResponseDto[]> {
    // Check if invitation exists
    const invitation = await this.invitationRepo.findByUid(invitationUid)
    if (!invitation) {
      throw new NotFoundError('Invitation not found')
    }

    const photos = await this.photoRepo.replaceAll(
      invitationUid,
      data.map((p, index) => ({
        src: p.src,
        alt: p.alt || null,
        caption: p.caption || null,
        section: p.section || section || 'gallery',
        orderIndex: p.orderIndex ?? index,
      })),
      section
    )

    return photos.map(this.toResponseDto)
  }

  private toResponseDto(photo: Photo): PhotoResponseDto {
    return {
      id: photo.id,
      src: photo.src,
      alt: photo.alt,
      caption: photo.caption,
      section: photo.section,
      orderIndex: photo.orderIndex || 0,
    }
  }
}
