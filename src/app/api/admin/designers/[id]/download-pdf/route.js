import { NextResponse } from "next/server"
import connectDB from "../../../../../../lib/mongodb"
import { User, Designer } from "../../../../../../models/User"
import { withPermission } from "../../../../../../middleware/auth"
import puppeteer from 'puppeteer'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Helper function to convert image file to base64 data URI with compression
async function fileToBase64(filePath) {
  try {
    // Remove leading slash and convert to absolute path
    const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    if (!existsSync(absolutePath)) {
      console.log("File not found:", absolutePath)
      return null
    }

    // Determine file extension
    const ext = path.extname(filePath).toLowerCase()

    // Skip compression for PDF files
    if (ext === '.pdf') {
      const fileBuffer = await readFile(absolutePath)
      const base64 = fileBuffer.toString('base64')
      return `data:application/pdf;base64,${base64}`
    }

    // Compress and resize image for PDF embedding
    // Max width: 800px, quality: 80%, format: JPEG for better compression
    const compressedBuffer = await sharp(absolutePath)
      .resize(800, null, { // Resize to max width 800px, maintain aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer()

    const base64 = compressedBuffer.toString('base64')
    if (process.env.NODE_ENV === 'development') {
      console.log(`Compressed image from ${absolutePath.length} to ${base64.length} characters`)
    }

    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error("Error converting file to base64:", error)
    return null
  }
}

async function handler(request, { params }) {
  let browser = null

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("Starting PDF generation for designer:", params.id)
    }
    await connectDB()

    const { id } = params
    if (!id) {
      console.error("No designer ID provided")
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid designer ID format:", id)
      return NextResponse.json({ error: "Invalid designer ID format" }, { status: 400 })
    }

    // Get designer information
    if (process.env.NODE_ENV === 'development') {
      console.log("Fetching user data for ID:", id)
    }
    const user = await User.findById(id).select("email createdAt userType").lean()
    if (!user) {
      console.error("User not found for ID:", id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    if (user.userType !== "designer") {
      console.error("User is not a designer:", user.userType)
      return NextResponse.json({ error: "User is not a designer" }, { status: 404 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("Fetching designer profile for user ID:", id)
    }
    const designer = await Designer.findOne({ userId: id }).lean()
    if (!designer) {
      console.error("Designer profile not found for user ID:", id)
      return NextResponse.json({ error: "Designer profile not found" }, { status: 404 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("Generating HTML content for PDF")
    }
    // Create HTML content for PDF (now async to handle image conversion)
    const htmlContent = await generateDesignerPDFHTML(user, designer)
    if (process.env.NODE_ENV === 'development') {
      console.log("HTML content generated, length:", htmlContent.length)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("Launching puppeteer browser")
    }
    // Generate PDF using puppeteer with better configuration for Windows
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Creating new page")
    }
    const page = await browser.newPage()
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Setting page content")
    }
    // Use 'load' which is faster than networkidle for base64 embedded images
    await page.setContent(htmlContent, {
      waitUntil: 'load',
      timeout: 90000
    })

    if (process.env.NODE_ENV === 'development') {
      console.log("Page content loaded, waiting for any rendering...")
      console.log("Generating PDF")
    }
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      timeout: 30000
    })

    if (process.env.NODE_ENV === 'development') {
      console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes")
    }

    // Clean filename for download
    const cleanName = (designer.fullName || user.email || 'designer')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="designer-${cleanName}-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error("PDF generation error:", error)
    console.error("Error stack:", error.stack)
    
    // Return more specific error information
    let errorMessage = "Failed to generate PDF"
    if (error.message.includes("Protocol error")) {
      errorMessage = "Browser error - please try again"
    } else if (error.message.includes("Navigation timeout")) {
      errorMessage = "PDF generation timeout - please try again"
    } else if (error.message.includes("not found")) {
      errorMessage = "Designer information not found"
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  } finally {
    // Always close browser
    if (browser) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log("Closing browser")
        }
        await browser.close()
      } catch (closeError) {
        console.error("Error closing browser:", closeError)
      }
    }
  }
}

