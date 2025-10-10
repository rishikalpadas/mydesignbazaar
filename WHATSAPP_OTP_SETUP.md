# 📱 WhatsApp OTP Setup Guide (Quick & Easy)

Complete step-by-step guide to set up WhatsApp OTP verification for your application.

## 🎯 Overview

Your application will send OTP verification codes via WhatsApp to verify mobile numbers during registration.

## ⚡ Quick Setup (15 Minutes)

### Step 1: Create Twilio Account (5 minutes)

1. **Sign up**: Go to https://www.twilio.com/try-twilio
2. **Fill in details**:
   - First & Last Name
   - Email
   - Password
   - Phone number (for verification)
3. **Verify your email**: Check inbox and click verification link
4. **Verify your phone**: Enter the code sent to your phone
5. **Get FREE $15 credit** 💰 (~3000 WhatsApp messages)

### Step 2: Get Your Twilio Credentials (2 minutes)

1. **Login** to Twilio Console: https://console.twilio.com
2. **Dashboard** will show:
   - **Account SID**: Copy this (looks like: AC1234567890abcdef...)
   - **Auth Token**: Click "View" and copy
3. **Keep these safe** - you'll need them in Step 4

### Step 3: Set Up WhatsApp Sandbox (3 minutes)

Since you're testing, we'll use Twilio's FREE WhatsApp Sandbox:

1. In Twilio Console, go to:
   - **Messaging** → **Try it out** → **Send a WhatsApp message**

2. You'll see a page showing:
   - **Sandbox Number**: e.g., `+14155238886`
   - **Join Code**: e.g., "join abc-defg"

3. **Join the Sandbox**:
   - Open WhatsApp on your phone
   - Send a message to the sandbox number shown
   - Message format: `join your-code-here`
   - Example: `join abc-defg`
   - You'll get a confirmation message

4. **Test it** (optional):
   - Send any message to the sandbox number
   - You should receive a reply
   - This confirms WhatsApp is working

### Step 4: Configure Your Application (5 minutes)

1. **Open your `.env` file** in the project root

2. **Update these lines**:
```env
# WhatsApp Provider (already set)
SMS_PROVIDER=twilio-whatsapp

# Twilio Credentials (replace with your actual values)
TWILIO_ACCOUNT_SID=paste-your-account-sid-here
TWILIO_AUTH_TOKEN=paste-your-auth-token-here
TWILIO_WHATSAPP_NUMBER=+14155238886

# Email Configuration (for email OTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

3. **Save the file**

4. **Restart your development server**:
   - Stop the server (Ctrl+C)
   - Start again: `npm run dev`

### Step 5: Test WhatsApp OTP (2 minutes)

1. **Make sure you've joined the WhatsApp sandbox** (Step 3)

2. **Test the OTP endpoint**:
```bash
curl -X POST http://localhost:3001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "9876543210",
    "type": "mobile",
    "userId": "your-user-id"
  }'
```

3. **Check WhatsApp** on the phone number you provided
4. **You should receive**: A message with your 6-digit OTP code

✅ **Done!** WhatsApp OTP is now working!

---

## 📋 Configuration Checklist

- [ ] Created Twilio account
- [ ] Got Account SID
- [ ] Got Auth Token
- [ ] Joined WhatsApp Sandbox
- [ ] Updated `.env` file with credentials
- [ ] Restarted dev server
- [ ] Tested and received WhatsApp message

---

## 🆓 Free Tier Details

### What You Get FREE with Twilio:

- **$15 Trial Credit** on signup
- **~3,000 WhatsApp messages** with trial credit
- **WhatsApp**: $0.005 per message
- **SMS**: $0.0075 per message

### Trial Limitations:

1. **Sandbox Only**: Must use Twilio's sandbox number
2. **Must Join Sandbox**: Each recipient must join first (one-time)
3. **Branded Messages**: Shows "sent from unverified number"

### When to Upgrade:

For production, you'll need:
1. **Apply for WhatsApp Business API**
2. **Get your own WhatsApp number**
3. **Costs**: $0.005/message (India)

But for **development and testing**, the free sandbox is perfect!

---

## 🔧 Example .env Configuration

```env
# === Email OTP Configuration ===
EMAIL_USER=mydesignbazaar@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# === WhatsApp OTP Configuration ===
SMS_PROVIDER=twilio-whatsapp
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_secret_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# === Database ===
MONGODB_URI=mongodb+srv://username:password@cluster...
JWT_SECRET=your_jwt_secret
```

---

## 📱 How It Works

### User Registration Flow:

1. **User enters** email and mobile number
2. **System sends**:
   - ✉️ OTP to email
   - 📱 OTP to WhatsApp
3. **User receives**:
   - Email: 6-digit code
   - WhatsApp: 6-digit code
4. **User verifies** both codes
5. **Account activated** ✅

### WhatsApp Message Format:

```
Hello User Name!

