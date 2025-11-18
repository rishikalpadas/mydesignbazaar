# Designer Wallet System - Testing Guide

## Prerequisites

1. **Running Application**: Ensure your Next.js app is running
2. **MongoDB Connection**: Database should be accessible
3. **Test Users**: Create test designers and buyers
4. **API Client**: Use Postman, Thunder Client, or curl

## Test Scenarios

### Scenario 1: Designer with < 50 Approved Designs (Not Eligible)

#### Setup:
```javascript
// Create a designer with 30 approved designs
Designer: {
  fullName: "Test Designer 1",
  approvedDesigns: 30
}
```

#### Test Steps:
1. **Buyer downloads designer's design**
   ```
   POST /api/designs/download/[designId]
   Authorization: Bearer <buyer_token>
   ```

2. **Expected Result:**
   - Download succeeds ✅
   - Buyer's credit deducted ✅
   - Designer's wallet NOT credited ❌
   - Log shows: "Designer not yet eligible (30/50 approved designs)" ✅

3. **Verify Wallet API:**
   ```
   GET /api/designer/wallet
   Authorization: Bearer <designer_token>
   ```
   
   **Expected Response:**
   ```json
   {
     "success": true,
     "wallet": {
       "balance": 0,
       "totalEarnings": 0
     },
     "eligibility": {
       "isEligible": false,
       "approvedDesigns": 30,
       "requiredDesigns": 50,
       "remainingDesigns": 20
     }
   }
   ```

---

### Scenario 2: Designer with >= 50 Approved Designs (Eligible)

#### Setup:
```javascript
// Create a designer with 55 approved designs
Designer: {
  fullName: "Test Designer 2",
  approvedDesigns: 55
}
```

#### Test Steps:
1. **Buyer downloads designer's design**
   ```
   POST /api/designs/download/[designId]
   Authorization: Bearer <buyer_token>
   ```

2. **Expected Result:**
   - Download succeeds ✅
   - Buyer's credit deducted ✅
   - Designer's wallet credited ₹10 ✅
   - Log shows: "Designer wallet credited: ₹10" ✅

3. **Verify Wallet Balance:**
   ```
   GET /api/designer/wallet
   Authorization: Bearer <designer_token>
   ```
   
   **Expected Response:**
   ```json
   {
     "success": true,
     "wallet": {
       "balance": 10,
       "totalEarnings": 10,
       "totalWithdrawn": 0,
       "currency": "INR",
       "status": "active"
     },
     "eligibility": {
       "isEligible": true,
       "approvedDesigns": 55,
       "requiredDesigns": 50,
       "remainingDesigns": 0
     }
   }
   ```

4. **Multiple Purchases Test:**
   - Have 5 different buyers download the same design
   - Each should credit ₹10 to designer's wallet
   - Final balance should be ₹60 (6 purchases × ₹10)

---

### Scenario 3: View Transaction History

#### Test Steps:
1. **Get Transactions (First Page):**
   ```
   GET /api/designer/wallet/transactions?page=1&limit=5
   Authorization: Bearer <designer_token>
   ```

2. **Expected Response:**
   ```json
   {
     "success": true,
     "transactions": [
       {
         "_id": "...",
         "type": "credit",
         "amount": 10,
         "balanceBefore": 50,
         "balanceAfter": 60,
         "source": "design_purchase",
         "description": "Earned ₹10 from design purchase: Floral Design",
         "designId": {
           "designId": "DES123",
           "title": "Floral Design",
           "category": "Womenswear"
         },
         "createdAt": "2024-01-15T10:30:00.000Z"
       },
       // ... more transactions
     ],
     "pagination": {
       "currentPage": 1,
       "totalPages": 2,
       "totalTransactions": 6,
       "limit": 5,
       "hasNextPage": true,
       "hasPrevPage": false
     },
     "walletSummary": {
       "balance": 60,
       "totalEarnings": 60,
       "totalWithdrawn": 0
     }
   }
   ```

