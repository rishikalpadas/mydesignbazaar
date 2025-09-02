import mongoose from "mongoose"

const designSchema = new mongoose.Schema(
  {
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
    previewImage: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String,
    },
    rawFiles: [
      {
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        mimetype: String,
        fileType: {
          type: String,
          enum: ["psd", "pdf", "cdr", "ai", "eps", "svg"],
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
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
designSchema.index({ uploadedBy: 1 })
designSchema.index({ status: 1 })
designSchema.index({ category: 1 })
designSchema.index({ createdAt: -1 })
designSchema.index({ featured: 1, status: 1 })

// Virtual for preview image URL - matches the actual file structure
designSchema.virtual("previewImageUrl").get(function () {
  return this.previewImage ? `/uploads/designs/${this._id}/preview/${this.previewImage.filename}` : null
})

// Virtual for raw file URLs
designSchema.virtual("rawFileUrls").get(function () {
  const files = Array.isArray(this.rawFiles) ? this.rawFiles : []
  return files.map((file) => {
    const base = file && typeof file.toObject === "function" ? file.toObject() : file
    return {
      ...base,
      url: `/uploads/designs/${this._id}/raw/${base?.filename}`,
    }
  })
})

designSchema.set("toJSON", { virtuals: true })
// Ensure toObject also keeps virtuals when needed
designSchema.set("toObject", { virtuals: true })

export default mongoose.models.Design || mongoose.model("Design", designSchema)