Your MyDesignBazaar verification code is: *123456*

This code will expire in 10 minutes.

If you didn't request this, please ignore this message.
```

---

## 🚨 Troubleshooting

### Issue: WhatsApp message not received

**Solution 1**: Join the sandbox
```
1. Open WhatsApp
2. Message: +14155238886 (or your sandbox number)
3. Send: join your-join-code
4. Wait for confirmation
5. Try sending OTP again
```

**Solution 2**: Check phone number format
```javascript
// Correct formats:
"+919876543210"  // With country code
"9876543210"     // System adds +91 automatically
```

**Solution 3**: Verify Twilio credentials
- Check Account SID is correct
- Check Auth Token is correct
- Check WhatsApp sandbox number

### Issue: Invalid credentials error

**Fix**:
1. Go to Twilio Console
2. Verify Account SID and Auth Token
3. Re-copy and paste into `.env`
4. Remove any extra spaces
5. Restart server

### Issue: Sandbox expired

**Fix**:
- Sandbox sessions last 24 hours
- Re-join by sending "join code" again
- Or upgrade to production WhatsApp API

---

## 💡 Pro Tips

### Development:
- Use sandbox - it's FREE
- Test with your own number first
- Join sandbox once per device

### Testing:
- Free $15 credit = 3000 messages
- Each OTP costs $0.005
- Monitor usage in Twilio dashboard

### Production:
- Apply for WhatsApp Business API (takes 1-2 weeks)
- Costs: ~$0.005 per message
- No sandbox limitations
- Professional branding

---

## 📊 Cost Estimate

For **10,000 users** registering:
- 10,000 WhatsApp OTPs
- Cost: 10,000 × $0.005 = **$50**
- That's **₹4,000 for 10,000 OTPs**
- Only **₹0.40 per user**

**Very affordable!** 🎉

---

## 🔗 Useful Links

- **Twilio Console**: https://console.twilio.com
- **WhatsApp Sandbox**: Console → Messaging → Try WhatsApp
- **Pricing**: https://www.twilio.com/pricing/messaging
- **API Docs**: https://www.twilio.com/docs/whatsapp/api
- **Support**: https://support.twilio.com

---

## 🆘 Need Help?

### Common Questions:

**Q: Is Twilio free?**
A: Yes! $15 credit on signup (3000+ messages)

**Q: Do I need a credit card?**
A: No for trial! Credit card only needed for upgrade

**Q: Can I use my own WhatsApp number?**
A: Not in sandbox. Need to apply for Business API

**Q: How long does sandbox last?**
A: Forever! But users must rejoin every 24 hours

**Q: Is there a truly free alternative?**
A: For development, use `SMS_PROVIDER=console` (prints OTP in terminal)

---

## ✅ Next Steps

After setup:
1. ✅ Test email OTP (using Gmail)
2. ✅ Test WhatsApp OTP (using Twilio)
3. ✅ Integrate with registration UI
4. ✅ Test complete registration flow
5. ✅ Deploy to production (when ready)

---

## 🎓 Additional Setup (Optional)

### If You Want SMS Instead of WhatsApp:

1. Change provider:
```env
SMS_PROVIDER=twilio-sms
```

2. Buy a Twilio phone number:
   - Console → Phone Numbers → Buy a number
   - Costs ~$1/month + message costs

3. Update `.env`:
```env
TWILIO_PHONE_NUMBER=+1234567890
```

### If You Want Indian SMS Provider:

Use 2Factor.in (100 FREE SMS/month):
```env
SMS_PROVIDER=2factor
TWOFACTOR_API_KEY=your-api-key
```

**But for WhatsApp specifically**, Twilio is the best option!

---

**That's it!** You're now ready to send WhatsApp OTPs! 🚀
