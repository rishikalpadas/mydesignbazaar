import mongoose from "mongoose"

const designSchema = new mongoose.Schema(
  {
    designId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ["Infantwear", "Kidswear", "Menswear", "Womenswear", "Typography", "Floral", "AI-Generated"],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    previewImages: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    // Keep the old previewImage field for backward compatibility
    previewImage: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String,
    },
    rawFile: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String,
      fileType: {
        type: String,
        enum: ["pdf", "cdr", "ai", "eps", "svg"],
      },
    },
    // Keep the old rawFiles field for backward compatibility
    rawFiles: [
      {
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        mimetype: String,
        fileType: {
          type: String,
          enum: ["pdf", "cdr", "ai", "eps", "svg"],
        },
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Upload tracking for copyright management
    uploadMetadata: {
      ipAddress: {
        type: String,
        trim: true,
      },
      userAgent: {
        type: String,
        trim: true,
      },
      deviceInfo: {
        browser: String,
        os: String,
        platform: String,
      },
      // Note: MAC address cannot be reliably obtained from web browsers for security/privacy reasons
      // We track IP, User Agent, and other device fingerprints instead
    },
  },
  {
    timestamps: true,
  },
)

// Only create indexes if they don't already exist (prevents duplicate index warnings)
if (!designSchema.options.indexesDeclared) {
  // Indexes for better query performance
  designSchema.index({ designId: 1 }, { unique: true }) // Unique index for designId
  designSchema.index({ uploadedBy: 1 })
  designSchema.index({ status: 1 })
  designSchema.index({ category: 1 })
  designSchema.index({ createdAt: -1 })
  designSchema.index({ featured: 1, status: 1 })
  
  designSchema.options.indexesDeclared = true
}

// Virtual for multiple preview image URLs
designSchema.virtual("previewImageUrls").get(function () {
  const designIdToUse = this.designId || this._id;
  if (this.previewImages && this.previewImages.length > 0) {
    return this.previewImages.map((img) => ({
      ...img.toObject ? img.toObject() : img,
      url: `/api/uploads/designs/${designIdToUse}/preview/${img.filename}`,
    }))
  }
  // Fallback to old single preview image for backward compatibility
  return this.previewImage ? [{
    ...this.previewImage,
    url: `/api/uploads/designs/${designIdToUse}/preview/${this.previewImage.filename}`,
    isPrimary: true
  }] : []
})

// Virtual for primary preview image URL (backward compatibility)
designSchema.virtual("previewImageUrl").get(function () {
  const designIdToUse = this.designId || this._id;
  if (this.previewImages && this.previewImages.length > 0) {
    const primary = this.previewImages.find(img => img.isPrimary) || this.previewImages[0]
    return `/api/uploads/designs/${designIdToUse}/preview/${primary.filename}`
  }
  return this.previewImage ? `/api/uploads/designs/${designIdToUse}/preview/${this.previewImage.filename}` : null
})

// Virtual for raw file URL (single file)
designSchema.virtual("rawFileUrl").get(function () {
  const designIdToUse = this.designId || this._id;
  if (this.rawFile) {
    return `/uploads/designs/${designIdToUse}/raw/${this.rawFile.filename}`
  }
  // Fallback to old rawFiles array for backward compatibility
  const files = Array.isArray(this.rawFiles) ? this.rawFiles : []
  if (files.length > 0) {
    return `/uploads/designs/${designIdToUse}/raw/${files[0].filename}`
  }
  return null
})

// Virtual for raw file URLs (backward compatibility)
designSchema.virtual("rawFileUrls").get(function () {
  const designIdToUse = this.designId || this._id;
  if (this.rawFile) {
    return [{
      ...this.rawFile.toObject ? this.rawFile.toObject() : this.rawFile,
      url: `/uploads/designs/${designIdToUse}/raw/${this.rawFile.filename}`,
    }]
  }
  const files = Array.isArray(this.rawFiles) ? this.rawFiles : []
  return files.map((file) => {
    const base = file && typeof file.toObject === "function" ? file.toObject() : file
    return {
      ...base,
      url: `/uploads/designs/${designIdToUse}/raw/${base?.filename}`,
    }
  })
})

designSchema.set("toJSON", { virtuals: true })
// Ensure toObject also keeps virtuals when needed
designSchema.set("toObject", { virtuals: true })

export default mongoose.models.Design || mongoose.model("Design", designSchema)
