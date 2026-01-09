import { ValidationError } from '../../shared/errors'
import type { CreateWishDto, AttendanceStatus } from './wish.dto'

const VALID_ATTENDANCE: AttendanceStatus[] = ['ATTENDING', 'NOT_ATTENDING', 'MAYBE']

export class WishValidator {
  static validateCreate(data: unknown): CreateWishDto {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid request body')
    }

    const dto = data as Record<string, unknown>

    if (!dto.name || typeof dto.name !== 'string') {
      errors.push('name is required')
    } else if (dto.name.length > 100) {
      errors.push('name must be 100 characters or less')
    }

    if (!dto.message || typeof dto.message !== 'string') {
      errors.push('message is required')
    } else if (dto.message.length > 2000) {
      errors.push('message must be 2000 characters or less')
    }

    if (dto.attendance) {
      if (!VALID_ATTENDANCE.includes(dto.attendance as AttendanceStatus)) {
        errors.push('attendance must be ATTENDING, NOT_ATTENDING, or MAYBE')
      }
    }

    if (dto.guestId !== undefined && typeof dto.guestId !== 'number') {
      errors.push('guestId must be a number')
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '))
    }

    return dto as unknown as CreateWishDto
  }
}
