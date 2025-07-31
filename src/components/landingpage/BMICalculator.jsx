import React, { useState } from 'react';
import fitnessBanner from '../../assets/fitness-banner2.jpg';
import fitnessPower from '../../assets/fitness-power.png';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState('');

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmiResult(bmi);
    }
  };

  return (
    <div className="overflow-hidden w-full">
      {/* Banner Section */}
      <section className="relative">
        <div className="w-full">
          <img 
            src={fitnessBanner}
            alt="Fitness Power" 
            className="w-full h-[200px] sm:h-auto object-cover"
          />
        </div>
      </section>

      {/* BMI Calculator Section */}
      <div className="relative">
        <div className="absolute inset-0 mt-28 bg-[#1a2b6d] h-[300px]" style={{
          clipPath: 'polygon(0 33%, 100% 0, 100% 100%, 0 100%)'
        }} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
          <div className="relative flex items-center">
            {/* Left Side - Image */}
            <div className="w-1/4 -mt-2 -ml-32">
              <img
                src={fitnessPower}
                alt="Woman exercising"
                className="w-full"
              />
            </div>

            {/* Right Side - Calculator */}
            <div className="lg:w-2/3 w-full lg:pl-16 pl-10">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-8 lg:-mt-20 text-black transform -rotate-3">
                  Know Your BMI – Track Your
                  <br />
                  Fitness Goals!
                </h2>
                <div className="text-black lg:mb-5 -mt-7 ml-2 font-bold transform -rotate-3 space-y-1">
                  Your Body Mass Index (BMI) is a simple way to assess whether
                  
                  you're in a healthy weight range. It helps you understand if
                
                  you're underweight, normal weight, overweight, or obese.
                </div>

                <div className="flex items-end gap-4 p-6 lg:flex-nowrap rounded-lg lg:mt-10">
                  <div className="flex-none lg:w-32 w-20">
                    <label className="block text-sm font-medium mb-2 text-white">Weight</label>
                    <input
                      type="number"
                      placeholder="Kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md bg-white text-right"
                    />
                  </div>
                  <div className="flex-none lg:w-32 w-20">
                    <label className="block text-sm font-medium mb-2 text-white">Height</label>
                    <input
                      type="number"
                      placeholder="Cm"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md bg-white text-right"
                    />
                  </div>
                  <button
                    onClick={calculateBMI}
                    className="bg-red-500 text-white lg:px-8 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Calculate
                  </button>
                  <div className="flex-none lg:w-32 w-24">
                    <input
                      type="text"
                      readOnly
                      value={bmiResult || 'Results'}
                      className="w-full px-4 py-2 border rounded-md bg-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
