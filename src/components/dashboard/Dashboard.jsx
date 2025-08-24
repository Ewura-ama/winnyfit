import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../context/AuthContext";
import SideMenu from './SideMenu';
import "../../styles/Dashboard.css";
import axios from "axios";

import defaultAvatar from '../../assets/avatar.jpg';

export default function Dashboard(){
    const navigate = useNavigate(); 
    const { user, loading, error } = useAuth();

    const [upcomingBookings, setUpcomingBookings] = React.useState([]);
    const [pastBookings, setPastBookings] = React.useState([]);
    const [userRole, setUserRole] = React.useState("");
    const [latestBooking, setLatestBooking] = React.useState(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (!token) navigate('/signin'); 
    }, [navigate]);

    React.useEffect(() => {
        async function fetchBookings() {
            try {
                const userType = localStorage.getItem("role"); // "trainer" or "customer"
                setUserRole(userType);

                let upcomingUrl = "";
                let pastUrl = "";

                if(userType === "trainer") {
                    upcomingUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/trainer/upcoming/`;
                    pastUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/trainer/past/`;
                } else {
                    upcomingUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/upcoming/`;
                    pastUrl = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/past/`;
                }

                const resUpcoming = await axios.get(upcomingUrl, {
                    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
                });
                const resPast = await axios.get(pastUrl, {
                    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
                });

                setUpcomingBookings(resUpcoming.data);
                setPastBookings(resPast.data);

                // Determine latest booking: prefer upcoming first, otherwise most recent past
                let latest = null;
                if(resUpcoming.data.length > 0){
                    latest = resUpcoming.data[0];
                } else if(resPast.data.length > 0){
                    latest = resPast.data[0];
                }
                setLatestBooking(latest);

            } catch(err){
                console.error("Error fetching bookings:", err);
            }
        }
        fetchBookings();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching user data</div>;

    return (
        <div className="dashboard-container">
            <SideMenu/>
            <div className="dashboard-content">
                <h1 className="greetings">
                    {(() => {
                        const currentHour = new Date().getHours();
                        let greeting;
                        if(currentHour < 12) greeting = 'Good morning';
                        else if(currentHour < 18) greeting = 'Good afternoon';
                        else greeting = 'Good evening';
                        return (<>{`${greeting}, `}<span>{`${user.firstname}!`}</span></>);
                    })()}
                </h1>

                <div className="profile-container">
                    <div className='profile-info'>
                        <div className='profile-image'>
                            <img src={user.profilePicture || defaultAvatar} alt="Profile" />
                        </div>
                        <div className='profile-details'>
                            <h2>{user.firstname} {user.lastname}</h2>
                            <p className='email'>{user.email}</p>
                            <p className='role'>{user.role}</p>
                        </div>
                    </div>
                    <div className='profile-actions'>
                        <button className='edit-profile' onClick={() => window.location.href = '/profile'}>View Profile</button>

                    </div>
                </div>

                <div className="bookings-container">
                    <h2>Your Latest Booking</h2>
                    {latestBooking ? (
                        <div className="booking-item">
                            <div className="left">
                                <h5>{latestBooking.title}</h5>
                                <p>With <a href="#">{latestBooking.trainer}</a></p>
                            </div>
                            <div className="right">
                                <p>{latestBooking.date}</p>
                                <p>Starting at {latestBooking.start_time}</p>
                            </div>
                            {latestBooking.can_join && (
                                userRole === "trainer" ? (
                                    <button onClick={() => handleTrainerJoin(booking)}>Join Now</button>
                                ) : latestBooking.session_started ? (
                                    <a href={latestBooking.meeting_url} target="_blank" rel="noopener noreferrer">
                                    <button>Join Now</button>
                                    </a>
                                ) : (
                                    <button disabled>Waiting for trainer...</button>
                                )
                                )}
                        </div>
                    ) : (
                        <p>No bookings available.</p>
                    )}
                    <button onClick={() => window.location.href = "/sessions"}>View All Bookings</button>
                </div>
            </div>
        </div>
    )
}
