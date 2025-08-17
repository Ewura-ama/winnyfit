import { useState } from "react";
import JitsiMeeting from "./JitsiMeeting";

const BookingCard = ({ booking }) => {
  const [join, setJoin] = useState(false);

  return (
    <div className="p-4 border rounded-lg shadow">
      <p>Trainer: {booking.trainer}</p>
      <p>Customer: {booking.customer}</p>
      <p>Date: {booking.date}</p>

      {!join ? (
        <button 
          onClick={() => setJoin(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Join Meeting
        </button>
      ) : (
        <JitsiMeeting meetingId={booking.meeting_id} username={booking.user} />
      )}
    </div>
  );
};

export default BookingCard;
