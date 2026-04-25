import { CartItem } from '@/types'

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

export function isInCart(cart: CartItem[], id: string): boolean {
  return cart.some((item) => item.id === id)
}

export function getCartItem(cart: CartItem[], id: string): CartItem | undefined {
  return cart.find((item) => item.id === id)
}
