# MSG91 WhatsApp OTP Setup Guide

Complete guide to set up WhatsApp OTP verification using MSG91 for MyDesignBazaar.

## Why MSG91 WhatsApp?

- ✅ **Best for Indian Market**: Optimized for India with local support
- ✅ **Better Deliverability**: Higher success rates than Twilio in India
- ✅ **Cost-Effective**: Competitive pricing, often cheaper than alternatives
- ✅ **Easy Integration**: Simple REST API
- ✅ **Template-Based**: Meta-approved templates ensure compliance

---

## Step 1: Create MSG91 Account

1. Visit [https://msg91.com](https://msg91.com)
2. Click **Sign Up** and complete registration
3. Verify your email and phone number
4. Complete KYC verification (required for WhatsApp Business API)

---

## Step 2: Get WhatsApp Business API Access

### Option A: Through MSG91 (Recommended)

1. Log in to [MSG91 Control Panel](https://control.msg91.com/)
2. Navigate to **WhatsApp** section in the sidebar
3. Click **Get Started with WhatsApp**
4. Choose your plan:
   - **Free Trial**: Limited messages for testing
   - **Paid Plans**: Starting from ₹4,999/month + per message charges

### Option B: Direct Meta Application

If you already have Meta WhatsApp Business API approval, you can integrate it with MSG91.

---

## Step 3: Register Your WhatsApp Number

1. In MSG91 Dashboard → **WhatsApp** → **Numbers**
2. Click **Add Number**
3. Choose one of these options:
   - **Use MSG91's Shared Number** (Quick start, limited branding)
   - **Register Your Own Number** (Better branding, requires verification)

### For Your Own Number:
- Provide a new phone number (cannot be used elsewhere)
- Verify ownership via OTP
- Complete Meta's verification process (2-3 business days)

---

## Step 4: Create WhatsApp Template

Meta requires **pre-approved templates** for WhatsApp Business messages.

### Creating the Template:

1. Go to **WhatsApp** → **Templates** → **Create Template**
2. Fill in the details:

```
Template Name: otp_verification (use this exact name)
Category: AUTHENTICATION
Language: English

Body Message:
Hello {{1}},

Your MyDesignBazaar verification code is *{{2}}*

This code will expire in 10 minutes.

If you didn't request this, please ignore this message.

Button Type: URL (Optional)
Button Text: Verify Now
Button URL: https://yourwebsite.com/verify?code={{1}}
```

3. **Submit for Approval** → Usually approved within 24 hours

### Important Template Guidelines:
- ✅ Keep it professional and clear
- ✅ Use placeholders like {{1}}, {{2}} for dynamic content
- ✅ Include validity time (e.g., "expires in 10 minutes")
- ✅ Add opt-out language if required
- ❌ Don't use promotional language
- ❌ Don't include marketing content

---

## Step 5: Get Your Credentials

### 1. Get Auth Key
- Go to **Settings** → **API Keys**
- Copy your **Auth Key**

### 2. Get WhatsApp Template ID
- Go to **WhatsApp** → **Templates**
- Find your approved template
- Copy the **Template Name** (e.g., `otp_verification`)

### 3. Get WhatsApp Number
- Go to **WhatsApp** → **Numbers**
- Copy your registered WhatsApp number

---

## Step 6: Configure Environment Variables

Update your `.env` file:

```env
# Set SMS Provider to MSG91 WhatsApp
SMS_PROVIDER=msg91-whatsapp

# MSG91 Configuration
MSG91_AUTH_KEY=your_actual_auth_key_here
MSG91_WHATSAPP_TEMPLATE_ID=otp_verification
MSG91_WHATSAPP_NUMBER=919876543210
```

**Important Notes:**
- `MSG91_AUTH_KEY`: Get from Settings → API Keys
- `MSG91_WHATSAPP_TEMPLATE_ID`: Use the exact template name (not the ID)
- `MSG91_WHATSAPP_NUMBER`: Include country code without + (e.g., 919876543210)

---

## Step 7: Test the Integration

### Using Development Mode (Console Output)

First, test without actual API calls:

```env
SMS_PROVIDER=console
```

Run your app and trigger OTP flow. Check console for OTP output.

### Testing with MSG91

1. Switch to MSG91:
```env
SMS_PROVIDER=msg91-whatsapp
```

2. Test with your own number:
```javascript
// Make API call to your OTP endpoint
POST /api/auth/otp/send
{
  "type": "mobile",
  "mobileNumber": "9876543210", // Your number
  "userId": "your-user-id"
}
```

3. Check:
   - ✅ You receive WhatsApp message
   - ✅ OTP code is visible
   - ✅ Message format matches your template
   - ✅ No errors in console

### Verify OTP

```javascript
POST /api/auth/otp/verify
{
  "type": "mobile",
  "mobileNumber": "9876543210",
  "otp": "123456",
  "userId": "your-user-id"
}
```

---

## Step 8: Production Checklist

Before going live:

- [ ] WhatsApp template approved by Meta
- [ ] Production phone number verified
- [ ] Auth key is from production account
- [ ] Environment variables set correctly
- [ ] Tested with multiple phone numbers
- [ ] Error handling works properly
- [ ] Rate limiting configured (if needed)
- [ ] Monitoring and logging enabled

---

## Pricing (As of 2024)

### MSG91 WhatsApp Pricing

| Message Type | India | International |
|-------------|-------|---------------|
| Authentication | ₹0.25 - ₹0.35 | $0.005 - $0.015 |
| Marketing | ₹0.45 - ₹0.60 | $0.015 - $0.030 |

**Monthly Platform Fee**: ₹4,999 - ₹9,999 (based on volume)

### Cost Comparison

| Provider | Indian OTP Cost | Setup Complexity |
|---------|----------------|------------------|
| MSG91 WhatsApp | ₹0.25 | Medium |
| Twilio WhatsApp | ~₹2.00 | Medium |
| SMS (2Factor) | ₹0.10 | Easy |
| SMS (MSG91) | ₹0.15 | Easy |

💡 **Recommendation**: Start with console mode or cheap SMS for development, move to WhatsApp for production.

---

## Troubleshooting

### Issue: "MSG91 Auth Key not configured"
**Solution**: Check if `MSG91_AUTH_KEY` is set in `.env` file

### Issue: "MSG91 WhatsApp Template ID not configured"
**Solution**: Set `MSG91_WHATSAPP_TEMPLATE_ID` to your template name

### Issue: "Invalid mobile number format"
**Solution**:
- Use 10-digit format without spaces
- System will automatically add +91

### Issue: "Template not approved"
**Solution**:
- Wait for Meta approval (usually 24 hours)
- Check template status in MSG91 dashboard

### Issue: "Failed to send WhatsApp OTP"
**Solution**:
1. Verify WhatsApp number is active on MSG91
2. Check if you have sufficient credits
3. Ensure template variables match ({{1}} for name, {{2}} for OTP)
4. Review API logs in MSG91 dashboard

### Issue: "Messages not received"
**Solution**:
1. Verify recipient's WhatsApp is active
2. Check MSG91 delivery reports
3. Ensure phone number format is correct
4. Try sending a test message from MSG91 dashboard

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "OTP sent to WhatsApp successfully",
  "expiresIn": "10 minutes"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to send mobile OTP",
  "details": "MSG91 WhatsApp Template ID not configured"
}
```

---

## Code Flow

1. User requests OTP → `/api/auth/otp/send`
2. System generates 6-digit OTP
3. Calls `sendMobileOTP()` with user's phone
4. Routes to `sendWhatsAppOTP()` based on `SMS_PROVIDER`
5. `sendWhatsAppOTP()` → `sendMSG91WhatsApp()`
6. MSG91 API call with template and parameters
7. WhatsApp message delivered to user
8. OTP stored in database with expiry
9. User enters OTP → `/api/auth/otp/verify`
10. System validates OTP and marks as verified

---

## Additional Resources

- [MSG91 Documentation](https://docs.msg91.com/)
- [MSG91 WhatsApp API Docs](https://docs.msg91.com/p/tf9GTextGzo7yQ8yP0wKe7/e/d-NaBQElA5B8qTAFEYw8o/MSG91-WhatsApp-API)
- [Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/business-management-api)
- [MSG91 Support](https://msg91.com/contact)

---

## Alternative: Quick Testing with SMS

If WhatsApp setup is taking time, use MSG91 SMS temporarily:

```env
SMS_PROVIDER=msg91-sms
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_sms_template_id
```

SMS templates are easier to approve and can be used immediately while waiting for WhatsApp approval.

---

## Support

If you encounter issues:
1. Check MSG91 dashboard logs
2. Review application logs for detailed errors
3. Contact MSG91 support: support@msg91.com
4. Check this project's issues on GitHub

---

**Ready to go! 🚀**

Your WhatsApp OTP system is now configured. Test thoroughly before production deployment.
