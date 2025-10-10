# 🆓 Free SMS/WhatsApp OTP Alternatives

Complete guide to FREE and low-cost alternatives for sending OTP to mobile numbers.

## 📊 Comparison Table

| Provider | Free Tier | Cost After Free | Best For | Setup Time |
|----------|-----------|-----------------|----------|------------|
| **Console** | ∞ Unlimited | Free Forever | Development/Testing | 0 min |
| **Twilio Trial** | $15 credit (~3000 msgs) | $0.0075/SMS | Testing with real numbers | 10 min |
| **2Factor.in** | 100 SMS/month | ₹0.10/SMS | Indian numbers, production | 5 min |
| **Fast2SMS** | Free credits on signup | ₹0.10-0.15/SMS | Quick setup, India | 5 min |
| **TextLocal** | 25 SMS trial | ₹0.10/SMS | Bulk SMS, India | 5 min |
| **MSG91** | Trial credits | ₹0.15/SMS | Reliable, India | 10 min |

## 🎯 Recommended Setup Strategy

### **For Development (FREE)**
```env
SMS_PROVIDER=console
```
- ✅ Instant setup
- ✅ See OTP in terminal/console
- ✅ No cost, no limits
- ✅ Perfect for testing

### **For Production (India)**

#### **Best Option: 2Factor.in**
```env
SMS_PROVIDER=2factor
TWOFACTOR_API_KEY=your-api-key
```

**Why 2Factor.in?**
- ✅ 100 FREE SMS every month
- ✅ Only ₹0.10 per SMS after
- ✅ No monthly fees
- ✅ Simple API
- ✅ Works perfectly with Indian numbers

**Setup Steps:**
1. Visit https://2factor.in
2. Sign up with email
3. Verify your number
4. Get API key from dashboard
5. Add to `.env`

#### **Alternative: Fast2SMS**
```env
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your-api-key
```

**Good for:**
- Quick setup
- Promotional SMS
- Transactional SMS

## 🚀 Quick Setup Guide

### Option 1: Console (Development) - 0 Minutes

**Already set up!** Just use:
```env
SMS_PROVIDER=console
```

OTP will appear in your terminal:
```
========================================
📱 SMS OTP (Development Mode)
========================================
Phone: +919876543210
OTP Code: 123456
Valid for: 10 minutes
========================================
```

### Option 2: 2Factor.in (Production) - 5 Minutes

1. **Sign up**: https://2factor.in
2. **Get API Key**:
   - Dashboard → Settings → API Key
   - Copy your API key
3. **Update .env**:
```env
SMS_PROVIDER=2factor
TWOFACTOR_API_KEY=paste-your-key-here
```
4. **Done!** Start sending OTP

### Option 3: Fast2SMS (Production) - 5 Minutes

1. **Sign up**: https://www.fast2sms.com
2. **Get API Key**:
   - Dashboard → Developers → API Keys
3. **Update .env**:
```env
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=paste-your-key-here
```

### Option 4: Twilio (International) - 10 Minutes

1. **Sign up**: https://www.twilio.com/try-twilio
2. **Get free $15 credit**
3. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone number or WhatsApp sandbox
4. **Update .env**:
```env
SMS_PROVIDER=twilio-whatsapp  # or twilio-sms
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_WHATSAPP_NUMBER=+14155238886  # Sandbox number
```

## 💡 Usage Examples

### Sending OTP

```javascript
// API call
POST /api/auth/otp/send
{
  "mobileNumber": "+919876543210",
  "type": "mobile",
  "userId": "user-id-here"
}

// Response
{
  "success": true,
  "message": "OTP sent to WhatsApp successfully",
  "expiresIn": "10 minutes"
}
```

### Switching Providers

Just change one line in `.env`:

```env
# Development
SMS_PROVIDER=console

# Production (Free tier)
SMS_PROVIDER=2factor

# Production (Paid, reliable)
SMS_PROVIDER=twilio-sms
```

## 🔄 Migration Path

### Phase 1: Development (FREE)
```env
SMS_PROVIDER=console
```
Test everything locally, no costs.

### Phase 2: Testing with Real Numbers (FREE)
```env
SMS_PROVIDER=2factor
TWOFACTOR_API_KEY=your-key
```
100 free SMS/month for testing with real devices.

