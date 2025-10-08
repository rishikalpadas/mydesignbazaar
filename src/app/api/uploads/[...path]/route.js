import { NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import path from 'path'

export async function GET(request, { params }) {
  try {
    const { path: pathArray } = await params;
    const filePath = pathArray.join('/')
    let absolutePath = path.join(process.cwd(), 'public', 'uploads', filePath)

    // Security check - ensure path is within uploads directory
    const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads')
    let resolvedPath = path.resolve(absolutePath)

    if (!resolvedPath.startsWith(publicUploadsPath)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Check if this is a preview image request - if so, try to serve watermarked version
    const isPreviewImage = filePath.includes('/preview/') &&
                          !filePath.includes('/preview/watermarked/') &&
                          (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ||
                           filePath.endsWith('.png') || filePath.endsWith('.webp'))

    if (isPreviewImage) {
      // Try to serve watermarked version instead
      const pathParts = filePath.split('/')
      const previewIndex = pathParts.indexOf('preview')
      if (previewIndex !== -1) {
        pathParts.splice(previewIndex + 1, 0, 'watermarked')
        const watermarkedFilePath = pathParts.join('/')
        const watermarkedAbsolutePath = path.join(process.cwd(), 'public', 'uploads', watermarkedFilePath)

        try {
          await access(watermarkedAbsolutePath)
          // Watermarked version exists, serve it
          absolutePath = watermarkedAbsolutePath
          resolvedPath = path.resolve(absolutePath)
        } catch {
          // Watermarked version doesn't exist, fall back to original
          console.warn(`Watermarked version not found for: ${filePath}`)
        }
      }
    }

    try {
      const fileBuffer = await readFile(resolvedPath)
      
      // Determine content type based on file extension
      const ext = path.extname(resolvedPath).toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.webp':
          contentType = 'image/webp'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.svg':
          contentType = 'image/svg+xml'
          break
        case '.pdf':
          contentType = 'application/pdf'
          break
      }
      
      // Check if this is a preview image (needs watermark protection)
      const isPreviewImage = filePath.includes('/preview/') &&
                            (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp')

      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      }

      // Add download prevention headers for preview images
      if (isPreviewImage) {
        headers['Content-Disposition'] = 'inline' // Prevent download dialog
        headers['X-Content-Type-Options'] = 'nosniff'
        headers['X-Frame-Options'] = 'SAMEORIGIN'
      }

      return new NextResponse(fileBuffer, { headers })
    } catch (fileError) {
      console.error('File not found:', resolvedPath)
      return new NextResponse('File not found', { status: 404 })
    }
  } catch (error) {
    console.error('Upload file serve error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}