async function generateDesignerPDFHTML(user, designer) {
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

  // Convert image files to base64 for embedding in PDF
  // Images are now compressed, so we can use a higher limit
  // With 800px width at 80% quality, most images will be under 500KB
  const MAX_BASE64_SIZE = 5000000 // ~5MB base64 string limit (images are compressed before conversion)
  const aadhaarImagesBase64 = []

  if (designer.aadhaarFiles && Array.isArray(designer.aadhaarFiles)) {
    for (const file of designer.aadhaarFiles) {
      if (file && (file.startsWith('/') || file.startsWith('http'))) {
        console.log("Converting Aadhaar file to base64:", file)
        try {
          const base64 = await fileToBase64(file)
          if (base64) {
            if (base64.length > MAX_BASE64_SIZE) {
              console.log("Aadhaar file too large for embedding, will show link only:", base64.length)
              aadhaarImagesBase64.push({ file, base64: null, isPdf: false, tooLarge: true })
            } else {
              console.log("Aadhaar file converted successfully, size:", base64.length)
              aadhaarImagesBase64.push({ file, base64, isPdf: file.toLowerCase().endsWith('.pdf'), tooLarge: false })
            }
          } else {
            console.log("Aadhaar file conversion failed")
            aadhaarImagesBase64.push({ file, base64: null, isPdf: false, tooLarge: false })
          }
        } catch (error) {
          console.error("Error converting Aadhaar file:", error.message)
          aadhaarImagesBase64.push({ file, base64: null, isPdf: false, tooLarge: false })
        }
      } else {
        aadhaarImagesBase64.push({ file, base64: null, isPdf: false, tooLarge: false })
      }
    }
  }

  let panCardImageBase64 = null
  let isPanPdf = false
  let panTooLarge = false

  if (designer.panCardFile) {
    const file = designer.panCardFile
    if (file && (file.startsWith('/') || file.startsWith('http'))) {
      console.log("Converting PAN file to base64:", file)
      try {
        panCardImageBase64 = await fileToBase64(file)
        if (panCardImageBase64) {
          if (panCardImageBase64.length > MAX_BASE64_SIZE) {
            console.log("PAN file too large for embedding, will show link only:", panCardImageBase64.length)
            panCardImageBase64 = null
            panTooLarge = true
          } else {
            console.log("PAN file converted successfully, size:", panCardImageBase64.length)
          }
        } else {
          console.log("PAN file conversion failed")
        }
        isPanPdf = file.toLowerCase().endsWith('.pdf')
      } catch (error) {
        console.error("Error converting PAN file:", error.message)
        panCardImageBase64 = null
      }
    }
  }

  const formatAgreement = (value) => value ? '✓ Agreed' : '✗ Not Agreed'
  const getAgreementClass = (value) => value ? 'agreed' : 'not-agreed'
  
  // Safe accessor for nested objects
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    try {
      return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue
    } catch {
      return defaultValue
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Designer Registration Details</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .section {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .section h2 {
          color: #1d4ed8;
          font-size: 20px;
          margin: 0 0 15px 0;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 8px;
        }
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .field-grid.single {
          grid-template-columns: 1fr;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: bold;
          color: #6b7280;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .field-value {
          font-size: 14px;
          color: #1f2937;
          word-wrap: break-word;
        }
        .specialization-tag {
          display: inline-block;
          background: #dbeafe;
          color: #1d4ed8;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          margin: 2px;
        }
        .agreement-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          margin: 8px 0;
        }
        .agreement-text {
          flex: 1;
        }
        .agreement-title {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 2px;
        }
        .agreement-desc {
          font-size: 12px;
          color: #6b7280;
        }
        .agreement-status {
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }
        .agreement-status.agreed {
          background: #d1fae5;
          color: #065f46;
        }
        .agreement-status.not-agreed {
          background: #fee2e2;
          color: #991b1b;
        }
        .document-links {
          margin-top: 10px;
        }
        .document-link {
          display: inline-block;
          background: #dbeafe;
          color: #1d4ed8;
          padding: 6px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          margin: 3px;
        }
        .document-preview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .document-preview {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px;
          background: white;
        }
        .document-preview-label {
          font-weight: bold;
          font-size: 12px;
          color: #1d4ed8;
          margin-bottom: 8px;
        }
        .document-preview-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          border-radius: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        .document-preview-link {
          display: block;
          font-size: 10px;
          color: #1d4ed8;
          margin-top: 5px;
          word-break: break-all;
          text-decoration: none;
        }
        .unavailable-file {
          color: #6b7280;
          font-style: italic;
          font-size: 11px;
          background: #f3f4f6;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
        }
        .no-data {
          color: #6b7280;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }
        .portfolio-link {
          color: #1d4ed8;
          text-decoration: none;
          word-break: break-all;
        }
        .generated-info {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Designer Registration Details</h1>
        <p>${safeGet(designer, 'fullName') || safeGet(designer, 'displayName') || safeGet(user, 'email')}</p>
        <p>Generated on ${formatDate(new Date())}</p>
      </div>

      <!-- Personal Information -->
      <div class="section">
        <h2>Personal Information</h2>
        <div class="field-grid">
          <div class="field">
            <div class="field-label">Full Name (as per ID proof)</div>
            <div class="field-value">${safeGet(designer, 'fullName')}</div>
          </div>
          <div class="field">
            <div class="field-label">Display Name / Brand Name</div>
            <div class="field-value">${safeGet(designer, 'displayName')}</div>
          </div>
          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value">${safeGet(user, 'email')}</div>
          </div>
          <div class="field">
            <div class="field-label">Mobile Number (with WhatsApp)</div>
            <div class="field-value">${safeGet(designer, 'mobileNumber')}</div>
          </div>
          ${safeGet(designer, 'alternativeContact') && safeGet(designer, 'alternativeContact') !== 'N/A' ? `
          <div class="field">
            <div class="field-label">Alternative Contact</div>
            <div class="field-value">${safeGet(designer, 'alternativeContact')}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Registration Date</div>
            <div class="field-value">${formatDate(safeGet(user, 'createdAt'))}</div>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      ${safeGet(designer, 'address') && safeGet(designer, 'address') !== 'N/A' ? `
      <div class="section">
        <h2>Address Information</h2>
        <div class="field-grid">
          <div class="field" style="grid-column: 1 / -1;">
            <div class="field-label">Street Address</div>
            <div class="field-value">${safeGet(designer, 'address.street')}</div>
          </div>
          <div class="field">
            <div class="field-label">City</div>
            <div class="field-value">${safeGet(designer, 'address.city')}</div>
          </div>
          <div class="field">
            <div class="field-label">State</div>
            <div class="field-value">${safeGet(designer, 'address.state')}</div>
          </div>
          <div class="field">
            <div class="field-label">Postal Code</div>
            <div class="field-value">${safeGet(designer, 'address.postalCode')}</div>
          </div>
          <div class="field">
            <div class="field-label">Country</div>
            <div class="field-value">${safeGet(designer, 'address.country')}</div>
          </div>
          ${safeGet(designer, 'gstNumber') && safeGet(designer, 'gstNumber') !== 'N/A' ? `
          <div class="field">
            <div class="field-label">GST Number</div>
            <div class="field-value">${safeGet(designer, 'gstNumber')}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <!-- Identity & Tax Information -->
      <div class="section">
        <h2>Identity & Tax Information</h2>
        <div class="field-grid">
          <div class="field">
            <div class="field-label">Aadhaar Number</div>
            <div class="field-value">${safeGet(designer, 'aadhaarNumber')}</div>
          </div>
          <div class="field">
            <div class="field-label">PAN Card Number</div>
            <div class="field-value">${safeGet(designer, 'panNumber')}</div>
          </div>
        </div>

        ${aadhaarImagesBase64.length > 0 ? `
        <div class="field">
          <div class="field-label" style="margin-top: 20px;">Aadhaar Card Documents</div>
          <div class="document-preview-grid">
            ${aadhaarImagesBase64.map((item, index) => {
              if (item.base64) {
                const fullUrl = item.file.startsWith('http') ? item.file : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.file}`
                return `
                  <div class="document-preview">
                    <div class="document-preview-label">Aadhaar Card ${index + 1}</div>
                    ${!item.isPdf ? `<img src="${item.base64}" alt="Aadhaar ${index + 1}" class="document-preview-image" />` : '<div class="unavailable-file">PDF Document - Cannot preview in PDF</div>'}
                    <div class="document-preview-link" style="margin-top: 5px;">
                      <a href="${fullUrl}" target="_blank" style="color: #1d4ed8; font-size: 10px; text-decoration: underline; word-break: break-all;">Click to view original: ${item.file}</a>
                    </div>
                  </div>
                `
              } else if (item.tooLarge) {
                const fullUrl = item.file.startsWith('http') ? item.file : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.file}`
                return `
                  <div class="document-preview">
                    <div class="document-preview-label">Aadhaar Card ${index + 1}</div>
                    <div class="unavailable-file">File too large to embed in PDF.<br/>Click to view: <a href="${fullUrl}" target="_blank" style="color: #1d4ed8; text-decoration: underline;">${item.file}</a></div>
                  </div>
                `
              } else {
                return `
                  <div class="document-preview">
                    <div class="document-preview-label">Aadhaar Card ${index + 1}</div>
                    <div class="unavailable-file">File uploaded before storage system was implemented: ${item.file || 'N/A'}</div>
                  </div>
                `
              }
            }).join('')}
          </div>
        </div>
        ` : ''}

        ${designer.panCardFile && designer.panCardFile !== 'N/A' ? `
        <div class="field">
          <div class="field-label" style="margin-top: 20px;">PAN Card Document</div>
          <div class="document-preview-grid" style="grid-template-columns: 1fr;">
            ${panCardImageBase64 ? `
              <div class="document-preview" style="max-width: 50%;">
                <div class="document-preview-label">PAN Card</div>
                ${!isPanPdf ? `<img src="${panCardImageBase64}" alt="PAN Card" class="document-preview-image" />` : '<div class="unavailable-file">PDF Document - Cannot preview in PDF</div>'}
                <div class="document-preview-link" style="margin-top: 5px;">
                  <a href="${designer.panCardFile.startsWith('http') ? designer.panCardFile : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + designer.panCardFile}" target="_blank" style="color: #1d4ed8; font-size: 10px; text-decoration: underline; word-break: break-all;">Click to view original: ${designer.panCardFile}</a>
                </div>
              </div>
            ` : panTooLarge ? `
              <div class="document-preview" style="max-width: 50%;">
                <div class="document-preview-label">PAN Card</div>
                <div class="unavailable-file">File too large to embed in PDF.<br/>Click to view: <a href="${designer.panCardFile.startsWith('http') ? designer.panCardFile : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + designer.panCardFile}" target="_blank" style="color: #1d4ed8; text-decoration: underline;">${designer.panCardFile}</a></div>
              </div>
            ` : `
              <div class="document-preview" style="max-width: 50%;">
                <div class="document-preview-label">PAN Card</div>
                <div class="unavailable-file">File uploaded before storage system was implemented: ${designer.panCardFile || 'N/A'}</div>
              </div>
            `}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Banking Information -->
      ${safeGet(designer, 'bankDetails') && safeGet(designer, 'bankDetails') !== 'N/A' ? `
      <div class="section">
        <h2>Banking Information</h2>
        <div class="field-grid">
          <div class="field">
            <div class="field-label">Account Holder Name</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.accountHolderName')}</div>
          </div>
          <div class="field">
            <div class="field-label">Account Number</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.accountNumber')}</div>
          </div>
          <div class="field">
            <div class="field-label">Bank Name</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.bankName')}</div>
          </div>
          <div class="field">
            <div class="field-label">Branch</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.branch')}</div>
          </div>
          <div class="field">
            <div class="field-label">IFSC/SWIFT Code</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.ifscCode')}</div>
          </div>
          <div class="field">
            <div class="field-label">UPI ID</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.upiId')}</div>
          </div>
          <div class="field">
            <div class="field-label">PayPal ID</div>
            <div class="field-value">${safeGet(designer, 'bankDetails.paypalId')}</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Portfolio & Specializations -->
      <div class="section">
        <h2>Portfolio & Specializations</h2>
        
        ${designer.specializations && Array.isArray(designer.specializations) && designer.specializations.length > 0 ? `
        <div class="field">
          <div class="field-label">Design Specialization</div>
          <div class="field-value">
            ${designer.specializations.map(spec => 
              `<span class="specialization-tag">${spec || 'N/A'}</span>`
            ).join('')}
          </div>
        </div>
        ` : ''}
        
        ${safeGet(designer, 'otherSpecialization') && safeGet(designer, 'otherSpecialization') !== 'N/A' ? `
        <div class="field">
          <div class="field-label">Other Specialization</div>
          <div class="field-value">${safeGet(designer, 'otherSpecialization')}</div>
        </div>
        ` : ''}
        
        ${designer.portfolioLinks && Array.isArray(designer.portfolioLinks) && designer.portfolioLinks.length > 0 ? `
        <div class="field">
          <div class="field-label">Link to Online Portfolio</div>
          <div class="field-value">
            ${designer.portfolioLinks.map((link, index) => 
              `<div><a href="${link || '#'}" class="portfolio-link">Portfolio Link ${index + 1}: ${link || 'N/A'}</a></div>`
            ).join('')}
          </div>
        </div>
        ` : ''}
        
        ${designer.sampleDesigns && Array.isArray(designer.sampleDesigns) && designer.sampleDesigns.length > 0 ? `
        <div class="field">
          <div class="field-label">Sample Designs</div>
          <div class="field-value">
            ${designer.sampleDesigns.map((design, index) => 
              `<div>Sample Design ${index + 1}: ${design || 'N/A'}</div>`
            ).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Terms & Conditions Agreements -->
      ${safeGet(designer, 'agreements') && safeGet(designer, 'agreements') !== 'N/A' ? `
      <div class="section">
        <h2>Terms & Conditions Agreements</h2>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Original Work Declaration</div>
            <div class="agreement-desc">I certify that all designs I upload are my original work</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.originalWork'))}">
            ${formatAgreement(safeGet(designer, 'agreements.originalWork'))}
          </span>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Platform Responsibility Clause</div>
            <div class="agreement-desc">I understand that MyDesignBazaar is not responsible for design copyright issues</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.noResponsibility'))}">
            ${formatAgreement(safeGet(designer, 'agreements.noResponsibility'))}
          </span>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Monetization Policy</div>
            <div class="agreement-desc">I agree to the platform's revenue sharing and monetization terms</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.monetizationPolicy'))}">
            ${formatAgreement(safeGet(designer, 'agreements.monetizationPolicy'))}
          </span>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Platform Pricing</div>
            <div class="agreement-desc">I agree to follow platform pricing guidelines and policies</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.platformPricing'))}">
            ${formatAgreement(safeGet(designer, 'agreements.platformPricing'))}
          </span>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Design Removal Rights</div>
            <div class="agreement-desc">I understand the platform's right to remove designs that violate policies</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.designRemoval'))}">
            ${formatAgreement(safeGet(designer, 'agreements.designRemoval'))}
          </span>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-text">
            <div class="agreement-title">Minimum Uploads Commitment</div>
            <div class="agreement-desc">I commit to maintaining regular design uploads as per platform requirements</div>
          </div>
          <span class="agreement-status ${getAgreementClass(safeGet(designer, 'agreements.minimumUploads'))}">
            ${formatAgreement(safeGet(designer, 'agreements.minimumUploads'))}
          </span>
        </div>
      </div>
      ` : ''}

      <div class="generated-info">
        <p>This document was automatically generated by MyDesignBazaar Admin System</p>
        <p>Generated on: ${formatDate(new Date())}</p>
      </div>
    </body>
    </html>
  `
}

export const GET = withPermission(["manage_designers"])(handler)