# 🚨 URGENT Security Actions Required

## ⚠️ Your credentials were exposed on GitHub!

Your `.env` file with real MongoDB credentials and JWT secret was committed to GitHub. Take these actions **IMMEDIATELY**:

---

## 1. Change MongoDB Password (CRITICAL - Do This NOW!)

### Steps:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on **Database Access** in the left sidebar
3. Find user `rishikalpadas`
4. Click **Edit** → **Edit Password**
5. Click **Autogenerate Secure Password** (recommended)
6. Copy the new password
7. Update your `.env.local` with the new password:
   ```
   MONGODB_URI="mongodb+srv://rishikalpadas:NEW_PASSWORD_HERE@cluster0.0whq45e.mongodb.net/ecommerce-dev?retryWrites=true&w=majority&appName=Cluster0"
   ```
8. **IMPORTANT**: Also update your production server with the new password!

---

## 2. Generate New JWT Secret (CRITICAL)

Your old JWT secret was exposed. Generate a new one:

```bash
# Run this command:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update:
- **Development**: `.env.local` → `JWT_SECRET=new-secret-here`
- **Production**: Your hosting platform's environment variables

---

## 3. Push Changes to GitHub

```bash
git push origin main
```

This will:
- Remove `.env` from the repository
- Add `.env.example` (safe template)
- Protect future `.env` files from being committed

---

## 4. Update Production Server

### If using Vercel/Netlify/Railway/Render:
1. Go to your project dashboard
2. Navigate to **Environment Variables** or **Settings**
3. Add/update these variables:
   - `MONGODB_URI` (with NEW password)
   - `JWT_SECRET` (with NEW secret)
   - `NODE_ENV=production`
   - All other variables from `.env.example`
4. Trigger a new deployment

### If using VPS/Server:
1. SSH into your server
2. Navigate to your project directory
3. Create/edit production environment file:
   ```bash
   nano .env.production
   # or
   nano .env.local
   ```
4. Add production credentials (see ENVIRONMENT_SETUP.md)
5. Restart your application

---

## 5. Verify Changes

### Development:
```bash
npm run dev
```
- App should start normally
- Check MongoDB connection works
- Test authentication/login

### Production:
- Visit your live site
- Test login functionality
- Verify database operations work

---

## 6. (Optional but Recommended) Remove Secrets from Git History

Your old credentials are still in git history. To completely remove them:

### Option A: Simple Cleanup (Recommended)
```bash
# Remove .env from entire git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
git push origin --force --tags
```

### Option B: Nuclear Option (Most Secure)
Create a fresh repository:
1. Create new GitHub repository
2. Copy all code (except `.env`) to new location
3. Initialize new git repo
4. Push to new repository
5. Update your team/deployments
6. Delete old repository

---

## 7. Future Prevention Checklist

✅ Use `.env.local` for development (already set up)
✅ Never commit `.env` files (`.gitignore` updated)
✅ Use `.env.example` as template (created)
✅ Different credentials per environment (see guide)
✅ Regular credential rotation (quarterly recommended)

---

## Quick Reference: What Files Go Where?

| File | Development | Git | Production Server |
|------|------------|-----|------------------|
| `.env.example` | ✅ Reference | ✅ Commit | ❌ Not needed |
| `.env.local` | ✅ Use this | ❌ Never | ❌ Never |
| `.env` | ❌ Deleted | ❌ Never | ❌ Never |
| `.env.production` | ❌ No | ❌ Never | ✅ Use this (or platform vars) |

---

## Need Help?

1. Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions
2. Check [.env.example](./.env.example) for all required variables
3. Contact your hosting provider's support for platform-specific help

---

## Timeline

- ⏱️ **Now**: Change MongoDB password + JWT secret (5 minutes)
- ⏱️ **Next**: Push changes + update production (10 minutes)
- ⏱️ **Later**: Clean git history (optional, 15 minutes)
- ⏱️ **Future**: Rotate secrets quarterly

---

## Status Checklist

- [ ] Changed MongoDB password in Atlas
- [ ] Generated new JWT secret
- [ ] Updated `.env.local` with new credentials
- [ ] Pushed changes to GitHub
- [ ] Updated production environment variables
- [ ] Tested development environment
- [ ] Tested production environment
- [ ] (Optional) Cleaned git history
- [ ] Informed team about credential change

---

**Last updated**: ${new Date().toISOString().split('T')[0]}
