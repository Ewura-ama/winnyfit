import React, { useState, useEffect } from 'react';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import jsPDF from "jspdf";
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
    const [instructors, setInstructors] = useState([]);
    const [showCalendarOptions, setShowCalendarOptions] = useState(false);

    const [bookingId, setBookingId] = useState(null); // To store booking ID after successful booking
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trainers/`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // if protected
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch trainers");
            }

            const data = await response.json();
            setInstructors(data);
            } catch (error) {
            console.error("Error fetching trainers:", error);
            }
        };

        fetchInstructors();
    }, []);

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

    const handleBookSession = async () => {
        const bookingData = {
            session_type: selectedSessionType,
            instructor: selectedInstructor?.name,
            date: selectedDate,
            time: selectedTime,
        };

        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem("token")}`, // assuming JWT
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error("Failed to create booking");
            }

            const result = await response.json();
            console.log("Booking confirmed:", result);
            setBookingId(result.booking_id); // Assuming the API returns the booking ID
            // move to confirmation step
            setCurrentStep(3);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to book session. Please try again.");
        }
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

    //Add to Calendar functionality
    const generateICS = (session) => {
        // Parse date string (YYYY-MM-DD)
        const [year, month, day] = session.date.split("-").map(Number);

        // Parse time string (like "11:00 AM" or "3:30 PM")
        let [time, modifier] = session.time.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier) {
            if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
            if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
        }

        const startDateTime = new Date(year, month - 1, day, hours, minutes);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hr

        const formatDate = (date) =>
            date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        return `
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//YourApp//EN
        BEGIN:VEVENT
        UID:${Date.now()}@yourapp.com
        DTSTAMP:${formatDate(new Date())}
        DTSTART:${formatDate(startDateTime)}
        DTEND:${formatDate(endDateTime)}
        SUMMARY:${session.session_type} session with ${session.instructor}
        DESCRIPTION:Workout session booked via YourApp
        LOCATION:${session.session_type === "virtual" ? "Online" : "Fitness Studio"}
        END:VEVENT
        END:VCALENDAR
        `.trim();
    };


    const generateGoogleCalendarLink = (session) => {
        // Parse date string (YYYY-MM-DD)
        const [year, month, day] = session.date.split("-").map(Number);

        // Parse time string (like "11:00 AM" or "3:30 PM")
        let [time, modifier] = session.time.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier) {
            if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
            if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
        }

        // Construct proper JS Date
        const startDateTime = new Date(year, month - 1, day, hours, minutes);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour

        const formatDate = (date) =>
            date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            session.session_type + " session with " + session.instructor
        )}&dates=${formatDate(startDateTime)}/${formatDate(endDateTime)}&details=${encodeURIComponent(
            "Workout session booked via WinnyFit. Please check-in with your trainer on time."
        )}&location=${encodeURIComponent(
            session.session_type === "virtual" ? "Online" : "Fitness Studio"
        )}`;
    };


    const downloadICS = (icsContent, filename = "booking.ics") => {
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    

    const generateReceipt = (session) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Booking Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Session ID: #${session.id || "N/A"}`, 20, 40);
    doc.text(`Session Type: ${session.session_type}`, 20, 50);
    doc.text(`Instructor: ${session.instructor}`, 20, 60);
    doc.text(`Date: ${session.date}`, 20, 70);
    doc.text(`Time: ${session.time}`, 20, 80);
    doc.text(
        `Location: ${session.session_type === "virtual" ? "Online" : "Fitness Studio"}`,
        20,
        90
    );

    doc.text("Thank you for booking with WinnyFit!", 20, 110);

    // Download as "receipt.pdf"
    doc.save("receipt.pdf");
    };



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
                            <div className="calendar-dropdown">
                                <button
                                    className="add-button"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    setShowCalendarOptions(!showCalendarOptions);
                                    }}
                                >
                                    Add to Calendar ▾
                                </button>

                                {showCalendarOptions && (
                                    <div className="calendar-options">
                                    {/* Google Calendar */}
                                    <a
                                        href={generateGoogleCalendarLink({
                                        session_type: selectedSessionType,
                                        instructor: selectedInstructor?.name,
                                        date: selectedDate,
                                        time: selectedTime,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Google Calendar
                                    </a>

                                    {/* ICS Download */}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                        e.preventDefault();
                                        const icsContent = generateICS({
                                            session_type: selectedSessionType,
                                            instructor: selectedInstructor?.name,
                                            date: selectedDate,
                                            time: selectedTime,
                                        });
                                        downloadICS(icsContent);
                                        setShowCalendarOptions(false);
                                        }}
                                    >
                                        Outlook / Apple (ICS)
                                    </a>
                                    </div>
                                )}
                            </div>


                        </div>
                        <div className="right">
                            <img src={profile_picture} alt="" />
                        </div>
                    </div>
                    <div className="bio-section">
                        
                        <div className="details">
                            <div className="avatar">
                                <img src={profile_picture} alt="" />
                            </div>
                            <div className="description">
                                <p className="name">{selectedInstructor.name}</p>
                                <p className="workplace">KNUST Wellness Center</p>
                                <p className="portfolio">{selectedInstructor.specialization.split("-").join(" ")}</p>
                            </div>
                            <a href={`https://wa.me/${selectedInstructor.phonenumber}`} target='_blank' className="message-btn">Message</a>
                        </div>
                        <div className="socials-section">
                            <p className="title">Follow {selectedInstructor.name.split(" ")[0]} on</p>
                            <div className="social-media">
                                <div className="detail">
                                    <p className="name">Instagram</p>
                                    <span className="handle">@{selectedInstructor.instagram.split("https://instagram.com/")}</span>
                                </div>
                                <a href={selectedInstructor.instagram} className="action-btn">View Profile</a>
                            </div>
                            <div className="social-media">
                                <div className="detail">
                                    <p className="name">Twitter(X)</p>
                                    <span className="handle">@{selectedInstructor.twitter.split("https://twitter.com/")}</span>
                                </div>
                                <a href={selectedInstructor.twitter} className="action-btn">View Profile</a>
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
                        <div className="btn calendar-btn">
                            <div className="calendar-dropdown">
                                <button
                                    className="add-button"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    setShowCalendarOptions(!showCalendarOptions);
                                    }}
                                >
                                    Add to Calendar ▾
                                </button>

                                {showCalendarOptions && (
                                    <div className="calendar-options">
                                    {/* Google Calendar */}
                                    <a
                                        href={generateGoogleCalendarLink({
                                        session_type: selectedSessionType,
                                        instructor: selectedInstructor?.name,
                                        date: selectedDate,
                                        time: selectedTime,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Google Calendar
                                    </a>

                                    {/* ICS Download */}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                        e.preventDefault();
                                        const icsContent = generateICS({
                                            session_type: selectedSessionType,
                                            instructor: selectedInstructor?.name,
                                            date: selectedDate,
                                            time: selectedTime,
                                        });
                                        downloadICS(icsContent);
                                        setShowCalendarOptions(false);
                                        }}
                                    >
                                        Outlook / Apple (ICS)
                                    </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            
                            className="btn download-receipt"
                            onClick={(e) => {
                                e.preventDefault();
                                generateReceipt({
                                id: bookingId,
                                session_type: selectedSessionType,
                                instructor: selectedInstructor?.name,
                                date: formatDateForDisplay(selectedDate),
                                time: selectedTime,
                                });
                            }}
                            >
                            Download Receipt
                            </button>

                    </div>
                    <div className="session-details">
                        <h3>Session Details</h3>
                        <div className="first-section">
                            <div className="session-id">
                                <small>Session ID</small>
                                <span>#{bookingId}</span>
                            </div>

                            <div className="session-type">
                                <small>Session Type</small>
                                <span>{selectedSessionType}</span>
                            </div>
                        </div>
                        <div className="second-section">
                            <div className="date">
                                <small>Date</small>
                                <span>{formatDateForDisplay(selectedDate)}</span>
                            </div>
                            <div className="time">
                                <small>Time</small>
                                <span>{selectedTime}</span>
                            </div>
                            <div className="location">
                                <small>Location</small>
                                <span>Fitness Studio</span>
                            </div>
                        </div>
                        <div className="trainer-details">
                            <div className="avatar">
                                <img src={profile_picture} alt="" />
                            </div>
                            <div className="details">
                                <h4>{selectedInstructor.name}</h4>
                                <p>Specializes in strength training, weight loss, and injury prevention. Certified personal trainer with 10 years of experience.</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}