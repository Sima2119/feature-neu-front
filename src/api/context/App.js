import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MeetingRoom from './components/MeetingRoom';
import AuthForm from './components/AuthForm';
import JoinGroup from './components/JoinGroup';
import JitsiMeetComponent from './components/JitsiMeetComponent'; // Import the new component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meet/:roomName" element={<MeetingRoom />} />
                <Route path="/joingroup/:token" element={<JoinGroup />} />
                <Route path="/jitsi/:roomName" element={<JitsiMeetComponent />} /> {/* Add the new route */}
            </Routes>
        </Router>
    );
}

export default App;
