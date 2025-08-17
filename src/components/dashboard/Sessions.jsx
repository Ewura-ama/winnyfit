import { useEffect, useState } from "react";
import SideMenu from "./SideMenu";
import "../../styles/Sessions.css";
import axios from "axios";

export default function Sessions() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        async function fetchBookings() {
            try {
                // Get user type from localStorage or some auth context
                const userType = localStorage.getItem("role"); // e.g., "trainer" or "customer"
                setUserRole(userType);
                let upcomingUrl = "";
                let pastUrl = "";

                if (userType === "trainer") {
                    upcomingUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/trainer/upcoming/`;
                    pastUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/trainer/past/`;
                } else {
                    // default: customer
                    upcomingUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/upcoming/`;
                    pastUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/past/`;
                }

                // Fetch upcoming bookings
                const resUpcoming = await axios.get(upcomingUrl, {
                    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
                });
                setUpcomingBookings(resUpcoming.data);

                // Fetch past bookings
                const resPast = await axios.get(pastUrl, {
                    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
                });
                setPastBookings(resPast.data);

            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        }

        fetchBookings();
    }, []);


    const handleTrainerJoin = async (booking) => {
    try {
        // 1️⃣ Mark session as started
        await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${booking.id}/start/`,
        {},
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );

        // 2️⃣ Open Jitsi meeting
        window.open(booking.meeting_url, "_blank");

        // 3️⃣ Optionally update local state
        setUpcomingBookings(prev =>
        prev.map(b => b.id === booking.id ? { ...b, session_started: true } : b)
        );

        
    } catch (err) {
        console.error("Error starting session:", err);
    }
    };

    console.log(upcomingBookings);
    return (
        <div className="sessions-container">
            <SideMenu />
            <div className="sessions-content">
                <h1>Sessions</h1>
                <div className="bookings-container">
                    <h6>Upcoming Sessions</h6>
                    <div className="booking-list">
                        {upcomingBookings.map((booking) => (
                            <div className="booking-item" key={booking.id}>
                                <div className="left">
                                    <h5>{booking.title}</h5>
                                    <p>
                                        With <a href="#">{booking.trainer}</a>
                                    </p>
                                </div>
                                <div className="right">
                                    <p>{booking.date}</p>
                                    <p>Starting at {booking.start_time}</p>
                                </div>
                                {booking.can_join && (
                                userRole === "trainer" ? (
                                    <button onClick={() => handleTrainerJoin(booking)}>Join Now</button>
                                ) : booking.session_started ? (
                                    <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer">
                                    <button>Join Now</button>
                                    </a>
                                ) : (
                                    <button disabled>Waiting for trainer...</button>
                                )
                                )}


                            </div>
                        ))}
                    </div>
                    <h6>Past Sessions</h6>
                    <div className="booking-list">
                        {pastBookings.map((booking) => (
                            <div className="booking-item" key={booking.id}>
                                <div className="left">
                                    <h5>{booking.title}</h5>
                                    <p>
                                        With <a href="#">{booking.trainer}</a>
                                    </p>
                                </div>
                                <div className="right">
                                    <p>{booking.date}</p>
                                    <p>Started at {booking.start_time}</p>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
