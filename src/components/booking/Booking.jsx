import React, { useState, useEffect } from 'react';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import Ellipse13 from '../../assets/Ellipse13.png';
import Ellipse14 from '../../assets/Ellipse14.png';
import Ellipse15 from '../../assets/Ellipse15.png';
import '../../styles/Booking.css';
import profile_picture from '../../assets/trainer-1.png'

export default function Booking() {
        // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    const instructorImages = [Ellipse13, Ellipse14, Ellipse15];
    const [selectedSessionType, setSelectedSessionType] = useState('virtual');
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [currentStep, setCurrentStep] = useState(1);

    const instructors = [
        {
            name: "Nasif Yusuf",
            durations: ["30 minutes", "120 minutes", "60 minutes"],
            availableTimes: ["9:00 AM", "9:30 AM", "10:00 AM"]
        },
        {
            name: "Vincent Akyea",
            durations: ["45 minutes", "60 minutes"],
            availableTimes: ["9:00 AM", "7:00 AM", "9:00 AM", "9:00 AM"]
        },
        {
            name: "Ama Agyei",
            durations: ["60 minutes", "90 minutes"],
            availableTimes: ["9:00 AM", "9:00 AM"]
        }
    ];

    const handleSessionTypeSelect = (type) => {
        setSelectedSessionType(type);
    };

    const handleInstructorSelect = (instructor) => {
        setSelectedInstructor(instructor);
        // setCurrentStep(2);
        
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleBookSession = () => {
        // Handle booking logic here
        console.log("Booking confirmed:", {
            sessionType: selectedSessionType,
            instructor: selectedInstructor,
            date: selectedDate,
            time: selectedTime
        });
    setCurrentStep(3);
    };

    // Format date for display (convert YYYY-MM-DD to readable format)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };




    const calendar = useCalendarApp({
        views: [createViewMonthGrid()],
        selectedDate: selectedDate || getTodayDate(), // Set initial selected date
        events: [
            {
                id: 1,
                title: 'Gym Appointment',
                start: '2025-08-20 00:00',
                end: '2025-10-25 15:00',
                description: 'Leg workout appointment at 12:00PM'
            }
        ],
        plugins: [createEventModalPlugin()],
        callbacks: {
            // Correct callback name for clicking a date in month grid
            onClickDate: (date) => {
                
                setSelectedDate(date);
                // Reset selected time when date changes
                setSelectedTime(null);
            },
            // Optional: Called when selected date is updated programmatically
            onSelectedDateUpdate: (date) => {
                
                setSelectedDate(date);
            }
        }
    });





    return (
        <div className="in-person-container">
            <h1>Book a session</h1>
            
            <div className="session-progress">
                <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Session Type</span>
                </div>
                <div className={`progress-step ${selectedTime ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Select Time</span>
                </div>
                <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Confirm</span>
                </div>
                <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                    <span className="step-number">4</span>
                    <span className="step-label">Success</span>
                </div>
            </div>

            {currentStep === 1 && (
                <div className="session-type-selection">
                    <h2>Choose your session type</h2>
                    
                    <div className="session-option-container">
                        <div 
                        className={`session-option ${selectedSessionType === 'in-person' ? 'selected' : ''}`}
                        onClick={() => handleSessionTypeSelect('in-person')}
                    >
                        <input 
                            type="radio" 
                            id="in-person" 
                            name="session-type" 
                            checked={selectedSessionType === 'in-person'}
                            onChange={() => {}}
                        />
                        <label htmlFor="in-person">
                            <h3>In-person Session</h3>
                            <p>Face to face gym session with an instructor</p>
                        </label>
                        {selectedSessionType === 'in-person' && <span className="selected-badge">Selected</span>}
                        </div>       
                        <div 
                            className={`session-option ${selectedSessionType === 'virtual' ? 'selected' : ''}`}
                            onClick={() => handleSessionTypeSelect('virtual')}
                        >
                            <input 
                                type="radio" 
                                id="virtual" 
                                name="session-type" 
                                checked={selectedSessionType === 'virtual'}
                                onChange={() => {}}
                            />
                            <label htmlFor="virtual">
                                <h3>Virtual Session</h3>
                                <p>Convenient workout session with an instructor</p>
                            </label>
                            {selectedSessionType === 'virtual' && <span className="selected-badge">Selected</span>}
                        </div>
                    </div>

                    <div className="row-selection-container">
                        <div className="instructor-selection">
                            <h2>Choose instructor</h2>
                            <div className="instructor-list">
                                {instructors.map((instructor, index) => (
                                    <div 
                                        key={index} 
                                        className={`instructor-card ${selectedInstructor?.name === instructor.name ? 'selected' : ''}`}
                                        onClick={() => handleInstructorSelect(instructor)}
                                    >
                                        <img src={instructorImages[index % instructorImages.length]} alt="Instructor" className="instructor-image" />
                                        <div className="instructor-info">
                                            <h4>{instructor.name}</h4>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {selectedInstructor && (
                        <div className="time-selection">
                            
                            <div className="date-selector">
                                <h2>Select Date</h2>
                                {calendar && <ScheduleXCalendar calendarApp={calendar}/>}
                            </div>
                            
                            <div className="time-slots">
                                <h2>Select Time</h2>
                                <div className="slots">
                                    {selectedInstructor.availableTimes.map((time, index) => (
                                    <div 
                                        key={index} 
                                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </div>
                                ))}
                                </div>
                            </div>
                            
                           
                        </div>
                        
                        )}
                         
                    </div>
                    <button 
                        className="book-button"
                        onClick={handleBookSession}
                        disabled={!selectedTime}
                    >
                        Book Session
                    </button>
                </div>
            )}

            {/* {currentStep === 2 && selectedInstructor && (
                
            )} */}

            {currentStep === 3 && (
                <div className="confirmation-screen">
                    <h2>Confirm Session</h2>
                    <span className="date">{formatDateForDisplay(selectedDate)}, {selectedTime}</span>
                    <div className="booking-details">
                        <div className="left">
                            <p className="session-type">{selectedSessionType} Session</p>
                            <p><strong>Gym Session with <span>{selectedInstructor.name}</span></strong></p>
                            <p className="extra-p">Get ready to sweat and tone in this high-energy workout</p>
                            <a href="#" className="add-button">Add to Calendar</a>
                        </div>
                        <div className="right">
                            <img src={profile_picture} alt="" />
                        </div>
                    </div>
                    <div className="bio-section">
                        
                        <div className="details">
                            <div className="avatar">
                                <img src={Ellipse13} alt="" />
                            </div>
                            <div className="description">
                                <p className="name">Akwasi Marfo</p>
                                <p className="workplace">KNUST Wellness Center</p>
                                <p className="portfolio">Personal Trainer</p>
                            </div>
                            <a href="#" className="message-btn">Message</a>
                        </div>
                        <div className="socials-section">
                            <p className="title">Follow Akwasi on</p>
                            <div className="social-media">
                                <div className="detail">
                                    <p className="name">Instagram</p>
                                    <span className="handle">@marfojunior</span>
                                </div>
                                <a href="#" className="action-btn">View Profile</a>
                            </div>
                            <div className="social-media">
                                <div className="detail">
                                    <p className="name">TikTok</p>
                                    <span className="handle">@marfojunior</span>
                                </div>
                                <a href="#" className="action-btn">View Profile</a>
                            </div>
                        </div>
                    </div>
                    <button className="done-button" onClick={() => setCurrentStep(4)}>
                        Confirm
                    </button>
                </div>
            )}

            {currentStep === 4 && (
                <div className="success-screen">
                    <h2>Session Confirmed</h2>
                    <p>Your session has been booked and confirmed. Please check-in with your trainer on time.</p>
                    <div className="action-btns">
                        <a href="#" className="calendar-btn">Add to Calendar</a>
                        <a href="#" className="download-receipt">Download Receipt</a>
                    </div>
                    <div className="session-details">
                        <h3>Session Details</h3>
                        <div className="first-section">
                            <div className="session-id">
                                <small>Session ID</small>
                                <span>#123456</span>
                            </div>

                            <div className="session-type">
                                <small>Session Type</small>
                                <span>In-Person</span>
                            </div>
                        </div>
                        <div className="second-section">
                            <div className="date">
                                <small>Date</small>
                                <span>Tuesday, July 7, 2023</span>
                            </div>
                            <div className="time">
                                <small>Time</small>
                                <span>11:00 AM</span>
                            </div>
                            <div className="location">
                                <small>Location</small>
                                <span>Fitness Studio</span>
                            </div>
                        </div>
                        <div className="trainer-details">
                            <div className="avatar">
                                <img src={Ellipse13} alt="" />
                            </div>
                            <div className="details">
                                <h4>Samantha Jones</h4>
                                <p>Specializes in strength training, weight loss, and injury prevention. Certified personal trainer with 10 years of experience.</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}