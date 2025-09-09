import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request, { params }) {
  try {
    const filePath = params.path.join('/')
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', filePath)
    
    // Security check - ensure path is within uploads directory
    const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads')
    const resolvedPath = path.resolve(absolutePath)
    
    if (!resolvedPath.startsWith(publicUploadsPath)) {
      return new NextResponse('Forbidden', { status: 403 })
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
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (fileError) {
      console.error('File not found:', resolvedPath)
      return new NextResponse('File not found', { status: 404 })
    }
  } catch (error) {
    console.error('Upload file serve error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}