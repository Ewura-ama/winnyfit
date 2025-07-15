import React from 'react';
import { Link } from 'react-router-dom';
import fitnessSection from '../../assets/fitness-section.png';

function FitnessSection() {
  return (
    <section className="relative py-10 overflow-visible bg-black text-white -mt-20">
      {/* Animated slanted background */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[150px] bg-white transition-all duration-500 hover:h-[160px]"
        style={{
          transformOrigin: 'bottom left',
          zIndex: 0,
          clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Animated Text Content */}
          <div className="w-full md:w-1/3 text-center md:text-left -mt-10 mb-6 md:mb-0 md:pr-0 md:pl-12 animate-slideIn">
            <p className="text-red-600 font-medium mb-3 hover:text-red-500 transition-colors">Welcome To CapFit</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 hover:transform hover:scale-105 transition-transform duration-300">
              FOCUS ON YOUR
              <br />
              FITNESS NOT
              <br />
              YOUR LOSS
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto md:mx-0 hover:text-gray-300 transition-colors">
              Whether you're a beginner or a seasoned athlete, our 
              state-of-the-art facilities, expert trainers, and dynamic 
              workout programs will help you achieve your goals.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-md text-lg font-medium 
                hover:bg-red-700 transition-all duration-300 
                hover:transform hover:scale-105 hover:shadow-lg
                active:transform active:scale-95"
            >
              Join Now
            </Link>
          </div>

          {/* Animated Image */}
          <div className="w-full lg:w-1/2 -mt-48 animate-slideIn hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="relative">
              <img 
                src={fitnessSection}
                alt="Fitness Training" 
                className="w-full h-auto transition-all duration-300 hover:shadow-2xl"
                style={{
                  maxHeight: '800px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FitnessSection; 