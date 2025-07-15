import React from 'react';
import trainer1 from '../../assets/trainer-1.png';
import trainer2 from '../../assets/trainer-2.png';
import trainer3 from '../../assets/trainer-3.png';
import trainer4 from '../../assets/trainer-4.png';

function TopTrainers() {
  const trainers = [
    {
      id: 1,
      name: 'Alexo',
      image: trainer2,
      rating: 5
    },
    {
      id: 2,
      name: 'Ray IBN',
      image: trainer1,
      rating: 5
    },
    {
      id: 3,
      name: 'Okordie',
      image: trainer4,
      rating: 5
    },
    {
      id: 4,
      name: 'Willy',
      image: trainer3,
      rating: 5
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-8">Top Trainers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="text-center">
              <div className="overflow-hidden rounded-3xl mb-4">
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-110 relative -mt-4"
                  style={{
                    objectPosition: '50% 20%'
                  }}
                />
              </div>
              <h3 className="font-bold mb-2">{trainer.name}</h3>
              <div className="flex justify-center text-yellow-400">
                {'★'.repeat(trainer.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopTrainers; 