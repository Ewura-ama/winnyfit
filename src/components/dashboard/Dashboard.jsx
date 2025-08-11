import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../context/AuthContext";
import "../../styles/Dashboard.css";
import logoutIcon from '../../assets/sign-out.png';
import defaultAvatar from '../../assets/John.jpg';
export default function Dashboard(){
    const navigate = useNavigate(); 
    React.useEffect(() => {
        // Check localStorage or context for authentication state
        const token = localStorage.getItem('token'); // Adjust based on your auth implementation
        if (!token) {
        navigate('/signin'); // Redirect to dashboard if token exists
        }
    }, [navigate]);

    const { user, loading, error } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching user data</div>;
    return (
        <div className="dashboard-container">
            <div className="sidemenu">
                <ul className="sidemenu-list">
                    <li className="sidemenu-item">
                        <a href="/dashboard" className="sidemenu-link">
                            <i className='bx bx-history'></i>
                            <div>
                                <span>History</span>
                                <p>View your session history</p>
                            </div>
                        </a>
                    </li>
                    <li className="sidemenu-item">
                        <a href="/profile" className="sidemenu-link">
                            <i className='bx bx-user'></i>
                            <div>
                                <span>Profile</span>
                                <p>View and edit your profile</p>
                            </div>
                        </a>
                    </li>
                    <li className="sidemenu-item">
                        <a href="/settings" className="sidemenu-link">
                            <i className='bx bx-cog'></i>
                            <div>
                                <span>Settings</span>
                                <p>Manage your account settings</p>
                            </div>
                        </a>
                    </li>
                    <li className="sidemenu-item">
                        <a href="/logout" className="sidemenu-link">
                            <i className='bx'><img src={logoutIcon} alt="Logout Icon" /></i>
                            <div>
                                <span>Logout</span>
                                <p>Sign out of your account</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="dashboard-content">
                <h1 className="greetings">
                    {(() => {
                        const currentHour = new Date().getHours();
                        let greeting;

                        if (currentHour < 12) {
                            greeting = 'Good morning';
                        } else if (currentHour < 18) {
                            greeting = 'Good afternoon';
                        } else {
                            greeting = 'Good evening';
                        }

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
                            {/* <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p> */}

                        </div>

                    </div>
                    <div className='profile-actions'>
                        <button className='edit-profile'>Edit Profile</button>
                        <button className='change-password'>Change Password</button>
                    </div>
                </div>
                <div className="bookings-container">
                    <h2>Your Bookings</h2>
                    <h6>Upcoming Sessions</h6>
                    {/* Map through user bookings and display them here */}
                    <div className="booking-list">
                        <div className="booking-item">
                            <div className="left">
                                <h5>Yoga Class - 50 min</h5>
                                <p>With <a href="#">Nuella Acquah</a>, KNUST gym</p>
                            </div>
                            <div className="right">
                                <p>5 September,2025</p>
                                <p>10:00 AM - 11:00 AM</p>
                            </div>
                        </div>
                        <button>View All Bookings</button>
                    </div>
                </div>
            </div>
        </div>
    )
}