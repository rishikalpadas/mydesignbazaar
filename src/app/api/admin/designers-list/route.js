
import connectDB from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("auth-token")?.value;

    console.log("token",process.env.JWT_SECRET);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const designer = await User.find({userType:"designer"});
    
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