3. **Filter by Type:**
   ```
   GET /api/designer/wallet/transactions?type=credit
   Authorization: Bearer <designer_token>
   ```

---

### Scenario 4: Admin Wallet Adjustment

#### Test Steps:
1. **Admin Credits Bonus (₹50):**
   ```
   POST /api/admin/designers/wallet/adjust
   Authorization: Bearer <admin_token>
   Content-Type: application/json

   {
     "designerId": "designer_user_id",
     "amount": 50,
     "type": "credit",
     "description": "Bonus for excellent designs"
   }
   ```

2. **Expected Response:**
   ```json
   {
     "success": true,
     "message": "Wallet credit successful",
     "wallet": {
       "balance": 110,
       "totalEarnings": 110,
       "totalWithdrawn": 0
     },
     "transaction": {
       "id": "...",
       "type": "credit",
       "amount": 50,
       "balanceBefore": 60,
       "balanceAfter": 110,
       "description": "Bonus for excellent designs",
       "createdAt": "2024-01-15T11:00:00.000Z"
     }
   }
   ```

3. **Verify in Transaction History:**
   - Should show new transaction with source: "admin_adjustment"
   - Metadata should contain admin details

---

### Scenario 5: Designer Reaches Eligibility Mid-Journey

#### Setup:
1. Designer has 48 approved designs
2. Designer uploads 2 more designs
3. Admin approves both designs → Now 50 approved

#### Test Steps:
1. **Before Approval (48 designs):**
   - Buyer downloads design → No earning
   - Wallet balance: ₹0

2. **After Approval (50 designs):**
   - Another buyer downloads design → Earns ₹10
   - Wallet balance: ₹10

3. **Verify Eligibility Status:**
   ```
   GET /api/designer/wallet
   ```
   Should show `isEligible: true`

---

### Scenario 6: Error Handling Tests

#### Test 6.1: Non-Designer Access Wallet
```
GET /api/designer/wallet
Authorization: Bearer <buyer_token>
```
**Expected:** 403 Forbidden - "Only designers can access wallet"

#### Test 6.2: Invalid Admin Adjustment
```
POST /api/admin/designers/wallet/adjust
Authorization: Bearer <admin_token>

{
  "designerId": "invalid_id",
  "amount": -10,  // Negative amount
  "type": "credit",
  "description": "Test"
}
```
**Expected:** 400 Bad Request - "Amount must be greater than 0"

#### Test 6.3: Debit More Than Balance
```
POST /api/admin/designers/wallet/adjust
Authorization: Bearer <admin_token>

{
  "designerId": "designer_id",
  "amount": 1000,  // More than balance
  "type": "debit",
  "description": "Test debit"
}
```
**Expected:** 400 Bad Request - "Insufficient wallet balance"

#### Test 6.4: Unauthorized Access
```
GET /api/designer/wallet
// No Authorization header
```
**Expected:** 401 Unauthorized

---

## Database Verification Queries

### Check Wallet Document
```javascript
db.wallets.findOne({ userId: ObjectId("designer_user_id") })
```

### Check All Transactions for a Designer
```javascript
db.wallettransactions.find({ 
  userId: ObjectId("designer_user_id") 
}).sort({ createdAt: -1 })
```

### Count Eligible Designers
```javascript
db.designers.countDocuments({ approvedDesigns: { $gte: 50 } })
```

### Check Total Earnings Across All Designers
```javascript
db.wallets.aggregate([
  { $group: { 
    _id: null, 
    totalEarnings: { $sum: "$totalEarnings" } 
  }}
])
```

---

## Performance Testing

### Test 1: Multiple Concurrent Downloads
- Simulate 10 buyers downloading different designs simultaneously
- Verify all wallet credits are processed correctly
- Check for race conditions

### Test 2: Large Transaction History
- Create 1000+ transactions for a designer
- Test pagination performance
- Verify query response time < 500ms

