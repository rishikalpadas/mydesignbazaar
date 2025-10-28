# Production Database Setup Guide

## Problem: Fresh MongoDB Database Has No Data

When you create a new MongoDB database for production, it starts completely empty. You need to initialize it with:
- ✅ Admin accounts
- ✅ System settings (pricing, GST, etc.)
- ✅ Database indexes

This guide shows you **multiple methods** to initialize your production database.

---

## 🎯 Method 1: Using the Seeding Script (RECOMMENDED)

This is the **easiest and most reliable** method.

### Step 1: SSH into Your Production Server

```bash
ssh user@your-server-ip
cd /path/to/mydesignbazaar
```

### Step 2: Ensure Production Environment Variables Are Set

Your production server should have `.env.production` or `.env.local` with:

```env
MONGODB_URI="mongodb+srv://username:NEW_PASSWORD@cluster.mongodb.net/myapp-prod?retryWrites=true&w=majority"
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
# ... other variables
```

### Step 3: Run the Seeding Script

```bash
# Make sure you're in the project root
cd /path/to/mydesignbazaar

# Install dependencies if needed
npm install

# Run the seeder
node scripts/seed-production.js
```

### Step 4: Follow the Prompts

The script will:
1. Show you what database it's connecting to
2. Ask for confirmation
3. Create admin accounts
4. Create system settings
5. Display the admin credentials (SAVE THESE!)

Example output:
```
============================================================
  🚀 MyDesignBazaar - Production Database Seeder
============================================================

📦 MongoDB URI: mongodb+srv://****@cluster.mongodb.net/myapp-prod
🌍 Node Environment: production

⚠️  WARNING: This will seed your database with initial data.
Continue? (yes/no): yes

🔌 Connecting to MongoDB...
  ✅ Connected successfully!

📋 Seeding Admin Accounts...
  ✅ admin@mydesignbazaar.com - Created (Password: Admin@123!MDB)
  ✅ designer@mydesignbazaar.com - Created (Password: Designer@123!MDB)
  ✅ buyer@mydesignbazaar.com - Created (Password: Buyer@123!MDB)

⚙️  Seeding System Settings...
  ✅ gst_percentage - Created
  ✅ price_basic_plan - Created
  ✅ price_premium_plan - Created
  ... (and more)

============================================================
  ✨ Database seeding completed successfully!
============================================================
```

### Step 5: Save Admin Credentials

**IMPORTANT:** Save the admin passwords shown in the output! You'll need them to log in.

---

## 🌐 Method 2: Using the /setup Web Page

### Step 1: Navigate to Setup Page

In your browser, visit:
```
https://yourdomain.com/setup
```

Or for development:
```
http://localhost:3000/setup
```

### Step 2: Click "Setup Database"

The page will:
- Create 3 admin accounts
- Display the credentials
- Show confirmation

### Step 3: Initialize System Settings

After creating admins, you need to initialize system settings. As a super admin:

1. Log in at `/dashboard` with: `admin@mydesignbazaar.com`
2. Go to **Settings** page (super admin only)
3. Click **"Initialize Default Settings"** if available

Or run this manually via API:

```bash
curl -X POST https://yourdomain.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"action": "initialize"}'
```

### Step 4: Security - Remove /setup Page in Production

**IMPORTANT:** The `/setup` page should be removed or protected in production!

Option A: Delete the setup page:
```bash
rm -rf src/app/setup
```

Option B: Add authentication check to the setup page (already implemented in the API route)

---

## 🔧 Method 3: Manual Database Initialization via mongosh

If you prefer direct database access:

### Step 1: Connect to MongoDB

```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/myapp-prod"
```

### Step 2: Create Admin User

```javascript
use myapp-prod  // Your database name

// Create super admin
db.admins.insertOne({
  email: "admin@mydesignbazaar.com",
  password: "$2a$12$[bcrypt-hash-here]",  // You need to hash this first!
  name: "Super Administrator",
  role: "super_admin",
  permissions: [
    "manage_designers", "manage_buyers", "manage_designs",
    "manage_payments", "manage_orders", "view_analytics",
    "manage_admins", "system_settings"
  ],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** You need to hash passwords using bcrypt first. This method is **NOT recommended** - use Method 1 or 2 instead.

---

## 🚨 Common Issues & Solutions

### Issue 1: "MONGODB_URI not configured"

**Solution:** Make sure your production environment variables are set.

For PM2:
```bash
# Check current environment
pm2 env 0

