/**
 * Formats a numeric amount into Vietnamese Dong (VND) currency string.
 *
 * @param amount - The numeric amount to format.
 * @returns A formatted currency string (e.g., "8.000.000 ₫").
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
}
