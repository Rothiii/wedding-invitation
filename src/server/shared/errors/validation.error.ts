import { BaseError } from './base.error'

export class ValidationError extends BaseError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
  }
}
