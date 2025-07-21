import React, { useState, useEffect } from 'react';
import testimonial1 from '../../assets/testimonial-1.png';
import justice from '../../assets/Justice.jpg';
import priceless from '../../assets/Priceless.jpg';
import felix from '../../assets/Felix.jpg';
import ebenezer from '../../assets/Ebenezer.jpg';
import kodjoe from '../../assets/Kodjoe.jpg';
import caiq from '../../assets/Caiq.jpg';
import reagan from '../../assets/Reagan.jpg';

// Define testimonial data
const testimonialData = [
  {
    id: 1,
    name: "Winny",
    image: testimonial1,
    text: [
      "Joining CapFit has been a life-changing experience! The trainers are",
      "incredibly supportive, and the classes keep me motivated every day.",
      "I've lost 15 pounds, gained muscle, and feel more energized than ever.",
      "The community here is amazing, and I finally enjoy working out!"
    ]
  },
  {
    id: 2,
    name: "Justice",
    image: justice,
    text: [
      "The personal training sessions at CapFit are outstanding!",
      "My trainer understands exactly what I need and pushes me",
      "to achieve my fitness goals. The results have been incredible,",
      "and I'm stronger than I've ever been!"
    ]
  },
  {
    id: 3,
    name: "Priceless",
    image: priceless,
    text: [
      "The variety of classes available at CapFit keeps my routine",
      "exciting and challenging. From HIIT to yoga, there's something",
      "for everyone. The instructors are knowledgeable and motivating.",
      "Best fitness decision I've ever made!"
    ]
  },
  {
    id: 4,
    name: "Felix",
    image: felix,
    text: [
      "The atmosphere at CapFit is unmatched! Everyone is so friendly",
      "and supportive. The facilities are top-notch, and the trainers",
      "really know their stuff. I've seen amazing progress in just",
      "a few months. Highly recommend joining this fitness family!"
    ]
  },
  {
    id: 5,
    name: "Ebenezer",
    image: ebenezer,
    text: [
      "As a beginner, I was intimidated at first, but the staff at",
      "CapFit made me feel welcome from day one. The personalized",
      "attention and structured programs have helped me build",
      "confidence and achieve goals I never thought possible!"
    ]
  },
  {
    id: 6,
    name: "Kodjoe",
    image: kodjoe,
    text: [
      "The group fitness classes at CapFit are incredible!",
      "The energy in each session is contagious, and I've made",
      "amazing friends along the way. The instructors keep us",
      "motivated and the results speak for themselves!"
    ]
  },
  {
    id: 7,
    name: "Caiquo",
    image: caiq,
    text: [
      "CapFit's flexible scheduling and variety of programs",
      "make it perfect for my busy lifestyle. The trainers are",
      "professional and the equipment is top-of-the-line.",
      "Best gym experience I've ever had!"
    ]
  },
  {
    id: 8,
    name: "Reagan",
    image: reagan,
    text: [
      "After trying multiple gyms, CapFit stands out for its",
      "welcoming atmosphere and expert guidance. The nutrition",
      "advice combined with personalized workouts has transformed",
      "my approach to fitness completely!"
    ]
  }
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonialData[currentIndex];

  return (
    <section className="py-16 p-8">
      <div className="max-w-7xl mx-auto px-4 ml-20 -mt-20">
        <h2 className="text-3xl font-bold mb-12 italic">Testimonials</h2>
        <div 
          className="flex items-start gap-6 transition-opacity duration-500"
          key={currentTestimonial.id}
        >
          <img 
            src={currentTestimonial.image} 
            alt={currentTestimonial.name} 
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <div className="text-lg text-black mb-4 italic">
              {currentTestimonial.text.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <p className="text-xl font-bold text-right">
              -{currentTestimonial.name}
            </p>
          </div>
        </div>

        {/* Add navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-red-500 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 