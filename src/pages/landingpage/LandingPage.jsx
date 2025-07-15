import React from 'react';
import Hero from '../../components/landingpage/Hero';
import FitnessSection from '../../components/landingpage/FitnessSection';
import HealthGallery from '../../components/landingpage/HealthGallery';
import LatestClasses from '../../components/landingpage/LatestClasses';
import ShopSection from '../../components/landingpage/ShopSection';
import BMICalculator from '../../components/landingpage/BMICalculator';
import TopTrainers from '../../components/landingpage/TopTrainers';
import Testimonials from '../../components/landingpage/Testimonials';
import PageWrapper from '../../components/landingpage/PageWrapper';
import Footer from '../../components/Footer';

export default function LandingPage(){
    return (
        <>
        <PageWrapper>
            <Hero />
            <FitnessSection/>
            <HealthGallery/>
            <LatestClasses/>
            <ShopSection/>
            <BMICalculator/>
            <TopTrainers/>
            <Testimonials/>
        </PageWrapper>
        <Footer/>
        </>
    )
}