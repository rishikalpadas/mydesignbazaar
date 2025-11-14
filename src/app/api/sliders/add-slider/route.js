import connectDB from "../../../../lib/mongodb";
import Slider from "../../../../models/Slider";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// File size limit (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// Helper function to save uploaded image
async function saveImage(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;

  // Create directory path
  const uploadDir = path.join(process.cwd(), "public", "uploads", "sliders");
  const filePath = path.join(uploadDir, uniqueFilename);

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // Write file
  await writeFile(filePath, buffer);

  // Return API route path - images will be served via /api/uploads/[...path] route
  return `/api/uploads/sliders/${uniqueFilename}`;
}

export async function POST(request) {
  try {
    // Verify content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({
        message: "Invalid request format. Expected multipart/form-data."
      }, { status: 400 });
    }

    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error("FormData parsing error:", formError);
      return NextResponse.json({
        message: "Failed to parse form data",
        details: formError.message
      }, { status: 400 });
    }

    await connectDB();

    // Extract form fields
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");
    const themeString = formData.get("theme");
    const trending = formData.get("trending") === "true";

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // Validate image file
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { message: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { message: "Image must be JPG, PNG, or WebP" },
        { status: 400 }
      );
    }

    // Parse theme
    let theme;
    try {
      theme = themeString ? JSON.parse(themeString) : {};
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid theme format" },
        { status: 400 }
      );
    }

    // Save image to file system
    let imagePath;
    try {
      imagePath = await saveImage(imageFile);
    } catch (error) {
      console.error("Error saving image:", error);
      return NextResponse.json(
        { message: "Failed to save image" },
        { status: 500 }
      );
    }

    // Get the order number for new slider
    const lastSlider = await Slider.findOne().sort({ order: -1 });
    const order = (lastSlider?.order || 0) + 1;

    // Create new slider
    const slider = new Slider({
      title: title.trim(),
      description: description.trim(),
      image: imagePath,
      theme,
      trending,
      order,
      isActive: true,
    });

    await slider.save();

    return NextResponse.json(
      {
        message: "Slider added successfully",
        slider,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding slider:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add slider" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Get all sliders for dashboard management (not just active ones)
    // Public-facing endpoints should filter for isActive: true
    const sliders = await Slider.find({}).sort({ order: 1 }).lean();

    // Ensure _id is converted to string
    const slidersWithStringIds = sliders.map(slider => ({
      ...slider,
      _id: slider._id.toString()
    }));

    return NextResponse.json(
      {
        message: "Sliders retrieved successfully",
        sliders: slidersWithStringIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}
