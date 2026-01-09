export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .substring(0, 100) // Limit length
}

export function generateUniqueSlug(
  text: string,
  existingSlugs: Set<string>
): string {
  const baseSlug = generateSlug(text)
  let slug = baseSlug
  let counter = 1

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
