import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import phone from '../assets/Phone.png';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import xLogo from '../assets/X_logo.png';
import whatsapp from '../assets/whatsapp.png';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  
  // Check if current page is an auth page
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage('Please enter a valid email address');
      return;
    }

    // Here you would typically make an API call to your backend
    // For now, we'll just show a success message
    setMessage('Thank you for signing up!');
    setEmail('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // Simplified footer for auth pages
  if (isAuthPage) {
    return (
      <footer className="bg-black text-white py-4 auth-footer">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-sm">
              All rights reserved CapFit( Gym Schedular) @2025
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-white"><img src={facebook} alt="Facebook" className="h-5 w-5" /></a>
              <a href="#" className="text-white"><img src={instagram} alt="Instagram" className="h-5 w-5" /></a>
              <a href="#" className="text-white"><img src={xLogo} alt="Twitter" className="h-5 w-5" /></a>
              <a href="#" className="text-white"><img src={whatsapp} alt="WhatsApp" className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-container bg-black text-white py-8 mt-20 auth-footer">
      {/* Newsletter Section */}
      <div className="relative -mt-20">
        <div className="container mx-auto px-4">
          <div className="bg-red-600 absolute -top-4 left-0" style={{
            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)'
          }}>
            <h3 className="text-xl font-bold text-white py-2 px-4">SIGN UP FOR LATEST NEWS UPDATES</h3>
          </div>
        </div>
        <div className="bg-[#333333] w-screen">
          <div className="container mx-auto px-4">
            <form onSubmit={handleNewsletterSignup} className="flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-10 py-8 mt-8">
                <input 
                  type="email" 
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-white text-white px-4 py-2 bg-transparent outline-none placeholder-gray-300"
                  style={{
                    width: '240px'
                  }}
                />
                <button 
                  type="submit"
                  className="bg-[#666666] text-white px-8 py-2 hover:bg-[#777777] transition-colors"
                  style={{
                    clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)'
                  }}
                >
                  SIGN UP NOW
                </button>
              </div>
              {message && (
                <p className={`text-sm ${message.includes('Please') ? 'text-red-400' : 'text-green-400'} -mt-4 mb-4`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Logo and Links Section */}
        <div className="flex flex-col items-center mt-12 mb-8">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src={logo} alt="CAPFIT" className="h-20 mb-0" />
          </Link>
          <nav className="flex flex-col items-center space-y-4 mb-8">
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-gray-300">About us</Link>
            <Link to="/classes" onClick={() => window.scrollTo(0, 0)} className="hover:text-gray-300">Classes</Link>
            <Link to="/trainers" onClick={() => window.scrollTo(0, 0)} className="hover:text-gray-300">Trainers</Link>
            <a href="#" className="hover:text-gray-300">Terms & Conditions</a>
          </nav>
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={phone} alt="Phone" className="h-5 w-5 ml-2 " />
            <p className="text-gray-400">+233242212610</p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex gap-4 mb-8">
            <a href="#" className="text-white"><img src={facebook} alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="#" className="text-white">
              <img src={instagram} alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="#" className="text-white">
              <img src={xLogo} alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="#" className="text-white">
              <img src={whatsapp} alt="WhatsApp" className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            All rights reserved CapFit( Gym Schedular)@2025
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 