import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Booking from '../../components/booking/Booking';
import Navbar from '../../components/Navbar';

export default function BookingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role"); // "customer" or "trainer"
        if (role === "trainer") {
            // Redirect trainers away from booking page
            navigate("/dashboard"); // or any page you want trainers to go to
        }
    }, [navigate]);

    return (
        <>
            <Navbar/>
            <Booking/>
        </>
    );
}
