// Currency conversion utilities for USDT payments
// Since USDT is pegged 1:1 with USD, we convert other currencies to USD equivalent

interface ExchangeRates {
  [key: string]: number;
}

// Simplified exchange rates - in production, these would come from an API
const EXCHANGE_RATES: ExchangeRates = {
  USD: 1.0,
  EUR: 1.09,  // 1 EUR = ~1.09 USD
  GBP: 1.27,  // 1 GBP = ~1.27 USD
  CAD: 0.72,  // 1 CAD = ~0.72 USD
  AUD: 0.64,  // 1 AUD = ~0.64 USD
  JPY: 0.0067, // 1 JPY = ~0.0067 USD
  CHF: 1.12,  // 1 CHF = ~1.12 USD
};

/**
 * Convert any supported currency amount to USD equivalent
 * @param amount - The amount in the source currency
 * @param fromCurrency - The source currency code (EUR, GBP, etc.)
 * @returns The equivalent amount in USD
 */
export const convertToUSD = (amount: number, fromCurrency: string): number => {
  const rate = EXCHANGE_RATES[fromCurrency.toUpperCase()];
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency}, defaulting to 1.0`);
    return amount;
  }
  return amount * rate;
};

/**
 * Convert any supported currency amount to USDT equivalent
 * Since USDT is pegged 1:1 with USD, this is the same as converting to USD
 * @param amount - The amount in the source currency
 * @param fromCurrency - The source currency code
 * @returns The equivalent amount in USDT
 */
export const convertToUSDT = (amount: number, fromCurrency: string): number => {
  return convertToUSD(amount, fromCurrency);
};

/**
 * Format currency conversion display
 * @param amount - Original amount
 * @param currency - Original currency
 * @param usdtAmount - Converted USDT amount
 * @returns Formatted string showing conversion
 */
export const formatCurrencyConversion = (amount: number, currency: string, usdtAmount: number): string => {
  if (currency.toUpperCase() === 'USD') {
    return `$${amount.toFixed(2)} USD = ${usdtAmount.toFixed(2)} USDT`;
  }
  
  const currencySymbols: { [key: string]: string } = {
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
  };
  
  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toFixed(2)} ${currency.toUpperCase()} = $${usdtAmount.toFixed(2)} USD = ${usdtAmount.toFixed(2)} USDT`;
};

/**
 * Get supported USDT networks
 */
export const USDT_NETWORKS = {
  ethereum: {
    name: 'Ethereum (ERC20)',
    symbol: 'USDT-ERC20',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  tron: {
    name: 'TRON (TRC20)',
    symbol: 'USDT-TRC20',
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  }
} as const;

export type USDTNetwork = keyof typeof USDT_NETWORKS;