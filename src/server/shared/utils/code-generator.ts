// Characters that avoid confusion (no 0/O, 1/I/L)
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateGuestCode(length: number = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length))
  }
  return code
}

export function generateUniqueCode(existingCodes: Set<string>, length: number = 6): string {
  let code: string
  let attempts = 0
  const maxAttempts = 100

  do {
    code = generateGuestCode(length)
    attempts++
  } while (existingCodes.has(code) && attempts < maxAttempts)

  if (attempts >= maxAttempts) {
    // Increase length if too many collisions
    return generateUniqueCode(existingCodes, length + 1)
  }

  return code
}