### Test 3: Database Indexing
```javascript
// Check if indexes are created
db.wallets.getIndexes()
db.wallettransactions.getIndexes()
```

Expected indexes:
- Wallet: `userId`, `status`
- WalletTransaction: `walletId + createdAt`, `userId + createdAt`, `designId`, `type + status`

---

## Integration Testing Script

```javascript
// test-wallet-system.js
const axios = require('axios');

async function testWalletSystem() {
  const API_URL = 'http://localhost:3000/api';
  
  // Test 1: Get wallet balance
  const wallet = await axios.get(`${API_URL}/designer/wallet`, {
    headers: { Authorization: `Bearer ${designerToken}` }
  });
  console.log('Wallet Balance:', wallet.data);
  
  // Test 2: Download design (triggers wallet credit)
  const download = await axios.post(
    `${API_URL}/designs/download/${designId}`,
    {},
    { headers: { Authorization: `Bearer ${buyerToken}` }}
  );
  console.log('Download Success:', download.data);
  
  // Test 3: Check updated balance
  const updatedWallet = await axios.get(`${API_URL}/designer/wallet`, {
    headers: { Authorization: `Bearer ${designerToken}` }
  });
  console.log('Updated Balance:', updatedWallet.data.wallet.balance);
  
  // Test 4: Get transactions
  const transactions = await axios.get(
    `${API_URL}/designer/wallet/transactions?limit=10`,
    { headers: { Authorization: `Bearer ${designerToken}` }}
  );
  console.log('Transaction Count:', transactions.data.transactions.length);
}

testWalletSystem();
```

---

## Checklist

### Basic Functionality
- [ ] Designer with < 50 designs doesn't earn
- [ ] Designer with >= 50 designs earns ₹10 per purchase
- [ ] Wallet is created automatically
- [ ] Transaction records are accurate
- [ ] Balance calculations are correct

### API Endpoints
- [ ] GET /api/designer/wallet works
- [ ] GET /api/designer/wallet/transactions works
- [ ] Pagination works correctly
- [ ] Filters work (type, status)
- [ ] POST /api/admin/designers/wallet/adjust works

### Security
- [ ] Authentication required for all endpoints
- [ ] Only designers can access their wallet
- [ ] Only admins can adjust wallets
- [ ] Input validation prevents invalid data

### Error Handling
- [ ] Graceful failure when wallet credit fails
- [ ] Download succeeds even if wallet fails
- [ ] Proper error messages for all scenarios
- [ ] Logs capture all important events

### Performance
- [ ] Queries use indexes
- [ ] Pagination prevents large data loads
- [ ] Response times acceptable (< 1s)
- [ ] No memory leaks

### Data Integrity
- [ ] balanceBefore + amount = balanceAfter
- [ ] totalEarnings matches sum of credit transactions
- [ ] No negative balances
- [ ] Audit trail complete

---

## Common Issues & Solutions

### Issue: Wallet credit not working
**Check:**
1. Designer has >= 50 approved designs
2. Design upload user matches designer user
3. Wallet service is imported correctly
4. MongoDB connection is active

### Issue: Transaction history empty
**Check:**
1. Transactions collection exists
2. userId matches correctly
3. Designer has made purchases
4. Pagination parameters are correct

### Issue: Admin adjustment fails
**Check:**
1. User has admin privileges
2. Designer ID is valid
3. Amount is positive
4. Type is valid (credit/debit/adjustment)

---

## Next Steps After Testing

1. ✅ **All tests pass** → Deploy to production
2. ❌ **Tests fail** → Fix issues and retest
3. **Performance issues** → Optimize queries/indexes
4. **UI needed** → Build frontend components
5. **Analytics needed** → Create reporting dashboards

---

## Support

For issues during testing:
1. Check error logs in console
2. Review transaction records in database
3. Verify user permissions and roles
4. Consult DESIGNER_WALLET_SYSTEM.md for details
