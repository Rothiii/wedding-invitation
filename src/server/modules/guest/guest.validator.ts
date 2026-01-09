import { ValidationError } from '../../shared/errors'
import type { CreateGuestDto, UpdateGuestDto, BulkCreateGuestDto } from './guest.dto'

export class GuestValidator {
  static validateCreate(data: unknown): CreateGuestDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    if (!dto.name || typeof dto.name !== 'string') {
      errors.push('name is required')
    } else if (dto.name.length > 255) {
      errors.push('name must be 255 characters or less')
    }

    if (dto.phone && typeof dto.phone === 'string' && dto.phone.length > 20) {
      errors.push('phone must be 20 characters or less')
    }

    if (dto.email && typeof dto.email === 'string') {
      if (dto.email.length > 255) {
        errors.push('email must be 255 characters or less')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(dto.email)) {
        errors.push('email must be a valid email address')
      }
    }

    if (dto.maxPersons !== undefined) {
      if (typeof dto.maxPersons !== 'number' || dto.maxPersons < 1) {
        errors.push('maxPersons must be a positive number')
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as unknown as CreateGuestDto
  }

  static validateUpdate(data: unknown): UpdateGuestDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    if (dto.name && typeof dto.name === 'string' && dto.name.length > 255) {
      errors.push('name must be 255 characters or less')
    }

    if (dto.phone && typeof dto.phone === 'string' && dto.phone.length > 20) {
      errors.push('phone must be 20 characters or less')
    }

    if (dto.email && typeof dto.email === 'string') {
      if (dto.email.length > 255) {
        errors.push('email must be 255 characters or less')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(dto.email)) {
        errors.push('email must be a valid email address')
      }
    }

    if (dto.maxPersons !== undefined) {
      if (typeof dto.maxPersons !== 'number' || dto.maxPersons < 1) {
        errors.push('maxPersons must be a positive number')
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as unknown as UpdateGuestDto
  }

  static validateBulkCreate(data: unknown): BulkCreateGuestDto {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    if (!Array.isArray(dto.guests)) {
      throw new ValidationError('guests must be an array')
    }

    if (dto.guests.length === 0) {
      throw new ValidationError('guests array cannot be empty')
    }

    if (dto.guests.length > 500) {
      throw new ValidationError('Maximum 500 guests per bulk import')
    }

    // Validate each guest
    dto.guests.forEach((guest, index) => {
      try {
        GuestValidator.validateCreate(guest)
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new ValidationError(`Guest at index ${index}: ${error.message}`)
        }
        throw error
      }
    })

    return dto as unknown as BulkCreateGuestDto
  }
}
