
import connectDB from '../../../../lib/mongodb';
import Design from "../../../../models/Design";
import { NextResponse } from "next/server";



export async function GET(request,{params}) {
  try {
    connectDB();
    const id=await params.id;

    const design = await Design.findOne({_id:id});
    
    if (!design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: design }, { status: 200 });
  } catch(error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Failed to get design. Please try again." },
      { status: 500 }
    );
  }
}
