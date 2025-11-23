# Credit Deduction Logic - Implementation Summary

## Overview
Implemented a priority-based credit deduction system that prioritizes purchased subscription plans over admin credits when users download designs.

## Credit Deduction Priority

### Priority 1: Purchased Subscription Plans (User_Subscription_Credits)
- Credits from purchased plans (Basic, Premium, Elite) are used first
- If multiple active plans exist, credits are deducted from the plan **expiring soonest**
- This ensures users maximize their credits before expiry
- Plans are sorted by `expiryDate` in ascending order (earliest first)

### Priority 2: Admin Credits (User_Credits)
- Admin-added credits are only used when:
  - No active purchased plans exist, OR
  - All purchased plans have exhausted their credits, OR
  - All purchased plans have expired
- This keeps purchased plans as the primary credit source

## Implementation Details

### File Modified
- `src/app/api/designs/download/[id]/route.js`

### Key Changes

1. **Import Additional Models**
   ```javascript
   import { User_Subscription_Credits, User_Credits } from '../../../../../models/Subscription';
   ```

2. **Credit Source Detection**
   ```javascript
   // Check for active purchased plans (expiring soonest first)
   const activePurchasedPlans = await User_Subscription_Credits.find({
     userId,
     status: 'active',
     expiryDate: { $gt: new Date() },
     creditsRemaining: { $gt: 0 }
   }).sort({ expiryDate: 1 });
   
   // If no purchased plans, check admin credits
   const adminCredits = await User_Credits.findOne({
     userId,
     status: 'active',
     adminCredits: { $gt: 0 }
   });
   ```

3. **Credit Deduction Logic**
   - For purchased plans: Deduct from `creditsRemaining` and increment `creditsUsed`
   - For admin credits: Deduct from both `adminCredits` and `creditsRemaining`
   - Auto-expire plan if credits reach zero

4. **Enhanced Response**
   - Returns `creditSource` indicating which source was used
   - Provides appropriate credit information based on source
   - Logs credit deduction for debugging

## Benefits

1. **Prevents Credit Waste**: Users consume credits that expire sooner first
2. **Fair Usage**: Purchased credits take priority since users paid for them
3. **Admin Credit Safety Net**: Admin credits remain available as backup
4. **Transparent Tracking**: Clear logging and transaction records
5. **Automatic Expiry Management**: Plans auto-expire when credits exhausted

## Example Scenarios

### Scenario 1: User has Basic Plan (15 days) expiring soon and Premium Plan (90 days)
- Download will use Basic Plan credits first (expires sooner)
- Premium Plan credits preserved for later use

### Scenario 2: User has only admin credits
- Download will use admin credits
- No purchased plan available

### Scenario 3: User has expired Premium Plan and active admin credits
- Download will use admin credits
- Expired plan is ignored

### Scenario 4: User has multiple expired plans
- Download blocked - requires new purchase or admin credit addition

## Database Records

### Download History
- `downloadType` field indicates source: `'subscription'` or `'admin_credits'`

### Credit Transactions
- Description includes source information
- Example: "Downloaded design: Floral Design (Source: Premium Plan)"

## Compatibility

This implementation maintains backward compatibility with:
- Existing subscription status API
- Current dashboard displays
- Download history tracking
- Credit transaction logging

## Future Enhancements

Potential improvements:
1. Allow users to choose credit source manually
2. Implement credit rollover between plans
3. Add credit gifting between users
4. Implement bulk download with automatic credit optimization
