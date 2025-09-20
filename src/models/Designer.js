import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const bankDetailsSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  ifscCode: { type: String, required: true },
});

const agreementsSchema = new mongoose.Schema({
  totalDesigns: { type: Number, default: 0 },
  approvedDesigns: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
});

const designerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: addressSchema, required: true },
    panNumber: { type: String, required: true, unique: true },
    bankDetails: { type: bankDetailsSchema, required: true },
    sampleDesigns: { type: [String], default: [] }, // array of image/file URLs
    specializations: { type: [String], default: [] },
    agreements: { type: agreementsSchema, default: {} },
  },
  { timestamps: true }
);

const Designer =
  mongoose.models.Designer || mongoose.model("Designer", designerSchema);

export default Designer;
