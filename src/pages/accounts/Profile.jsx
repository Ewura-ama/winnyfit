import React from 'react';
import "../../styles/Profile.css";
import frame1 from '../..assets/frame1.png';
import frame2 from '../..assets/frame2.png';
import frame3 from '../..assets/frame3.png';
import frame4 from '../..assets/frame4.png';
import frame5 from '../..assets/frame5.png';
import frame6 from '../..assets/frame6.png';
import frame7 from '../..assets/frame7.png';
import frame8 from '../..assets/frame8.png';
import frame9 from '../..assets/frame9.png';
import depth4 from '../..assets/depth4.png';

export default function Profile() {
  const profileItems = [
    { id: 1, title: 'Sessions Booked', description: 'See your upcoming sessions and past workouts' },
    { id: 2, title: 'History', description: 'View your session history' },
    { id: 3, title: 'Edit Profile' },
    { id: 4, title: 'Upcoming Sessions' },
    { id: 5, title: 'Removal Date' },
    { id: 6, title: 'Comments', subtitle: 'Membership Status' },
    { id: 7, title: 'Deadly 5, Frame 3' },
    { id: 8, title: 'Correct Support' },
    { id: 9, title: 'Payment Methods' },
    { id: 10, title: 'Refer a Friend' },
    { id: 11, title: 'Support' },
    { id: 12, title: 'Send Feedback' },
    { id: 13, title: 'Privacy Policy' },
    { id: 14, title: 'Terms of Service' },
  ];

  const handleItemClick = (itemId) => {
    // Implement navigation or specific actions for each item here
    console.log(`Item ${itemId} clicked`);
    // Example: navigate(`/profile/${itemId}`);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      
      <div className="profile-items">
        {profileItems.map((item) => (
          <div 
            key={item.id} 
            className="profile-item"
            onClick={() => handleItemClick(item.id)}
          >
            <div className="item-number">{item.id}</div>
            <div className="item-content">
              <h2 className="item-title">{item.title}</h2>
              {item.description && <p className="item-description">{item.description}</p>}
              {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}