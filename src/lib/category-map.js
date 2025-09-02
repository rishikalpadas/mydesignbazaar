export const slugToCategory = {
  infantwear: "Infantwear",
  kidswear: "Kidswear",
  menswear: "Menswear",
  womenswear: "Womenswear",
  typography: "Typography",
  floral: "Floral",
  "ai-generated": "AI-Generated",
}

export const categoryToSlug = Object.fromEntries(
  Object.entries(slugToCategory).map(([slug, name]) => [name.toLowerCase(), slug]),
)

export function getCategoryFromSlug(slug) {
  if (!slug) return null
  return slugToCategory[String(slug).toLowerCase()] || null
}

export function getSlugFromCategory(name) {
  if (!name) return null
  const slug = categoryToSlug[String(name).toLowerCase()]
  return slug || null
}

export function isSupportedCategorySlug(slug) {
  return Boolean(getCategoryFromSlug(slug))
}
