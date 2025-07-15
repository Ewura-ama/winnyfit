// Safer approach without direct imports of files with special characters
// This avoids URI malformed errors when Vite processes imports

// Direct imports for all available images
import blenderBottle from '../assets/BlenderBottle Classic V2 Shaker Bottle Perfect for Protein Shakes and Pre Workout, 20-Ounce.jpeg';
import hydroJug from '../assets/HydroJug Traveler.jpeg';
import ironFlask from '../assets/IRON °FLASK Sports Water Bottle - 40 Oz 3 Lids (Straw Lid), Leak Proof - Stainless Steel Gym Bottles for Men, Women & Kids - Double Walled, Insulated Thermos.jpeg';
import kneeSleves from '../assets/AEOLOS Knee Sleeves (1 Pair)，7mm Compression Knee Braces for Heavy-Lifting,Squats,Gym and Other Sports (Large, Black).jpeg';
import boxingGloves from '../assets/Everlast Powerlock 2R Hook and Loop Training Boxing Gloves - 12 oz_ - Black.jpeg';
import compression from '../assets/Camisa Camiseta de Compressão Homem Aranha Manga Curta Rash Guard Academia.jpeg';

// Import the renamed files
import mensTShirt from '../assets/mens-gym-tshirt-xl.jpeg';
import mensRunningShorts from '../assets/Men\'s 2-in-1 Running Shorts Quick Drying Breathable Active Training E5p8.jpeg';
import nikeJacket from '../assets/nike-hyperadapt-jacket.jpeg';
import nikeLongSleeve from '../assets/nike-long-sleeve.jpeg';
import womensCompression from '../assets/womens-compression-sleeve.jpeg';

// Import other product images
import womenShorts from '../assets/Workout Shorts for Women Scrunch Butt Lifting High.jpeg';
import womenSet from '../assets/OLCHEE Womens Workout Sets 2 Piece - Seamless Acid Wash Yoga Outfits Shorts and Crop Top Matching Gym Athletic Clothing Set.jpeg';
import homeWeights from '../assets/The Only Weights You Need To Stay Fit Without Leaving Your Home, According to Trainers.jpeg';
import handStrengthener from '../assets/Adjustable Hand Strengthener with 5-100KG Resistance and LCD Counter - Pink.jpeg';
import resistanceBands from '../assets/Versatile Resistance Bands for Home Workout and Yoga - Grey.jpeg';
import abRoller from '../assets/Ab Roller Wheel Set.jpeg';
import pushUpBoard from '../assets/fitove Push Up Board Set für Krafttraining und Muskelaufbau - Fitness Home Workout Trainer - mit Trainingsplan und Trainingsvideos - zum Training Zuhause ohne Trainingsgeräte für Männer und Frauen.jpeg';
import homeGym from '../assets/Centr 2 Home Gym Functional Trainer, Steel.jpeg';
import olympicBench from '../assets/Sierra Olympic Flat Bench - GYM READY EQUIPMENT.jpeg';
import powerTower from '../assets/Sportsroyals Power Tower Dip Station Pull Up Bar for Home Gym Strength Training Workout Equipment, 450LBS_.jpeg';
import wheyProtein from '../assets/Nutrabay Gold Tri Blend Whey Protein Powder - No Artificial Colour, No fillers, No Added Sugar.jpeg';
import bcaa from '../assets/XL Nutrition Instant BCAA 210g - 210g _ Orange Slush.jpeg';
import creatine from '../assets/Evlution Creatine Monohydrate.jpeg';
import preWorkout from '../assets/MuscleTech Muscle Builder.jpeg';
import massGainer from '../assets/Muscletech Mass Gainer Mass-Tech Extreme 2000, Muscle Builder Whey Protein Powder.jpeg';
// Use a placeholder URL instead of direct import for the fat burner (problematic filename)
// import fatBurner from '../assets/Green Tea Weight Loss Pills with Green Coffee Bean Extract _ Belly Fat Burner, Metabolism Booster, & Appetite Suppressant for Women & Men _ 45% EGCG _ Vegan, Gluten-Free Supplement _ 60 Capsules.jpeg';
import testBooster from '../assets/Arazo Nutrition TestoBoost Test Booster Supplement - Potent & Natural Herbal Pills - Boost Muscle Growth - Tribulus, Horny Goat Weed, Hawthorn, Zinc, Minerals.jpeg';
import creatineGummies from '../assets/Creatine Monohydrate Gummies 4000mg.jpeg';

