/**
 * Recursively converts all MongoDB ObjectId instances to strings
 * to make objects safe for passing to Client Components
 */
export function serializeObjectIds(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeObjectIds(item))
  }

  // Handle objects
  if (typeof obj === 'object') {
    const serialized = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        
        // Check if this is a MongoDB ObjectId (has toJSON method and is an object)
        if (value && typeof value === 'object' && typeof value.toJSON === 'function' && !Array.isArray(value)) {
          // Convert ObjectId to string
          serialized[key] = value.toString()
        } else if (Array.isArray(value)) {
          serialized[key] = value.map(item => serializeObjectIds(item))
        } else if (value && typeof value === 'object') {
          serialized[key] = serializeObjectIds(value)
        } else {
          serialized[key] = value
        }
      }
    }
    return serialized
  }

  return obj
}
