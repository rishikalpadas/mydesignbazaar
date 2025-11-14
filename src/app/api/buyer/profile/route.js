import connectDB from "../../../../lib/mongodb";
import { User, Buyer } from "../../../../models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../middleware/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;

    // Fetch user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is a buyer
    if (user.userType !== "buyer") {
      return NextResponse.json(
        { success: false, message: "Access denied. Buyer account required." },
        { status: 403 }
      );
    }

    // Fetch buyer profile
    const buyerProfile = await Buyer.findOne({ userId: user._id })
      .populate("currentSubscription")
      .lean();

    if (!buyerProfile) {
      // Return basic user info if buyer profile doesn't exist yet
      return NextResponse.json(
        {
          success: true,
          profile: {
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
            creditPoints: user.creditPoints || 0,
            fullName: user.name || "",
            mobileNumber: "",
            businessType: "other",
            address: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "India",
              gstNumber: "",
            },
            paymentMethods: [],
            billingCurrency: "INR",
            interestedCategories: [],
            purchaseFrequency: "occasionally",
            agreements: {
              licensedUse: false,
              noCopyright: false,
              refundPolicy: false,
              noIllegalDesigns: false,
              compliance: false,
            },
            stats: {
              totalPurchases: 0,
              totalSpent: 0,
            },
            currentSubscription: null,
            isComplete: false, // Flag to show profile is incomplete
          },
        },
        { status: 200 }
      );
    }

    // Combine user and buyer data
    const profile = {
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      creditPoints: user.creditPoints || 0,
      fullName: buyerProfile.fullName,
      mobileNumber: buyerProfile.mobileNumber,
      businessType: buyerProfile.businessType,
      address: buyerProfile.address,
      paymentMethods: buyerProfile.paymentMethods || [],
      billingCurrency: buyerProfile.billingCurrency,
      interestedCategories: buyerProfile.interestedCategories || [],
      purchaseFrequency: buyerProfile.purchaseFrequency,
      agreements: buyerProfile.agreements,
      stats: {
        totalPurchases: buyerProfile.totalPurchases || 0,
        totalSpent: buyerProfile.totalSpent || 0,
      },
      currentSubscription: buyerProfile.currentSubscription,
      isComplete: true, // Profile is complete
    };

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
