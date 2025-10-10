/**
 * Alternative SMS/OTP Providers
 * Free and low-cost options for Indian market
 */

/**
 * 2Factor.in SMS Provider (India)
 * Free: 100 SMS/month
 * Signup: https://2factor.in
 */
export async function send2FactorSMS(phoneNumber, otp) {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;

    if (!apiKey) {
      throw new Error('2Factor API key not configured');
    }

    // Remove +91 if present, 2Factor expects 10 digits
    const mobile = phoneNumber.replace(/^\+91/, '');

    // Send OTP using 2Factor API
    const response = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/AUTOGEN`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (data.Status === 'Success') {
      return { success: true, sessionId: data.Details };
    } else {
      return { success: false, error: data.Details };
    }
  } catch (error) {
    console.error('2Factor SMS error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fast2SMS Provider (India)
 * Free credits on signup
 * Signup: https://www.fast2sms.com
 */
export async function sendFast2SMS(phoneNumber, otp) {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      throw new Error('Fast2SMS API key not configured');
    }

    // Remove +91 if present
    const mobile = phoneNumber.replace(/^\+91/, '');

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        sender_id: 'FSTSMS',
        message: `Your MyDesignBazaar verification code is ${otp}. Valid for 10 minutes.`,
        variables_values: otp,
        flash: 0,
        numbers: mobile
      })
    });

    const data = await response.json();

    if (data.return === true) {
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Fast2SMS error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * TextLocal Provider (India)
 * Free trial credits
 * Signup: https://www.textlocal.in
 */
export async function sendTextLocalSMS(phoneNumber, otp) {
  try {
    const apiKey = process.env.TEXTLOCAL_API_KEY;
    const sender = process.env.TEXTLOCAL_SENDER || 'TXTLCL';

    if (!apiKey) {
      throw new Error('TextLocal API key not configured');
    }

    // Remove +91 if present, keep 10 digits
    const mobile = phoneNumber.replace(/^\+91/, '');

    const message = `Your MyDesignBazaar verification code is ${otp}. Valid for 10 minutes.`;

    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        apikey: apiKey,
        numbers: mobile,
        sender: sender,
        message: message
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { success: true };
    } else {
      return { success: false, error: data.errors?.[0]?.message };
    }
  } catch (error) {
    console.error('TextLocal SMS error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * MSG91 Provider (India)
 * Good pricing, reliable
 * Signup: https://msg91.com
 */
export async function sendMSG91SMS(phoneNumber, otp) {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    if (!authKey || !templateId) {
      throw new Error('MSG91 credentials not configured');
    }

    // Remove +91, keep 10 digits
    const mobile = phoneNumber.replace(/^\+91/, '');

    const response = await fetch(`https://api.msg91.com/api/v5/otp`, {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: `91${mobile}`,
        otp: otp
      })
    });

    const data = await response.json();

    if (data.type === 'success') {
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('MSG91 SMS error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Simple Console Logger for Development
 * Perfect for testing without actual SMS
 */
export async function sendConsoleSMS(phoneNumber, otp) {
  console.log('\n========================================');
  console.log('📱 SMS OTP (Development Mode)');
  console.log('========================================');
  console.log(`Phone: ${phoneNumber}`);
  console.log(`OTP Code: ${otp}`);
  console.log('Valid for: 10 minutes');
  console.log('========================================\n');

  return { success: true };
}
