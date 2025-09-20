
import connectDB from "../../../../../lib/mongodb";
import Designer from "../../../../../models/Designer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function GET(request,{params}) {
  try {

    connectDB();
    const token = request.cookies.get("auth-token")?.value;

    console.log("token",process.env.JWT_SECRET);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const id=await params.id;
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const designer = await Designer.findOne({userId:id});
    
    if (!designer) {
      return NextResponse.json(
        { error: "No designer available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: designer }, { status: 200 });
  } catch(error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Failed to get designers. Please try again." },
      { status: 500 }
    );
  }
}
