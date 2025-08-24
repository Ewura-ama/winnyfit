import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../products/PageContainer';
import { getProductImage } from '../../utils/productImages';
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  
  const [step, setStep] = useState(1); // 1: Review, 2: Billing, 3: Payment, 4: Confirmation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: 'Greater Accra',
    paymentMethod: 'momo',
    momoProvider: 'mtn',
    momoNumber: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    bankName: '',
    accountNumber: ''
  });
  
  const navigate = useNavigate();
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) {
      // Redirect to cart if empty
      navigate('/cart');
    }
    setCart(savedCart);

   
    
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://127.0.0.1:8000/api/customer/fetch`, {
            headers: { Authorization: `Token ${token}` },
          });
          console.log("Hello", response)

          setFormData(prev => ({
            ...prev,
            firstName: response.data.firstname || '',
            lastName: response.data.lastname || '',
            email: response.data.email || '',
            phone: response.data.contact_number || '',
          }));
          console.log(formData)
        }
      } catch (err) {
        console.error("Error fetching customer data:", err);
        
      } 
    };
    fetchCustomer();
  }, [])

  // Calculate summary values
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 20.00; // Fixed shipping fee
  const total = subtotal + shipping;
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for each step
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Final submission - process order
      completeOrder();
    }
  };
  
  // Handle going back a step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Complete order process
  const completeOrder = () => {
    // Here you would typically send the order to a backend
    // For now, we'll just clear the cart and show success
    // Check if the user is AnonymousUser
    
    var user_email = formData.email;
    var momonumber = formData.momoNumber;

   

    // Continue with payment logic
    let handler = PaystackPop.setup({
        key: 'pk_test_bd6a6eb65b4c2966f303176e3dc55b25a74799ac', // Replace with your public key
        email: user_email, // Use the authenticated user's email
        phone: momonumber,
        amount: total * 100,
        currency: "GHS",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        onClose: function () {
            alert('Window closed.');
        },
        callback: function (response) {
            let message = 'Payment complete! Reference: ' + response.reference;
            alert(message);
            
            navigate('/products');
            localStorage.setItem('cart', JSON.stringify([]));
            setCart([]);
        }
    });

    handler.openIframe();
    
    
    // Navigate to success page or show success message
    
  };
  
  return (
  
      <div className="container mx-auto px-4 py-8" style={{marginTop: "15vh",marginBottom: "5rem"}}>
        <div className="flex flex-col-2 lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {/* Checkout Steps Header */}
              <div className="border-b pb-4 mb-6" style={{borderBottom: "1px solid #00000012"}}>
                <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
                <div className="flex mt-4">
                  <div className={`flex-1 text-center pb-2 ${step >= 1 ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'border-b text-gray-500'}`}>
                    Review Cart
                  </div>
                  <div className={`flex-1 text-center pb-2 ${step >= 2 ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'border-b text-gray-500'}`}>
                    Billing Address
                  </div>
                  <div className={`flex-1 text-center pb-2 ${step >= 3 ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'border-b text-gray-500'}`}>
                    Payment
                  </div>
                  <div className={`flex-1 text-center pb-2 ${step >= 4 ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'border-b text-gray-500'}`}>
                    Confirmation
                  </div>
                </div>
              </div>
              
              {/* Step 1: Review Cart */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  {cart.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                  ) : (
                    <div className="divide-y">
                      {cart.map((item, index) => {
                        const imgSrc = getProductImage(item.image);
                        return (
                          <div key={index} className="py-4 flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              <img src={imgSrc} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium text-gray-800">{item.name}</h3>
                              <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₵{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button 
                      onClick={handleSubmit}
                      disabled={cart.length === 0}
                      className={`w-full py-2 px-4 rounded-md font-medium ${
                        cart.length === 0 
                          ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      Continue to Billing
                    </button>
                    <Link to="/cart" className="block text-center mt-4 text-indigo-600 hover:text-indigo-800">
                      Back to Cart
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Step 2: Billing Address */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="firstName">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="lastName">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 024 123 4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="address">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city">
                        City/Town *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="region">
                        Region *
                      </label>
                      <select
                        id="region"
                        name="region"
                        required
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Western">Western</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Central">Central</option>
                        <option value="Volta">Volta</option>
                        <option value="Northern">Northern</option>
                        <option value="Upper East">Upper East</option>
                        <option value="Upper West">Upper West</option>
                        <option value="Bono">Bono</option>
                        <option value="Ahafo">Ahafo</option>
                        <option value="Bono East">Bono East</option>
                        <option value="North East">North East</option>
                        <option value="Savannah">Savannah</option>
                        <option value="Oti">Oti</option>
                        <option value="Western North">Western North</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button 
                      type="button"
                      onClick={() => navigate(-1)}
                      className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}
              
              {/* Step 3: Payment Method */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <div className="mb-6">
                    <div className="space-y-2">
                      {/* Mobile Money */}
                      <div className="border rounded-md p-4 hover:border-indigo-500 transition-colors">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="momo"
                            checked={formData.paymentMethod === 'momo'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Mobile Money</span>
                            <p className="text-sm text-gray-500">Pay with MTN, Vodafone, or AirtelTigo Mobile Money</p>
                          </div>
                        </label>
                        
                        {formData.paymentMethod === 'momo' && (
                          <div className="mt-3 pl-7">
                            <div className="mb-3">
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Select Provider
                              </label>
                              <div className="flex space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="momoProvider"
                                    value="mtn"
                                    checked={formData.momoProvider === 'mtn'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">MTN Mobile Money</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="momoProvider"
                                    value="vodafone"
                                    checked={formData.momoProvider === 'vodafone'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-red-500 focus:ring-red-400"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Vodafone Cash</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="momoProvider"
                                    value="airteltigo"
                                    checked={formData.momoProvider === 'airteltigo'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-400"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">AirtelTigo Money</span>
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="momoNumber">
                                Mobile Money Number
                              </label>
                              <input
                                type="tel"
                                id="momoNumber"
                                name="momoNumber"
                                value={formData.momoNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Enter your mobile money number"
                                required={formData.paymentMethod === 'momo'}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                You will receive a prompt on your phone to complete the payment.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Credit/Debit Card */}
                      <div className="border rounded-md p-4 hover:border-indigo-500 transition-colors">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Credit/Debit Card</span>
                            <p className="text-sm text-gray-500">Pay with Visa, Mastercard, or other cards</p>
                          </div>
                        </label>
                        
                        {formData.paymentMethod === 'card' && (
                          <div className="mt-3 pl-7 space-y-3">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cardNumber">
                                Card Number
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="•••• •••• •••• ••••"
                                required={formData.paymentMethod === 'card'}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cardName">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                id="cardName"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="John Doe"
                                required={formData.paymentMethod === 'card'}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cardExpiry">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  placeholder="MM/YY"
                                  required={formData.paymentMethod === 'card'}
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cardCVV">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  id="cardCVV"
                                  name="cardCVV"
                                  value={formData.cardCVV}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  placeholder="•••"
                                  required={formData.paymentMethod === 'card'}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Bank Transfer */}
                      <div className="border rounded-md p-4 hover:border-indigo-500 transition-colors">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank"
                            checked={formData.paymentMethod === 'bank'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Bank Transfer</span>
                            <p className="text-sm text-gray-500">Pay directly from your bank account</p>
                          </div>
                        </label>
                        
                        {formData.paymentMethod === 'bank' && (
                          <div className="mt-3 pl-7 space-y-3">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="bankName">
                                Bank Name
                              </label>
                              <select
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required={formData.paymentMethod === 'bank'}
                              >
                                <option value="">Select your bank</option>
                                <option value="GCB Bank">GCB Bank</option>
                                <option value="Ecobank">Ecobank</option>
                                <option value="Zenith Bank">Zenith Bank</option>
                                <option value="Stanbic Bank">Stanbic Bank</option>
                                <option value="Absa Bank">Absa Bank</option>
                                <option value="Fidelity Bank">Fidelity Bank</option>
                                <option value="Access Bank">Access Bank</option>
                                <option value="Cal Bank">Cal Bank</option>
                                <option value="Republic Bank">Republic Bank</option>
                                <option value="Consolidated Bank">Consolidated Bank</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="accountNumber">
                                Account Number
                              </label>
                              <input
                                type="text"
                                id="accountNumber"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Enter your account number"
                                required={formData.paymentMethod === 'bank'}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Cash on Delivery */}
                      <div className="border rounded-md p-4 hover:border-indigo-500 transition-colors">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <span className="font-medium text-gray-800">Cash on Delivery</span>
                            <p className="text-sm text-gray-500">Pay when you receive your order</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button 
                      type="button"
                      onClick={() => navigate(-1)}
                      className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              )}
              
              {/* Step 4: Order Confirmation */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review and Confirm Your Order</h2>
                  
                  <div className="border rounded-md p-4 mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Shipping & Billing Information</h3>
                    <p className="text-gray-700">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.region}<br />
                      Phone: {formData.phone}<br />
                      Email: {formData.email}
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4 mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                    {formData.paymentMethod === 'momo' && (
                      <p className="text-gray-700">
                        Mobile Money ({formData.momoProvider === 'mtn' ? 'MTN Mobile Money' : 
                                     formData.momoProvider === 'vodafone' ? 'Vodafone Cash' : 
                                     'AirtelTigo Money'})<br />
                        Number: {formData.momoNumber}
                      </p>
                    )}
                    {formData.paymentMethod === 'card' && (
                      <p className="text-gray-700">
                        Credit/Debit Card<br />
                        Card ending in {formData.cardNumber.slice(-4)}
                      </p>
                    )}
                    {formData.paymentMethod === 'bank' && (
                      <p className="text-gray-700">
                        Bank Transfer<br />
                        {formData.bankName}<br />
                        Account ending in {formData.accountNumber.slice(-4)}
                      </p>
                    )}
                    {formData.paymentMethod === 'cod' && (
                      <p className="text-gray-700">
                        Cash on Delivery
                      </p>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-4 mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
                    <div className="divide-y">
                      {cart.map((item, index) => (
                        <div key={index} className="py-2 flex justify-between">
                          <div>
                            <span className="text-gray-800">{item.name}</span>
                            <span className="text-gray-500 text-sm ml-1">x{item.quantity}</span>
                          </div>
                          <span className="text-gray-800 font-medium">₵{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">₵{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-800">₵{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-lg font-semibold border-t mt-2">
                        <span>Total</span>
                        <span>₵{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button"
                      onClick={() => navigate(-1)}
                      className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={completeOrder}
                      className="py-2 px-6 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md"
                    >
                      Make Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b" style={{borderBottom: "1px solid #00000013"}}>Order Summary</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto mb-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center py-2">
                        <span className="text-gray-600 flex-grow">{item.name} <span className="text-xs">x{item.quantity}</span></span>
                        <span className="font-medium">₵{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-2" style={{borderTop: "1px solid #00000013"}}>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Shipping</span>
                      <span>₵{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-semibold border-t mt-2" style={{borderTop: "1px solid #00000013"}}>
                      <span>Total</span>
                      <span>₵{total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-6">
                <div className="flex items-center text-indigo-600 mb-4">
                  <i className="fas fa-shield-alt mr-2"></i>
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center text-indigo-600 mb-4">
                  <i className="fas fa-truck mr-2"></i>
                  <span className="text-sm">Free Shipping on orders over ₵250</span>
                </div>
                <div className="flex items-center text-indigo-600">
                  <i className="fas fa-undo-alt mr-2"></i>
                  <span className="text-sm">30-day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Checkout; 