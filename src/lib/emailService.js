/**
 * Email Service - Send various emails (password reset, notifications, etc.)
 */

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(email, resetToken, resetUrl) {
  const nodemailer = require('nodemailer');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Email template
    const mailOptions = {
      from: `"MyDesignBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reset-box { background: white; border: 2px solid #f59e0b; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .reset-button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .reset-button:hover { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your MyDesignBazaar account.</p>

              <div class="reset-box">
                <p style="margin: 0 0 10px 0; font-size: 16px; color: #666;">Click the button below to reset your password:</p>
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This link will expire in 1 hour</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This link can only be used once</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged if you don't click the link</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>

              <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; font-size: 12px; color: #666;">
                ${resetUrl}
              </p>

              <p style="margin-top: 30px;">Best regards,<br><strong>MyDesignBazaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MyDesignBazaar. All rights reserved.</p>
              <p style="margin-top: 10px;">If you have any questions, contact us at ${process.env.EMAIL_USER}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send Password Changed Confirmation Email
 */
export async function sendPasswordChangedEmail(email, userName = 'User') {
  const nodemailer = require('nodemailer');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MyDesignBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Successfully Changed - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: white; border: 2px solid #10b981; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Changed</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>

              <div class="success-box">
                <p style="margin: 0; font-size: 18px; color: #10b981; font-weight: bold;">Password Successfully Updated</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Your password has been changed successfully.</p>
              </div>

              <p>You can now log in to your MyDesignBazaar account using your new password.</p>

              <div class="warning">
                <strong>⚠️ Didn't make this change?</strong>
                <p style="margin: 10px 0 0 0;">
                  If you didn't change your password, please contact us immediately at ${process.env.EMAIL_USER}
                  or reset your password again to secure your account.
                </p>
              </div>

              <p style="margin-top: 30px;">Best regards,<br><strong>MyDesignBazaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MyDesignBazaar. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password changed confirmation sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Password changed email error:', error);
    return { success: false, error: error.message };
  }
}
