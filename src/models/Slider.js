import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    theme: {
      type: Object,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    cta: {
      type: String,
      default: "Explore Now",
    },
    ctaLink: {
      type: String,
      default: "/",
    },
    stats: {
      designs: {
        type: String,
        default: "1K+",
      },
      rating: {
        type: String,
        default: "4.8",
      },
      downloads: {
        type: String,
        default: "10K+",
      },
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Slider || mongoose.model("Slider", SliderSchema);
