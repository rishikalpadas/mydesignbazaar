# Designer Wallet System - Flow Diagram

## Purchase Flow with Wallet Credit

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUYER DOWNLOADS DESIGN                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  API: POST /api/designs/download/[id]                           │
│  - Verify buyer authentication                                   │
│  - Check buyer's credits/subscription                            │
│  - Deduct 1 credit from buyer                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Create Download Record                                          │
│  - DownloadHistory entry created                                 │
│  - CreditTransaction for buyer created                           │
│  - Design downloads count incremented                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  WALLET CREDIT LOGIC (walletService.creditDesignerWallet)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Get Designer   │
                    │  from Design    │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Check Approved  │
                    │  Designs Count  │
                    └─────────────────┘
                              ↓
                  ┌──────────┴──────────┐
                  │                     │
          < 50 Designs          >= 50 Designs
                  │                     │
                  ↓                     ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │   NOT ELIGIBLE       │  │    ELIGIBLE          │
    │   - Log message      │  │    - Find/Create     │
    │   - Return success   │  │      Wallet          │
    │   - No credit        │  │    - Credit ₹10      │
    └──────────────────────┘  │    - Update balance  │
                              │    - Create          │
                              │      Transaction     │
                              │    - Log success     │
                              └──────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────┐
│  DOWNLOAD SUCCESSFUL                                             │
│  - Return download URL to buyer                                  │
│  - Designer wallet credited (if eligible)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌────────────┐
│    User    │
│  (Designer)│
└─────┬──────┘
      │ 1
      │
      │ has one
      │
      ↓ 1
┌────────────┐        1:N        ┌─────────────────┐
│   Wallet   │──────────────────→│ WalletTransaction│
└─────┬──────┘                   └────────┬────────┘
      │                                   │
      │ belongs to                        │ references
      │                                   │
      ↓                                   ↓
┌────────────┐                   ┌─────────────────┐
│   Design   │←──────────────────│  DownloadHistory│
└────────────┘     references    └─────────────────┘
```

## API Flow - Designer Checks Wallet

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGNER REQUESTS WALLET BALANCE                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  API: GET /api/designer/wallet                                   │
│  - Verify designer authentication                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Get Designer Profile                                            │
│  - Fetch Designer document                                       │
│  - Check approvedDesigns count                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Find or Create Wallet                                           │
│  - Search for existing wallet                                    │
│  - Create new if doesn't exist                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Return Response                                                 │
│  {                                                               │
│    wallet: { balance, totalEarnings, ... },                     │
│    eligibility: {                                                │
│      isEligible: approvedDesigns >= 50,                         │
│      approvedDesigns: 45,                                        │
│      requiredDesigns: 50,                                        │
│      remainingDesigns: 5                                         │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## API Flow - Designer Views Transactions

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGNER REQUESTS TRANSACTION HISTORY                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  API: GET /api/designer/wallet/transactions?page=1&limit=20     │
│  - Verify designer authentication                                │
│  - Parse query parameters                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Query WalletTransactions                                        │
│  - Filter by userId                                              │
│  - Optional filters (type, status)                               │
│  - Sort by createdAt (descending)                                │
│  - Apply pagination (skip, limit)                                │
│  - Populate designId and buyerId                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Return Response                                                 │
│  {                                                               │
│    transactions: [...],                                          │
│    pagination: {                                                 │
│      currentPage: 1,                                             │
│      totalPages: 5,                                              │
│      totalTransactions: 95,                                      │
│      hasNextPage: true                                           │
│    },                                                            │
│    walletSummary: { balance, totalEarnings, ... }               │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Admin Adjustment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN ADJUSTS DESIGNER WALLET                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  API: POST /api/admin/designers/wallet/adjust                    │
│  Body: {                                                         │
│    designerId, amount, type, description                         │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Verify Admin Authentication                                     │
│  - Check JWT token                                               │
│  - Verify admin role/permissions                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Validate Input                                                  │
│  - Check all required fields                                     │
│  - Validate type (credit/debit/adjustment)                       │
│  - Ensure amount > 0                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Find Designer & Wallet                                          │
│  - Verify designer exists                                        │
│  - Find or create wallet                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
              type: credit         type: debit
                    │                   │
                    ↓                   ↓
    ┌────────────────────────┐  ┌──────────────────┐
    │ Add to balance         │  │ Check balance    │
    │ balance += amount      │  │ Deduct amount    │
    │ totalEarnings += amt   │  │ balance -= amt   │
    └────────────────────────┘  └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Create Transaction Record                                       │
│  - Store adjustment details                                      │
│  - Log admin info in metadata                                    │
│  - Set status to 'completed'                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Return Success Response                                         │
│  - Updated wallet balance                                        │
│  - Transaction details                                           │
└─────────────────────────────────────────────────────────────────┘
```

## State Transitions

### Designer Eligibility Status
```
New Designer → Uploading Designs → < 50 Approved → >= 50 Approved
    ↓               ↓                    ↓                ↓
Not Earning    Not Earning         Not Earning     EARNING ₹10
                                                    per purchase
```

### Wallet Status
```
No Wallet → Wallet Created → Active → Suspended? → Closed?
                                ↓
                         (Can earn & view)
```

### Transaction Status
```
Initiated → Pending → Completed
                 ↓
              Failed/Cancelled
```

## Example Timeline

```
Day 1:  Designer registers → No wallet yet
Day 5:  Designer uploads 10 designs → Still no earnings
Day 15: Designer has 30 approved designs → Not eligible yet
Day 30: Designer reaches 50 approved designs! → Now eligible
        Wallet created automatically on first eligible purchase
Day 31: First purchase of designer's design → ₹10 credited
Day 35: 5 more purchases → ₹50 more earned (total: ₹60)
Day 40: Designer checks wallet → Balance: ₹60
Day 45: 10 more purchases → Total balance: ₹160
```

## Key Points

✅ **Automatic**: No manual intervention needed for wallet credits
✅ **Fair**: Only eligible designers (50+ approved) earn
✅ **Transparent**: Complete transaction history available
✅ **Secure**: Authentication and authorization enforced
✅ **Scalable**: Indexed database queries for performance
✅ **Fail-Safe**: Download succeeds even if wallet credit fails
✅ **Auditable**: Full trail with balanceBefore/balanceAfter
