# Designer Wallet System - Implementation Guide

## Overview
This system automatically credits ₹10 to a designer's wallet whenever their design is purchased by a buyer, **but only if the designer has 50 or more approved designs**.

## Features Implemented

### 1. Database Models

#### Wallet Model (`src/models/Wallet.js`)
Tracks designer earnings with the following fields:
- `userId` - Reference to User (designer)
- `balance` - Current wallet balance (₹)
- `totalEarnings` - Total amount earned
- `totalWithdrawn` - Total amount withdrawn
- `currency` - Currency type (default: INR)
- `status` - Wallet status (active/suspended/closed)
- Timestamps: `createdAt`, `updatedAt`

#### WalletTransaction Model (`src/models/Wallet.js`)
Logs all wallet activities:
- `walletId` - Reference to Wallet
- `userId` - Reference to User (designer)
- `type` - Transaction type (credit/debit/withdrawal/refund/adjustment)
- `amount` - Transaction amount
- `balanceBefore` - Balance before transaction
- `balanceAfter` - Balance after transaction
- `source` - Source of transaction (design_purchase/bonus/withdrawal/refund/admin_adjustment)
- `designId` - Reference to Design (if applicable)
- `downloadId` - Reference to DownloadHistory (if applicable)
- `buyerId` - Reference to buyer User
- `description` - Transaction description
- `metadata` - Additional data
- `status` - Transaction status

### 2. API Endpoints

#### GET `/api/designer/wallet`
**Purpose:** Fetch designer's wallet information
**Authentication:** Required (Designer only)
**Response:**
```json
{
  "success": true,
  "wallet": {
    "balance": 150,
    "totalEarnings": 200,
    "totalWithdrawn": 50,
    "currency": "INR",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  },
  "eligibility": {
    "isEligible": true,
    "approvedDesigns": 65,
    "requiredDesigns": 50,
    "remainingDesigns": 0
  }
}
```

