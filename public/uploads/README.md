# Uploads Directory

This directory stores all user-uploaded files for the MyDesignBazaar platform.

## Directory Structure

```
uploads/
├── .gitkeep              # Keeps this directory in Git
├── aadhaar/              # Designer Aadhaar card images
│   └── .gitkeep
├── pan/                  # Designer PAN card images
│   └── .gitkeep
├── sample-designs/       # Designer portfolio sample designs
│   └── .gitkeep
├── general/              # General file uploads
│   └── .gitkeep
└── designs/              # Design submissions (preview & raw files)
    └── .gitkeep
    └── {designId}/       # Each design has its own folder
        ├── preview/      # Preview images (JPG, PNG, WebP)
        │   └── watermarked/  # Watermarked versions
        └── raw/          # Raw design files (PDF, AI, CDR, EPS, SVG)
```

## Git Configuration

### What's Tracked
- ✅ Directory structure (via `.gitkeep` files)
- ✅ This README file

### What's NOT Tracked (Ignored by Git)
- ❌ All uploaded images (*.jpg, *.jpeg, *.png, *.webp)
- ❌ All uploaded documents (*.pdf)
- ❌ All design files (*.ai, *.cdr, *.eps, *.svg)
- ❌ Any other files in these directories

## Security & Privacy

All uploaded files containing sensitive information are automatically excluded from version control:
- **Aadhaar Cards**: Personal identification documents
- **PAN Cards**: Tax identification documents
- **Design Files**: Proprietary creative work
- **Preview Images**: Designer intellectual property

## File Size Limits

- **Preview Images**: Max 5MB per image
- **Raw Design Files**: Max 50MB per file
- **Aadhaar/PAN**: Standard document sizes

## File Type Support

### Preview Images
- JPG/JPEG
- PNG
- WebP

### Raw Design Files
- PDF (Portable Document Format)
- AI (Adobe Illustrator)
- CDR (CorelDRAW)
- EPS (Encapsulated PostScript)
- SVG (Scalable Vector Graphics)

## Important Notes

1. **Never commit uploaded files** to the repository
2. **The `.gitkeep` files** must remain in each directory to preserve the structure
3. **Watermarked previews** are generated automatically for approved designs
4. **Backups** should be configured separately for uploaded files
5. **Production deployments** need proper file storage configuration (local or cloud)

## Deployment Checklist

- [ ] Ensure upload directories have proper write permissions
- [ ] Configure backup strategy for uploaded files
- [ ] Set up CDN (optional) for serving preview images
- [ ] Verify file upload size limits in server configuration
- [ ] Test file upload and retrieval functionality

## File Access

Files are served via the `/api/uploads/[...path]` API route with proper authentication and authorization checks.
