import { Wallet, WalletTransaction } from '../models/Wallet';
import { Designer } from '../models/User';
import Design from '../models/Design';

/**
 * Credit designer wallet when their design is purchased
 * Credits based on tier system:
 * - 50-99 approved designs: 10 points per download
 * - 100+ approved designs: 25 points per download
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

    // Check eligibility: Designer must have 50+ approved designs
    const approvedCount = designer.approvedDesigns;
    if (approvedCount < 50) {
      console.log(`[WALLET] Designer has ${approvedCount} approved designs. Minimum 50 required for earnings.`);
      return { 
        success: true, 
        eligible: false, 
        approvedDesigns: approvedCount,
        message: 'Designer not eligible for earnings yet (minimum 50 approved designs required)'
      };
    }

    // Determine credit amount based on tier
    let creditAmount;
    let tier;
    if (approvedCount >= 100) {
      creditAmount = 25;
      tier = 'premium'; // 100+ designs
    } else if (approvedCount >= 50) {
      creditAmount = 10;
      tier = 'standard'; // 50-99 designs
    }

    console.log(`[WALLET] Designer tier: ${tier}, Approved designs: ${approvedCount}, Credit: ₹${creditAmount}`);

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
      description: `Earned ₹${creditAmount} from design purchase: ${design.title} (Tier: ${tier})`,
      metadata: {
        designTitle: design.title,
        designCategory: design.category,
        approvedDesignsCount: designer.approvedDesigns,
        tier: tier,
        creditAmount: creditAmount
      },
      status: 'completed'
    });

    console.log(`[WALLET] Successfully credited ₹${creditAmount} to designer ${designerId}. New balance: ₹${wallet.balance}`);

    return {
      success: true,
      eligible: true,
      credited: true,
      amount: creditAmount,
      tier: tier,
      newBalance: wallet.balance,
      transactionId: transaction._id,
      message: `Designer earned ₹${creditAmount} (${tier} tier)`
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
        eligible: designer ? designer.approvedDesigns >= 50 : false,
        approvedDesigns: designer ? designer.approvedDesigns : 0,
        tier: designer && designer.approvedDesigns >= 100 ? 'premium' : 
              designer && designer.approvedDesigns >= 50 ? 'standard' : 'not_eligible',
        earningRate: designer && designer.approvedDesigns >= 100 ? 25 : 
                     designer && designer.approvedDesigns >= 50 ? 10 : 0
      };
    }

    return {
      exists: true,
      balance: wallet.balance,
      totalEarnings: wallet.totalEarnings,
      totalWithdrawn: wallet.totalWithdrawn,
      status: wallet.status,
      eligible: designer ? designer.approvedDesigns >= 50 : false,
      approvedDesigns: designer ? designer.approvedDesigns : 0,
      tier: designer && designer.approvedDesigns >= 100 ? 'premium' : 
            designer && designer.approvedDesigns >= 50 ? 'standard' : 'not_eligible',
      earningRate: designer && designer.approvedDesigns >= 100 ? 25 : 
                   designer && designer.approvedDesigns >= 50 ? 10 : 0
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
