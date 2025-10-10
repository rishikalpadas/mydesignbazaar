# OTP Verification Setup Guide

This guide will help you set up Email and WhatsApp OTP verification for your MyDesignBazaar application.

## Overview

The OTP system verifies both email and mobile number during user registration:
- **Email OTP**: Sent via email using Gmail SMTP
- **Mobile OTP**: Sent via WhatsApp using Twilio

## 📧 Email OTP Setup (Gmail)

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other** as the device and name it "MyDesignBazaar"
4. Click **Generate**
5. Copy the 16-character password (remove spaces)

### Step 3: Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=mydesignbazaar@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Use without spaces: abcdefghijklmnop
```

## 📱 WhatsApp OTP Setup (Twilio)

### Step 1: Create Twilio Account
1. Sign up at: https://www.twilio.com/try-twilio
2. Verify your email and phone number
3. Complete the account setup

### Step 2: Get Twilio Credentials
1. Go to Twilio Console: https://console.twilio.com
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Copy both credentials

### Step 3: Enable WhatsApp Sandbox (For Testing)
1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see a WhatsApp number (e.g., +14155238886)
3. Follow instructions to join the sandbox:
   - Send a WhatsApp message to the Twilio number
   - Use the join code provided (e.g., "join <code>")

### Step 4: Update .env File
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Example:**
```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Step 5: Production Setup (Optional)
For production use, you need to:
1. Apply for WhatsApp Business API access through Twilio
2. Get your own WhatsApp Business number
3. Update `TWILIO_WHATSAPP_NUMBER` with your number

## 🔧 Alternative Options

### Option 1: SMS Instead of WhatsApp
If you prefer SMS over WhatsApp:

1. Get a Twilio Phone Number:
   - Go to **Phone Numbers** → **Manage** → **Buy a number**
   - Purchase a number with SMS capability

2. Update `.env`:
```env
TWILIO_PHONE_NUMBER=+1234567890
```

3. Modify `src/lib/otpService.js`:
   - Replace `sendWhatsAppOTP` calls with `sendSMSOTP`

### Option 2: Other Email Providers
To use a different email provider (not Gmail):

Update transporter config in `src/lib/otpService.js`:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## 📝 Testing the OTP System

### Test Email OTP
```bash
# Send OTP
curl -X POST http://localhost:3001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "email"
  }'

# Verify OTP
curl -X POST http://localhost:3001/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "type": "email"
  }'
```

### Test WhatsApp OTP
```bash
# Send OTP
curl -X POST http://localhost:3001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "+919876543210",
    "type": "mobile",
    "userId": "user-id-here"
  }'

# Verify OTP
curl -X POST http://localhost:3001/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "+919876543210",
    "otp": "123456",
    "type": "mobile",
    "userId": "user-id-here"
  }'
```

## 🔒 Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use environment variables** - Never hardcode credentials
3. **Rotate credentials regularly** - Change passwords periodically
4. **Monitor usage** - Check Twilio dashboard for unusual activity
5. **Rate limiting** - Implement rate limits on OTP endpoints (recommended)

## 💰 Pricing

### Gmail
- **Free** for personal use
- No cost for sending OTP emails

### Twilio
- **Free Trial**: $15 credit
- **WhatsApp**: ~$0.005 per message (India)
- **SMS**: ~$0.0075 per message (India)
- Check latest pricing: https://www.twilio.com/pricing

## 🚨 Common Issues & Solutions

### Email OTP Not Sending
- Check if 2-Step Verification is enabled
- Verify App Password is correct (no spaces)
- Check Gmail account is not blocked

### WhatsApp OTP Not Sending
- Verify you've joined Twilio sandbox
- Check phone number format (+91 for India)
- Ensure WhatsApp is installed on test device

### OTP Expired
- Default expiry: 10 minutes
- Request a new OTP if expired

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Twilio WhatsApp Guide](https://www.twilio.com/docs/whatsapp)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

## 🆘 Support

For issues:
1. Check console logs for detailed errors
2. Verify all environment variables are set
3. Test with Twilio/Gmail test credentials first
4. Contact support if issues persist