// Map of image filenames to their respective imports
const productImages = {
  // Weekly Top Picks
  "BlenderBottle Classic V2 Shaker Bottle Perfect for Protein Shakes and Pre Workout, 20-Ounce.jpeg": blenderBottle,
  "HydroJug Traveler.jpeg": hydroJug,
  "IRON °FLASK Sports Water Bottle - 40 Oz 3 Lids (Straw Lid), Leak Proof - Stainless Steel Gym Bottles for Men, Women & Kids - Double Walled, Insulated Thermos.jpeg": ironFlask,
  "AEOLOS Knee Sleeves (1 Pair)，7mm Compression Knee Braces for Heavy-Lifting,Squats,Gym and Other Sports (Large, Black).jpeg": kneeSleves,
  "Everlast Powerlock 2R Hook and Loop Training Boxing Gloves - 12 oz_ - Black.jpeg": boxingGloves,
  
  // Gym Attire (problematic files now use renamed versions)
  "Camisa Camiseta de Compressão Homem Aranha Manga Curta Rash Guard Academia.jpeg": compression,
  "Men's Gym T-Shirt - 2 _ xl.jpeg": mensTShirt,
  "Men's Running Shorts Gym Shorts Sports Basketball Gym Breathable Quick Dry Drawstring Elastic Waist Liner Plain Short Sport Casual Activewear Black Grey Micro-elastic.jpeg": mensRunningShorts,
  "Mens Nike Hyperadapt #gym #fitness #jackets….jpeg": nikeJacket,
  "Nike Seamed Active Long Sleeve Tee-black _ ModeSens.jpeg": nikeLongSleeve,
  "HeatGear OG Compression Women's Short Sleeve - Black LG.jpeg": womensCompression,
  "Workout Shorts for Women Scrunch Butt Lifting High.jpeg": womenShorts,
  "OLCHEE Womens Workout Sets 2 Piece - Seamless Acid Wash Yoga Outfits Shorts and Crop Top Matching Gym Athletic Clothing Set.jpeg": womenSet,
  
  // Gym Equipment
  "The Only Weights You Need To Stay Fit Without Leaving Your Home, According to Trainers.jpeg": homeWeights,
  "Adjustable Hand Strengthener with 5-100KG Resistance and LCD Counter - Pink.jpeg": handStrengthener,
  "Versatile Resistance Bands for Home Workout and Yoga - Grey.jpeg": resistanceBands,
  "Ab Roller Wheel Set.jpeg": abRoller,
  "fitove Push Up Board Set für Krafttraining und Muskelaufbau - Fitness Home Workout Trainer - mit Trainingsplan und Trainingsvideos - zum Training Zuhause ohne Trainingsgeräte für Männer und Frauen.jpeg": pushUpBoard,
  "Centr 2 Home Gym Functional Trainer, Steel.jpeg": homeGym,
  "Sierra Olympic Flat Bench - GYM READY EQUIPMENT.jpeg": olympicBench,
  "Sportsroyals Power Tower Dip Station Pull Up Bar for Home Gym Strength Training Workout Equipment, 450LBS_.jpeg": powerTower,
  
  // Supplements
  "Nutrabay Gold Tri Blend Whey Protein Powder - No Artificial Colour, No fillers, No Added Sugar.jpeg": wheyProtein,
  "XL Nutrition Instant BCAA 210g - 210g _ Orange Slush.jpeg": bcaa,
  "Evlution Creatine Monohydrate.jpeg": creatine,
  "MuscleTech Muscle Builder.jpeg": preWorkout,
  "Muscletech Mass Gainer Mass-Tech Extreme 2000, Muscle Builder Whey Protein Powder.jpeg": massGainer,
  // Use placeholder for problematic fat burner image
  "Green Tea Weight Loss Pills with Green Coffee Bean Extract _ Belly Fat Burner, Metabolism Booster, & Appetite Suppressant for Women & Men _ 45% EGCG _ Vegan, Gluten-Free Supplement _ 60 Capsules.jpeg": "https://via.placeholder.com/200x200?text=Fat+Burner",
  "Arazo Nutrition TestoBoost Test Booster Supplement - Potent & Natural Herbal Pills - Boost Muscle Growth - Tribulus, Horny Goat Weed, Hawthorn, Zinc, Minerals.jpeg": testBooster,
  "Creatine Monohydrate Gummies 4000mg.jpeg": creatineGummies,
};

/**
 * Get the correct image source for a product
 * @param {string} imageName - The filename of the image
 * @returns {string|object} The image URL or import
 */
export const getProductImage = (imageName) => {
  // Check if we have this image in our mapping
  if (productImages[imageName]) {
    return productImages[imageName];
  }
  
  // Return a placeholder if the image is not found
  console.warn(`Image not found: ${imageName}`);
  
  // Use a safe approach for the placeholder URL to avoid encoding issues
  return `https://via.placeholder.com/200x200?text=Product`;
};

export default productImages; 