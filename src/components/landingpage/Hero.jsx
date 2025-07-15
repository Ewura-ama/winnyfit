import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeroImage from '../../assets/hero-image.png';
import '../../styles/Hero.css';

function Hero() {
  // const { user } = useAuth();
  const navigate = useNavigate();
  
  // const handleBookClick = (e) => {
  //   if (!user) {
  //     e.preventDefault();
  //     navigate('/signin', { state: { from: '/book-session', message: 'Please sign in to book a session' } });
  //   }
  // };
  
  return (
    <section className="relative pt-20 overflow-hidden w-full min-h-screen">
      {/* Background with gradient */}
      <div 
        className="absolute top-0 left-0 w-full h-full" 
        style={{
          transform: 'skewY(-5deg)',
          transformOrigin: 'top right',
          background: 'linear-gradient(to bottom right,rgb(178, 184, 226), #F5F6FF)',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <img 
              src={HeroImage} 
              alt="Fitness in action" 
              className="w-full max-w-md mx-auto md:max-w-full h-auto object-contain"
            />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10 order-1 lg:order-2 lg:pl-12">
            <div className="animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 hover:transform hover:scale-105 transition-transform duration-300">
                SPEAK <br/>
                FITNESS
                <br />
                WITH YOUR
                <br/>
                <span className="text-red-600"> WORK</span>
              </h1>
              
              <Link 
                // to={user ? "/book-session" : "#"}
                to={"#"}
                // onClick={handleBookClick}
                className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 