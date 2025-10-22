/**
 * OTP Service - Generate and verify OTPs for email and mobile verification
 */

import {
  send2FactorSMS,
  sendFast2SMS,
  sendTextLocalSMS,
  sendMSG91SMS,
  sendMSG91WhatsApp,
  sendConsoleSMS
} from './smsProviders';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get OTP expiry time (10 minutes from now)
 */
export function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiryDate) {
  return new Date() > new Date(expiryDate);
}

/**
 * Send OTP via Email using Nodemailer
 */
export async function sendEmailOTP(email, otp, userName = 'User') {
  // For now, we'll use Nodemailer with Gmail
  // You'll need to configure SMTP credentials in .env
  const nodemailer = require('nodemailer');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    // Email template
    const mailOptions = {
      from: `"MyDesignBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>Thank you for registering with MyDesignBazaar! To complete your registration, please verify your email address using the OTP below:</p>

              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code will expire in 10 minutes</p>
              </div>

              <p>If you didn't request this verification, please ignore this email.</p>

              <p>Best regards,<br><strong>MyDesignBazaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MyDesignBazaar. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email OTP sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send OTP via WhatsApp using MSG91
 * This is the recommended WhatsApp OTP method
 */
export async function sendWhatsAppOTP(phoneNumber, otp, userName = 'User') {
  try {
    // Use MSG91 WhatsApp API
    return await sendMSG91WhatsApp(phoneNumber, otp, userName);
  } catch (error) {
    console.error('WhatsApp OTP sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send OTP via WhatsApp using Twilio (Alternative)
 * Use this if you prefer Twilio over MSG91
 */
export async function sendTwilioWhatsAppOTP(phoneNumber, otp, userName = 'User') {
  try {
    // Using Twilio for WhatsApp
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Format phone number (must include country code, e.g., +91 for India)
    const formattedNumber = phoneNumber.startsWith('+')
      ? `whatsapp:${phoneNumber}`
      : `whatsapp:+91${phoneNumber}`; // Default to India

    // Send WhatsApp message
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
      to: formattedNumber,
      body: `Hello ${userName}!\n\nYour MyDesignBazaar verification code is: *${otp}*\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this message.`
    });

    return { success: true };
  } catch (error) {
    console.error('Twilio WhatsApp OTP sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Smart Mobile OTP Sender
 * Automatically uses the best available provider based on configuration
 */
export async function sendMobileOTP(phoneNumber, otp, userName = 'User') {
  const provider = process.env.SMS_PROVIDER || 'console';

  console.log(`[OTP] Using provider: ${provider} for ${phoneNumber}`);

  try {
    switch (provider.toLowerCase()) {
      case 'msg91-whatsapp':
        // Primary: MSG91 WhatsApp (Recommended for Indian market)
        return await sendWhatsAppOTP(phoneNumber, otp, userName);

      case 'twilio-whatsapp':
        // Alternative: Twilio WhatsApp
        return await sendTwilioWhatsAppOTP(phoneNumber, otp, userName);

      case 'twilio-sms':
        return await sendSMSOTP(phoneNumber, otp, userName);

      case '2factor':
        return await send2FactorSMS(phoneNumber, otp);

      case 'fast2sms':
        return await sendFast2SMS(phoneNumber, otp);

      case 'textlocal':
        return await sendTextLocalSMS(phoneNumber, otp);

      case 'msg91':
      case 'msg91-sms':
        return await sendMSG91SMS(phoneNumber, otp);

      case 'console':
      default:
        return await sendConsoleSMS(phoneNumber, otp);
    }
  } catch (error) {
    console.error('[OTP] Provider error, falling back to console:', error);
    return await sendConsoleSMS(phoneNumber, otp);
  }
}

/**
 * Alternative: Simple SMS OTP (using Twilio SMS)
 * Use this if WhatsApp Business API is not available
 */
export async function sendSMSOTP(phoneNumber, otp, userName = 'User') {
  try {
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Format phone number
    const formattedNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+91${phoneNumber}`;

    // Send SMS
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
      body: `Your MyDesignBazaar verification code is: ${otp}. Valid for 10 minutes.`
    });

    return { success: true };
  } catch (error) {
    console.error('SMS OTP sending error:', error);
    return { success: false, error: error.message };
  }
}
