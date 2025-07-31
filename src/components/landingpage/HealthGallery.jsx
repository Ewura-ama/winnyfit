import React, { useState, useEffect } from 'react';
import gallery1 from '../../assets/gallery-1.png';
import gallery2 from '../../assets/gallery-2.png';
import gallery3 from '../../assets/gallery-3.png';
import gallery4 from '../../assets/gallery-4.png';
import gallery5 from '../../assets/gallery-5.png';

function HealthGallery() {
  const classes = [
    { id: 1, name: 'STRENGTH', image: gallery1, alt: 'Man lifting dumbbells' },
    { id: 2, name: 'YOGA', image: gallery2, alt: 'Woman doing yoga' },
    { id: 3, name: 'HIIT', image: gallery3, alt: 'Man doing HIIT workout' },
    { id: 4, name: 'COMBAT', image: gallery4, alt: 'Woman boxing' },
    { id: 5, name: 'AEROBICS', image: gallery5, alt: 'Group doing aerobics' },
  ];

  const quotes = [
    {
      title: "Unlock Your Strength, Transform Your Life!",
      text: ["Join us today and take the first step", "toward a healthier, stronger you!"]
    },
    {
      title: "Your Fitness Journey Starts Here!",
      text: ["Discover your potential and achieve", "your fitness goals with us!"]
    },
    {
      title: "Push Your Limits, Find Your Power!",
      text: ["Every workout brings you closer to", "becoming your best self!"]
    },
    {
      title: "Strength Doesn't Come By Chance!",
      text: ["It comes by training, dedication,", "and unwavering determination!"]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % quotes.length;
          setCurrentQuote(quotes[nextIndex]);
          setIsTransitioning(false);
          return nextIndex;
        });
      }, 1000); // Transition time
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div className="max-w-xl">
              <p className="text-red-600 font-medium mb-2">Our Classes</p>
              <h2 className="text-3xl italic md:text-4xl lg:text-5xl font-bold">
                HEALTH IS A
                <br />
                PRIORITY HERE
              </h2>
            </div>
            <div className="text-right max-w-xl self-end pt-10">
              <h3 
                className={`text-xl font-bold mb-3 transition-opacity duration-1000 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                "{currentQuote.title}"
              </h3>
              <div 
                className={`text-left text-gray-600 transition-opacity duration-1000 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <p className="mb-1">{currentQuote.text[0]}</p>
                <p>{currentQuote.text[1]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="flex justify-end mb-4">
          <a href="#" className="text-blue-500 hover:text-blue-600">
            View All
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {classes.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={item.image} 
                  alt={item.alt}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h4 className="text-center font-bold">
                {item.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HealthGallery; 