# Set environment variables
pm2 stop all
# Edit your .env.production or ecosystem.config.js
pm2 start ecosystem.config.js --env production
```

For Vercel/Netlify/Railway:
- Add environment variables in the platform dashboard
- Redeploy your application

### Issue 2: "Connection timeout" or "Network error"

**Solution:** Check MongoDB Atlas network access:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add your server's IP or use `0.0.0.0/0` (not recommended for production)
4. Make sure your MongoDB user has proper permissions

### Issue 3: "Admin already exists"

**Solution:** This is fine! It means admins were already created. Skip to system settings.

### Issue 4: System settings not showing up

**Solution:** Run the seeder script again or manually initialize:

```bash
curl -X POST http://localhost:3000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'
```

### Issue 5: "Cannot find module" errors

**Solution:** Install dependencies:
```bash
npm install
# or
npm ci  # For production, uses package-lock.json
```

---

## 📋 Default Admin Credentials

After seeding, these accounts will be created:

| Role | Email | Default Password | Access |
|------|-------|-----------------|---------|
| Super Admin | admin@mydesignbazaar.com | Admin@123!MDB | Full system access |
| Designer Admin | designer@mydesignbazaar.com | Designer@123!MDB | Designers & designs |
| Buyer Admin | buyer@mydesignbazaar.com | Buyer@123!MDB | Buyers & orders |

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

---

## 🔒 Security Checklist

After database initialization:

- [ ] Changed all default admin passwords
- [ ] Removed or protected `/setup` page
- [ ] Verified system settings in admin panel
- [ ] Tested login functionality
- [ ] Checked pricing displays correctly on frontend
- [ ] Verified MongoDB network access rules
- [ ] Set up database backups
- [ ] Documented new admin credentials securely

---

## 📊 What Gets Created

### Admin Accounts
- 3 admin users with different permission levels
- Passwords are bcrypt-hashed (12 rounds)
- All accounts are active by default

### System Settings
- **GST percentage**: 18%
- **Platform commission**: 20%
- **Subscription plan prices**:
  - Basic: ₹600
  - Premium: ₹5,000
  - Elite: ₹50,000
- **Pay-per-download prices**:
  - Standard: ₹199
  - Exclusive: ₹399
  - AI: ₹499
- **Other settings**: Minimum withdrawal, auto-approval, etc.

---

## 🔄 Updating Production After Seeding

After initial setup, to deploy new changes:

### Using PM2:
```bash
git pull origin main
npm install
npm run build
pm2 restart all
```

### Using Vercel/Netlify:
- Just push to your git repository
- Platform auto-deploys

### Using Docker:
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🧪 Testing the Setup

### 1. Test Database Connection
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message));"
```

### 2. Test Admin Login
Visit `/dashboard` and log in with admin credentials

### 3. Test Pricing Display
- Visit homepage → Check pricing section
- Visit `/pricing` → Verify prices load correctly

### 4. Test Settings Page
- Log in as super admin
- Go to Settings
- Try updating a price
- Refresh homepage/pricing page to verify change

---

## 📞 Need Help?

### If seeding fails:
1. Check MongoDB URI is correct
2. Verify network access in MongoDB Atlas
3. Check server logs for errors
4. Try manual method via `/setup` page

### If pricing doesn't show:
1. Verify system settings exist in database
2. Check browser console for API errors
3. Verify API route `/api/admin/settings?public=true` works

### If login doesn't work:
1. Verify admin accounts were created
2. Check password is correct (case-sensitive)
3. Check JWT_SECRET is set
4. Clear browser cookies and try again

---

## 📁 Related Files

- [scripts/seed-production.js](./scripts/seed-production.js) - Main seeding script
- [src/app/api/setup/database/route.js](./src/app/api/setup/database/route.js) - Setup API
- [src/app/setup/page.jsx](./src/app/setup/page.jsx) - Setup UI page
- [src/models/SystemSettings.js](./src/models/SystemSettings.js) - Settings schema
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment configuration guide

---

## ✅ Quick Start Checklist

For a brand new production database:

1. [ ] Set up `.env.production` with production MongoDB URI
2. [ ] Run `npm install` on production server
3. [ ] Run `node scripts/seed-production.js`
4. [ ] Save admin credentials shown in output
5. [ ] Run `npm run build && pm2 restart all`
6. [ ] Visit your domain and test login
7. [ ] Change default admin passwords
8. [ ] Verify pricing shows correctly
9. [ ] Set up database backups
10. [ ] Document production credentials securely

---

Last updated: 2025-10-28
