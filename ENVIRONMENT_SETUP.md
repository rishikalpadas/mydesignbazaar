# Environment Setup Guide

## 🚨 Security Notice

**NEVER commit `.env`, `.env.local`, `.env.development`, or `.env.production` files to git!** These files contain sensitive credentials and should only exist on your local machine and production server.

## Environment Files Structure

This project uses different environment files for different purposes:

### 1. `.env.example` ✅ (Committed to Git)
- **Purpose**: Template file showing all required environment variables
- **Contains**: Placeholder values, no real credentials
- **Usage**: Reference for setting up new environments

### 2. `.env.local` ❌ (NOT Committed)
- **Purpose**: Local development environment
- **Contains**: Your real development credentials
- **Usage**: Automatically loaded by Next.js in development
- **Priority**: Overrides `.env` file

### 3. `.env` ❌ (NOT Committed - DEPRECATED)
- **Status**: No longer used, removed from git
- **Reason**: Was accidentally committed with real credentials

---

## 🔧 Development Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd mydesignbazaar
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Your Local Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your development credentials
# Use a text editor or:
code .env.local  # VS Code
nano .env.local  # Terminal
```

### Step 4: Configure Development Credentials

Update `.env.local` with your development values:

#### MongoDB Development Database
```env
# Use a separate database for development
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/myapp-dev?retryWrites=true&w=majority"
```

**Recommended**: Create a separate MongoDB database for development (e.g., `myapp-dev`) to avoid affecting production data.

#### Generate New JWT Secret (IMPORTANT!)
```bash
# Linux/Mac
openssl rand -hex 64

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated secret to `JWT_SECRET` in `.env.local`.

#### Email Configuration
1. Go to https://myaccount.google.com/apppasswords
2. Generate an app password for Gmail
3. Update `EMAIL_USER` and `EMAIL_APP_PASSWORD`

#### SMS/WhatsApp Provider
For development, you can use `console` mode:
```env
SMS_PROVIDER=console
```

This will log OTP codes to the console instead of sending real SMS/WhatsApp messages.

### Step 5: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## 🚀 Production Setup

### Option A: Using Hosting Platform Environment Variables (RECOMMENDED)

Most hosting platforms (Vercel, Netlify, Railway, Render, etc.) provide a UI to set environment variables:

#### Vercel
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable from `.env.example`
4. Set environment to "Production"
5. Redeploy

#### Netlify
1. Site settings → Environment variables
2. Add each variable
3. Trigger a new deploy

#### Railway / Render
1. Project settings → Environment
2. Add variables
3. Redeploy

### Option B: Using .env.production File (Server-based hosting)

If you're using a VPS or dedicated server:

1. **On your production server**, create `.env.production`:
```bash
nano .env.production
```

2. Add production credentials:
```env
# Production MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/myapp-prod?retryWrites=true&w=majority"

# Production JWT Secret (DIFFERENT from development!)
JWT_SECRET=your-production-jwt-secret-here

# Production Email
EMAIL_USER=production@yourdomain.com
EMAIL_APP_PASSWORD=production-app-password

# Production SMS Provider
SMS_PROVIDER=msg91-whatsapp
MSG91_AUTH_KEY=your-production-msg91-key

# Production Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

3. Build and start:
```bash
npm run build
npm start
```

---

## 🔐 Security Best Practices

### 1. Use Different Credentials for Each Environment

| Environment | Database | JWT Secret | API Keys |
|------------|----------|------------|----------|
| Development | `myapp-dev` | Dev secret | Test/free keys |
| Production | `myapp-prod` | Production secret | Production keys |

### 2. Never Commit Secrets

Files that should **NEVER** be committed:
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- Any file with real credentials

### 3. Rotate Secrets Regularly

If credentials are exposed:
1. **Immediately** change MongoDB password
2. Generate new JWT secret
3. Revoke and regenerate API keys
4. Update all environments

### 4. Remove Secrets from Git History

If you already committed secrets to git:

```bash
# Remove .env from entire git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: Destructive!)
git push origin --force --all
git push origin --force --tags

# Clean up local repo
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

⚠️ **Better approach**: Create a new repository and migrate code without history.

---

## 📋 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens (64+ chars) | Random hex string |
| `NODE_ENV` | Environment name | `development` / `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_USER` | Gmail address for sending emails | - |
| `EMAIL_APP_PASSWORD` | Gmail app password | - |
| `SMS_PROVIDER` | SMS/WhatsApp provider | `console` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the app | `http://localhost:3000` |

### SMS/WhatsApp Providers

See `.env.example` for complete list of provider configurations.

---

## 🧪 Testing Environment Variables

Create a test script to verify your environment:

```javascript
// scripts/test-env.js
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MongoDB:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('- JWT Secret:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
```

Run: `node scripts/test-env.js`

---

## ❓ Troubleshooting

### "Environment variable not found"
- Check spelling in `.env.local`
- Restart development server after changes
- Verify file is in project root

### "Database connection failed"
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure database name is correct

### "JWT secret too short"
- Generate a new secret (64+ characters)
- Use the commands in Step 4 above

---

## 📞 Support

For issues with environment setup, check:
1. This guide
2. `.env.example` for required variables
3. Project documentation
4. MongoDB Atlas network settings
5. API provider dashboards

---

## 🔄 Next.js Environment Variable Loading Order

Next.js loads environment variables in this order (later files override earlier ones):

1. `.env` (all environments)
2. `.env.local` (overrides `.env`, ignored by git)
3. `.env.development` (only in development)
4. `.env.development.local` (development, ignored by git)
5. `.env.production` (only in production)
6. `.env.production.local` (production, ignored by git)

**Recommendation**: Use `.env.local` for development to keep it simple.
