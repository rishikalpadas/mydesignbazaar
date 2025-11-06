import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/mongodb'
import Design from '../../../../../models/Design'
import { withPermission } from '../../../../../middleware/auth'
import { validateRawFileMatch, batchValidateRawFiles } from '../../../../../lib/rawFileValidator'
import path from 'path'

/**
 * Validate single design's raw file
 * POST /api/admin/designs/validate-raw
 * Body: { designId: string }
 */
async function validateSingleHandler(request) {
  try {
    await connectDB()

    const { designId } = await request.json()

    if (!designId) {
      return NextResponse.json({ error: 'Design ID is required' }, { status: 400 })
    }

    const design = await Design.findOne({ designId })

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 })
    }

    if (!design.rawFile || !design.rawFile.path) {
      return NextResponse.json({ error: 'Design has no raw file' }, { status: 400 })
    }

    if (!design.previewImages || design.previewImages.length === 0) {
      return NextResponse.json({ error: 'Design has no preview images' }, { status: 400 })
    }

    // Get absolute paths
    const publicDir = path.join(process.cwd(), 'public')
    const rawFilePath = path.join(publicDir, design.rawFile.path)
    const previewImagePaths = design.previewImages.map(img => path.join(publicDir, img.path))

    // Validate
    const validation = await validateRawFileMatch(
      rawFilePath,
      design.rawFile.fileType,
      previewImagePaths,
      10 // threshold
    )

    // Update design with validation results
    design.rawFileValidation = {
      isValidated: true,
      isMatch: validation.isMatch,
      similarity: validation.similarity,
      matchedPreview: validation.matchedPreview,
      matchedPreviewIndex: validation.matchedPreviewIndex,
      hammingDistance: validation.hammingDistance,
      details: validation.details,
      validatedAt: new Date(),
      skipped: validation.skipped || false
    }

    await design.save()

    return NextResponse.json({
      success: true,
      designId: design.designId,
      validation: {
        isMatch: validation.isMatch,
        similarity: validation.similarity,
        matchedPreview: validation.matchedPreview,
        details: validation.details,
        skipped: validation.skipped
      }
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate raw file', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Batch validate all pending designs' raw files
 * POST /api/admin/designs/validate-raw/batch
 * Body: { designIds?: string[] } (if not provided, validates all pending designs)
 */
async function validateBatchHandler(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { designIds } = body || {}

    let query = { status: 'pending' }

    if (designIds && designIds.length > 0) {
      query.designId = { $in: designIds }
    }

    const designs = await Design.find(query)
      .select('designId title rawFile previewImages rawFileValidation')
      .lean()

    if (!designs || designs.length === 0) {
      return NextResponse.json({ error: 'No designs found to validate' }, { status: 404 })
    }

    const publicDir = path.join(process.cwd(), 'public')
    const validationTasks = []

    // Prepare validation tasks
    for (const design of designs) {
      if (!design.rawFile || !design.rawFile.path) {
        validationTasks.push({
          designId: design.designId,
          skipped: true,
          reason: 'No raw file'
        })
        continue
      }

      if (!design.previewImages || design.previewImages.length === 0) {
        validationTasks.push({
          designId: design.designId,
          skipped: true,
          reason: 'No preview images'
        })
        continue
      }

      validationTasks.push({
        designId: design.designId,
        rawFilePath: path.join(publicDir, design.rawFile.path),
        rawFileType: design.rawFile.fileType,
        previewImagePaths: design.previewImages.map(img => path.join(publicDir, img.path)),
        threshold: 10
      })
    }

    // Filter only tasks that need validation
    const tasksToValidate = validationTasks.filter(t => !t.skipped)

    // Run batch validation
    const validationResults = await batchValidateRawFiles(tasksToValidate)

    // Update designs with validation results
    const updatePromises = []
    const results = []

    for (let i = 0; i < validationResults.length; i++) {
      const result = validationResults[i]
      const task = tasksToValidate[i]

      const updatePromise = Design.findOneAndUpdate(
        { designId: task.designId },
        {
          $set: {
            'rawFileValidation.isValidated': true,
            'rawFileValidation.isMatch': result.isMatch,
            'rawFileValidation.similarity': result.similarity,
            'rawFileValidation.matchedPreview': result.matchedPreview,
            'rawFileValidation.matchedPreviewIndex': result.matchedPreviewIndex,
            'rawFileValidation.hammingDistance': result.hammingDistance,
            'rawFileValidation.details': result.details,
            'rawFileValidation.validatedAt': new Date(),
            'rawFileValidation.skipped': result.skipped || false
          }
        },
        { new: true }
      )

      updatePromises.push(updatePromise)

      results.push({
        designId: task.designId,
        isMatch: result.isMatch,
        similarity: result.similarity,
        details: result.details,
        skipped: result.skipped
      })
    }

    // Add skipped tasks to results
    for (const task of validationTasks) {
      if (task.skipped) {
        results.push({
          designId: task.designId,
          skipped: true,
          reason: task.reason
        })
      }
    }

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      validatedCount: validationResults.length,
      skippedCount: validationTasks.filter(t => t.skipped).length,
      results
    })

  } catch (error) {
    console.error('Batch validation error:', error)
    return NextResponse.json(
      { error: 'Failed to batch validate raw files', details: error.message },
      { status: 500 }
    )
  }
}

export const POST = withPermission(['manage_marketplace'])(async (request) => {
  const url = new URL(request.url)

  // Check if this is a batch request
  if (url.pathname.endsWith('/batch')) {
    return validateBatchHandler(request)
  }

  return validateSingleHandler(request)
})
