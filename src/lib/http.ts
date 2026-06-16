import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export function ok<T>(c: Context, data: T, init?: ResponseInit) {
  return c.json(data, (init?.status ?? 200) as ContentfulStatusCode)
}

export function notFound(c: Context, message = 'Not found') {
  return c.json({ error: message }, 404)
}

export function badRequest(c: Context, message: string, details?: unknown) {
  return c.json({ error: message, details }, 400)
}

export function serverError(c: Context, message = 'Internal server error') {
  return c.json({ error: message }, 500)
}
