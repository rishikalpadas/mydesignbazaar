import { User, Designer } from '../models/User';
import Design from '../models/Design';
import BlockedCredentials from '../models/BlockedCredentials';
import { sendBlockNotificationEmail, sendDeleteNotificationEmail, sendUnblockNotificationEmail } from './emailTemplates';
import fs from 'fs/promises';
import path from 'path';

/**
 * Blocks a designer account and all their credentials
 * @param {Object} params - Block parameters
 * @param {string} params.userId - Designer's user ID
 * @param {string} params.adminId - Admin performing the action
 * @param {string} params.blockReason - Reason for blocking
 * @param {Object} params.adminInfo - Admin information (name, email)
 * @returns {Promise<Object>} Result object
 */
export async function blockDesignerAccount({ userId, adminId, blockReason, adminInfo }) {
  try {
    // Fetch designer and user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.userType !== 'designer') {
      throw new Error('User is not a designer');
    }

    const designer = await Designer.findOne({ userId });
    if (!designer) {
      throw new Error('Designer profile not found');
    }

    // Update designer status to blocked
    designer.accountStatus = 'blocked';
    designer.blockedAt = new Date();
    designer.blockedBy = adminId;
    designer.blockReason = blockReason;
    await designer.save();

    // Also update user's isApproved to false to prevent login
    user.isApproved = false;
    await user.save();

    // Add credentials to blocked list
    await BlockedCredentials.blockCredentials({
      email: user.email,
      phoneNumber: designer.mobileNumber,
      aadhaarNumber: designer.aadhaarNumber,
      panNumber: designer.panNumber,
      alternativeContact: designer.alternativeContact,
      gstNumber: designer.gstNumber,
      bankAccountNumber: designer.bankDetails?.accountNumber,
      upiId: designer.bankDetails?.upiId,
      paypalId: designer.bankDetails?.paypalId,
      portfolioLinks: designer.portfolioLinks || [],
      blockedBy: adminId,
      blockReason,
      originalUserId: userId,
      metadata: {
        adminEmail: adminInfo.email,
        adminName: adminInfo.name,
        designerName: designer.fullName,
      },
    });

    // Delete all designs by this designer
    const deletedDesigns = await deleteDesignerDesigns(userId);

    // Send email notification to designer (non-blocking - don't fail if email fails)
    sendBlockNotificationEmail({
      email: user.email,
      designerName: designer.fullName,
      blockReason,
    }).catch(emailError => {
      console.error('Failed to send block notification email:', emailError);
      // Continue anyway - email failure shouldn't block the operation
    });

    return {
      success: true,
      message: 'Designer account blocked successfully',
      deletedDesignsCount: deletedDesigns.count,
    };
  } catch (error) {
    console.error('Error blocking designer account:', error);
    throw error;
  }
}

/**
 * Deletes a designer account permanently
 * @param {Object} params - Delete parameters
 * @param {string} params.userId - Designer's user ID
 * @param {string} params.adminId - Admin performing the action
 * @param {string} params.deleteReason - Reason for deletion
 * @param {Object} params.adminInfo - Admin information (name, email)
 * @returns {Promise<Object>} Result object
 */
export async function deleteDesignerAccount({ userId, adminId, deleteReason, adminInfo }) {
  try {
    // Fetch designer and user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.userType !== 'designer') {
      throw new Error('User is not a designer');
    }

    const designer = await Designer.findOne({ userId });
    if (!designer) {
      throw new Error('Designer profile not found');
    }

    // Save email for notification before deletion
    const designerEmail = user.email;
    const designerName = designer.fullName;

    // Remove from blocked credentials if exists (allows re-registration)
    await BlockedCredentials.unblockCredentials(userId);

    // Delete all designs by this designer
    const deletedDesigns = await deleteDesignerDesigns(userId);

    // Delete designer profile files (Aadhaar, PAN, sample designs)
    await deleteDesignerFiles(designer);

    // Delete designer profile
    await Designer.deleteOne({ userId });

    // Delete user account
    await User.deleteOne({ _id: userId });

    // Send email notification to designer (non-blocking - don't fail if email fails)
    sendDeleteNotificationEmail({
      email: designerEmail,
      designerName,
      deleteReason,
    }).catch(emailError => {
      console.error('Failed to send delete notification email:', emailError);
      // Continue anyway - email failure shouldn't block the operation
    });

    return {
      success: true,
      message: 'Designer account deleted successfully',
      deletedDesignsCount: deletedDesigns.count,
    };
  } catch (error) {
    console.error('Error deleting designer account:', error);
    throw error;
  }
}

/**
 * Deletes all designs by a designer
 * @param {string} userId - Designer's user ID
 * @returns {Promise<Object>} Result with count of deleted designs
 */
