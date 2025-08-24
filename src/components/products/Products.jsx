import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from './PageContainer';
import { getProductImage } from '../../utils/productImages';
import heroImage from '../../assets/GYM.jpeg'; // Direct import of hero image
import PageWrapper from '../PageWrapper';

const Products = () => {
  // State for cart and products
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);
  
  // Create a ref to store notifications
  const notificationsRef = useRef([]);
  
  // Create a ref to track the current scroll position
  const scrollPositionRef = useRef(0);
  
  // Flag to indicate if we're adding to cart
  const isAddingToCartRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    
    // Save initial scroll position on mount
    scrollPositionRef.current = window.scrollY;
    
    // Add scroll event listener to track position
    const handleScroll = () => {
      if (!isAddingToCartRef.current) {
        scrollPositionRef.current = window.scrollY;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update localStorage whenever cart changes and restore scroll position
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Use layoutEffect to restore scroll position after DOM updates but before browser paint
  useLayoutEffect(() => {
    if (isAddingToCartRef.current) {
      window.scrollTo(0, scrollPositionRef.current);
      isAddingToCartRef.current = false;
    }
  }, [cart]);

  // Handle adding product to cart without scrolling
  const addToCart = (product, event) => {
    // Set flag to indicate we're adding to cart
    isAddingToCartRef.current = true;
    
    // Update cart
    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(item => item.name === product.name);
    
    if (existingItemIndex > -1) {
      // Product already in cart, increment quantity
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: newCart[existingItemIndex].quantity + 1
      };
    } else {
      // Add new product to cart
      newCart.push({ ...product, quantity: 1 });
    }
    
    // Apply the cart update
    setCart(newCart);
    
    // Create a non-layout-shifting notification
    showToast(`${product.name} added to cart!`);
  };

  // Show a toast notification without affecting scroll
  const showToast = (message) => {
    // Create a toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300';
    toast.style.pointerEvents = 'none';
    toast.textContent = message;
    
    // Add to document body directly (outside React flow)
    document.body.appendChild(toast);
    
    // Track it in our ref array
    notificationsRef.current.push(toast);
    
    // Show it after a small delay (to prevent layout shifts)
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
    
    // Hide and remove after timeout
    setTimeout(() => {
      toast.style.opacity = '0';
      
      // Remove from DOM after fade out
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
        // Remove from our tracking array
        notificationsRef.current = notificationsRef.current.filter(item => item !== toast);
      }, 300);
    }, 2000);
  };

  // Clean up any notifications when component unmounts
  useEffect(() => {
    return () => {
      // Remove any remaining notifications
      notificationsRef.current.forEach(toast => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      });
    };
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // When changing categories, it's expected to scroll to top
  };

  // Memoize products to prevent re-renders
  const allProducts = (
    <>
      {/* Weekly Top Picks Section */}
      {(activeCategory === 'all') && (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Weekly Top Picks</h2>
          <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Blender Bottle */}
            <ProductCard
              name="Blender Bottle"
              price={45.00}
              image="BlenderBottle Classic V2 Shaker Bottle Perfect for Protein Shakes and Pre Workout, 20-Ounce.jpeg"
              addToCart={addToCart}
            />
            {/* HydroJug */}
            <ProductCard
              name="HydroJug Traveler"
              price={75.00}
              image="HydroJug Traveler.jpeg"
              addToCart={addToCart}
            />
            {/* Iron Flask */}
            <ProductCard
              name="IRON °FLASK Sports Bottle"
              price={95.00}
              image="IRON °FLASK Sports Water Bottle - 40 Oz 3 Lids (Straw Lid), Leak Proof - Stainless Steel Gym Bottles for Men, Women & Kids - Double Walled, Insulated Thermos.jpeg"
              addToCart={addToCart}
            />
            {/* Knee Sleeves */}
            <ProductCard
              name="AEOLOS Knee Sleeves"
              price={85.00}
              image="AEOLOS Knee Sleeves (1 Pair)，7mm Compression Knee Braces for Heavy-Lifting,Squats,Gym and Other Sports (Large, Black).jpeg"
              addToCart={addToCart}
            />
            {/* Boxing Gloves */}
            <ProductCard
              name="Everlast Boxing Gloves"
              price={120.00}
              image="Everlast Powerlock 2R Hook and Loop Training Boxing Gloves - 12 oz_ - Black.jpeg"
              addToCart={addToCart}
            />
          </div>
        </div>
      )}

      {/* Gym Attire Section */}
      {(activeCategory === 'all' || activeCategory === 'gym-attire') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Gym Attire</h2>
          <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Product Items */}
            <ProductCard
              name="Compression T-Shirt"
              price={120.00}
              image="Camisa Camiseta de Compressão Homem Aranha Manga Curta Rash Guard Academia.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Men's Gym T-Shirt"
              price={85.00}
              image="Men's Gym T-Shirt - 2 _ xl.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Men's Running Shorts"
              price={95.00}
              image="Men's Running Shorts Gym Shorts Sports Basketball Gym Breathable Quick Dry Drawstring Elastic Waist Liner Plain Short Sport Casual Activewear Black Grey Micro-elastic.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Nike Hyperadapt Jacket"
              price={280.00}
              image="Mens Nike Hyperadapt #gym #fitness #jackets….jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Nike Long Sleeve Tee"
              price={150.00}
              image="Nike Seamed Active Long Sleeve Tee-black _ ModeSens.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Women's Compression Sleeve"
              price={110.00}
              image="HeatGear OG Compression Women's Short Sleeve - Black LG.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Women's Workout Shorts"
              price={95.00}
              image="Workout Shorts for Women Scrunch Butt Lifting High.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Women's Workout Set"
              price={180.00}
              image="OLCHEE Womens Workout Sets 2 Piece - Seamless Acid Wash Yoga Outfits Shorts and Crop Top Matching Gym Athletic Clothing Set.jpeg"
              addToCart={addToCart}
            />
          </div>
        </div>
      )}

      {/* Gym Equipment Section */}
      {(activeCategory === 'all' || activeCategory === 'gym-equipment') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Gym Equipment</h2>
          <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Product Items */}
            <ProductCard
              name="Home Weights Set"
              price={450.00}
              image="The Only Weights You Need To Stay Fit Without Leaving Your Home, According to Trainers.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Hand Strengthener"
              price={65.00}
              image="Adjustable Hand Strengthener with 5-100KG Resistance and LCD Counter - Pink.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Resistance Bands"
              price={85.00}
              image="Versatile Resistance Bands for Home Workout and Yoga - Grey.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Ab Roller Wheel"
              price={110.00}
              image="Ab Roller Wheel Set.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Push Up Board"
              price={180.00}
              image="fitove Push Up Board Set für Krafttraining und Muskelaufbau - Fitness Home Workout Trainer - mit Trainingsplan und Trainingsvideos - zum Training Zuhause ohne Trainingsgeräte für Männer und Frauen.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Home Gym Trainer"
              price={2500.00}
              image="Centr 2 Home Gym Functional Trainer, Steel.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Olympic Flat Bench"
              price={850.00}
              image="Sierra Olympic Flat Bench - GYM READY EQUIPMENT.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Power Tower"
              price={950.00}
              image="Sportsroyals Power Tower Dip Station Pull Up Bar for Home Gym Strength Training Workout Equipment, 450LBS_.jpeg"
              addToCart={addToCart}
            />
          </div>
        </div>
      )}

      {/* Supplements Section */}
      {(activeCategory === 'all' || activeCategory === 'supplements') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Supplements</h2>
          <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Product Items */}
            <ProductCard
              name="Whey Protein"
              price={250.00}
              image="Nutrabay Gold Tri Blend Whey Protein Powder - No Artificial Colour, No fillers, No Added Sugar.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="BCAA"
              price={180.00}
              image="XL Nutrition Instant BCAA 210g - 210g _ Orange Slush.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Creatine"
              price={150.00}
              image="Evlution Creatine Monohydrate.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Pre Workout"
              price={200.00}
              image="MuscleTech Muscle Builder.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Mass Gainer"
              price={280.00}
              image="Muscletech Mass Gainer Mass-Tech Extreme 2000, Muscle Builder Whey Protein Powder.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Fat Burner"
              price={120.00}
              image="Green Tea Weight Loss Pills with Green Coffee Bean Extract _ Belly Fat Burner, Metabolism Booster, & Appetite Suppressant for Women & Men _ 45% EGCG _ Vegan, Gluten-Free Supplement _ 60 Capsules.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Testosterone Booster"
              price={190.00}
              image="Arazo Nutrition TestoBoost Test Booster Supplement - Potent & Natural Herbal Pills - Boost Muscle Growth - Tribulus, Horny Goat Weed, Hawthorn, Zinc, Minerals.jpeg"
              addToCart={addToCart}
            />
            <ProductCard
              name="Creatine Gummies"
              price={160.00}
              image="Creatine Monohydrate Gummies 4000mg.jpeg"
              addToCart={addToCart}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <PageWrapper>
      <PageContainer>
        <div className="m-0  p-0" >
          {/* Hero Section */}
          <section className="flex flex-col-2 md:flex-row items-center bg-black text-white p-6 rounded-lg mb-8 mt-1">
            <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-3">FROM WEIGHTS TO WEARS</h1>
              <h2 className="text-2xl font-semibold text-pink-500 mb-3">You name it, we have it!</h2>
              <p className="text-gray-300">
                From weight to workout gear, we've got it all. Top-quality fitness products at unbeatable prices. 
                Upgrade your training without overspending–shop now!
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {heroImgError ? (
                <div className="w-full max-w-md h-60 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-300 text-center">Fitness Products & Equipment</span>
                </div>
              ) : (
                <img 
                  src={heroImage} 
                  alt="Fitness model" 
                  className="w-full max-w-md rounded-lg shadow-lg object-cover"
                  onError={() => setHeroImgError(true)}
                />
              )}
            </div>
          </section>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-lg shadow-md">
            <button 
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-200 text-gray-800 hover:bg-indigo-300'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              All Products
            </button>
            <button 
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === 'gym-attire' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-200 text-gray-800 hover:bg-indigo-300'
              }`}
              onClick={() => handleCategoryChange('gym-attire')}
            >
              Gym Attire
            </button>
            <button 
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === 'gym-equipment' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-200 text-gray-800 hover:bg-indigo-300'
              }`}
              onClick={() => handleCategoryChange('gym-equipment')}
            >
              Gym Equipment
            </button>
            <button 
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === 'supplements' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-200 text-gray-800 hover:bg-indigo-300'
              }`}
              onClick={() => handleCategoryChange('supplements')}
            >
              Supplements
            </button>
          </div>

          {/* Products Sections - Note: Now it uses a div with ID to anchor positioning and uses the memoized products */}
          <div id="products-container" className="bg-white rounded-lg shadow-md p-6">
            {allProducts}
          </div>
        </div>

        {/* Cart Badge Overlay */}
        <Link to="/cart" className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-10 flex items-center justify-center">
          <div className="relative">
            <i className="fas fa-shopping-cart text-2xl text-gray-800"></i>
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </Link>
      </PageContainer>
    </PageWrapper>
  );
};

// Product Card Component
const ProductCard = ({ name, price, image, addToCart }) => {
  // Use state to track if image loading fails
  const [imgError, setImgError] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  // Get image source with our helper and handle errors
  const imgSrc = getProductImage(image);

  // Check if the image is a placeholder on mount
  useEffect(() => {
    if (imgSrc && imgSrc.includes('placeholder.com')) {
      setIsPlaceholder(true);
    }
  }, [imgSrc]);
  
  // Handle add to cart - make sure it doesn't interfere with navigation
  const handleAddToCart = (e) => {
    // Completely prevent default browser behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Also prevent any native events from propagating
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    // Capture current scroll position before adding to cart
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    
    // Add to cart
    addToCart({ name, price, image }, e);
    
    // Immediately restore scroll position
    window.scrollTo({
      top: scrollPos,
      behavior: 'instant' // Use 'instant' to prevent any smooth scrolling
    });
    
    // Return false to prevent any additional event handling
    return false;
  };

  // Generate URL-friendly name for product that matches the keys in ProductDetail.jsx
  const getProductUrl = () => {
    // Remove spaces and special characters to match the productMapping keys
    // in ProductDetail.jsx
    return name.replace(/[ '\-°.]/g, '')
              .replace(/\s+/g, '')
              .replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer">
      <Link to={`/product/${getProductUrl()}`} className="flex flex-col flex-grow">
        <div className="h-40 overflow-hidden">
          {imgError || isPlaceholder ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center p-2">
              <span className="text-gray-700 text-sm text-center">{name}</span>
            </div>
          ) : (
            <img 
              src={imgSrc} 
              alt={name} 
              className="w-full h-full object-contain" 
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-sm mb-1 text-gray-800 line-clamp-2 h-10">{name}</h3>
          <p className="font-bold text-sm mb-2 text-gray-900">₵{price.toFixed(2)}</p>
          <div className="mt-auto">
            <p className="text-xs text-blue-600 hover:underline">View details</p>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button 
          onClick={handleAddToCart}
          type="button" 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-1 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
        >
          Add to Cart <i className="fas fa-shopping-cart text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default Products; 