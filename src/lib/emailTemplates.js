/**
 * Email Templates for Designer Account Management
 */

/**
 * Send Account Blocked Notification Email
 */
export async function sendBlockNotificationEmail({ email, designerName, blockReason }) {
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
      subject: 'Account Blocked - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: white; border: 2px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚫 Account Blocked</h1>
            </div>
            <div class="content">
              <p>Dear ${designerName},</p>

              <div class="alert-box">
                <p style="margin: 0; font-size: 18px; color: #ef4444; font-weight: bold; text-align: center;">Your MyDesignBazaar Account Has Been Blocked</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666; text-align: center;">Effective immediately, your account and all associated credentials have been blocked.</p>
              </div>

              <div class="reason-box">
                <strong>Reason for Blocking:</strong>
                <p style="margin: 10px 0 0 0;">${blockReason}</p>
              </div>

              <p><strong>What this means:</strong></p>
              <ul>
                <li>You can no longer access your designer account</li>
                <li>All your uploaded designs have been removed from the platform</li>
                <li>Your credentials (email, phone, Aadhaar, PAN) are permanently blocked</li>
                <li>You cannot create a new account using any of these credentials</li>
                <li>Any attempt to register with blocked credentials will result in immediate account suspension</li>
              </ul>

              <div class="info-box">
                <strong>Blocked Credentials:</strong>
                <p style="margin: 10px 0 0 0;">The following information has been permanently blocked:</p>
                <ul style="margin: 10px 0 0 0;">
                  <li>Email address: ${email}</li>
                  <li>Associated phone numbers (primary & alternative)</li>
                  <li>Aadhaar number</li>
                  <li>PAN number</li>
                  <li>GST number</li>
                  <li>Bank account details</li>
                  <li>UPI ID and PayPal ID</li>
                  <li>Portfolio website links</li>
                </ul>
              </div>

              <p><strong>If you believe this action was taken in error:</strong></p>
              <p>Please contact our support team at ${process.env.EMAIL_USER} with your account details and any relevant information. Include "Account Block Appeal" in the subject line.</p>

              <p style="margin-top: 30px;">Sincerely,<br><strong>MyDesignBazaar Admin Team</strong></p>
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
    console.log(`Account blocked notification sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Block notification email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send Account Deleted Notification Email
 */
export async function sendDeleteNotificationEmail({ email, designerName, deleteReason }) {
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
      subject: 'Account Deleted - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: white; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .reason-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🗑️ Account Deleted</h1>
            </div>
            <div class="content">
              <p>Dear ${designerName},</p>

              <div class="alert-box">
                <p style="margin: 0; font-size: 18px; color: #f59e0b; font-weight: bold; text-align: center;">Your MyDesignBazaar Account Has Been Deleted</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666; text-align: center;">Your designer account and all associated data have been permanently removed.</p>
              </div>

              <div class="reason-box">
                <strong>Reason for Deletion:</strong>
                <p style="margin: 10px 0 0 0;">${deleteReason}</p>
              </div>

              <p><strong>What has been removed:</strong></p>
              <ul>
                <li>Your designer profile and account information</li>
                <li>All uploaded designs and associated files</li>
                <li>Portfolio samples and documents</li>
                <li>Account history and statistics</li>
              </ul>

              <div class="success-box">
                <strong>✓ You Can Create a New Account</strong>
                <p style="margin: 10px 0 0 0;">
                  Your credentials (email, phone, Aadhaar, PAN) have been released and you are welcome
                  to create a new account on MyDesignBazaar if you wish to do so in the future.
                </p>
              </div>

              <p><strong>Questions or concerns?</strong></p>
              <p>If you have any questions about this action or would like more information, please contact our support team at ${process.env.EMAIL_USER}.</p>

              <p style="margin-top: 30px;">Thank you for being part of MyDesignBazaar.</p>
              <p>Sincerely,<br><strong>MyDesignBazaar Admin Team</strong></p>
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
    console.log(`Account deleted notification sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Delete notification email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send Designer Application Rejection Email
 */
export async function sendRejectionNotificationEmail({ email, designerName, rejectionReason }) {
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
      subject: 'Designer Application Status - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .rejection-box { background: white; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .reason-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .warning-icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="warning-icon">📋</div>
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>Dear ${designerName},</p>

              <div class="rejection-box">
                <p style="margin: 0; font-size: 18px; color: #f59e0b; font-weight: bold; text-align: center;">Thank you for your interest in MyDesignBazaar</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666; text-align: center;">We have reviewed your designer application.</p>
              </div>

              <p>After careful consideration of your application, we regret to inform you that we are unable to approve your designer account at this time.</p>

              <div class="reason-box">
                <strong>Reason for Rejection:</strong>
                <p style="margin: 10px 0 0 0;">${rejectionReason}</p>
              </div>

              <p><strong>What this means:</strong></p>
              <ul>
                <li>Your application has not been approved for our platform</li>
                <li>Your uploaded documents and information have been removed</li>
                <li>Your credentials are not blocked - you can reapply in the future</li>
                <li>You can create a new account with the same email and phone number</li>
              </ul>

              <div class="info-box">
                <strong>💡 For Future Applications:</strong>
                <p style="margin: 10px 0 0 0;">
                  We encourage you to consider the feedback provided and reapply once you've addressed the mentioned concerns. 
                  Our platform maintains high standards to ensure the best experience for both designers and buyers.
                </p>
              </div>

              <p><strong>🚀 Reapplication Process:</strong></p>
              <ul>
                <li>You can create a new designer account anytime</li>
                <li>Ensure your portfolio meets our quality standards</li>
                <li>Provide complete and accurate information</li>
                <li>Upload high-quality sample designs</li>
                <li>Make sure all documents are clear and valid</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://mydesignbazaar.com'}/register" class="cta-button">
                  Apply Again →
                </a>
              </div>

              <p><strong>📋 Application Tips:</strong></p>
              <ul>
                <li>Review our designer guidelines before reapplying</li>
                <li>Ensure your sample designs showcase your best work</li>
                <li>Complete all required fields accurately</li>
                <li>Upload clear, high-resolution document images</li>
                <li>Write a compelling bio and portfolio description</li>
              </ul>

              <p><strong>❓ Questions or Need Clarification?</strong></p>
              <p>If you have any questions about this decision or need clarification on how to improve your application, please contact our support team at ${process.env.EMAIL_USER}. Include "Application Feedback Request" in the subject line.</p>

              <p style="margin-top: 30px;">We appreciate your interest in MyDesignBazaar and encourage you to apply again when you're ready.</p>

              <p style="margin-top: 20px;">Best regards,<br><strong>MyDesignBazaar Review Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MyDesignBazaar. All rights reserved.</p>
              <p style="margin-top: 5px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application rejection notification sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Rejection notification email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send Account Unblocked Notification Email
 */
export async function sendUnblockNotificationEmail({ email, designerName, unblockRemarks = null }) {
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
      subject: '✅ Account Unblocked - MyDesignBazaar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: white; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .remarks-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Account Unblocked</h1>
            </div>
            <div class="content">
              <p>Dear ${designerName},</p>

              <div class="success-box">
                <p style="margin: 0; font-size: 18px; color: #10b981; font-weight: bold; text-align: center;">Great News! Your Account Has Been Unblocked</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666; text-align: center;">You can now access your MyDesignBazaar designer account again.</p>
              </div>

              ${unblockRemarks ? `
              <div class="remarks-box">
                <strong>Admin Remarks:</strong>
                <p style="margin: 10px 0 0 0;">${unblockRemarks}</p>
              </div>
              ` : ''}

              <p><strong>What this means:</strong></p>
              <ul>
                <li>You can now log in to your designer account</li>
                <li>Your credentials are no longer blocked</li>
                <li>You can start uploading new designs</li>
                <li>You have full access to all platform features</li>
                <li>You can manage your profile and portfolio</li>
              </ul>

              <div class="info-box">
                <strong>📋 Please Note:</strong>
                <p style="margin: 10px 0 0 0;">
                  Your previous designs that were removed during the blocking period are not restored. 
                  You will need to re-upload any designs you wish to sell on the platform.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://mydesignbazaar.com'}/login" class="cta-button">
                  Login to Your Dashboard →
                </a>
              </div>

              <p><strong>🚀 Ready to Get Started Again?</strong></p>
              <ul>
                <li>Upload fresh, high-quality designs</li>
                <li>Update your profile and portfolio</li>
                <li>Set competitive pricing for your designs</li>
                <li>Engage with the buyer community</li>
              </ul>

              <p><strong>❗ Important Reminder:</strong></p>
              <p>Please ensure you follow our community guidelines and terms of service to maintain your account in good standing. If you have any questions about our policies, feel free to reach out to our support team.</p>

              <p><strong>Need assistance?</strong></p>
              <p>If you have any questions or need help getting started again, please contact our support team at ${process.env.EMAIL_USER}.</p>

              <p style="margin-top: 30px;">Welcome back to MyDesignBazaar!</p>
              <p>Sincerely,<br><strong>MyDesignBazaar Admin Team</strong></p>
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
    console.log(`Account unblocked notification sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Unblock notification email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send Designer Approval Welcome Email
 */
export async function sendApprovalWelcomeEmail({ email, designerName }) {
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
      subject: '🎉 Welcome to MyDesignBazaar - Your Account is Approved!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .welcome-box { background: white; border: 2px solid #10b981; padding: 25px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .feature-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .info-list { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">🎉</div>
              <h1 style="margin: 0;">Congratulations!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Your Designer Account Has Been Approved</p>
            </div>
            <div class="content">
              <p>Dear ${designerName},</p>

              <div class="welcome-box">
                <p style="margin: 0; font-size: 20px; color: #10b981; font-weight: bold;">Welcome to MyDesignBazaar! ✨</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">You can now start uploading and selling your designs to thousands of buyers.</p>
              </div>

              <p><strong>🎊 What does this mean?</strong></p>
              <div class="info-list">
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;"><strong>Full Platform Access:</strong> You can now log in to your designer dashboard</li>
                  <li style="margin-bottom: 10px;"><strong>Upload Designs:</strong> Start uploading your creative designs and showcase your portfolio</li>
                  <li style="margin-bottom: 10px;"><strong>Earn Money:</strong> Set your prices and earn from every design sale</li>
                  <li style="margin-bottom: 10px;"><strong>Manage Inventory:</strong> Keep track of all your designs and sales in one place</li>
                  <li style="margin-bottom: 10px;"><strong>Get Discovered:</strong> Your designs will be visible to all buyers on the platform</li>
                </ul>
              </div>

              <p><strong>🚀 What can you do now?</strong></p>

              <div class="feature-box">
                <strong>1. Upload Your First Design</strong>
                <p style="margin: 5px 0 0 0;">Head to your dashboard and start uploading your designs. Make sure they meet our quality guidelines for the best results!</p>
              </div>

              <div class="feature-box">
                <strong>2. Complete Your Profile</strong>
                <p style="margin: 5px 0 0 0;">Add a profile picture, bio, and portfolio links to help buyers connect with you and your work.</p>
              </div>

              <div class="feature-box">
                <strong>3. Set Your Pricing</strong>
                <p style="margin: 5px 0 0 0;">You have full control over your design pricing. Choose prices that reflect the value of your work.</p>
              </div>

              <div class="feature-box">
                <strong>4. Track Your Sales</strong>
                <p style="margin: 5px 0 0 0;">Monitor your sales, earnings, and popular designs through your dashboard analytics.</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://mydesignbazaar.com'}/login" class="cta-button">
                  Login to Your Dashboard →
                </a>
              </div>

              <p><strong>📋 Quick Tips for Success:</strong></p>
              <ul>
                <li>Upload high-quality, original designs</li>
                <li>Write clear, detailed descriptions for each design</li>
                <li>Use relevant tags to help buyers find your work</li>
                <li>Respond promptly to buyer inquiries</li>
                <li>Keep your portfolio fresh with regular uploads</li>
              </ul>

              <p><strong>❓ Need Help?</strong></p>
              <p>If you have any questions or need assistance getting started, our support team is here to help! Contact us at ${process.env.EMAIL_USER}</p>

              <p style="margin-top: 30px;">We're excited to have you as part of our creative community!</p>

              <p style="margin-top: 20px;">Best regards,<br><strong>MyDesignBazaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MyDesignBazaar. All rights reserved.</p>
              <p style="margin-top: 5px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval welcome email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Approval welcome email error:', error);
    return { success: false, error: error.message };
  }
}
