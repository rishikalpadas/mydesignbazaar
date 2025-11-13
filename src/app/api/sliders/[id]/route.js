import connectDB from "../../../../lib/mongodb";
import Slider from "../../../../models/Slider";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to delete image file
async function deleteImage(imagePath) {
  try {
    // Remove leading slash and construct full path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    await unlink(fullPath);
  } catch (error) {
    console.error("Error deleting image file:", error);
    // Don't throw error if file doesn't exist
  }
}

// DELETE: Delete a slider
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    console.log("DELETE request for slider ID:", id);

    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid slider ID format:", id);
      return NextResponse.json(
        { message: "Invalid slider ID format" },
        { status: 400 }
      );
    }

    // Find the slider first to get the image path
    const slider = await Slider.findById(id);

    console.log("Slider found:", slider ? "Yes" : "No");

    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }

    // Delete the image file from file system
    if (slider.image) {
      await deleteImage(slider.image);
    }

    // Delete the slider from database
    await Slider.findByIdAndDelete(id);

    console.log("Slider deleted successfully:", id);

    return NextResponse.json(
      { message: "Slider deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting slider:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete slider" },
      { status: 500 }
    );
  }
}

// PATCH: Update slider (e.g., toggle isActive)
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    console.log("PATCH request for slider ID:", id);
    console.log("Update data:", body);

    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      console.error("Invalid slider ID format:", id);
      return NextResponse.json(
        { message: "Invalid slider ID format" },
        { status: 400 }
      );
    }

    // Find and update the slider
    const slider = await Slider.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    console.log("Slider updated:", slider ? "Yes" : "No");

    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Slider updated successfully",
        slider,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating slider:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update slider" },
      { status: 500 }
    );
  }
}
