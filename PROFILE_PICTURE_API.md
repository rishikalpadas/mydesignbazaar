# Profile Picture API Documentation

## Overview
The profile picture system uses a dedicated `ProfilePicture` schema that stores profile pictures with user references. This allows for better organization, file management, and metadata tracking.

## Database Schema

### ProfilePicture Model
Located in: `src/models/ProfilePicture.js`

```javascript
{
  userId: ObjectId (unique, indexed),
  userType: String ('designer' | 'buyer' | 'admin'),
  imageUrl: String (e.g., '/uploads/profile-pics/1234567890-abc123.jpg'),
  filename: String,
  fileSize: Number (in bytes),
  mimeType: String ('image/jpeg' | 'image/jpg' | 'image/png'),
  uploadedAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Upload/Update Profile Picture
**Endpoint:** `POST /api/upload/profile-pic`

**Authentication:** Required

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with 'file' field

**Validation:**
- File types: JPG, JPEG, PNG only
- Max size: 5MB
- User must be authenticated

**Response:**
```json
{
  "success": true,
  "url": "/uploads/profile-pics/1234567890-abc123.jpg",
  "filename": "1234567890-abc123.jpg",
  "profilePicture": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "imageUrl": "/uploads/profile-pics/1234567890-abc123.jpg",
    "uploadedAt": "2025-11-23T10:30:00.000Z"
  }
}
```

**Features:**
- Automatically deletes old profile picture when uploading new one
- Creates ProfilePicture record or updates existing one
- Stores file metadata (size, type, timestamps)

---

### 2. Get Profile Picture
**Endpoint:** `GET /api/upload/profile-pic`

**Authentication:** Required

**Response (when picture exists):**
```json
{
  "success": true,
  "profilePicture": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "imageUrl": "/uploads/profile-pics/1234567890-abc123.jpg",
    "filename": "1234567890-abc123.jpg",
    "fileSize": 524288,
    "mimeType": "image/jpeg",
    "uploadedAt": "2025-11-23T10:30:00.000Z",
    "updatedAt": "2025-11-23T10:30:00.000Z"
  }
}
```

**Response (when no picture):**
```json
{
  "success": true,
  "profilePicture": null
}
```

---

### 3. Delete Profile Picture
**Endpoint:** `DELETE /api/upload/profile-pic`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Profile picture deleted successfully"
}
```

**Features:**
- Deletes file from filesystem
- Removes ProfilePicture record from database

---

## Integration with User Profiles

### Designer Profile API
**Endpoint:** `GET /api/designer/profile`

The profile response includes `profile_pic` fetched from ProfilePicture collection:
```json
{
  "success": true,
  "profile": {
    "fullName": "John Doe",
    "displayName": "John",
    "profile_pic": "/uploads/profile-pics/1234567890-abc123.jpg",
    ...
  }
}
```

### Buyer Profile API
**Endpoint:** `GET /api/buyer/profile`

Same structure as designer profile.

### Admin Profile API
**Endpoint:** `GET /api/admin/profile`

Same structure as designer profile.

---

## File Storage

**Location:** `public/uploads/profile-pics/`

**Filename Format:** `{timestamp}-{random}.{ext}`
- Example: `1732356000000-a1b2c3d.jpg`

**Access:** Files are publicly accessible via URL
- Example: `http://yourdomain.com/uploads/profile-pics/1732356000000-a1b2c3d.jpg`

---

## Usage in Frontend

### Upload Profile Picture
```javascript
const handleUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload/profile-pic', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  
  const data = await response.json()
  if (data.success) {
    console.log('Uploaded:', data.profilePicture.imageUrl)
  }
}
```

### Fetch Profile Picture
```javascript
const fetchProfilePic = async () => {
  const response = await fetch('/api/upload/profile-pic', {
    credentials: 'include'
  })
  
  const data = await response.json()
  if (data.success && data.profilePicture) {
    setProfilePic(data.profilePicture.imageUrl)
  }
}
```

### Delete Profile Picture
```javascript
const deleteProfilePic = async () => {
  const response = await fetch('/api/upload/profile-pic', {
    method: 'DELETE',
    credentials: 'include'
  })
  
  const data = await response.json()
  if (data.success) {
    console.log('Deleted successfully')
  }
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request (Invalid file type):**
```json
{
  "error": "Invalid file type. Only JPG, JPEG, and PNG files are allowed."
}
```

**400 Bad Request (File too large):**
```json
{
  "error": "File size too large. Maximum size is 5MB."
}
```

**404 Not Found:**
```json
{
  "error": "Profile picture not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to upload profile picture",
  "details": "Error message here"
}
```

---

## Security Features

1. **Authentication Required:** All endpoints require valid JWT token
2. **File Type Validation:** Only JPG, JPEG, PNG allowed
3. **File Size Limit:** Maximum 5MB
4. **User Isolation:** Users can only access/modify their own profile pictures
5. **Automatic Cleanup:** Old pictures are deleted when new ones are uploaded

---

## Database Indexes

The `ProfilePicture` collection has a unique index on `userId` to ensure:
- Fast lookups by user
- One profile picture per user
- Data integrity

---

## Future Enhancements

Potential improvements:
- Image optimization (resize, compress)
- Support for multiple profile pictures (avatar, cover, etc.)
- Image cropping functionality
- CDN integration for better performance
- Thumbnail generation
- Image format conversion (WebP)
