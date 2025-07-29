import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import { getProductImage } from '../../utils/productImages';
import PageWrapper from '../PageWrapper';

const ProductDetail = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Generate product descriptions
  const getDescription = (name) => {
    // First try exact match in descriptions
    if (descriptions[name]) {
      return descriptions[name];
    }
    
    // If not found, try to match by searching for a similar key
    const descKeys = Object.keys(descriptions);
    const matchingKey = descKeys.find(key => {
      const cleanKey = key.replace(/[^a-zA-Z0-9]/gi, '').toLowerCase();
      const cleanName = name.replace(/[^a-zA-Z0-9]/gi, '').toLowerCase();
      return cleanKey === cleanName;
    });
    
    if (matchingKey) {
      return descriptions[matchingKey];
    }
    
    // Default description if no match found
    return `Premium quality ${name} designed for optimal performance and durability. Perfect for fitness enthusiasts looking to enhance their workout experience.`;
  };
  
  // Descriptions object
  const descriptions = {
    "BlenderBottle": "The BlenderBottle Classic V2 revolutionizes protein shakes and pre-workout mixing. Featuring a patented mixing system with a 316 surgical-grade stainless steel BlenderBall wire whisk, it ensures smooth, clump-free drinks. Dishwasher safe and BPA free.",
    "HydroJugTraveler": "Stay hydrated on the go with the HydroJug Traveler. This lightweight water bottle features a convenient carry handle, leak-proof design, and double-wall insulation to keep your drinks cold for up to 24 hours. Perfect for gym sessions and daily use.",
    "IRONFLASKSportsBottle": "The IRON °FLASK Sports Water Bottle is crafted from premium 18/8 stainless steel, free from toxins and BPAs. This vacuum-insulated bottle keeps beverages cold for 24 hours and hot for 12 hours. Includes 3 straw lids and is 100% leak-proof.",
    "AEOLOSKneeSleeves": "AEOLOS Knee Sleeves provide 7mm neoprene compression support for heavy lifting, squats, and sports. These durable sleeves offer optimal joint warmth, improved blood flow, and injury prevention. Perfect for CrossFit, weightlifting, and high-impact activities.",
    "EverlastBoxingGloves": "Everlast Powerlock Training Boxing Gloves feature anatomical foam construction that guides your hand into a natural fist position. Premium synthetic leather with superior construction ensures long-lasting durability for heavy bag work and mitt training.",
    "CompressionTShirt": "This high-performance compression shirt enhances your workout with moisture-wicking fabric and strategic compression zones. The four-way stretch material moves with your body while providing muscle support and improved circulation for better performance and recovery.",
    "MensGymTShirt": "Designed for comfort during intense workouts, this premium gym t-shirt features breathable fabric that wicks away moisture. The athletic fit provides freedom of movement while the durable construction ensures it holds up through countless training sessions.",
    "MensRunningShorts": "These versatile running shorts combine comfort and functionality with breathable, quick-dry fabric. Features include a supportive liner, elastic waistband with drawstring, and lightweight design perfect for running, basketball, and gym workouts.",
    "NikeHyperadaptJacket": "The Nike Hyperadapt Jacket offers weather-adaptive technology that responds to changing conditions. This premium fitness jacket features windproof and water-resistant materials, strategic ventilation, and a streamlined fit for maximum performance during outdoor workouts.",
    "NikeLongSleeveTee": "This Nike Seamed Active Long Sleeve Tee delivers comfort and style for your fitness routine. Featuring Dri-FIT technology to wick away sweat, flatlock seams to prevent chafing, and a streamlined fit that moves with you through any workout.",
    "WomensCompressionSleeve": "HeatGear OG Compression technology delivers superior muscle support and recovery benefits. This women's short sleeve compression top features strategic ventilation, 4-way stretch fabric, and moisture-wicking properties for intense training sessions.",
    "WomensWorkoutShorts": "These high-waisted workout shorts feature a scrunch butt design that enhances your natural shape. Made with 4-way stretch fabric that's squat-proof and moisture-wicking, they're perfect for any workout from yoga to HIIT training.",
    "WomensWorkoutSet": "This seamless 2-piece workout set includes a crop top and shorts in an on-trend acid wash pattern. The breathable, stretchy fabric provides comfort and support for any activity from yoga to strength training, while the matching design offers effortless style.",
    "HomeWeightsSet": "This comprehensive home weight set includes everything you need for effective strength training at home. Featuring adjustable dumbbells, weight plates, and comfortable grips, this versatile set allows for a wide range of exercises targeting all major muscle groups.",
    "HandStrengthener": "This adjustable hand strengthener provides resistance from 5-100KG with an LCD counter to track your progress. Perfect for improving grip strength, rehabilitating injuries, or enhancing performance in sports and climbing. The ergonomic design ensures comfortable use.",
    "ResistanceBands": "These versatile resistance bands are perfect for home workouts, yoga, and rehabilitation exercises. The set includes multiple resistance levels to progressive challenge your muscles. Made from durable, skin-friendly material that won't snap or lose elasticity over time.",
    "AbRollerWheel": "The Ab Roller Wheel Set provides an effective way to strengthen your core, arms, and back. This quality roller features non-slip handles, a wide wheel for stability, and comes with a knee pad for comfort during workouts. Perfect for home fitness routines.",
    "PushUpBoard": "This innovative push-up board system allows you to target specific muscle groups with precision. The color-coded board features multiple positions to work different parts of the chest, shoulders, and arms. Includes training plan and access to instructional videos.",
    "HomeGymTrainer": "The Centr 2 Home Gym Functional Trainer offers commercial-grade quality for your home. This steel-constructed machine provides smooth cable motion, multiple weight settings, and versatility for a full-body workout without requiring multiple equipment pieces.",
    "OlympicFlatBench": "This Sierra Olympic Flat Bench is built to commercial standards for home use. Featuring a stable wide stance, high-density padding, and heavy-gauge steel construction, it supports heavy lifting with comfort and safety for bench presses and other exercises.",
    "PowerTower": "The Sportsroyals Power Tower is a versatile strength training station supporting up to 450lbs. Perfect for dips, pull-ups, push-ups, and vertical knee raises, this adjustable tower allows for a complete upper body and core workout in one compact piece of equipment.",
    "WheyProtein": "Nutrabay Gold Tri Blend Whey Protein combines whey concentrate, isolate, and hydrolyzed whey for optimal absorption. This premium formula contains no artificial colors, fillers, or added sugar while delivering 24g of protein per serving to support muscle recovery and growth.",
    "BCAA": "XL Nutrition Instant BCAA in Orange Slush flavor delivers 5g of branched-chain amino acids per serving. These essential amino acids support muscle recovery, reduce fatigue, and prevent muscle breakdown during intense workouts. Mixes instantly for convenient consumption during training.",
    "Creatine": "Evlution Creatine Monohydrate provides 5g of pure creatine per serving to increase strength, power, and muscle size. This pharmaceutical-grade supplement is unflavored, mixes easily, and has been scientifically proven to enhance high-intensity exercise performance.",
    "PreWorkout": "MuscleTech Muscle Builder pre-workout formula delivers explosive energy, enhanced focus, and increased muscle pump during workouts. Featuring scientifically researched ingredients including caffeine, beta-alanine, and L-citrulline, it helps you push through plateaus and maximize training intensity.",
    "MassGainer": "Muscletech Mass-Tech Extreme 2000 delivers 2000 calories and 80g of protein per serving to support muscle growth and recovery. This advanced formula includes added creatine, essential fats, and complex carbohydrates to fuel intense workouts and support size and strength gains.",
    "FatBurner": "These Green Tea Weight Loss Pills combine green tea extract with green coffee bean extract to boost metabolism and support fat burning. With 45% EGCG, these vegan, gluten-free supplements help suppress appetite, increase energy, and promote thermogenesis for effective weight management.",
    "TestosteroneBooster": "Arazo Nutrition TestoBoost contains potent natural ingredients including Tribulus, Horny Goat Weed, Hawthorn, and essential minerals to support healthy testosterone levels. This supplement helps boost muscle growth, increase energy, and enhance overall vitality and performance.",
    "CreatineGummies": "These innovative Creatine Monohydrate Gummies deliver 4000mg of creatine per serving in a convenient, great-tasting form. Perfect for those who dislike powders, these gummies provide the same strength and performance benefits as traditional creatine supplements with improved compliance."
  };
  
  // Product data mapping
  const productMapping = {
    "BlenderBottle": {
      name: "Blender Bottle",
      price: 45.00,
      image: "BlenderBottle Classic V2 Shaker Bottle Perfect for Protein Shakes and Pre Workout, 20-Ounce.jpeg",
      category: "accessories",
      rating: 4.8,
      reviewCount: 126,
      features: [
        "Patented mixing system with 316 surgical-grade stainless steel BlenderBall",
        "20-ounce capacity",
        "Dishwasher safe and BPA free",
        "Secure screw-on lid with leak-proof guarantee",
        "Wide mouth for easy adding of ingredients"
      ],
      stock: 42
    },
    "HydroJugTraveler": {
      name: "HydroJug Traveler",
      price: 75.00,
      image: "HydroJug Traveler.jpeg",
      category: "accessories",
      rating: 4.7,
      reviewCount: 84,
      features: [
        "Double-wall insulation keeps drinks cold for up to 24 hours",
        "Convenient carry handle",
        "Leak-proof design",
        "Lightweight and portable",
        "Dishwasher safe"
      ],
      stock: 38
    },
    "IRONFLASKSportsBottle": {
      name: "IRON °FLASK Sports Bottle",
      price: 95.00,
      image: "IRON °FLASK Sports Water Bottle - 40 Oz 3 Lids (Straw Lid), Leak Proof - Stainless Steel Gym Bottles for Men, Women & Kids - Double Walled, Insulated Thermos.jpeg",
      category: "accessories",
      rating: 4.9,
      reviewCount: 203,
      features: [
        "Premium 18/8 stainless steel construction",
        "Vacuum-insulated to keep beverages cold for 24 hours and hot for 12 hours",
        "Includes 3 straw lids for versatile use",
        "100% leak-proof design",
        "Free from toxins and BPAs"
      ],
      stock: 25
    },
    "AEOLOSKneeSleeves": {
      name: "AEOLOS Knee Sleeves",
      price: 85.00,
      image: "AEOLOS Knee Sleeves (1 Pair)，7mm Compression Knee Braces for Heavy-Lifting,Squats,Gym and Other Sports (Large, Black).jpeg",
      category: "accessories",
      rating: 4.6,
      reviewCount: 118,
      features: [
        "7mm neoprene compression support",
        "Optimal joint warmth",
        "Improved blood flow",
        "Injury prevention for CrossFit, weightlifting, and high-impact activities",
        "Durable and washable material"
      ],
      stock: 33
    },
    "EverlastBoxingGloves": {
      name: "Everlast Boxing Gloves",
      price: 120.00,
      image: "Everlast Powerlock 2R Hook and Loop Training Boxing Gloves - 12 oz_ - Black.jpeg",
      category: "accessories",
      rating: 4.7,
      reviewCount: 89,
      features: [
        "Anatomical foam construction guides hand into natural fist position",
        "Premium synthetic leather for long-lasting durability",
        "Excellent for heavy bag work and mitt training",
        "Secure hook and loop closure system",
        "Ventilated palm for optimal comfort"
      ],
      stock: 18
    },
    "CompressionTShirt": {
      name: "Compression T-Shirt",
      price: 120.00,
      image: "Camisa Camiseta de Compressão Homem Aranha Manga Curta Rash Guard Academia.jpeg",
      category: "gym-attire",
      rating: 4.5,
      reviewCount: 78,
      features: [
        "Four-way stretch material moves with your body",
        "Moisture-wicking fabric keeps you dry during workouts",
        "Strategic compression zones for muscle support",
        "Flatlock seams prevent chafing",
        "Machine washable and quick-drying"
      ],
      stock: 45
    },
    "MensGymTShirt": {
      name: "Men's Gym T-Shirt",
      price: 85.00,
      image: "Men's Gym T-Shirt - 2 _ xl.jpeg",
      category: "gym-attire",
      rating: 4.3,
      reviewCount: 62,
      features: [
        "Breathable fabric wicks away moisture",
        "Athletic fit for freedom of movement",
        "Reinforced stitching for durability",
        "Lightweight design for comfort during workouts",
        "Available in multiple sizes and colors"
      ],
      stock: 56
    },
    "MensRunningShorts": {
      name: "Men's Running Shorts",
      price: 95.00,
      image: "Men's Running Shorts Gym Shorts Sports Basketball Gym Breathable Quick Dry Drawstring Elastic Waist Liner Plain Short Sport Casual Activewear Black Grey Micro-elastic.jpeg",
      category: "gym-attire",
      rating: 4.4,
      reviewCount: 93,
      features: [
        "Quick-dry fabric for comfort during intense workouts",
        "Built-in liner for support and coverage",
        "Elastic waistband with drawstring for adjustable fit",
        "Side pockets for essentials",
        "Lightweight and breathable design"
      ],
      stock: 38
    },
    "NikeHyperadaptJacket": {
      name: "Nike Hyperadapt Jacket",
      price: 280.00,
      image: "Mens Nike Hyperadapt #gym #fitness #jackets….jpeg",
      category: "gym-attire",
      rating: 4.8,
      reviewCount: 47,
      features: [
        "Weather-adaptive technology responds to changing conditions",
        "Wind-resistant and water-repellent material",
        "Strategic ventilation for temperature regulation",
        "Streamlined fit for maximum performance",
        "Multiple pockets for storage"
      ],
      stock: 22
    },
    "NikeLongSleeveTee": {
      name: "Nike Long Sleeve Tee",
      price: 150.00,
      image: "Nike Seamed Active Long Sleeve Tee-black _ ModeSens.jpeg",
      category: "gym-attire",
      rating: 4.6,
      reviewCount: 58,
      features: [
        "Dri-FIT technology wicks away sweat",
        "Flatlock seams to prevent chafing",
        "Streamlined fit for unrestricted movement",
        "Crew neckline for classic style",
        "Ideal for layering or wearing alone"
      ],
      stock: 42
    },
    "WomensCompressionSleeve": {
      name: "Women's Compression Sleeve",
      price: 110.00,
      image: "HeatGear OG Compression Women's Short Sleeve - Black LG.jpeg",
      category: "gym-attire",
      rating: 4.7,
      reviewCount: 64,
      features: [
        "HeatGear OG Compression technology",
        "Strategic ventilation for temperature control",
        "4-way stretch fabric for maximum mobility",
        "Moisture-wicking properties keep you dry",
        "Anti-odor technology prevents microbe growth"
      ],
      stock: 36
    },
    "WomensWorkoutShorts": {
      name: "Women's Workout Shorts",
      price: 95.00,
      image: "Workout Shorts for Women Scrunch Butt Lifting High.jpeg",
      category: "gym-attire",
      rating: 4.6,
      reviewCount: 86,
      features: [
        "High-waisted design for core support",
        "Scrunch butt design enhances natural shape",
        "4-way stretch fabric is squat-proof",
        "Moisture-wicking material keeps you dry",
        "Hidden waistband pocket for small essentials"
      ],
      stock: 40
    },
    "WomensWorkoutSet": {
      name: "Women's Workout Set",
      price: 180.00,
      image: "OLCHEE Womens Workout Sets 2 Piece - Seamless Acid Wash Yoga Outfits Shorts and Crop Top Matching Gym Athletic Clothing Set.jpeg",
      category: "gym-attire",
      rating: 4.8,
      reviewCount: 72,
      features: [
        "Matching crop top and shorts set",
        "Seamless construction prevents chafing",
        "Trendy acid wash pattern",
        "Breathable, stretchy fabric for comfort",
        "Perfect for yoga, gym, and athleisure wear"
      ],
      stock: 28
    },
    "HomeWeightsSet": {
      name: "Home Weights Set",
      price: 450.00,
      image: "The Only Weights You Need To Stay Fit Without Leaving Your Home, According to Trainers.jpeg",
      category: "gym-equipment",
      rating: 4.7,
      reviewCount: 59,
      features: [
        "Adjustable dumbbells for versatile workouts",
        "Includes weight plates of various sizes",
        "Comfortable grips for extended use",
        "Compact storage design for home use",
        "Durable construction for long-lasting performance"
      ],
      stock: 15
    },
    "HandStrengthener": {
      name: "Hand Strengthener",
      price: 65.00,
      image: "Adjustable Hand Strengthener with 5-100KG Resistance and LCD Counter - Pink.jpeg",
      category: "gym-equipment",
      rating: 4.4,
      reviewCount: 103,
      features: [
        "Adjustable resistance from 5-100KG",
        "LCD counter to track progress",
        "Ergonomic design for comfortable grip",
        "Perfect for improving grip strength",
        "Helps with rehabilitation and sports performance"
      ],
      stock: 50
    },
    "ResistanceBands": {
      name: "Resistance Bands",
      price: 85.00,
      image: "Versatile Resistance Bands for Home Workout and Yoga - Grey.jpeg",
      category: "gym-equipment",
      rating: 4.5,
      reviewCount: 127,
      features: [
        "Set includes multiple resistance levels",
        "Made from durable, skin-friendly material",
        "Perfect for home workouts and rehabilitation",
        "Portable design for fitness on the go",
        "Includes carrying case and exercise guide"
      ],
      stock: 65
    },
    "AbRollerWheel": {
      name: "Ab Roller Wheel",
      price: 110.00,
      image: "Ab Roller Wheel Set.jpeg",
      category: "gym-equipment",
      rating: 4.6,
      reviewCount: 84,
      features: [
        "Strengthens core, arms, and back muscles",
        "Non-slip handles for secure grip",
        "Wide wheel design for stability",
        "Includes knee pad for comfort during workouts",
        "Compact and portable for home or travel use"
      ],
      stock: 38
    },
    "PushUpBoard": {
      name: "Push Up Board",
      price: 180.00,
      image: "fitove Push Up Board Set für Krafttraining und Muskelaufbau - Fitness Home Workout Trainer - mit Trainingsplan und Trainingsvideos - zum Training Zuhause ohne Trainingsgeräte für Männer und Frauen.jpeg",
      category: "gym-equipment",
      rating: 4.7,
      reviewCount: 75,
      features: [
        "Color-coded board for targeting specific muscle groups",
        "Multiple handle positions for varied workouts",
        "Includes training plan and video access",
        "Suitable for beginners and advanced users",
        "Durable construction for long-term use"
      ],
      stock: 25
    },
    "HomeGymTrainer": {
      name: "Home Gym Trainer",
      price: 2500.00,
      image: "Centr 2 Home Gym Functional Trainer, Steel.jpeg",
      category: "gym-equipment",
      rating: 4.9,
      reviewCount: 38,
      features: [
        "Commercial-grade steel construction",
        "Smooth cable motion for consistent resistance",
        "Multiple weight settings for progressive training",
        "Compact footprint for home use",
        "Versatile for full-body workouts"
      ],
      stock: 10
    },
    "OlympicFlatBench": {
      name: "Olympic Flat Bench",
      price: 850.00,
      image: "Sierra Olympic Flat Bench - GYM READY EQUIPMENT.jpeg",
      category: "gym-equipment",
      rating: 4.8,
      reviewCount: 52,
      features: [
        "Commercial standard for home use",
        "Stable wide stance design",
        "High-density padding for comfort",
        "Heavy-gauge steel construction",
        "Supports heavy lifting with safety"
      ],
      stock: 12
    },
    "PowerTower": {
      name: "Power Tower",
      price: 950.00,
      image: "Sportsroyals Power Tower Dip Station Pull Up Bar for Home Gym Strength Training Workout Equipment, 450LBS_.jpeg",
      category: "gym-equipment",
      rating: 4.7,
      reviewCount: 68,
      features: [
        "Supports up to 450lbs weight capacity",
        "Multi-function station for dips, pull-ups, push-ups, and knee raises",
        "Adjustable height for different users",
        "Stable H-shaped base prevents tipping",
        "Comfortable padded back and arm rests"
      ],
      stock: 15
    },
    "WheyProtein": {
      name: "Whey Protein",
      price: 250.00,
      image: "Nutrabay Gold Tri Blend Whey Protein Powder - No Artificial Colour, No fillers, No Added Sugar.jpeg",
      category: "supplements",
      rating: 4.8,
      reviewCount: 145,
      features: [
        "Tri-blend formula with whey concentrate, isolate, and hydrolyzed whey",
        "No artificial colors or fillers",
        "No added sugar",
        "24g of protein per serving",
        "Supports muscle recovery and growth"
      ],
      stock: 45
    },
    "BCAA": {
      name: "BCAA",
      price: 180.00,
      image: "XL Nutrition Instant BCAA 210g - 210g _ Orange Slush.jpeg",
      category: "supplements",
      rating: 4.6,
      reviewCount: 92,
      features: [
        "5g of branched-chain amino acids per serving",
        "Delicious Orange Slush flavor",
        "Supports muscle recovery",
        "Reduces exercise-induced fatigue",
        "Prevents muscle breakdown during workouts"
      ],
      stock: 38
    },
    "Creatine": {
      name: "Creatine",
      price: 150.00,
      image: "Evlution Creatine Monohydrate.jpeg",
      category: "supplements",
      rating: 4.9,
      reviewCount: 178,
      features: [
        "5g of pure creatine monohydrate per serving",
        "Unflavored for versatile mixing",
        "Increases strength and power",
        "Enhances muscle size and performance",
        "Pharmaceutical grade quality"
      ],
      stock: 56
    },
    "PreWorkout": {
      name: "Pre Workout",
      price: 200.00,
      image: "MuscleTech Muscle Builder.jpeg",
      category: "supplements",
      rating: 4.7,
      reviewCount: 134,
      features: [
        "Delivers explosive energy and focus",
        "Enhances muscle pump during workouts",
        "Contains scientifically researched ingredients",
        "Includes caffeine and beta-alanine",
        "Helps push through plateaus"
      ],
      stock: 42
    },
    "MassGainer": {
      name: "Mass Gainer",
      price: 280.00,
      image: "Muscletech Mass Gainer Mass-Tech Extreme 2000, Muscle Builder Whey Protein Powder.jpeg",
      category: "supplements",
      rating: 4.5,
      reviewCount: 87,
      features: [
        "2000 calories per serving",
        "80g of protein for muscle recovery",
        "Added creatine for strength",
        "Essential fats and complex carbohydrates",
        "Supports size and strength gains"
      ],
      stock: 28
    },
    "FatBurner": {
      name: "Fat Burner",
      price: 120.00,
      image: "Green Tea Weight Loss Pills with Green Coffee Bean Extract _ Belly Fat Burner, Metabolism Booster, & Appetite Suppressant for Women & Men _ 45% EGCG _ Vegan, Gluten-Free Supplement _ 60 Capsules.jpeg",
      category: "supplements",
      rating: 4.3,
      reviewCount: 156,
      features: [
        "Combines green tea extract with green coffee bean extract",
        "Contains 45% EGCG for effective fat burning",
        "Boosts metabolism naturally",
        "Suppresses appetite to reduce calorie intake",
        "Vegan and gluten-free formula"
      ],
      stock: 63
    },
    "TestosteroneBooster": {
      name: "Testosterone Booster",
      price: 190.00,
      image: "Arazo Nutrition TestoBoost Test Booster Supplement - Potent & Natural Herbal Pills - Boost Muscle Growth - Tribulus, Horny Goat Weed, Hawthorn, Zinc, Minerals.jpeg",
      category: "supplements",
      rating: 4.4,
      reviewCount: 109,
      features: [
        "Natural herbal formula with Tribulus and Horny Goat Weed",
        "Contains essential minerals including zinc",
        "Supports healthy testosterone levels",
        "Enhances energy and vitality",
        "Helps boost muscle growth and performance"
      ],
      stock: 35
    },
    "CreatineGummies": {
      name: "Creatine Gummies",
      price: 160.00,
      image: "Creatine Monohydrate Gummies 4000mg.jpeg",
      category: "supplements",
      rating: 4.5,
      reviewCount: 74,
      features: [
        "4000mg of creatine monohydrate per serving",
        "Convenient gummy form - no mixing required",
        "Great taste for improved compliance",
        "Increases strength and power",
        "Alternative to traditional powder supplements"
      ],
      stock: 47
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find the matching product from the mapping
    const productKey = Object.keys(productMapping).find(key => 
      // Match ignoring spaces, special chars
      key.replace(/[^a-zA-Z0-9]/gi, '').toLowerCase() === 
      productName.replace(/[^a-zA-Z0-9]/gi, '').toLowerCase()
    );
    
    if (productKey) {
      const productData = productMapping[productKey];
      productData.description = getDescription(productKey);
      setProduct(productData);
    }
    
    setLoading(false);
  }, [productName]);

  // Handle quantity changes
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  // Add to cart
  const addToCart = (e) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      // Get existing cart or initialize empty one
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product is already in cart
      const existingItemIndex = existingCart.findIndex(item => item.name === product.name);
      
      if (existingItemIndex > -1) {
        // Update quantity if already in cart
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        existingCart.push({ 
          name: product.name, 
          price: product.price, 
          image: product.image,
          quantity: quantity
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Show notification
      setShowNotification(true);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Hide notification after timeout
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };
  
  // Buy now - Add to cart and go to checkout
  const buyNow = (e) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      // Get existing cart or initialize empty one
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product is already in cart
      const existingItemIndex = existingCart.findIndex(item => item.name === product.name);
      
      if (existingItemIndex > -1) {
        // Update quantity if already in cart
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        existingCart.push({ 
          name: product.name, 
          price: product.price, 
          image: product.image,
          quantity: quantity
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (err) {
      console.error('Error with buy now:', err);
    }
  };

  // Handle image errors
  const handleImageError = () => {
    setImgError(true);
  };

  // If not found
  if (!loading && !product) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Back to Products
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-pink-600 rounded-full border-t-transparent"></div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const imgSrc = getProductImage(product.image);

  return (

      <div className="container mx-auto px-4 py-8" style={{marginTop: "15vh", marginBottom: "5rem"}}>
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-pink-600">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/products" className="text-gray-500 hover:text-pink-600">Products</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-pink-600 font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col-2 lg:flex-row -mx-4">
          {/* Product Image */}
          <div className="lg:w-1/2 px-4 mb-10 lg:mb-0">
            <div className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-center min-h-[400px]">
              {imgError || isPlaceholder ? (
                <div className="bg-gray-100 w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">{product.name}</span>
                </div>
              ) : (
                <img 
                  src={imgSrc} 
                  alt={product.name} 
                  className="max-w-full h-auto max-h-[400px] object-contain" 
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">₵{product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="ml-4 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="ml-4 inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
              <ul className="list-disc pl-5 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h2>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="bg-gray-100 py-2 px-6">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-2 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={addToCart}
                className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 sm:px-10 rounded-lg font-semibold flex-grow sm:flex-grow-0"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button 
                onClick={buyNow}
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 sm:px-10 rounded-lg font-semibold flex-grow"
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section - would be added in a real app */}

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Added to cart!</span>
          </div>
        )}
      </div>
    );
};

export default ProductDetail; 