/**
 * Format currency to Uzbek sum (UZS) with full precision
 * @param amount - The numerical amount to format
 * @param showCurrency - Whether to append "so'm" suffix
 * @returns Formatted string e.g. "1 250 000.00 so'm"
 */
export const formatMoney = (amount: number, showCurrency: boolean = true): string => {
  // Using 'en-US' to ensure consistent formatting (768,000,000.00) 
  // and to avoid hydration errors between server and client.
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  
  return showCurrency ? `${formatted} so'm` : formatted;
};

/**
 * Compact format for very large numbers but still showing precision if needed
 * @param amount 
 * @returns 
 */
export const formatCompact = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace('.', ',') + " mlrd";
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace('.', ',') + " mln";
  }


  return formatMoney(amount, false);
};
