import { ValidationError } from '../../shared/errors'
import type { CreateInvitationDto, UpdateInvitationDto } from './invitation.dto'

export class InvitationValidator {
  static validateCreate(data: unknown): CreateInvitationDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    // Required fields
    if (!dto.uid || typeof dto.uid !== 'string') {
      errors.push('uid is required')
    } else if (!/^[a-z0-9-]+$/.test(dto.uid)) {
      errors.push('uid must be lowercase alphanumeric with dashes only')
    } else if (dto.uid.length > 50) {
      errors.push('uid must be 50 characters or less')
    }

    if (!dto.groomName || typeof dto.groomName !== 'string') {
      errors.push('groomName is required')
    } else if (dto.groomName.length > 100) {
      errors.push('groomName must be 100 characters or less')
    }

    if (!dto.brideName || typeof dto.brideName !== 'string') {
      errors.push('brideName is required')
    } else if (dto.brideName.length > 100) {
      errors.push('brideName must be 100 characters or less')
    }

    if (!dto.weddingDate || typeof dto.weddingDate !== 'string') {
      errors.push('weddingDate is required')
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(dto.weddingDate)) {
        errors.push('weddingDate must be in YYYY-MM-DD format')
      }
    }

    // Optional field validation
    if (dto.guestMode && !['public', 'private'].includes(dto.guestMode as string)) {
      errors.push('guestMode must be either "public" or "private"')
    }

    if (dto.agenda && !Array.isArray(dto.agenda)) {
      errors.push('agenda must be an array')
    }

    if (dto.banks && !Array.isArray(dto.banks)) {
      errors.push('banks must be an array')
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as unknown as CreateInvitationDto
  }

  static validateUpdate(data: unknown): UpdateInvitationDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    // Optional field validation
    if (dto.groomName && typeof dto.groomName === 'string' && dto.groomName.length > 100) {
      errors.push('groomName must be 100 characters or less')
    }

    if (dto.brideName && typeof dto.brideName === 'string' && dto.brideName.length > 100) {
      errors.push('brideName must be 100 characters or less')
    }

    if (dto.weddingDate && typeof dto.weddingDate === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(dto.weddingDate)) {
        errors.push('weddingDate must be in YYYY-MM-DD format')
      }
    }

    if (dto.guestMode && !['public', 'private'].includes(dto.guestMode as string)) {
      errors.push('guestMode must be either "public" or "private"')
    }

    if (dto.agenda && !Array.isArray(dto.agenda)) {
      errors.push('agenda must be an array')
    }

    if (dto.banks && !Array.isArray(dto.banks)) {
      errors.push('banks must be an array')
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as unknown as UpdateInvitationDto
  }
}
