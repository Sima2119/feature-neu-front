import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function JitsiMeetComponent() {
    const { roomName } = useParams();
    const jitsiContainerRef = useRef(null);
    const jitsiApiRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadJitsiScript = () => {
            if (!window.JitsiMeetExternalAPI) {
                const script = document.createElement('script');
                script.src = 'https://localhost:8443/external_api.js';
                script.async = true;
                script.onload = initJitsi;
                document.body.appendChild(script);
            } else {
                initJitsi();
            }
        };

        const initJitsi = () => {
            if (!jitsiApiRef.current) {
                jitsiApiRef.current = new window.JitsiMeetExternalAPI('localhost:8443', {
                    roomName,
                    parentNode: jitsiContainerRef.current,
                    width: '100%',
                    height: 700,
                });

                jitsiApiRef.current.addEventListener('readyToClose', () => {
                    navigate('/dashboard');
                });
            }
        };

        loadJitsiScript();

        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
                jitsiApiRef.current = null;
            }
        };
    }, [roomName, navigate]);

    return <div ref={jitsiContainerRef} style={{ height: '100vh' }} />;
}

export default JitsiMeetComponent;
