import React, { useState } from 'react';
import trainer1 from '../../assets/trainer-1.png';
import trainer2 from '../../assets/trainer-2.png';
import trainer3 from '../../assets/trainer-3.png';
import trainer4 from '../../assets/trainer-4.png';
import trainer5 from '../../assets/trainer-5.jpg';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import x from '../../assets/x.png';
import whatsapp from '../../assets/whatsapp.png';
import PageWrapper from '../../components/PageWrapper';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Separate image sources
const trainerImages = {
  topTrainers: {
    trainer1: trainer1,
    trainer2: trainer2,
    trainer3: trainer4
  },
  serviceImages: {
    personalTraining: trainer2,
    groupFitness: trainer5,
    strengthConditioning: trainer1,
    weightLoss: trainer4,
    rehabilitation: trainer3
  },
  socialIcons: {
    facebook: facebook,
    instagram: instagram,
    X_logo: x,
    whatsapp: whatsapp
  }
};

const trainersData = [
  {
    id: 1,
    services: [
      {
        name: "Alexo",
        title: "Personal Training",
        description: "One-on-one sessions tailored to your goals.",
        image: trainerImages.serviceImages.personalTraining,
        rating: 5
      },
      {
        name: "Gladys",
        title: "Group Fitness Classes",
        description: "Fun and energetic workouts for all fitness levels.",
        image: trainerImages.serviceImages.groupFitness,
        rating: 5
      },
      {
        name: "Ray TBN",
        title: "Strength & Conditioning",
        description: "Build muscle and improve endurance.",
        image: trainerImages.serviceImages.strengthConditioning,
        rating: 5
      },
      {
        name: "Okordie",
        title: "Weight Loss Coaching",
        description: "Science-backed methods to help you shed excess weight.",
        image: trainerImages.serviceImages.weightLoss,
        rating: 5
      },
      {
        name: "Willy",
        title: "Rehabilitation Training",
        description: "Safe exercise programs for injury recovery.",
        image: trainerImages.serviceImages.rehabilitation,
        rating: 5
      }
    ]
  }
];

// Add this CSS animation at the top of your component or in your global CSS
const rotatingGradientStyle = {
  background: 'linear-gradient(129deg, #F15C0C, #F2262B, #F15C0C, #F2262B)',
  backgroundSize: '300% 300%',
  animation: 'gradientRotate 3s ease infinite'
};

const Trainers = () => {
  const [hoveredTrainer, setHoveredTrainer] = useState(null);

  const renderStars = (rating) => {
    return Array(rating).fill('⭐').map((star, i) => (
      <span key={i} className="text-yellow-400">★</span>
    ));
  };

  return (
    <PageWrapper>
      <Navbar/>
      <div className="animate-fadeIn">
        {/* Top Trainers Section */}
        <div className="bg-black text-white py-12 animate-slideInUp">
          <h1 className="text-center text-5xl font-bold mb-12 mt-12 hover:scale-105 transition-transform">
            TOP TRAINERS
          </h1>
          <div className="container mx-auto px-10">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
              {Object.values(trainerImages.topTrainers).map((image, name, index) => (
                <div 
                  key={index} 
                  className="rounded-3xl overflow-hidden p-[12px] w-full transform transition-all duration-500 hover:scale-105"
                  style={rotatingGradientStyle}
                >
                  <img 
                    src={image}
                    alt={`Top Trainer ${index + 1}`}
                    className="w-full h-96 object-cover rounded-2xl transition-transform duration-500 hover:scale-110"
                  />
                  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Trainers Section */}
        <div className="container mx-auto px-10 py-12 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-8 hover:text-red-500 transition-colors">
            Available Trainers
          </h2>
          
          <div className="space-y-6">
            {trainersData[0].services.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg p-6 flex items-center justify-between shadow-md
                  transform transition-all duration-300
                  ${hoveredTrainer === index ? 'scale-[1.02] shadow-xl' : ''}
                  hover:shadow-xl`}
                onMouseEnter={() => setHoveredTrainer(index)}
                onMouseLeave={() => setHoveredTrainer(null)}
              >
                <div className="flex items-center gap-6">
                  <img 
                    src={service.image}
                    alt={service.name}
                    className="w-32 h-32 rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div>
                    <h3 className="text-xl font-bold hover:text-blue-500 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                      Service
                    </span>
                    <p className="hover:text-black transition-colors">
                      <span className="font-bold">{service.title}:</span> {service.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="font-medium">Follow</span>
                      <div className="flex gap-2">
                        {Object.entries(trainerImages.socialIcons).map(([platform, icon]) => (
                          <a 
                            key={platform} 
                            href="#" 
                            className="transform transition-all duration-300 hover:scale-125"
                          >
                            <img  
                              src={icon}
                              alt={platform}
                              className="w-4 h-4"
                              
                            />
                          </a>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ratings:</span>
                        <div className="flex animate-pulse">{renderStars(service.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-8 py-3 rounded-md 
                  transition-all duration-300 transform
                  hover:bg-red-600 hover:scale-110 hover:shadow-lg
                  active:scale-95 font-bold">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </PageWrapper>
  );
};

export default Trainers; 