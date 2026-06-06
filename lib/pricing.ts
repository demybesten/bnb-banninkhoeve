// lib/pricing.ts

const DISCOUNT_NIGHTS_THRESHOLD = 2 // >2 nights qualifies for discount
const DISCOUNT_RATE = 0.1 // 10%

export interface PriceBreakdown {
  nights: number
  pricePerNight: number
  subtotal: number
  discount: number
  total: number
  hasDiscount: boolean
}

/** Calculate price breakdown with 10% discount when staying more than 2 nights. */
export function getPriceBreakdown(nights: number, pricePerNight: number): PriceBreakdown {
  const subtotal = nights * pricePerNight
  const hasDiscount = nights > DISCOUNT_NIGHTS_THRESHOLD
  const discount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0
  const total = subtotal - discount
  return { nights, pricePerNight, subtotal, discount, total, hasDiscount }
}

/** Format a number as EUR price string, e.g. 125 -> "€125" */
export function formatEuro(amount: number): string {
  return `€${amount}`
}
