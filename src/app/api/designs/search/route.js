import connectDB from "../../../../lib/mongodb";
import Design from "../../../../models/Design";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 1) {
      return Response.json(
        { designs: [] },
        { status: 200 }
      );
    }

    // Create a regex pattern for case-insensitive search
    const searchPattern = new RegExp(query, "i");

    // Search across title, category, designId, tags and description
    const designs = await Design.find({
      $or: [
        { title: searchPattern },
        { category: searchPattern },
        { designId: searchPattern },
        { tags: searchPattern },
        { description: searchPattern },
      ],
      status: "approved", // Only show approved designs
    })
      .select("_id title category previewImage previewImages designId tags")
      .limit(8)

    // Convert to plain objects and include virtual fields
    const designsWithImages = designs.map((design) => {
      const obj = design.toObject({ virtuals: true })
      return {
        _id: obj._id,
        title: obj.title,
        category: obj.category,
        designId: obj.designId,
        tags: obj.tags,
        previewImageUrls: obj.previewImageUrls,
      }
    })

    return Response.json(
      { designs: designsWithImages },
      { status: 200 }
    )
  } catch (error) {
    console.error("Search error:", error);
    return Response.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
