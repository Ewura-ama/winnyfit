import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classImage from '../../assets/class-image.png';
import trainerIcon from '../../assets/trainer.png';
import strengthImg from '../../assets/strength.jpg';
import johnImg from '../../assets/John.jpg';
import yogaImg from '../../assets/yoga.jpg';
import sarahImg from '../../assets/Sarah.jpg';

const LatestClasses = () => {
  const classes = [
    {
      id: 1,
      title: "Body Shape Ladies",
      price: "120.00",
      instructor: "Matilda Hipsy",
      image: classImage,
      instructorImage: trainerIcon,
      rating: 5
    },
    {
      id: 2,
      title: "Strength Training",
      price: "150.00",
      instructor: "John Smith",
      image: strengthImg,
      instructorImage: johnImg,
      rating: 5
    },
    {
      id: 3,
      title: "Yoga Flow",
      price: "100.00",
      instructor: "Sarah Chen",
      image: yogaImg,
      instructorImage: sarahImg,
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate classes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === classes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change class every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const currentClass = classes[currentIndex];

  return (
    <section className="relative py-12 md:py-20 overflow-hidden w-full">
      <div className="container mx-auto px-4 md:pl-24">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">LATEST CLASSES</h2>
          <Link 
            to="/classes" 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            View All
          </Link>
        </div>
        
        <div className="relative">
          {/* Purple Background */}
          <div className="absolute inset-0 bg-[#8B8BF5] -right-24 w-[120%]" style={{
            clipPath: 'polygon(0 55%, 100% 0, 100% 100%, 0 100%)'
          }} />
          
          {/* Class Card */}
          <Link 
            to="/classes"
            className="w-full text-left group cursor-pointer transition-all duration-500 hover:scale-[1.02] animate-fadeIn block"
          >
            <div 
              className="relative flex gap-8 items-end pb-0 transition-all duration-500"
              key={currentClass.id}
            >
              {/* Image Section */}
              <div className="w-1/3 relative hover:transform hover:-translate-y-2 transition-transform duration-300">
                <div className="mt-8 relative animate-slideIn">
                  <img
                    src={currentClass.image}
                    alt={currentClass.title}
                    className="w-full h-[400px] rounded-xl shadow-lg object-cover transition-transform duration-300 hover:shadow-2xl"
                  />
                  {/* Enhanced Hover overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center" style={{background: "#0000005e"}}>
                    <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      View Class Details →
                    </span>
                  </div>
                </div>
                
                {/* Navigation Dots */}
                <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="flex gap-2 justify-center">
                    {classes.map((_, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCurrentIndex(index);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            e.preventDefault();
                            setCurrentIndex(index);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                          index === currentIndex 
                            ? 'bg-[#7C8FD8]' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to class ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="w-2/3 text-black py-12 self-end">
                <h3 className="text-5xl font-bold italic mb-4">{currentClass.title}</h3>
                <div className="text-5xl font-bold mb-4 flex items-start">
                  <span className="text-4xl font-medium mt-2">₵</span>
                  <h3 className="text-7xl font-bold mb-3">
                    {currentClass.price}
                  </h3>
                  <div className="text-xl font-bold ml-2 mt-3 flex flex-col">
                    <span>PER</span>
                    <span>MONTH</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 ml-2">
                    <img
                      src={currentClass.instructorImage}
                      alt={currentClass.instructor}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-black">{currentClass.instructor}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {"★".repeat(currentClass.rating)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestClasses;
