import Design from '../models/Design';

/**
 * Get the current financial year in YYZZ format
 * Financial Year: April 1 to March 31
 * @returns {string} - Format like "2526" for FY 2025-26
 */
function getCurrentFinancialYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based (0 = January, 3 = April)

  let fyStartYear;
  if (currentMonth >= 3) { // April onwards (month 3 = April)
    fyStartYear = currentYear;
  } else { // January to March
    fyStartYear = currentYear - 1;
  }

  const fyEndYear = fyStartYear + 1;

  // Convert to YYZZ format (last 2 digits of each year)
  const startYearSuffix = fyStartYear.toString().slice(-2);
  const endYearSuffix = fyEndYear.toString().slice(-2);

  return `${startYearSuffix}${endYearSuffix}`;
}

/**
 * Generate a 6-digit unique suffix
 * @returns {string} - 6-digit string
 */
function generateSixDigitSuffix() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a unique design ID in the format FY{YYZZ}{XXXXXX}
 * Example: FY2526123456 for financial year 2025-26
 * @returns {Promise<string>} - Unique design ID
 */
export async function generateUniqueDesignId() {
  const fyPrefix = getCurrentFinancialYear();
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (attempts < maxAttempts) {
    const sixDigitSuffix = generateSixDigitSuffix();
    const designId = `MDB${fyPrefix}${sixDigitSuffix}`;

    // Check if this ID already exists
    const existingDesign = await Design.findOne({ designId });

    if (!existingDesign) {
      return designId;
    }

    attempts++;
  }

  // If we've exhausted attempts, throw an error
  throw new Error('Unable to generate unique design ID after maximum attempts');
}

/**
 * Get the current financial year for display purposes
 * @returns {string} - Format like "2025-26"
 */
export function getCurrentFinancialYearDisplay() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let fyStartYear;
  if (currentMonth >= 3) { // April onwards
    fyStartYear = currentYear;
  } else { // January to March
    fyStartYear = currentYear - 1;
  }

  const fyEndYear = fyStartYear + 1;

  return `${fyStartYear}-${fyEndYear.toString().slice(-2)}`;
}

/**
 * Parse a design ID to extract financial year and suffix
 * @param {string} designId - Design ID like "FY2526123456"
 * @returns {object} - { fyYear: "2526", suffix: "123456", fyDisplay: "2025-26" }
 */
export function parseDesignId(designId) {
  if (!designId || !designId.startsWith('MDB') || designId.length !== 12) {
    throw new Error('Invalid design ID format');
  }

  const fyYear = designId.substring(2, 6); // Extract YYZZ
  const suffix = designId.substring(6, 12); // Extract XXXXXX

  // Convert YYZZ back to full years for display
  const startYear = parseInt(`20${fyYear.substring(0, 2)}`);
  const endYear = parseInt(`20${fyYear.substring(2, 4)}`);
  const fyDisplay = `${startYear}-${endYear.toString().slice(-2)}`;

  return {
    fyYear,
    suffix,
    fyDisplay
  };
}