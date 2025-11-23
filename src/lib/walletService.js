import { Wallet, WalletTransaction } from '../models/Wallet';
import { Designer } from '../models/User';
import Design from '../models/Design';

/**
 * Credit designer wallet when their design is purchased
 * Only credits if designer has 10+ approved designs
 * 
 * @param {string} designId - The ID of the design that was purchased
 * @param {string} buyerId - The ID of the buyer who purchased the design
 * @param {string} downloadId - The ID of the download record (optional)
 * @returns {Object} Result object with success status and details
 */
export async function creditDesignerWallet(designId, buyerId, downloadId = null) {
  try {
    // Get the design to find the designer
    const design = await Design.findById(designId);
    if (!design) {
      console.error('[WALLET] Design not found:', designId);
      return { success: false, error: 'Design not found' };
    }

    const designerId = design.uploadedBy;

    // Get designer profile to check approved designs count
    const designer = await Designer.findOne({ userId: designerId });
    if (!designer) {
      console.error('[WALLET] Designer profile not found for userId:', designerId);
      return { success: false, error: 'Designer not found' };
    }

    // Check eligibility: Designer must have 10+ approved designs
    if (designer.approvedDesigns < 10) {
      console.log(`[WALLET] Designer has ${designer.approvedDesigns} approved designs. Minimum 10 required for earnings.`);
      return { 
        success: true, 
        eligible: false, 
        approvedDesigns: designer.approvedDesigns,
        message: 'Designer not eligible for earnings yet'
      };
    }

    // Amount to credit (₹10 per purchase)
    const creditAmount = 10;

    // Find or create wallet for the designer
    let wallet = await Wallet.findOne({ userId: designerId });
    
    if (!wallet) {
      // Create new wallet if it doesn't exist
      wallet = await Wallet.create({
        userId: designerId,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        currency: 'INR',
        status: 'active'
      });
    }

    // Check wallet status
    if (wallet.status !== 'active') {
      console.error('[WALLET] Wallet is not active for designer:', designerId);
      return { success: false, error: 'Wallet is not active' };
    }

    // Store balance before credit
    const balanceBefore = wallet.balance;

    // Credit the wallet
    wallet.balance += creditAmount;
    wallet.totalEarnings += creditAmount;
    wallet.updatedAt = new Date();
    await wallet.save();

    // Create transaction record
    const transaction = await WalletTransaction.create({
      walletId: wallet._id,
      userId: designerId,
      type: 'credit',
      amount: creditAmount,
      balanceBefore: balanceBefore,
      balanceAfter: wallet.balance,
      source: 'design_purchase',
      designId: designId,
      downloadId: downloadId,
      buyerId: buyerId,
      description: `Earned ₹${creditAmount} from design purchase: ${design.title}`,
      metadata: {
        designTitle: design.title,
        designCategory: design.category,
        approvedDesignsCount: designer.approvedDesigns
      },
      status: 'completed'
    });

    console.log(`[WALLET] Successfully credited ₹${creditAmount} to designer ${designerId}. New balance: ₹${wallet.balance}`);

    return {
      success: true,
      eligible: true,
      credited: true,
      amount: creditAmount,
      newBalance: wallet.balance,
      transactionId: transaction._id,
      message: `Designer earned ₹${creditAmount}`
    };

  } catch (error) {
    console.error('[WALLET] Error crediting designer wallet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get designer's wallet summary
 * 
 * @param {string} userId - The designer's user ID
 * @returns {Object} Wallet summary with balance and earnings
 */
export async function getDesignerWalletSummary(userId) {
  try {
    const wallet = await Wallet.findOne({ userId });
    const designer = await Designer.findOne({ userId });

    if (!wallet) {
      return {
        exists: false,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        eligible: designer ? designer.approvedDesigns >= 10 : false,
        approvedDesigns: designer ? designer.approvedDesigns : 0
      };
    }

    return {
      exists: true,
      balance: wallet.balance,
      totalEarnings: wallet.totalEarnings,
      totalWithdrawn: wallet.totalWithdrawn,
      status: wallet.status,
      eligible: designer ? designer.approvedDesigns >= 10 : false,
      approvedDesigns: designer ? designer.approvedDesigns : 0
    };

  } catch (error) {
    console.error('[WALLET] Error getting wallet summary:', error);
    return null;
  }
}

export default {
  creditDesignerWallet,
  getDesignerWalletSummary
};
