import { NextResponse } from "next/server"
import connectDB from "../../../../../../lib/mongodb"
import { User, Designer } from "../../../../../../models/User"
import { withPermission } from "../../../../../../middleware/auth"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Helper function to convert image file to optimized buffer for PDF embedding
async function getImageBuffer(filePath) {
  try {
    // Remove leading slash and convert to absolute path
    const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath
    const absolutePath = path.join(process.cwd(), 'public', relativePath)
    
    console.log('Attempting to access file at:', absolutePath)
    console.log('Current working directory:', process.cwd())
    
    if (!existsSync(absolutePath)) {
      console.error("File not found:", absolutePath)
      console.error("Full path details:", {
        originalPath: filePath,
        relativePath,
        absolutePath,
        cwd: process.cwd(),
        publicPath: path.join(process.cwd(), 'public')
      })
      return null
    }

    // Determine file extension
    const ext = path.extname(filePath).toLowerCase()

    // For PDF files, read as-is
    if (ext === '.pdf') {
      const fileBuffer = await readFile(absolutePath)
      return { buffer: fileBuffer, type: 'pdf' }
    }

    // Compress and resize image for PDF embedding
    // Max width: 600px, quality: 85%, format: JPEG for better compression
    const compressedBuffer = await sharp(absolutePath)
      .resize(600, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    console.log(`Compressed image from ${absolutePath}: ${compressedBuffer.length} bytes`)
    return { buffer: compressedBuffer, type: 'image' }
  } catch (error) {
    console.error("Error processing file:", error)
    return null
  }
}

async function handler(request, { params }) {
  try {
    await connectDB()

    const { id } = await params
    if (!id) {
      console.error("No designer ID provided")
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid designer ID format:", id)
      return NextResponse.json({ error: "Invalid designer ID format" }, { status: 400 })
    }

    console.log("Fetching designer data for ID:", id)

    // Get designer information
    const user = await User.findById(id).select("email createdAt userType").lean()
    if (!user) {
      console.error("User not found for ID:", id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.userType !== "designer") {
      console.error("User is not a designer:", user.userType)
      return NextResponse.json({ error: "User is not a designer" }, { status: 404 })
    }

    const designer = await Designer.findOne({ userId: id }).lean()
    if (!designer) {
      console.error("Designer profile not found for user ID:", id)
      return NextResponse.json({ error: "Designer profile not found" }, { status: 404 })
    }

    console.log("Designer data fetched successfully, generating PDF...")

    // Generate PDF using pdf-lib
    const pdfDoc = await PDFDocument.create()

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Helper function to add a page
    const addPage = () => {
      const page = pdfDoc.addPage([595, 842]) // A4 size in points
      return page
    }

    // Helper to format dates
    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      } catch (error) {
        return 'Invalid Date'
      }
    }

    // Safe accessor for nested objects
    const safeGet = (obj, path, defaultValue = 'N/A') => {
      try {
        const value = path.split('.').reduce((o, p) => o && o[p], obj)
        return value || defaultValue
      } catch {
        return defaultValue
      }
    }

    let currentPage = addPage()
    let yPosition = 800
    const leftMargin = 50
    const rightMargin = 545
    const lineHeight = 20

    // Function to check if we need a new page
    const checkNewPage = (requiredSpace = 50) => {
      if (yPosition < requiredSpace) {
        currentPage = addPage()
        yPosition = 800
        return true
      }
      return false
    }

    // Function to sanitize text for PDF encoding
    const sanitizeText = (text) => {
      if (!text) return '';
      // Replace problematic characters with their closest ASCII equivalents
      return text.toString()
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[–—]/g, '-')
        .replace(/[^\x00-\x7F]/g, '') // Remove any remaining non-ASCII characters
        .trim();
    }

    // Function to draw text with word wrap
    const drawText = (text, x, y, options = {}) => {
      const {
        font = helveticaFont,
        size = 12,
        color = rgb(0, 0, 0),
        maxWidth = rightMargin - x,
        lineHeight: customLineHeight = size * 1.2
      } = options

      // Sanitize the text before drawing
      const sanitizedText = sanitizeText(text)

      const words = sanitizedText.split(' ')
      let line = ''
      let currentY = y

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const testWidth = font.widthOfTextAtSize(testLine, size)

        if (testWidth > maxWidth && i > 0) {
          currentPage.drawText(line, {
            x,
            y: currentY,
            size,
            font,
            color
          })
          line = words[i] + ' '
          currentY -= customLineHeight

          // Check if we need a new page
          if (currentY < 50) {
            currentPage = addPage()
            currentY = 800
            yPosition = currentY
          }
        } else {
          line = testLine
        }
      }

      if (line.trim()) {
        currentPage.drawText(line, {
          x,
          y: currentY,
          size,
          font,
          color
        })
      }

      return currentY
    }

    // Function to draw section header
    const drawSectionHeader = (title) => {
      checkNewPage(60)

      // Draw background rectangle
      currentPage.drawRectangle({
        x: leftMargin - 10,
        y: yPosition - 5,
        width: rightMargin - leftMargin + 20,
        height: 30,
        color: rgb(0.23, 0.51, 0.96),
      })

      currentPage.drawText(title, {
        x: leftMargin,
        y: yPosition + 5,
        size: 16,
        font: helveticaBold,
        color: rgb(1, 1, 1)
      })

      yPosition -= 45
    }

    // Function to draw field
    const drawField = (label, value, sameLine = false) => {
      checkNewPage(40)

      if (sameLine) {
        currentPage.drawText(label + ':', {
          x: leftMargin,
          y: yPosition,
          size: 10,
          font: helveticaBold,
          color: rgb(0.4, 0.4, 0.4)
        })

        const labelWidth = helveticaBold.widthOfTextAtSize(label + ':', 10)
        const finalY = drawText(value, leftMargin + labelWidth + 5, yPosition, {
          font: helveticaFont,
          size: 11,
          color: rgb(0.12, 0.16, 0.22)
        })

        yPosition = finalY - lineHeight
      } else {
        currentPage.drawText(label.toUpperCase(), {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: helveticaBold,
          color: rgb(0.42, 0.45, 0.5)
        })

        yPosition -= 15

        const finalY = drawText(value, leftMargin, yPosition, {
          font: helveticaFont,
          size: 11,
          color: rgb(0.12, 0.16, 0.22)
        })

        yPosition = finalY - lineHeight
      }
    }

    // ===== HEADER =====
    currentPage.drawRectangle({
      x: 0,
      y: 760,
      width: 595,
      height: 82,
      color: rgb(0.23, 0.51, 0.96),
    })

    currentPage.drawText('Designer Registration Details', {
      x: 50,
      y: 810,
      size: 22,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    })

    const designerName = safeGet(designer, 'fullName') || safeGet(designer, 'displayName') || safeGet(user, 'email')
    currentPage.drawText(designerName, {
      x: 50,
      y: 785,
      size: 14,
      font: helveticaFont,
      color: rgb(1, 1, 1)
    })

    currentPage.drawText(`Generated on ${formatDate(new Date())}`, {
      x: 50,
      y: 768,
      size: 10,
      font: helveticaFont,
      color: rgb(0.9, 0.9, 0.9)
    })

    yPosition = 720

    // ===== PERSONAL INFORMATION =====
    drawSectionHeader('Personal Information')

    drawField('Full Name (as per ID proof)', safeGet(designer, 'fullName'))
    drawField('Display Name / Brand Name', safeGet(designer, 'displayName'))
    drawField('Email Address', safeGet(user, 'email'))
    drawField('Mobile Number (with WhatsApp)', safeGet(designer, 'mobileNumber'))

    if (safeGet(designer, 'alternativeContact') !== 'N/A') {
      drawField('Alternative Contact', safeGet(designer, 'alternativeContact'))
    }

    drawField('Registration Date', formatDate(safeGet(user, 'createdAt')))

    yPosition -= 10

    // ===== ADDRESS INFORMATION =====
    if (safeGet(designer, 'address') !== 'N/A') {
      drawSectionHeader('Address Information')

      drawField('Street Address', safeGet(designer, 'address.street'))
      drawField('City', safeGet(designer, 'address.city'))
      drawField('State', safeGet(designer, 'address.state'))
      drawField('Postal Code', safeGet(designer, 'address.postalCode'))
      drawField('Country', safeGet(designer, 'address.country'))

      if (safeGet(designer, 'gstNumber') !== 'N/A') {
        drawField('GST Number', safeGet(designer, 'gstNumber'))
      }

      yPosition -= 10
    }

    // ===== IDENTITY & TAX INFORMATION =====
    drawSectionHeader('Identity & Tax Information')

    drawField('Aadhaar Number', safeGet(designer, 'aadhaarNumber'))
    drawField('PAN Card Number', safeGet(designer, 'panNumber'))

    yPosition -= 10

    // Try to embed Aadhaar images
    if (designer.aadhaarFiles && Array.isArray(designer.aadhaarFiles) && designer.aadhaarFiles.length > 0) {
      checkNewPage(200)

      currentPage.drawText('Aadhaar Card Documents:', {
        x: leftMargin,
        y: yPosition,
        size: 10,
        font: helveticaBold,
        color: rgb(0.42, 0.45, 0.5)
      })

      yPosition -= 20

      for (let i = 0; i < designer.aadhaarFiles.length; i++) {
        const file = designer.aadhaarFiles[i]
        if (file && (file.startsWith('/') || file.startsWith('http'))) {
          const imageData = await getImageBuffer(file)

          if (imageData && imageData.type === 'image') {
            checkNewPage(250)

            try {
              const image = await pdfDoc.embedJpg(imageData.buffer)
              const imageDims = image.scale(0.3) // Smaller scale for preview

              // Limit image to thumbnail size
              const maxWidth = 200 // Smaller preview
              const maxHeight = 150
              let finalWidth = imageDims.width
              let finalHeight = imageDims.height

              if (finalWidth > maxWidth) {
                const scale = maxWidth / finalWidth
                finalWidth = maxWidth
                finalHeight = finalHeight * scale
              }

              if (finalHeight > maxHeight) {
                const scale = maxHeight / finalHeight
                finalHeight = maxHeight
                finalWidth = finalWidth * scale
              }

              // Draw preview image
              currentPage.drawImage(image, {
                x: leftMargin,
                y: yPosition - finalHeight,
                width: finalWidth,
                height: finalHeight
              })

              // Add clickable link annotation
              const fullUrl = file.startsWith('http') ? file : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${file}`

              currentPage.drawText(`Aadhaar Card ${i + 1} - Click to view full size`, {
                x: leftMargin + finalWidth + 10,
                y: yPosition - 10,
                size: 10,
                font: helveticaBold,
                color: rgb(0.23, 0.51, 0.96)
              })

              currentPage.drawText(fullUrl, {
                x: leftMargin + finalWidth + 10,
                y: yPosition - 25,
                size: 8,
                font: helveticaFont,
                color: rgb(0.23, 0.51, 0.96),
                maxWidth: rightMargin - (leftMargin + finalWidth + 10)
              })

              // Add clickable link annotation for image
              try {
                const linkAnnotation = pdfDoc.context.obj({
                  Type: 'Annot',
                  Subtype: 'Link',
                  Rect: [leftMargin, yPosition - finalHeight, leftMargin + finalWidth, yPosition],
                  Border: [0, 0, 0],
                  A: {
                    S: 'URI',
                    URI: fullUrl
                  }
                })
                const annotations = currentPage.node.lookup('Annots') || pdfDoc.context.obj([])
                if (Array.isArray(annotations)) {
                  currentPage.node.set('Annots', pdfDoc.context.obj([...annotations, linkAnnotation]))
                }
              } catch (linkError) {
                console.error('Error adding link annotation:', linkError)
              }

              yPosition -= Math.max(finalHeight, 40) + 20
            } catch (error) {
              console.error(`Error embedding Aadhaar image ${i + 1}:`, error)
              const fullUrl = file.startsWith('http') ? file : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${file}`

              currentPage.drawText(`Aadhaar Card ${i + 1}: ${fullUrl}`, {
                x: leftMargin,
                y: yPosition,
                size: 9,
                font: helveticaFont,
                color: rgb(0.23, 0.51, 0.96)
              })
              yPosition -= 15
            }
          } else {
            const fullUrl = file.startsWith('http') ? file : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${file}`

            currentPage.drawText(`Aadhaar Card ${i + 1}: ${fullUrl}`, {
              x: leftMargin,
              y: yPosition,
              size: 9,
              font: helveticaFont,
              color: rgb(0.23, 0.51, 0.96)
            })
            yPosition -= 15
          }
        }
      }

      yPosition -= 10
    }

    // Try to embed PAN card image
    if (designer.panCardFile && designer.panCardFile !== 'N/A') {
      checkNewPage(250)

      currentPage.drawText('PAN Card Document:', {
        x: leftMargin,
        y: yPosition,
        size: 10,
        font: helveticaBold,
        color: rgb(0.42, 0.45, 0.5)
      })

      yPosition -= 20

      const imageData = await getImageBuffer(designer.panCardFile)

      if (imageData && imageData.type === 'image') {
        try {
          const image = await pdfDoc.embedJpg(imageData.buffer)
          const imageDims = image.scale(0.3) // Smaller scale for preview

          // Limit image to thumbnail size
          const maxWidth = 200 // Smaller preview
          const maxHeight = 150
          let finalWidth = imageDims.width
          let finalHeight = imageDims.height

          if (finalWidth > maxWidth) {
            const scale = maxWidth / finalWidth
            finalWidth = maxWidth
            finalHeight = finalHeight * scale
          }

          if (finalHeight > maxHeight) {
            const scale = maxHeight / finalHeight
            finalHeight = maxHeight
            finalWidth = finalWidth * scale
          }

          // Draw preview image
          currentPage.drawImage(image, {
            x: leftMargin,
            y: yPosition - finalHeight,
            width: finalWidth,
            height: finalHeight
          })

          // Add clickable link annotation
          const fullUrl = designer.panCardFile.startsWith('http') ? designer.panCardFile : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${designer.panCardFile}`

          currentPage.drawText('PAN Card - Click to view full size', {
            x: leftMargin + finalWidth + 10,
            y: yPosition - 10,
            size: 10,
            font: helveticaBold,
            color: rgb(0.23, 0.51, 0.96)
          })

          currentPage.drawText(fullUrl, {
            x: leftMargin + finalWidth + 10,
            y: yPosition - 25,
            size: 8,
            font: helveticaFont,
            color: rgb(0.23, 0.51, 0.96),
            maxWidth: rightMargin - (leftMargin + finalWidth + 10)
          })

          // Add clickable link annotation for image
          try {
            const linkAnnotation = pdfDoc.context.obj({
              Type: 'Annot',
              Subtype: 'Link',
              Rect: [leftMargin, yPosition - finalHeight, leftMargin + finalWidth, yPosition],
              Border: [0, 0, 0],
              A: {
                S: 'URI',
                URI: fullUrl
              }
            })
            const annotations = currentPage.node.lookup('Annots') || pdfDoc.context.obj([])
            if (Array.isArray(annotations)) {
              currentPage.node.set('Annots', pdfDoc.context.obj([...annotations, linkAnnotation]))
            }
          } catch (linkError) {
            console.error('Error adding link annotation:', linkError)
          }

          yPosition -= Math.max(finalHeight, 40) + 20
        } catch (error) {
          console.error('Error embedding PAN image:', error)
          const fullUrl = designer.panCardFile.startsWith('http') ? designer.panCardFile : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${designer.panCardFile}`

          currentPage.drawText(`PAN Card: ${fullUrl}`, {
            x: leftMargin,
            y: yPosition,
            size: 9,
            font: helveticaFont,
            color: rgb(0.23, 0.51, 0.96)
          })
          yPosition -= 15
        }
      } else {
        const fullUrl = designer.panCardFile.startsWith('http') ? designer.panCardFile : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${designer.panCardFile}`

        currentPage.drawText(`PAN Card: ${fullUrl}`, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: helveticaFont,
          color: rgb(0.23, 0.51, 0.96)
        })
        yPosition -= 15
      }

      yPosition -= 10
    }

    // ===== BANKING INFORMATION =====
    if (safeGet(designer, 'bankDetails') !== 'N/A') {
      drawSectionHeader('Banking Information')

      drawField('Account Holder Name', safeGet(designer, 'bankDetails.accountHolderName'))
      drawField('Account Number', safeGet(designer, 'bankDetails.accountNumber'))
      drawField('Bank Name', safeGet(designer, 'bankDetails.bankName'))
      drawField('Branch', safeGet(designer, 'bankDetails.branch'))
      drawField('IFSC/SWIFT Code', safeGet(designer, 'bankDetails.ifscCode'))
      drawField('UPI ID', safeGet(designer, 'bankDetails.upiId'))
      drawField('PayPal ID', safeGet(designer, 'bankDetails.paypalId'))

      yPosition -= 10
    }

    // ===== PORTFOLIO & SPECIALIZATIONS =====
    drawSectionHeader('Portfolio & Specializations')

    if (designer.specializations && Array.isArray(designer.specializations) && designer.specializations.length > 0) {
      drawField('Design Specializations', designer.specializations.join(', '))
    }

    if (safeGet(designer, 'otherSpecialization') !== 'N/A') {
      drawField('Other Specialization', safeGet(designer, 'otherSpecialization'))
    }

    if (designer.portfolioLinks && Array.isArray(designer.portfolioLinks) && designer.portfolioLinks.length > 0) {
      drawField('Portfolio Links', designer.portfolioLinks.join(', '))
    }

    if (designer.sampleDesigns && Array.isArray(designer.sampleDesigns) && designer.sampleDesigns.length > 0) {
      currentPage.drawText('SAMPLE DESIGNS', {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: helveticaBold,
        color: rgb(0.42, 0.45, 0.5)
      })

      yPosition -= 15

      designer.sampleDesigns.forEach((design, index) => {
        checkNewPage(30)
        currentPage.drawText(`${index + 1}. ${design || 'N/A'}`, {
          x: leftMargin + 10,
          y: yPosition,
          size: 11,
          font: helveticaFont,
          color: rgb(0.12, 0.16, 0.22)
        })
        yPosition -= 15
      })
    }

    yPosition -= 10

    // ===== TERMS & CONDITIONS AGREEMENTS =====
    if (safeGet(designer, 'agreements') !== 'N/A') {
      drawSectionHeader('Terms & Conditions Agreements')

      const agreements = [
        { key: 'originalWork', label: 'Original Work Declaration' },
        { key: 'noResponsibility', label: 'Platform Responsibility Clause' },
        { key: 'monetizationPolicy', label: 'Monetization Policy' },
        { key: 'platformPricing', label: 'Platform Pricing' },
        { key: 'designRemoval', label: 'Design Removal Rights' },
        { key: 'minimumUploads', label: 'Minimum Uploads Commitment' }
      ]

      agreements.forEach(({ key, label }) => {
        checkNewPage(30)
        const value = designer.agreements && designer.agreements[key]
        const status = value ? '[AGREED]' : '[NOT AGREED]'
        const color = value ? rgb(0.06, 0.37, 0.27) : rgb(0.6, 0.11, 0.11)

        currentPage.drawText(label + ':', {
          x: leftMargin,
          y: yPosition,
          size: 11,
          font: helveticaFont,
          color: rgb(0.12, 0.16, 0.22)
        })

        const labelWidth = helveticaFont.widthOfTextAtSize(label + ':', 11)

        currentPage.drawText(status, {
          x: leftMargin + labelWidth + 10,
          y: yPosition,
          size: 11,
          font: helveticaBold,
          color: color
        })

        yPosition -= 20
      })
    }

    // ===== FOOTER =====
    checkNewPage(60)

    currentPage.drawLine({
      start: { x: leftMargin, y: yPosition },
      end: { x: rightMargin, y: yPosition },
      thickness: 1,
      color: rgb(0.9, 0.9, 0.9)
    })

    yPosition -= 20

    currentPage.drawText('This document was automatically generated by MyDesignBazaar Admin System', {
      x: leftMargin,
      y: yPosition,
      size: 9,
      font: helveticaFont,
      color: rgb(0.42, 0.45, 0.5)
    })

    yPosition -= 15

    currentPage.drawText(`Generated on: ${formatDate(new Date())}`, {
      x: leftMargin,
      y: yPosition,
      size: 9,
      font: helveticaFont,
      color: rgb(0.42, 0.45, 0.5)
    })

    // Serialize the PDF
    console.log("Serializing PDF...")
    const pdfBytes = await pdfDoc.save()
    console.log("PDF generated successfully, size:", pdfBytes.length, "bytes")

    // Clean filename for download
    const cleanName = (designer.fullName || user.email || 'designer')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Return PDF as response
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="designer-${cleanName}-${Date.now()}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    })

  } catch (error) {
    console.error("PDF generation error:", error)
    console.error("Error stack:", error.stack)
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    console.error("Server environment:", {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      env: process.env.NODE_ENV,
      memory: process.memoryUsage()
    })

    return NextResponse.json({
      error: "Failed to generate PDF",
      details: error.message,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

export const GET = withPermission(["manage_designers"])(handler)
