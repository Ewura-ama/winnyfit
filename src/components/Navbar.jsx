import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth  from '../context/AuthContext';
import { navigateTo } from '../utils/navigation';
import logo from '../assets/logo.png';
import "./Navbar.css"; 
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isHomePage = location.pathname === '/';
  

  // Update cart count from localStorage whenever it changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    // Initial cart count
    updateCartCount();

    // Listen for storage events to update cart count
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates within the same window
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Updated handleClick to use navigateTo utility instead
  const handleNavigate = (path) => {
    navigateTo(navigate, path);
    setShowUserMenu(false); // Close user menu if open
  };

  const handleLogout = () => {
    logout();
    navigateTo(navigate, '/signin');
  };

  // Show different dashboard based on user role
  const userRole = user?.role;
  const userName = user?.firstname  || user?.email;;

  
  
  // Full navbar for main pages
  return (
  <nav className="navbar fixed top-0 w-full bg-white z-50 shadow-sm px-4">
    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full" >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="CAPFIT" className="w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="md:flex items-center space-x-8 gap-4 hide-on-mobile">
          <Link to="/" className="text-gray-800 hover:text-red-600">Home</Link>
          <Link to="/classes" className="text-gray-800 hover:text-red-600">Classes</Link>
          <Link to="/trainers" className="text-gray-800 hover:text-red-600">Trainers</Link>
          <Link to="/products" className="text-gray-800 hover:text-red-600">Products</Link>

          {user && (
            <>
              <Link to="/booking" className="text-gray-800 hover:text-red-600">Booking</Link>
              <Link to="/dashboard" className="text-gray-800 hover:text-red-600">Dashboard</Link>
            </>
          )}

          <Link to="/cart" className="text-gray-800 hover:text-red-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-800 hover:text-red-600"
              >
                <span>{userName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  
                  <Link to="/sessions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Classes</Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-8">
              <Link to="/signin" className="text-gray-800 hover:text-red-600">Sign In</Link>
              <Link to="/signup" className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
                {isHomePage ? 'Join Membership' : 'Sign Up'}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="text-gray-800 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showUserMenu && (
        <div className="lg:hidden sm:hidden mt-2 space-y-2">
          <Link to="/" className="block text-gray-800 hover:text-red-600">Home</Link>
          <Link to="/classes" className="block text-gray-800 hover:text-red-600">Classes</Link>
          <Link to="/trainers" className="block text-gray-800 hover:text-red-600">Trainers</Link>
          <Link to="/products" className="block text-gray-800 hover:text-red-600">Products</Link>

          {user && <Link to="/dashboard" className="block text-gray-800 hover:text-red-600">Dashboard</Link>}

          {user ? (
            <>
              <Link to="/profile" className="block text-gray-800 hover:text-red-600">Profile</Link>
              <Link to="/sessions" className="block text-gray-800 hover:text-red-600">My Classes</Link>
              {(userRole === 'instructor' || userRole === 'admin') ? (
                <Link to="/instructor-dashboard" className="block text-gray-800 hover:text-red-600">Instructor Dashboard</Link>
              ) : (
                <>
                  <Link to="/dashboard" className="block text-gray-800 hover:text-red-600">User Dashboard</Link>
                  <Link to="/instructor-login" className="block text-gray-800 hover:text-red-600">Instructor Portal</Link>
                </>
              )}
              <button onClick={handleLogout} className="block w-full text-left text-gray-800 hover:text-red-600">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="block text-gray-800 hover:text-red-600">Sign In</Link>
              <Link to="/signup" className="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                {isHomePage ? 'Join Membership' : 'Sign Up'}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  </nav>
);

}

export default Navbar; 