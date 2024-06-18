import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CommonStyles.css';
import './AuthForm.css';
import LogoImage from './Logo2.png'; // Ensure the path to the image is correct
import GitLabLogo from './GitLab.png'; // Ensure the path to the image is correct
import InstagramIcon from './InstagramIcon.png'; // Add your Instagram icon image path here
import VideoConferenceImage from './vc.png'; // Add the correct path to your image
import { createUser, loginUser } from '../api'; // Ensure these are imported correctly

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = isLogin ? await loginUser(userData) : await createUser(userData);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username || userData.username);
                navigate('/dashboard');
            } else {
                throw new Error('Authentication failed, no token provided');
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = () => {
        window.location.href = process.env.REACT_APP_GOOGLE_AUTH_URL || 'http://localhost:5000/api/auth/google';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const moveX = (clientX / window.innerWidth) * 100;
            const moveY = (clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--mouse-x', `${moveX}%`);
            document.documentElement.style.setProperty('--mouse-y', `${moveY}%`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="container">
            <div className="sidebar">
                <div className="logo-container">
                    <div className="circle-image"></div>
                </div>
                <div className="sidebar-item">
                    <span className="text">Developers Team</span>
                    <span className="icon">▶</span>
                    <div className="sidebar-info">
                        Sima,<br/>
                        Lotfi,<br/>
                        Mojtaba<br/>
                    </div>
                </div>
                <div className="sidebar-item">
                    <span className="text">CONTACT</span>
                    <span className="icon">▶</span>
                    <div className="sidebar-info">
                        mojtaba.pourshiri@docc.techsta.com
                    </div>
                </div>
                <div className="sidebar-item">
                    <span className="text">ABOUT</span>
                    <span className="icon">▶</span>
                    <div className="sidebar-info">
                        This is the final project
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="button-container">
                    <motion.button
                        className="button auth-button-toggle"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Need to register?' : 'Already have an account?'}
                    </motion.button>
                    <motion.button
                        className="button auth-button-google"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleGoogleLogin}
                    >
                        Login with Google
                    </motion.button>
                </div>
                <div className="form-container">
                    <div className="header-with-logo">
                        <img src={LogoImage} alt="ConvoConnect Logo" className="header-logo" />
                        <motion.div className="auth-header" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
                            ConvoConnect
                        </motion.div>
                    </div>
                    <motion.div className="auth-subheader" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2 }}>
                        Overview
                    </motion.div>
                    <motion.div className="auth-text" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.4 }}>
                        ConvoConnect is an advanced video conferencing platform, designed as a comprehensive DevOps project. Leveraging cutting-edge technologies and best practices, it integrates Jitsi Meet for seamless real-time communication and Authentik for robust user authentication. Our platform is built on Amazon EKS, ensuring scalability and reliability for all your communication needs.
                    </motion.div>
                    <motion.div className="auth-subheader" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.6 }}>
                        Features
                    </motion.div>
                    <motion.div className="auth-text" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.8 }}>
                        <ul style={{ textAlign: 'left', color: 'black' }}>
                            <li><strong>Secure Authentication:</strong> Our platform uses Authentik to ensure secure and flexible user authentication.</li>
                            <li><strong>High-Quality Video Conferencing:</strong> Jitsi Meet is integrated to provide high-quality video and audio communication.</li>
                            <li><strong>Group Management:</strong> Create and manage user groups efficiently, facilitating organized and collaborative communications.</li>
                            <li><strong>Personalized Dashboard:</strong> Each user gets a personalized dashboard displaying their scheduled meetings and active groups, making it easy to stay organized.</li>
                        </ul>
                    </motion.div>
                    <motion.div className="auth-subheader" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2 }}>
                        How It Works
                    </motion.div>
                    <motion.div className="auth-text" initial={{ y: 100, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2.2 }}>
                        <ul style={{ textAlign: 'left', color: 'black' }}>
                            <li><strong>Register or Login:</strong> New users can register by clicking the "Need to register?" button. Existing users can log in using their credentials or Google account.</li>
                            <li><strong>Create Groups:</strong> After logging in, users can create groups for different projects or teams.</li>
                            <li><strong>Invite Members:</strong> Group owners can invite members to join their groups by sending an invitation link.</li>
                            <li><strong>Schedule and Join Meetings:</strong> Generate meet links for scheduled meetings and join directly from the dashboard.</li>
                        </ul>
                    </motion.div>
                </div>
                <div className="image-container">
                    <img src={VideoConferenceImage} alt="Video Conference" />
                </div>
                <div className="login-form-container">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label>
                            Username:
                            <input type="text" name="username" value={userData.username} onChange={handleChange} required />
                        </label>
                        {!isLogin && (
                            <label>
                                Email:
                                <input type="email" name="email" value={userData.email} onChange={handleChange} required />
                            </label>
                        )}
                        <label>
                            Password:
                            <input type="password" name="password" value={userData.password} onChange={handleChange} required />
                        </label>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" disabled={loading}>{isLogin ? 'Login' : 'Register'}</button>
                    </form>
                </div>
                <footer className="footer">
                    <div className="footer-links">
                        <a href="https://gitlab.com/mj26143118/convoconnect.git" target="_blank" rel="noopener noreferrer">
                            <img src={GitLabLogo} alt="GitLab Logo" />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <img src={InstagramIcon} alt="Instagram Logo" />
                        </a>
                    </div>
                    <div className="footer-text">
                        © 2024 ConvoConnect. All rights reserved. <br />
                        Sima, Lotfi, Mojtaba.
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AuthForm;
