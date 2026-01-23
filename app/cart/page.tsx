"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) {
    return (
      <>
        <div className="detail-bg"></div>
        <div className="cart-section">
          <div className="cart-container">
            <h1 className="cart-title text-white">Your Cart</h1>
            <div className="cart-empty text-white">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      await clearCart();
      alert('Thank you for your purchase! This is a demo checkout.');
    } catch (error) {
      alert('Failed to complete checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <div className="detail-bg"></div>
        <div className="cart-section">
          <div className="cart-container">
            <h1 className="cart-title text-white">Your Cart</h1>
            <div className="cart-empty text-white">
              <p>Your cart is empty.</p>
              <Link href="/shop" className="cart-continue-shopping text-white">
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="detail-bg"></div>
      <div className="cart-section">
        <div className="cart-container">
          <h1 className="cart-title text-white">Your Cart</h1>
          
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <Link href={`/products/${item.id}`} className="cart-item-image-link">
                    <div className="cart-item-frame-outer">
                      <div className="cart-item-frame-inner">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </Link>

                  <div className="cart-item-info">
                    <Link href={`/products/${item.id}`} className="cart-item-title-link">
                      <h3 className="cart-item-title text-white">{item.title}</h3>
                    </Link>
                    
                    {item.artist && (
                      <p className="cart-item-artist text-white">By {item.artist}</p>
                    )}
                    
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-button text-white"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-value text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-button text-white"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="cart-item-price text-white">
                        {(item.price * item.quantity).toLocaleString()} ₾
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-item-remove text-white"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-content">
                <h2 className="cart-summary-title text-white">Order Summary</h2>
                
                <div className="cart-summary-row">
                  <span className="cart-summary-label text-white">Subtotal:</span>
                  <span className="cart-summary-value text-white">
                    {getTotalPrice().toLocaleString()} ₾
                  </span>
                </div>
                
                <div className="cart-summary-row">
                  <span className="cart-summary-label text-white">Shipping:</span>
                  <span className="cart-summary-value text-white">Free</span>
                </div>
                
                <div className="cart-summary-divider"></div>
                
                <div className="cart-summary-row cart-summary-total">
                  <span className="cart-summary-label text-white">Total:</span>
                  <span className="cart-summary-value text-white">
                    {getTotalPrice().toLocaleString()} ₾
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="cart-checkout-button text-white"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <Link href="/shop" className="cart-continue-shopping text-white">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