#### GET `/api/designer/wallet/transactions`
**Purpose:** List all wallet transactions with pagination
**Authentication:** Required (Designer only)
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `type` - Filter by transaction type
- `status` - Filter by status

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "...",
      "type": "credit",
      "amount": 10,
      "balanceBefore": 140,
      "balanceAfter": 150,
      "source": "design_purchase",
      "description": "Earned ₹10 from design purchase: Floral Design",
      "designId": {
        "designId": "DES123",
        "title": "Floral Design",
        "category": "Womenswear"
      },
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTransactions": 95,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "walletSummary": {
    "balance": 150,
    "totalEarnings": 200,
    "totalWithdrawn": 50
  }
}
```

#### POST `/api/admin/designers/wallet/adjust`
**Purpose:** Admin endpoint to manually adjust designer wallet
**Authentication:** Required (Admin only)
**Request Body:**
```json
{
  "designerId": "user_id_here",
  "amount": 50,
  "type": "credit",
  "description": "Bonus for excellent performance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet credit successful",
  "wallet": {
    "balance": 200,
    "totalEarnings": 250,
    "totalWithdrawn": 50
  },
  "transaction": {
    "id": "...",
    "type": "credit",
    "amount": 50,
    "balanceBefore": 150,
    "balanceAfter": 200,
    "description": "Bonus for excellent performance",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### 3. Wallet Service (`src/lib/walletService.js`)

#### `creditDesignerWallet(designId, buyerId, downloadId)`
**Purpose:** Automatically credit ₹10 to designer's wallet when their design is purchased
**Logic:**
1. Fetches the design to get the designer
2. Checks if designer has 50+ approved designs
3. If eligible, credits ₹10 to wallet
4. Creates transaction record
5. Returns result with eligibility status

**Return Object:**
```javascript
{
  success: true,
  eligible: true,
  credited: true,
  amount: 10,
  newBalance: 160,
  transactionId: "...",
  message: "Designer earned ₹10"
}
```

#### `getDesignerWalletSummary(userId)`
**Purpose:** Get quick summary of designer's wallet and eligibility
**Returns:**
```javascript
{
  exists: true,
  balance: 150,
  totalEarnings: 200,
  totalWithdrawn: 50,
  status: "active",
  eligible: true,
  approvedDesigns: 65
}
```

### 4. Integration with Purchase Flow

The wallet credit logic is integrated into the design download API (`src/app/api/designs/download/[id]/route.js`):

```javascript
// After successful download
await creditDesignerWallet(designId, userId, downloadRecord._id);
```

**Key Points:**
- Wallet credit is called automatically after each design download
- If wallet credit fails, the download still succeeds (fail-safe design)
- Logs are created for debugging and monitoring
- Only eligible designers (50+ approved designs) receive credits

## Business Rules

1. **Eligibility Requirement:** Designer must have **50 or more approved designs** to earn from purchases
2. **Earning Amount:** ₹10 per design purchase/download
3. **Automatic Credits:** Credits are added automatically when a buyer downloads a design
4. **No Retroactive Credits:** Credits only apply to purchases after the designer reaches 50 approved designs
5. **Wallet Creation:** Wallets are created automatically on first credit or when designer checks their wallet

## Database Indexes

For optimal performance, the following indexes are created:

**Wallet:**
- `userId` (unique)
- `status`

**WalletTransaction:**
- `walletId, createdAt` (compound, descending)
- `userId, createdAt` (compound, descending)
- `designId`
- `type, status` (compound)

## Security Considerations

1. **Authentication:** All wallet endpoints require valid JWT authentication
2. **Authorization:** 
   - Only designers can access their own wallet
   - Admin endpoints require admin privileges
3. **Validation:** All inputs are validated before processing
4. **Transaction Integrity:** Balance calculations use balanceBefore/balanceAfter for audit trail

## Testing Checklist

- [ ] Designer with < 50 approved designs doesn't earn on purchase
- [ ] Designer with >= 50 approved designs earns ₹10 on purchase
- [ ] Wallet is created automatically if it doesn't exist
- [ ] Transaction records are created correctly
- [ ] Designer can view their wallet balance
- [ ] Designer can view transaction history with pagination
- [ ] Admin can manually adjust wallets
- [ ] Download succeeds even if wallet credit fails

## Future Enhancements

1. **Withdrawal System:** Allow designers to withdraw their earnings
2. **Payment Gateway Integration:** Connect to bank accounts or UPI for payouts
3. **Minimum Withdrawal:** Set minimum balance for withdrawal (e.g., ₹500)
4. **Analytics Dashboard:** Show earnings trends and statistics
5. **Notifications:** Notify designers when they earn money
6. **Variable Earnings:** Different earning rates based on design category or popularity
7. **Bonus System:** Special bonuses for featured designs or milestones

## Error Handling

The system implements graceful error handling:
- Wallet credit failures don't block design downloads
- Detailed error logs for debugging
- User-friendly error messages
- Validation errors return 400 status codes
- Authentication errors return 401/403 status codes

## Monitoring & Logs

Key log patterns to monitor:
- `[WALLET] Successfully credited` - Successful wallet credit
- `[WALLET] Designer not yet eligible` - Designer below 50 designs threshold
- `[WALLET] Error crediting designer wallet` - System error
- `[DOWNLOAD] Designer wallet credited` - Integration success

## API Usage Examples

### Frontend Integration

```javascript
// Fetch wallet balance
const getWalletBalance = async () => {
  const response = await fetch('/api/designer/wallet', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Fetch transactions
const getTransactions = async (page = 1, limit = 20) => {
  const response = await fetch(
    `/api/designer/wallet/transactions?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return await response.json();
};

// Admin adjust wallet
const adjustWallet = async (designerId, amount, type, description) => {
  const response = await fetch('/api/admin/designers/wallet/adjust', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      designerId,
      amount,
      type,
      description
    })
  });
  return await response.json();
};
```

## Summary

The designer wallet system is now fully implemented with:
- ✅ Automatic earnings tracking (₹10 per purchase after 50 approved designs)
- ✅ Comprehensive transaction history
- ✅ Admin controls for manual adjustments
- ✅ Secure API endpoints with authentication
- ✅ Database models with proper indexing
- ✅ Integration with existing purchase flow
- ✅ Error handling and logging
- ✅ Scalable architecture for future enhancements
