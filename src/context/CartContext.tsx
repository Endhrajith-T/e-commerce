"use client";

import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item: any) => {
    const normalized = {
      qty: 1,
      ...item,
      id: item.id ?? item.name,
      qty: item.qty ?? 1,
    };

    setCart((prev) => {
      const exists = prev.find((i) => i.id === normalized.id);
      if (exists) {
        return prev.map((i) =>
          i.id === normalized.id ? { ...i, qty: i.qty + normalized.qty } : i
        );
      }
      return [...prev, normalized];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWish = (item: any) => {
    const normalized = {
      id: item.id ?? item.name,
      ...item,
    };

    let wished = false;

    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === normalized.id);
      wished = !exists;
      if (exists) {
        return prev.filter((i) => i.id !== normalized.id);
      }
      return [...prev, normalized];
    });

    return wished;
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const moveToCart = (id: string) => {
    const item = wishlist.find((i) => i.id === id);
    if (!item) return;
    addToCart({ ...item, qty: 1 });
    removeFromWishlist(id);
  };

  const openCart = () => {
    setIsWishOpen(false);
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);
  const openWish = () => {
    setIsCartOpen(false);
    setIsWishOpen(true);
  };
  const closeWish = () => setIsWishOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + (i.qty ?? 1), 0),
    [cart]
  );
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        total,
        cartCount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWish,
        removeFromWishlist,
        moveToCart,
        isCartOpen,
        isWishOpen,
        isCheckoutOpen,
        openCart,
        closeCart,
        openWish,
        closeWish,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}