async function deleteDesignerDesigns(userId) {
  try {
    // Find all designs by this designer
    const designs = await Design.find({ uploadedBy: userId });

    let deletedCount = 0;

    // Delete each design and its files
    for (const design of designs) {
      try {
        // Delete design files from filesystem
        const designDir = path.join(process.cwd(), 'public', 'uploads', 'designs', design.designId);

        try {
          await fs.rm(designDir, { recursive: true, force: true });
        } catch (fsError) {
          console.error(`Error deleting design directory ${designDir}:`, fsError);
          // Continue even if file deletion fails
        }

        // Delete design from database
        await Design.deleteOne({ _id: design._id });
        deletedCount++;
      } catch (designError) {
        console.error(`Error deleting design ${design.designId}:`, designError);
        // Continue with next design even if one fails
      }
    }

    return {
      count: deletedCount,
      total: designs.length,
    };
  } catch (error) {
    console.error('Error deleting designer designs:', error);
    throw error;
  }
}

/**
 * Deletes designer profile files (Aadhaar, PAN, sample designs)
 * @param {Object} designer - Designer document
 * @returns {Promise<void>}
 */
async function deleteDesignerFiles(designer) {
  try {
    const filesToDelete = [];

    // Add Aadhaar files
    if (designer.aadhaarFiles && designer.aadhaarFiles.length > 0) {
      filesToDelete.push(...designer.aadhaarFiles);
    }

    // Add PAN card file
    if (designer.panCardFile) {
      filesToDelete.push(designer.panCardFile);
    }

    // Add government ID (deprecated but may exist)
    if (designer.governmentId) {
      filesToDelete.push(designer.governmentId);
    }

    // Add sample designs
    if (designer.sampleDesigns && designer.sampleDesigns.length > 0) {
      filesToDelete.push(...designer.sampleDesigns);
    }

    // Delete each file
    for (const filePath of filesToDelete) {
      try {
        const fullPath = path.join(process.cwd(), 'public', filePath);
        await fs.unlink(fullPath);
      } catch (fileError) {
        console.error(`Error deleting file ${filePath}:`, fileError);
        // Continue even if file deletion fails
      }
    }
  } catch (error) {
    console.error('Error deleting designer files:', error);
    // Don't throw - file deletion failures shouldn't stop the account deletion
  }
}

/**
 * Checks if a designer account is blocked
 * @param {string} userId - Designer's user ID
 * @returns {Promise<boolean>} True if blocked
 */
export async function isDesignerBlocked(userId) {
  try {
    const designer = await Designer.findOne({ userId });
    return designer && designer.accountStatus === 'blocked';
  } catch (error) {
    console.error('Error checking designer block status:', error);
    return false;
  }
}

/**
 * Gets list of all approved designers with their status
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of designers
 */

/**
 * Unblocks a designer account and removes credentials from blocklist
 * @param {Object} params - Unblock parameters
 * @param {string} params.userId - Designer's user ID
 * @param {string} params.adminId - Admin performing the action
 * @param {string|null} params.unblockRemarks - Optional remarks for unblocking
 * @param {Object} params.adminInfo - Admin information (name, email)
 * @returns {Promise<Object>} Result object
 */
export async function unblockDesignerAccount({ userId, adminId, unblockRemarks, adminInfo }) {
  try {
    // Fetch designer and user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.userType !== 'designer') {
      throw new Error('User is not a designer');
    }

    const designer = await Designer.findOne({ userId });
    if (!designer) {
      throw new Error('Designer profile not found');
    }

    if (designer.accountStatus !== 'blocked') {
      throw new Error('Designer account is not blocked');
    }

    // Update designer status to active
    designer.accountStatus = 'active';
    designer.blockedAt = null;
    designer.blockedBy = null;
    designer.blockReason = null;
    // Store unblock information
    designer.unblockedAt = new Date();
    designer.unblockedBy = adminId;
    if (unblockRemarks && unblockRemarks.trim()) {
      designer.unblockRemarks = unblockRemarks.trim();
    }
    await designer.save();

    // Re-enable user approval
    user.isApproved = true;
    await user.save();

    // Remove credentials from blocked list
    await BlockedCredentials.unblockCredentials(userId);

    // Send email notification to designer (non-blocking - don't fail if email fails)
    sendUnblockNotificationEmail({
      email: user.email,
      designerName: designer.fullName,
      unblockRemarks: unblockRemarks && unblockRemarks.trim() ? unblockRemarks.trim() : null,
    }).catch(emailError => {
      console.error('Failed to send unblock notification email:', emailError);
      // Continue anyway - email failure shouldn't block the operation
    });

    return {
      success: true,
      message: 'Designer account unblocked successfully',
    };
  } catch (error) {
    console.error('Error unblocking designer account:', error);
    throw error;
  }
}
export async function getApprovedDesigners(filters = {}) {
  try {
    const query = {};

    // Filter by status if provided
    if (filters.status) {
      query.accountStatus = filters.status;
    }

    const designers = await Designer.find(query)
      .populate('userId', 'email isApproved isVerified createdAt')
      .sort({ createdAt: -1 });

    return designers;
  } catch (error) {
    console.error('Error fetching approved designers:', error);
    throw error;
  }
}
