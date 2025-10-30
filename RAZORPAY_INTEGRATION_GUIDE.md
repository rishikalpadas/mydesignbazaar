# Razorpay Payment Integration Guide

## Overview
Complete Razorpay payment gateway integration with credit points system for MyDesignBazaar.

## Setup Instructions

### 1. Add Razorpay Credentials to .env

Add the following to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Get your credentials from:** https://dashboard.razorpay.com/app/keys

- Use **Test Mode** keys for testing
- Use **Live Mode** keys for production

### 2. Pricing Plans

Three credit-based plans are configured in `src/lib/razorpay.js`:

| Plan | Price | Credits | Validity | Features |
|------|-------|---------|----------|----------|
| **Basic** | ₹600 | 10 | 15 days | Commercial rights, Email support |
| **Premium** | ₹5,000 | 100 | 90 days | AI designs access, Priority support, 10% off extras |
| **Elite** | ₹50,000 | 1,200 | 365 days | Full AI access, Dedicated manager, Custom requests |

## Files Created/Modified

### Models
1. **`src/models/User.js`** - Added `creditPoints` field
2. **`src/models/Transaction.js`** - NEW - Tracks all credit transactions

### API Endpoints
1. **`src/app/api/payments/create-order/route.js`** - Creates Razorpay order
2. **`src/app/api/payments/verify-payment/route.js`** - Verifies payment and adds credits
3. **`src/app/api/payments/transactions/route.js`** - Gets user transaction history

### Configuration
1. **`src/lib/razorpay.js`** - Razorpay configuration, pricing plans, signature verification

### Components
1. **`src/components/RazorpayButton.jsx`** - Reusable payment button component
2. **`src/components/PricingSection.jsx`** - NEW - Complete pricing section with Razorpay integration
3. **`src/app/page.js`** - Updated to use new PricingSection

### Environment
1. **`.env.example`** - Added Razorpay configuration template

## Payment Flow

### 1. User Clicks "Get Started"
- If not logged in → Redirect to login
- If logged in → RazorpayButton component handles payment

### 2. Create Order (Backend)
```
POST /api/payments/create-order
Body: { planType: "basic" | "premium" | "elite" }

Response: {
  orderId: "order_xxx",
  amount: 99900,
  currency: "INR",
  transactionId: "trans_xxx",
  plan: { name, credits, price }
}
```

### 3. Open Razorpay Checkout
- Razorpay SDK loads payment modal
- User completes payment
- Razorpay returns: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`

### 4. Verify Payment (Backend)
```
POST /api/payments/verify-payment
Body: {
  razorpayOrderId: "order_xxx",
  razorpayPaymentId: "pay_xxx",
  razorpaySignature: "signature_xxx",
  transactionId: "trans_xxx"
}

Response: {
  success: true,
  creditPoints: 100,
  newBalance: 100,
  transaction: { ... }
}
```

### 5. Credits Added
- User's `creditPoints` field updated
- Transaction status changed to "completed"
- Success message shown to user

## Transaction Types

The Transaction model supports multiple transaction types:

1. **`credit_purchase`** - Buying credit points
2. **`design_purchase`** - Using credits to download designs
3. **`refund`** - Refunded credits
4. **`bonus`** - Bonus/promotional credits

## API Reference

### Create Order
**Endpoint:** `POST /api/payments/create-order`
**Auth:** Required (withAuth middleware)
**Body:**
```json
{
  "planType": "basic" | "premium" | "elite"
}
```

**Response:**
```json
{
  "orderId": "order_MNxxxx",
  "amount": 99900,
  "currency": "INR",
  "transactionId": "65xxx",
  "plan": {
    "name": "Starter Plan",
    "credits": 100,
    "price": 999
  }
}
```

### Verify Payment
**Endpoint:** `POST /api/payments/verify-payment`
**Auth:** Required (withAuth middleware)
**Body:**
```json
{
  "razorpayOrderId": "order_MNxxxx",
  "razorpayPaymentId": "pay_MNxxxx",
  "razorpaySignature": "signature_xxx",
  "transactionId": "65xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "creditPoints": 100,
  "newBalance": 100,
  "transaction": {
    "id": "65xxx",
    "planName": "Starter Plan",
    "amount": 999,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Transactions
**Endpoint:** `GET /api/payments/transactions?page=1&limit=50`
**Auth:** Required (withAuth middleware)
**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4000 0000 0000 0002

### Test UPI
- UPI ID: success@razorpay
- UPI ID: failure@razorpay

### Test Wallets
- All test wallets will work in test mode

## Security Features

1. **Signature Verification** - All payments verified using Razorpay signature
2. **Authentication Required** - Only logged-in users can purchase
3. **Buyer-Only** - Only buyers can purchase credit plans
4. **Transaction Tracking** - All transactions logged with full details
5. **Atomic Operations** - Credits only added after successful verification

## Customization

### Update Pricing Plans
Edit `src/lib/razorpay.js`:

```javascript
export const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    price: 600, // INR
    credits: 10,
    description: 'Perfect for Startups',
    features: [...]
  },
  // Add more plans...
}
```

### Customize Razorpay Checkout
Edit `src/components/RazorpayButton.jsx`:

```javascript
const options = {
  // ... existing options
  theme: {
    color: '#f97316', // Change theme color
  },
  // Add more Razorpay options
}
```

## Production Checklist

- [ ] Replace test keys with live keys in `.env.local`
- [ ] Test all payment flows
- [ ] Test failure scenarios
- [ ] Setup webhook for payment notifications (optional)
- [ ] Monitor transactions in Razorpay Dashboard
- [ ] Test GST calculations if applicable
- [ ] Setup email notifications for successful payments
- [ ] Test refund flow

## Webhook Setup (Optional)

For additional security, setup Razorpay webhooks:

1. Go to Razorpay Dashboard → Webhooks
2. Create endpoint: `https://yourdomain.com/api/webhooks/razorpay`
3. Subscribe to events: `payment.captured`, `payment.failed`
4. Verify webhook signature in your endpoint

## Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Credentials:** https://razorpay.com/docs/payments/test-card-upi-details/
- **Dashboard:** https://dashboard.razorpay.com/

## Next Steps

1. **Design Purchase Flow:** Create API to deduct credits when downloading designs
2. **Credit Expiry:** Implement credit expiry based on plan validity
3. **Credit History:** Show credit usage history in user dashboard
4. **Notifications:** Send email/SMS on successful purchase
5. **Invoices:** Generate GST invoices for purchases
