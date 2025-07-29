import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getProductImage } from '../../utils/productImages';
import PageWrapper from '../PageWrapper';

const Cart = () => {
  // Initialize cart state from localStorage
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  // Add navigate hook
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Check if image is a placeholder
  const isPlaceholder = (src) => {
    return src && src.includes('placeholder.com');
  };

  // Handle image error
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show notification
    setNotificationMessage("Item removed from cart");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Update quantity in cart
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQuantity
    };
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      
        <div className="container mx-auto px-4 py-8" style={{marginTop: "15vh", marginBottom: "5rem"}}>
          <div className="flex flex-col-2 lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg p-6" style={{boxShadow: "0px 0px 3px 3px #00000008"}}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <Link to="/products" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const imgSrc = getProductImage(item.image);
                      const hasError = imageErrors[`item-${index}`] || isPlaceholder(imgSrc);
                      
                      return (
                        <div key={index} className="flex items-center border-b pb-4">
                          <div className="w-20 h-20 overflow-hidden rounded-md">
                            {hasError ? (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-600">{item.name}</span>
                              </div>
                            ) : (
                              <img 
                                src={imgSrc} 
                                alt={item.name}
                                className="w-full h-full object-cover" 
                                onError={() => handleImageError(`item-${index}`)}
                              />
                            )}
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-gray-600">₵{item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <p className="font-semibold text-gray-800">₵{(item.price * item.quantity).toFixed(2)}</p>
                            <button 
                              onClick={() => removeFromCart(index)}
                              className="text-sm text-red-500 hover:text-red-700 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg p-6" style={{boxShadow: "0px 0px 3px 3px #00000008"}}>
                <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No items in cart</p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-3 mb-6">
                      {cart.map((item, index) => {
                        const imgSrc = getProductImage(item.image);
                        const hasError = imageErrors[`summary-${index}`] || isPlaceholder(imgSrc);
                        
                        return (
                          <div key={index} className="flex items-center">
                            <div className="w-12 h-12 overflow-hidden rounded-md">
                              {hasError ? (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-600">Item</span>
                                </div>
                              ) : (
                                <img 
                                  src={imgSrc} 
                                  alt={item.name}
                                  className="w-full h-full object-cover" 
                                  onError={() => handleImageError(`summary-${index}`)}
                                />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-800">₵{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-700">Subtotal</p>
                        <p className="font-medium text-gray-800">₵{calculateTotal().toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-700">Shipping</p>
                        <p className="font-medium text-gray-800">₵0.00</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-700">Tax</p>
                        <p className="font-medium text-gray-800">₵0.00</p>
                      </div>
                      <div className="flex justify-between pt-4 border-t mt-4">
                        <p className="text-lg font-bold text-gray-800">Total</p>
                        <p className="text-lg font-bold text-pink-600">₵{calculateTotal().toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full bg-pink-600 text-white py-3 rounded-md font-semibold mt-6 hover:bg-pink-700 transition-colors"
                      onClick={() => {
                        navigate('/checkout');
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        <div 
          className={`fixed bottom-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform ${
            showNotification ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {notificationMessage}
        </div>
      
    </>
  );
};

export default Cart;