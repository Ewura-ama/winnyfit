import React, { createContext, useState, useContext, useEffect } from 'react';
import productService from '../services/productService';

// Create Cart Context
const CartContext = createContext(null);

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    updateCartCount(savedCart);
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  // Helper to calculate total items in cart
  const updateCartCount = (currentCart) => {
    const count = currentCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Product already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update quantity of an item
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Create order from cart
  const createOrder = async (orderDetails) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format order data for API
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        ...orderDetails
      };
      
      // Submit order to API
      const response = await productService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create order');
      setLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    cart,
    cartCount,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 