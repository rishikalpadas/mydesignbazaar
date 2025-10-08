
import connectDB from '../../../../lib/mongodb';
import Design from "../../../../models/Design";
import { NextResponse } from "next/server";



export async function GET(request,{params}) {
  try {
    connectDB();
    const { id } = await params;

    const design = await Design.findOne({_id:id}).lean();

    if (!design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    // Manually compute virtuals for lean query
    const designIdToUse = design.designId || design._id.toString();
    console.log(`Design lookup: MongoDB _id=${design._id}, designId=${design.designId}, using=${designIdToUse}`);

    // Compute previewImageUrls
    const previewImageUrls = design.previewImages && design.previewImages.length > 0
      ? design.previewImages.map((img) => ({
          ...img,
          url: `/api/uploads/designs/${designIdToUse}/preview/${img.filename}`,
        }))
      : design.previewImage ? [{
          ...design.previewImage,
          url: `/api/uploads/designs/${designIdToUse}/preview/${design.previewImage.filename}`,
          isPrimary: true
        }] : [];

    // Compute rawFileUrls
    const rawFileUrls = design.rawFile
      ? [{
          ...design.rawFile,
          url: `/api/uploads/designs/${designIdToUse}/raw/${design.rawFile.filename}`,
        }]
      : (design.rawFiles || []).map((file) => ({
          ...file,
          url: `/api/uploads/designs/${designIdToUse}/raw/${file.filename}`,
        }));

    return NextResponse.json({
      data: {
        ...design,
        previewImageUrls,
        rawFileUrls
      }
    }, { status: 200 });
  } catch(error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Failed to get design. Please try again." },
      { status: 500 }
    );
  }
}
