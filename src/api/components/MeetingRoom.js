// frontend/src/components/MeetingRoom.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const domain = 'localhost:8443'; // Your Jitsi server domain

function MeetingRoom() {
    const { roomName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: document.querySelector('#jitsi-container'),
            interfaceConfigOverwrite: {
                // Custom interface configuration if needed
            },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        api.addListener('readyToClose', () => {
            // Handle the end call event and redirect to the dashboard
            navigate('/dashboard');
        });

        return () => api.dispose(); // Cleanup on unmount
    }, [roomName, navigate]);

    return (
        <div id="jitsi-container" style={{ width: '100%', height: '100vh' }}></div>
    );
}

export default MeetingRoom;
