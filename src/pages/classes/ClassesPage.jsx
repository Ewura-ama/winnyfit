import React from 'react';

import Hero from '../../components/classes/Hero';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import Classes from '../../components/classes/Classes';

export default function ClassesPage(){
    return (
        <>
        <div style={{border: '1px solid red'}}>
            <Navbar/>
            <Hero />
            <Classes />
        </div>
        <Footer/>
        </>
    )
}