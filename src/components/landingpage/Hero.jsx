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
    <section className="relative w-full" style={{"height": "fit-content", marginTop: "15vh", marginBottom: "5rem"}}>
      {/* Background with gradient */}
      <div 
        className="absolute top-0 left-0 w-full h-full" 
        style={{
          transformOrigin: 'top right',
          background: 'linear-gradient(to bottom right,rgb(178, 184, 226), #F5F6FF)',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10" style={{height: "100%"}}>
        <div className="flex flex-row md:flex-row items-start justify-center" style={{"min-height": "85vh"}}>
          <div style={{width: "60%"}}>
            <img 
              src={HeroImage} 
              alt="Fitness in action" 
              
              style={{height: "650px", objectFit: "contain", width: "100%"}}
            />
          </div>
          <div style={{width: "40%", padding: "3rem 0", marginLeft: "-4rem"}}>
            <div className="animate-fadeIn">
              <h1 className="text-4xl italic md:text-6xl font-bold mb-10 hover:transform hover:scale-105 transition-transform duration-300">
                SPEAK <br/>
                FITNESS
                <br />
                WITH YOUR
                <br/>
                <span className="text-red-600"> WORK</span>
              </h1>
              
              <Link 
                // to={user ? "/book-session" : "#"}
                to={"/signin"}
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