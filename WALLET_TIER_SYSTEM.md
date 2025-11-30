# Designer Wallet Tier System

## Overview
The wallet system automatically credits designers when buyers download their designs. Credits are awarded based on a tier system determined by the number of approved designs.

## Tier Structure

### Standard Tier (50-99 Approved Designs)
- **Requirement**: 50-99 approved designs
- **Earning Rate**: ₹10 per design download
- **Status**: Standard earning tier

### Premium Tier (100+ Approved Designs)
- **Requirement**: 100 or more approved designs
- **Earning Rate**: ₹25 per design download
- **Status**: Premium earning tier

### Not Eligible (Less than 50 Approved Designs)
- **Requirement**: Less than 50 approved designs
- **Earning Rate**: ₹0 per design download
- **Status**: Not eligible for wallet earnings

## How It Works

### 1. Design Download
When a buyer downloads a design:
- The system checks if the designer has at least 50 approved designs
- If eligible, it determines the tier (Standard or Premium)
- Credits the appropriate amount to the designer's wallet

### 2. Re-Downloads
- Re-downloading the same design with the same subscription **does not** credit the wallet again
- Only the first download of each design per subscription credits the wallet
- This prevents duplicate earnings

### 3. Wallet Transaction Tracking
Each wallet credit creates a transaction record with:
- Designer ID
- Design ID
- Buyer ID
- Download ID
- Credit amount
- Tier information
- Approved designs count at time of transaction
- Transaction timestamp

## Database Structure

### Wallet Table
Stores the designer's wallet information:
```javascript
{
  userId: ObjectId,           // Designer's user ID
  balance: Number,            // Current wallet balance
  totalEarnings: Number,      // Total earned (all time)
  totalWithdrawn: Number,     // Total withdrawn
  currency: String,           // Default: 'INR'
  status: String,             // 'active', 'suspended', 'closed'
  createdAt: Date,
  updatedAt: Date
}
```

### Wallet Transaction Table
Logs every wallet activity:
```javascript
{
  walletId: ObjectId,         // Reference to wallet
  userId: ObjectId,           // Designer's user ID
  type: String,               // 'credit', 'debit', 'withdrawal', etc.
  amount: Number,             // Transaction amount
  balanceBefore: Number,      // Balance before transaction
  balanceAfter: Number,       // Balance after transaction
  source: String,             // 'design_purchase', 'bonus', etc.
  designId: ObjectId,         // Related design
  downloadId: ObjectId,       // Related download record
  buyerId: ObjectId,          // Buyer who downloaded
  description: String,        // Transaction description
  metadata: {
    designTitle: String,
    designCategory: String,
    approvedDesignsCount: Number,
    tier: String,
    creditAmount: Number
  },
  status: String,             // 'completed', 'pending', etc.
  createdAt: Date
}
```

## Implementation Files

### 1. Wallet Service (`src/lib/walletService.js`)
- `creditDesignerWallet()` - Main function to credit wallet
- `getDesignerWalletSummary()` - Get wallet summary with tier info

### 2. Wallet Model (`src/models/Wallet.js`)
- Wallet schema definition
- WalletTransaction schema definition

### 3. Download API (`src/app/api/designs/download/[id]/route.js`)
- Calls wallet service after successful download
- Prevents duplicate credits for re-downloads

## Usage Examples

### Example 1: Designer with 60 Approved Designs
```
Approved Designs: 60
Tier: Standard
Earning per Download: ₹10
```

When a buyer downloads their design:
- Wallet credited: ₹10
- Transaction logged with tier: "standard"
- Designer balance increases by ₹10

### Example 2: Designer with 120 Approved Designs
```
Approved Designs: 120
Tier: Premium
Earning per Download: ₹25
```

When a buyer downloads their design:
- Wallet credited: ₹25
- Transaction logged with tier: "premium"
- Designer balance increases by ₹25

### Example 3: Designer with 30 Approved Designs
```
Approved Designs: 30
Tier: Not Eligible
Earning per Download: ₹0
```

When a buyer downloads their design:
- No wallet credit
- Designer needs 50 approved designs to start earning

## Benefits

### For Designers
- **Tiered rewards**: Higher earning potential as they grow
- **Motivation**: Clear path to increase earnings (50 → 100 designs)
- **Transparency**: All transactions logged and visible
- **No duplicate credits**: Fair system prevents manipulation

### For Platform
- **Quality incentive**: Encourages designers to create more designs
- **Growth tracking**: Easy to see designer progression
- **Audit trail**: Complete transaction history
- **Scalable**: Easy to add more tiers in the future

## API Responses

### Successful Credit (Standard Tier)
```json
{
  "success": true,
  "eligible": true,
  "credited": true,
  "amount": 10,
  "tier": "standard",
  "newBalance": 150,
  "transactionId": "...",
  "message": "Designer earned ₹10 (standard tier)"
}
```

### Successful Credit (Premium Tier)
```json
{
  "success": true,
  "eligible": true,
  "credited": true,
  "amount": 25,
  "tier": "premium",
  "newBalance": 500,
  "transactionId": "...",
  "message": "Designer earned ₹25 (premium tier)"
}
```

### Not Eligible
```json
{
  "success": true,
  "eligible": false,
  "approvedDesigns": 35,
  "message": "Designer not eligible for earnings yet (minimum 50 approved designs required)"
}
```

## Console Logs

The system provides detailed console logs for debugging:

```
[WALLET] Designer tier: standard, Approved designs: 65, Credit: ₹10
[WALLET] Successfully credited ₹10 to designer 123abc. New balance: ₹150
[DOWNLOAD] ✓ Designer wallet credited: ₹10 (standard tier), new balance: ₹150
```

## Future Enhancements

Potential tier additions:
- **Elite Tier**: 250+ designs = ₹40 per download
- **Master Tier**: 500+ designs = ₹50 per download
- **Bonus multipliers** for featured designs
- **Monthly bonuses** based on download volume
