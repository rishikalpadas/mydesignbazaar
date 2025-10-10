import { unlink, rmdir } from 'fs/promises'
import path from 'path'

export const deleteDesignFiles = async (designId) => {
  try {
    const designDir = path.join(process.cwd(), 'public', 'uploads', 'designs', designId)
    
    // Delete the entire design directory
    await rmdir(designDir, { recursive: true })
    
    console.log(`Deleted design files for design ID: ${designId}`)
  } catch (error) {
    console.error(`Error deleting design files for ID ${designId}:`, error)
  }
}

export const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    await unlink(fullPath)
    console.log(`Deleted file: ${filePath}`)
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error)
  }
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

export const isValidImageType = (mimetype) => {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(mimetype)
}

export const isValidRawFileType = (mimetype, filename) => {
  const rawTypes = {
    'application/pdf': 'pdf',
    'application/postscript': 'ai',
    'application/illustrator': 'ai',
    'image/svg+xml': 'svg',
    'application/x-coreldraw': 'cdr',
    'application/eps': 'eps'
  }

  if (rawTypes[mimetype]) return rawTypes[mimetype]

  // Fallback to extension check
  const extension = getFileExtension(filename)
  const validExtensions = ['pdf', 'ai', 'cdr', 'eps', 'svg']

  return validExtensions.includes(extension) ? extension : null
}