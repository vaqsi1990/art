"use client";

import { useState, useEffect, useCallback } from 'react';
import { Artwork } from '@/data/artworks';

export interface CartItem extends Artwork {
  quantity: number;
}

interface UseCartReturn {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (item: Artwork) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data.cart || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (item: Artwork) => {
    try {
      setError(null);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      setCart(data.cart || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      setCart(data.cart || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const data = await response.json();
      setCart(data.cart || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to checkout');
      }

      setCart([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout');
      throw err;
    }
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refreshCart: fetchCart,
  };
}
