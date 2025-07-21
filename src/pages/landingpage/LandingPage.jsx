import React from 'react';
import Hero from '../../components/landingpage/Hero';
import FitnessSection from '../../components/landingpage/FitnessSection';
import HealthGallery from '../../components/landingpage/HealthGallery';
import LatestClasses from '../../components/landingpage/LatestClasses';
import ShopSection from '../../components/landingpage/ShopSection';
import BMICalculator from '../../components/landingpage/BMICalculator';
import TopTrainers from '../../components/landingpage/TopTrainers';
import Testimonials from '../../components/landingpage/Testimonials';

import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function LandingPage(){
    return (
        <>
        <div style={{border: '1px solid red'}}>
            <Navbar/>
            <Hero />
            <FitnessSection/>
            <HealthGallery/>
            <LatestClasses/>
            <ShopSection/>
            <BMICalculator/>
            <TopTrainers/>
            <Testimonials/>
        </div>
        <Footer/>
        </>
    )
}