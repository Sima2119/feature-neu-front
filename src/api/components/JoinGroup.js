import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinGroup } from '../api';

function JoinGroup() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log("Received token:", token); // Log the token to debug
        const join = async () => {
            try {
                const response = await joinGroup(token);
                if (response.status === 200) {
                    setMessage('Successfully joined the group!');
                    setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard after 2 seconds
                } else {
                    setMessage('Failed to join the group.');
                }
            } catch (err) {
                setMessage('Error joining the group.');
            }
        };
        join();
    }, [token, navigate]);

    return <div>{message}</div>;
}

export default JoinGroup;
