
import connectDB from "../../../../lib/mongodb";
import { User, Designer } from "../../../../models/User";
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

    // Get all designer users
    const users = await User.find({userType:"designer"}).lean();

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No designer available" },
        { status: 404 }
      );
    }

    // Get all designer profiles, excluding blocked ones
    const userIds = users.map(u => u._id);
    const profiles = await Designer.find({
      userId: { $in: userIds },
      accountStatus: { $ne: 'blocked' } // Exclude blocked designers
    }).lean();

    // Create a map of userId to profile
    const profileMap = new Map(profiles.map(p => [String(p.userId), p]));

    // Combine user and profile data, only including non-blocked designers
    const designers = users
      .filter(u => profileMap.has(String(u._id))) // Filter out blocked designers
      .map(u => ({
        ...u,
        profile: profileMap.get(String(u._id))
      }));

    return NextResponse.json({ data: designers, designers: designers }, { status: 200 });
  } catch(error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Failed to get designers. Please try again." },
      { status: 500 }
    );
  }
}
