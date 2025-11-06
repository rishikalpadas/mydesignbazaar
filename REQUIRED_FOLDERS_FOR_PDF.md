# Required Folder Structure for PDF Generation

## Overview
For the PDF generation feature to work properly, you need the correct folder structure in the `public/uploads` directory. This is where all user-uploaded documents and files are stored.

## Required Folder Structure

```
public/
└── uploads/
    ├── .gitkeep                     # Keeps uploads directory in Git
    ├── README.md                    # Documentation (optional but recommended)
    ├── aadhaar/                     # Aadhaar card documents
    │   └── .gitkeep
    ├── pan/                         # PAN card documents  
    │   └── .gitkeep
    ├── general/                     # General file uploads
    │   └── .gitkeep
    ├── sample-designs/              # Designer portfolio samples
    │   └── .gitkeep
    ├── designs/                     # Design submissions
    │   └── .gitkeep
    │   └── {designId}/             # Individual design folders
    │       ├── preview/            # Preview images
    │       │   └── watermarked/    # Watermarked versions
    │       └── raw/                # Raw design files
    ├── gst/                        # GST certificates (if used)
    │   └── .gitkeep
    ├── bank/                       # Bank documents (cancelled cheques)
    │   └── .gitkeep
    └── portfolio/                  # Portfolio files (if separate from sample-designs)
        └── .gitkeep
```

## Currently Existing Folders

Based on your current structure, you have:

✅ **Existing:**
- `public/uploads/`
- `public/uploads/aadhaar/`
- `public/uploads/pan/`
- `public/uploads/general/`
- `public/uploads/sample-designs/`
- `public/uploads/designs/`

## Potentially Missing Folders

You may need to create these additional folders based on your designer registration requirements:

### For Designer Documents:
```bash
# GST certificates
public/uploads/gst/

# Bank documents (cancelled cheques)
public/uploads/bank/

# Portfolio samples (if different from sample-designs)
public/uploads/portfolio/
```

## How to Create Missing Folders

### Method 1: Using File Explorer (Windows)
1. Navigate to `d:\rishi\mydesignbazaar\public\uploads\`
2. Right-click → New → Folder
3. Create folders: `gst`, `bank`, `portfolio` (if needed)
4. In each new folder, create an empty file named `.gitkeep`

### Method 2: Using Command Line
```cmd
cd d:\rishi\mydesignbazaar\public\uploads
mkdir gst
mkdir bank  
mkdir portfolio
echo. > gst\.gitkeep
echo. > bank\.gitkeep
echo. > portfolio\.gitkeep
```

### Method 3: Using PowerShell (if execution policy allows)
```powershell
cd d:\rishi\mydesignbazaar\public\uploads
New-Item -ItemType Directory -Name "gst"
New-Item -ItemType Directory -Name "bank"
New-Item -ItemType Directory -Name "portfolio"
New-Item -ItemType File -Path "gst\.gitkeep"
New-Item -ItemType File -Path "bank\.gitkeep" 
New-Item -ItemType File -Path "portfolio\.gitkeep"
```

## File Types Expected in Each Folder

### `aadhaar/`
- **Purpose:** Aadhaar card images
- **File types:** `.jpg`, `.jpeg`, `.png`, `.pdf`
- **Used in PDF:** Yes - shows "✓ Uploaded" or "✗ Not Uploaded"

### `pan/`
- **Purpose:** PAN card images
- **File types:** `.jpg`, `.jpeg`, `.png`, `.pdf`
- **Used in PDF:** Yes - shows "✓ Uploaded" or "✗ Not Uploaded"

### `gst/` (if needed)
- **Purpose:** GST certificate documents
- **File types:** `.pdf`, `.jpg`, `.jpeg`, `.png`
- **Used in PDF:** Yes - shows "✓ Uploaded" if `gstCertificate` field exists

### `bank/` (if needed)
- **Purpose:** Cancelled cheque images
- **File types:** `.jpg`, `.jpeg`, `.png`, `.pdf`
- **Used in PDF:** Yes - shows "✓ Uploaded" if `cancelledCheque` field exists

### `sample-designs/` or `portfolio/`
- **Purpose:** Designer portfolio samples
- **File types:** `.jpg`, `.jpeg`, `.png`, `.pdf`, `.ai`, `.cdr`, `.eps`, `.svg`
- **Used in PDF:** Yes - shows count if `portfolioSamples` array has items

### `designs/`
- **Purpose:** Customer design submissions
- **File types:** Various design formats
- **Used in PDF:** No (not related to designer registration)

### `general/`
- **Purpose:** General file uploads
- **File types:** Various
- **Used in PDF:** Potentially, depends on usage

## Important Notes

### 1. Permissions
Ensure the web server has **write permissions** to all upload folders:
- IIS: Configure appropriate user permissions
- Development: Usually inherited from parent directory

### 2. Security
- Never commit uploaded files to Git (already configured in `.gitignore`)
- The `.gitkeep` files should remain to preserve folder structure
- Files are served via `/api/uploads/[...path]` with security checks

### 3. PDF Generation Dependencies
The PDF generation looks for files in these paths:
```javascript
// Example file path construction in PDF generation:
const filePath = `/uploads/${type}/${filename}`
// Where type is: 'aadhaar', 'pan', 'gst', 'bank', etc.
```

### 4. API Route Compatibility
The `/api/uploads/[...path]` route can serve files from any subfolder under `uploads/`, so creating additional folders won't break existing functionality.

## Verification Steps

After creating the folders, verify they work:

1. **Check folder structure:**
   ```cmd
   dir public\uploads /s
   ```

2. **Test file upload** (if you have upload functionality)

3. **Test PDF generation** - should show proper document status

4. **Check API access:**
   - Try accessing: `https://yoursite.com/api/uploads/gst/test.pdf`
   - Should return 404 (not 403), indicating the folder is accessible

## Current Status Assessment

Based on your existing structure, **the PDF generation should work** with the current folders for:
- ✅ Aadhaar cards (`/uploads/aadhaar/`)
- ✅ PAN cards (`/uploads/pan/`)
- ✅ Portfolio samples (`/uploads/sample-designs/`)

You **may need to add** these folders if your designer registration form accepts:
- ❓ GST certificates → `public/uploads/gst/`
- ❓ Cancelled cheques → `public/uploads/bank/`

## Recommendation

**For immediate PDF functionality:** Your current folders are sufficient.

**For complete feature support:** Create the additional folders (`gst`, `bank`) as shown above to ensure all document types can be uploaded and referenced in PDFs.

The Print-to-PDF feature will work regardless of folder structure since it only displays the information, not the actual files.