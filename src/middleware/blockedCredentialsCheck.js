import BlockedCredentials from '../models/BlockedCredentials';
import { Designer } from '../models/User';

/**
 * Checks if any of the provided credentials are blocked
 * @param {Object} credentials - Object containing email, phone, aadhaar, pan
 * @returns {Promise<Object>} { isBlocked: boolean, reason: string }
 */
export async function checkBlockedCredentials(credentials) {
  try {
    const { email, mobileNumber, aadhaarNumber, panNumber } = credentials;

    // Check if any credential is blocked
    const blockedRecord = await BlockedCredentials.isCredentialBlocked({
      email,
      phoneNumber: mobileNumber,
      aadhaarNumber,
      panNumber,
    });

    if (blockedRecord) {
      return {
        isBlocked: true,
        reason: blockedRecord.blockReason,
        blockedAt: blockedRecord.blockedAt,
      };
    }

    return {
      isBlocked: false,
    };
  } catch (error) {
    console.error('Error checking blocked credentials:', error);
    // In case of error, allow registration but log the error
    return {
      isBlocked: false,
      error: error.message,
    };
  }
}

/**
 * Middleware to check blocked credentials before registration
 * Automatically blocks the account if blocked credentials are detected
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} { allowed: boolean, message: string }
 */
export async function validateRegistrationCredentials(userData) {
  try {
    const { userType, email, ...profileData } = userData;

    // Only check for designer registrations (as per requirements)
    if (userType !== 'designer') {
      return { allowed: true };
    }

    // Extract credentials to check
    const credentials = {
      email: email,
      mobileNumber: profileData.mobileNumber,
      aadhaarNumber: profileData.aadhaarNumber,
      panNumber: profileData.panNumber,
      alternativeContact: profileData.alternativeContact,
      gstNumber: profileData.gstNumber,
      bankAccountNumber: profileData.bankDetails?.accountNumber,
      upiId: profileData.bankDetails?.upiId,
      paypalId: profileData.bankDetails?.paypalId,
      portfolioLinks: profileData.portfolioLinks || [],
    };

    // Check if any credential is blocked
    const blockCheck = await checkBlockedCredentials(credentials);

    if (blockCheck.isBlocked) {
      return {
        allowed: false,
        message: 'Your account has been blocked. You cannot register using these credentials.',
        reason: blockCheck.reason,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error validating registration credentials:', error);
    // In case of error, allow registration but log the error
    return { allowed: true, error: error.message };
  }
}
