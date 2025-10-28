# 🚀 Quick Start: Production Database Setup

## The Problem You Had

You created a new MongoDB database for production, but after deploying and running `pm2 restart`, **the database was empty** - no tables (collections), no admin accounts, no pricing data.

## The Solution

Your production database needs to be **initialized** with data. Here's the fastest way to do it:

---

## ⚡ Quick Setup (2 minutes)

### Step 1: SSH into Your Production Server

```bash
ssh user@your-server-ip
cd /path/to/mydesignbazaar
```

### Step 2: Run the Seeding Script

```bash
npm run seed
```

Or directly:

```bash
node scripts/seed-production.mjs
```

### Step 3: Type "yes" When Prompted

The script will show you what it's going to do and ask for confirmation.

### Step 4: Save the Admin Passwords

The script will output something like:

```
🔑 New Admin Credentials (SAVE THESE!):
   admin@mydesignbazaar.com : Admin@123!MDB
   designer@mydesignbazaar.com : Designer@123!MDB
   buyer@mydesignbazaar.com : Buyer@123!MDB
```

**Save these credentials!** You'll need them to log in.

### Step 5: Done!

Now your database has:
- ✅ 3 admin accounts
- ✅ All system settings (pricing, GST, etc.)
- ✅ Database indexes

---

## 🔄 After Seeding, Restart Your App

```bash
npm run build
pm2 restart all
```

Or if using PM2 ecosystem:

```bash
pm2 restart mydesignbazaar
```

---

## 🧪 Test It Works

### 1. Visit your website
```
https://yourdomain.com
```

### 2. Check pricing loads correctly
- Homepage should show pricing section
- `/pricing` page should load with correct prices

### 3. Log in to admin panel
```
https://yourdomain.com/dashboard
```

Use credentials:
- **Email**: `admin@mydesignbazaar.com`
- **Password**: `Admin@123!MDB`

### 4. Change the default password
After logging in, go to settings and change the password immediately!

---

## 📋 What Gets Created

| Item | Count | Details |
|------|-------|---------|
| Admin Accounts | 3 | Super admin, Designer admin, Buyer admin |
| System Settings | 10+ | Pricing, GST, commissions, etc. |
| Collections | Auto | Created by Mongoose when needed |

---

## 🔧 Common Issues

### "MONGODB_URI not configured"

**Fix**: Make sure your `.env.production` or `.env.local` has the MongoDB URI:

```bash
# On your production server
nano .env.production

# Add:
MONGODB_URI="your-production-mongodb-uri"
```

Then restart:

```bash
pm2 restart all
```

### "Cannot connect to database"

**Fix**: Check MongoDB Atlas network access:
1. Go to MongoDB Atlas dashboard
2. Network Access → Add IP Address
3. Add your server's IP (or `0.0.0.0/0` temporarily)

### "Admins already exist"

**Fix**: This is fine! It means your database already has admin accounts. The script won't overwrite them.

### Pricing still not showing

**Fix**:
1. Check if system settings were created: Log in to admin panel → Settings
2. If settings are empty, the seeder didn't run completely
3. Run the seeder again: `npm run seed`

---

## 🎯 Alternative: Use /setup Page

If you prefer a UI instead of command line:

### 1. Visit the setup page
```
https://yourdomain.com/setup
```

### 2. Click "Setup Database"

This creates admin accounts (but NOT system settings).

### 3. Log in and initialize settings

Log in as admin, go to Settings page, and look for an "Initialize" button.

---

## 🔐 Security Reminder

After setup:

- [ ] Change all default admin passwords
- [ ] Remove or protect the `/setup` page
- [ ] Set up MongoDB backups
- [ ] Document admin credentials securely

---

## 📊 Verifying Everything Works

### Check 1: Admin accounts exist

```bash
# On your server
mongosh "your-mongodb-uri"
> use your-database-name
> db.admins.countDocuments()
# Should return: 3
```

### Check 2: System settings exist

```bash
> db.systemsettings.countDocuments()
# Should return: 10 or more
```

### Check 3: API returns pricing

```bash
curl https://yourdomain.com/api/admin/settings?public=true
# Should return JSON with pricing data
```

---

## 🆘 Still Having Issues?

1. Check full documentation: [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md)
2. Check environment setup: [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
3. Check server logs:
   ```bash
   pm2 logs mydesignbazaar
   ```

---

## ✅ Summary

**Before**: Empty MongoDB database, no data
**After**: Fully initialized database with admins + settings
**Time**: ~2 minutes
**Command**: `npm run seed`

That's it! 🎉
