import type { Context, Next } from 'hono'
import {
  BaseError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from '../../../shared/errors'

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)

    if (error instanceof NotFoundError) {
      return c.json({ success: false, error: error.message }, 404)
    }

    if (error instanceof ValidationError) {
      return c.json({ success: false, error: error.message }, 400)
    }

    if (error instanceof UnauthorizedError) {
      return c.json({ success: false, error: error.message }, 401)
    }

    if (error instanceof BaseError) {
      return c.json({ success: false, error: error.message }, error.statusCode)
    }

    // Handle Drizzle/Postgres errors
    if (error instanceof Error) {
      // Unique constraint violation
      if (error.message.includes('unique constraint')) {
        return c.json(
          { success: false, error: 'Resource already exists' },
          409
        )
      }

      // Foreign key violation
      if (error.message.includes('foreign key constraint')) {
        return c.json(
          { success: false, error: 'Referenced resource not found' },
          400
        )
      }
    }

    // Unknown error
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
}
