import React, { useEffect } from "react";

const JitsiMeeting = ({ meetingId, username }) => {
  useEffect(() => {
    const domain = "meet.jit.si"; // if self-hosted, replace with your server domain
    const options = {
      roomName: meetingId,
      width: "100%",
      height: 600,
      parentNode: document.getElementById("jitsi-container"),
      userInfo: {
        displayName: username,
      },
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api.dispose();
  }, [meetingId, username]);

  return <div id="jitsi-container" style={{ height: "600px" }} />;
};

export default JitsiMeeting;
