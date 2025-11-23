# Database Migration Scripts

## Available Migrations

### 1. Slider Image Path Migration

#### Problem
Previously, slider images were stored with relative paths like `/uploads/sliders/image.jpg` or full URLs like `https://mydesignbazaar.com/uploads/sliders/image.jpg`. This caused 404 errors in production because:

1. Next.js doesn't automatically serve files from `/uploads/...` in production
2. Images need to be served through the API route `/api/uploads/[...path]`
3. Full URLs with domains are environment-specific and don't work across dev/staging/prod

#### Solution
Update all slider image paths to use the API route format: `/api/uploads/sliders/image.jpg`

#### How to Run:
```bash
npm run migrate:slider-paths
```

### 2. Designer Wallet Initialization

#### Purpose
Creates wallet records for all existing designers who don't have wallets yet. This should be run once after deploying the wallet system.

#### What it Does:
- Scans all designers in the database
- Creates a wallet for each designer who doesn't have one
- Initializes with zero balance
- Sets status to 'active'
- Reports summary of created vs existing wallets

#### How to Run:

**Local Environment:**
```bash
node scripts/initialize-designer-wallets.js
```

**Production Environment:**
```bash
# SSH into your production server
ssh user@your-server

# Navigate to project directory
cd /path/to/mydesignbazaar

# Set environment variable if needed
export MONGODB_URI="your_production_mongodb_uri"

# Run migration
node scripts/initialize-designer-wallets.js
```

#### Output Example:
```
Found 45 designers

✓ Created wallet for designer John Doe (userId123)
✓ Wallet already exists for designer Jane Smith (userId456)
...

========================================
Migration completed successfully!
Wallets created: 32
Wallets already existed: 13
Total designers: 45
========================================
```

## General Migration Guidelines

### Before Running Migrations:
1. **Backup your database** - Always create a backup before running migrations
2. **Test in development** - Run migrations in dev/staging before production
3. **Check environment** - Ensure correct MongoDB URI is set
4. **Review the script** - Understand what the migration will do

### Database Backup:
```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=./backup-$(date +%Y%m%d)
```

### Verification After Migration:
1. Check application logs for errors
2. Test affected features manually
3. Review database records
4. Monitor for any issues

## Rollback Procedures

### Slider Path Migration:
If needed, you can manually update paths or restore from backup. The script doesn't delete data.

### Wallet Initialization:
If you need to remove wallets (not recommended):
```javascript
// Connect to MongoDB and run:
db.wallets.deleteMany({ balance: 0, totalEarnings: 0 })
```

## Production Environment

### Setting MongoDB URI:
```bash
# Option 1: Environment variable
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# Option 2: Update scripts directly (not recommended)
# Edit the script file and replace the MONGODB_URI constant
```

### Production Checklist:
- [ ] Database backup created
- [ ] Script tested in staging
- [ ] Environment variables set
- [ ] Maintenance window scheduled (if needed)
- [ ] Team notified
- [ ] Rollback plan ready

## Troubleshooting

### Connection Issues:
```
Error: MongoNetworkError
```
**Solution:** Check MongoDB URI, network connectivity, and firewall rules

### Permission Issues:
```
Error: not authorized
```
**Solution:** Ensure database user has write permissions

### Script Not Found:
```
Error: Cannot find module
```
**Solution:** Run `npm install` to install dependencies

## Support

For issues or questions about migrations:
1. Check error logs
2. Review this documentation
3. Test in development environment
4. Contact development team