### Phase 3: Production (Low Cost)
Keep using 2Factor.in:
- ₹1000 = 10,000 SMS
- Only pay for what you use
- No monthly subscription

### Phase 4: Scale (If needed)
Switch to Twilio or MSG91 for enterprise features.

## 📱 Provider Details

### 2Factor.in ⭐ RECOMMENDED
- **Website**: https://2factor.in
- **Free**: 100 SMS/month
- **Cost**: ₹0.10/SMS (₹100 for 1000 SMS)
- **API Docs**: https://2factor.in/docs/
- **Support**: Email + Phone

**Pros:**
- ✅ Generous free tier
- ✅ Simple API
- ✅ Fast delivery
- ✅ Indian company
- ✅ Good support

**Cons:**
- ❌ India-only
- ❌ No WhatsApp

### Fast2SMS
- **Website**: https://www.fast2sms.com
- **Free**: Credits on signup
- **Cost**: ₹0.10-0.15/SMS
- **API Docs**: https://docs.fast2sms.com

**Pros:**
- ✅ Quick setup
- ✅ Good dashboard
- ✅ OTP + Promotional

**Cons:**
- ❌ India-only
- ❌ Delivery can be slow

### Twilio
- **Website**: https://www.twilio.com
- **Free**: $15 trial credit
- **Cost**: $0.0075/SMS, $0.005/WhatsApp
- **API Docs**: https://www.twilio.com/docs

**Pros:**
- ✅ Global reach
- ✅ WhatsApp support
- ✅ Enterprise-grade
- ✅ Excellent docs

**Cons:**
- ❌ Expensive for India
- ❌ USD pricing
- ❌ Requires credit card

## 🎓 Best Practices

### For Development
1. Use `console` provider
2. Check OTP in terminal
3. No setup needed

### For Testing
1. Use 2Factor.in free tier
2. Test with real numbers
3. Verify delivery on actual devices

### For Production
1. Start with 2Factor.in
2. Monitor delivery rates
3. Add backup provider
4. Implement retry logic

## 🚨 Common Issues

### Issue: OTP not received
**Solution:**
1. Check phone number format (+91xxxxxxxxxx)
2. Verify API key is correct
3. Check provider dashboard for delivery status
4. Try different provider as fallback

### Issue: Provider error
**Solution:**
System automatically falls back to console mode:
```javascript
// Automatic fallback in code
catch (error) {
  console.log('[OTP] Falling back to console');
  return sendConsoleSMS(phoneNumber, otp);
}
```

### Issue: Slow delivery
**Solution:**
- 2Factor.in: Usually < 5 seconds
- Fast2SMS: Can take 10-30 seconds
- Twilio: Usually < 5 seconds

## 💰 Cost Comparison (per 1000 SMS)

| Provider | Cost (INR) | Cost (USD) | Delivery Time |
|----------|-----------|------------|---------------|
| Console | ₹0 | $0 | Instant |
| 2Factor.in | ₹100 | $1.20 | < 5 sec |
| Fast2SMS | ₹100-150 | $1.20-1.80 | 10-30 sec |
| TextLocal | ₹100 | $1.20 | < 10 sec |
| MSG91 | ₹150 | $1.80 | < 5 sec |
| Twilio SMS | ₹600 | $7.50 | < 5 sec |
| Twilio WhatsApp | ₹400 | $5.00 | < 5 sec |

## 🎯 Final Recommendation

### For Your Project:

1. **Right Now (Development)**:
   ```env
   SMS_PROVIDER=console
   ```
   - Free, instant, perfect for testing

2. **When Going Live (Production)**:
   ```env
   SMS_PROVIDER=2factor
   TWOFACTOR_API_KEY=your-key
   ```
   - 100 free SMS/month
   - ₹0.10/SMS after
   - No monthly fees
   - Perfect for Indian users

3. **Future (Scale)**:
   - Keep using 2Factor.in (cost-effective)
   - Or upgrade to Twilio if going international

## 📞 Support

Need help choosing?
- **Low budget**: 2Factor.in
- **International**: Twilio
- **Development**: Console
- **Bulk SMS**: Fast2SMS or MSG91
