import classPic1 from "../../assets/gallery-1.png"
import classPic2 from "../../assets/gallery-4.png"
import classPic3 from "../../assets/gallery-2.png"
import classPic4 from "../../assets/gallery-3.png"
import classPic5 from "../../assets/gallery-5.png"

import "../../styles/classes.css"
export default function Classes(){
    return (
        
        <div className="classes-section">
            <h2 className="font-bold text-red-600">
               Our Classes
            </h2>
            <div className="classes-container">
                <div className="class-card">
                    <div className="card-img">
                        <img src={classPic1} alt="" />
                    </div>
                    <div className="card-details">
                        <p><span className="class-title">Strength Training:</span> Focus on muscle building and toning with guided weightlifting and resistance exercises to enhance strength and endurance.</p>
                        <div>
                            <span>In-Person</span>
                            <span className="active-type">Virtual</span>
                            <a href="#" className="book-btn">Book Now</a>
                        </div>
                        
                    </div>
                </div>
                <div className="class-card">
                    <div className="card-img">
                        <img src={classPic2} alt="" />
                    </div>
                    <div className="card-details">
                        <p><span className="class-title">Combat Training:</span> A fusion of martial arts-inspired movements designed to build strength, improve reflexes, and enhance endurance through high-intensity kickboxing, punching, and conditioning exercises.</p>
                        <div>
                            <span className="active-type">In-Person</span>
                            <span>Virtual</span>
                            <a href="#" className="book-btn">Book Now</a>
                        </div>
                        
                    </div>
                </div>
                <div className="class-card">
                    <div className="card-img">
                        <img src={classPic3} alt="" />
                    </div>
                    <div className="card-details">
                        <p><span className="class-title">Yoga & Flexibility Training:</span>  Improve balance, flexibility, and mental clarity through guided yoga and stretching sessions.</p>
                        <div>
                            <span>In-Person</span>
                            <span className="active-type">Virtual</span>
                            <a href="#" className="book-btn">Book Now</a>
                        </div>
                        
                    </div>
                </div>
                <div className="class-card">
                    <div className="card-img">
                        <img src={classPic4} alt="" />
                    </div>
                    <div className="card-details">
                        <p><span className="class-title">HIIT (High-Intensity Interval Training):</span> Short, intense bursts of exercise followed by recovery periods to maximize fat burn and cardiovascular fitness</p>
                        <div>
                            <span className="active-type">In-Person</span>
                            <span>Virtual</span>
                            <a href="#" className="book-btn">Book Now</a>
                        </div>
                        
                    </div>
                </div>
                <div className="class-card">
                    <div className="card-img">
                        <img src={classPic5} alt="" />
                    </div>
                    <div className="card-details">
                        <p><span className="class-title">Aerobics</span> High-energy dance-based workouts to boost cardiovascular fitness, improve coordination, and burn calories in a fun and engaging way.</p>
                        <div>
                            <span className="active-type">In-Person</span>
                            <span>Virtual</span>
                            <a href="#" className="book-btn">Book Now</a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}