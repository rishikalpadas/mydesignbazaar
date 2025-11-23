import mongoose from 'mongoose';

const profilePictureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['designer', 'buyer', 'admin'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
profilePictureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProfilePicture = mongoose.models.ProfilePicture || mongoose.model('ProfilePicture', profilePictureSchema);

export default ProfilePicture;
