import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchGroups, createGroup, deleteGroup, inviteMember, generateMeetLink, shareGroup } from '../api';
import bubbleStyles from './BubbleText.module.css'; // Correct import
import buttonStyles from './Button.module.css';
import './Dashboard.css';

function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [groupName, setGroupName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [action, setAction] = useState('invite');
    const [meetLinks, setMeetLinks] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const usernameFromParams = params.get('username');
        const userIdFromParams = params.get('userId');

        if (token) {
            localStorage.setItem('token', token);
            if (usernameFromParams) {
                localStorage.setItem('username', usernameFromParams);
            }
            if (userIdFromParams) {
                localStorage.setItem('userId', userIdFromParams);
            }
            navigate('/dashboard', { replace: true });
        }

        loadGroups();
    }, [location.search, navigate]);

    const loadGroups = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchGroups();
            if (response.status === 200) {
                setGroups(response.data.groups || []);
                const links = response.data.groups.reduce((acc, group) => {
                    if (group.meetLink) {
                        acc[group.id] = group.meetLink;
                    }
                    return acc;
                }, {});
                setMeetLinks(links);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            setError(`Failed to fetch groups: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (groupName) => {
        try {
            const response = await createGroup({ name: groupName });
            if (response.status === 201) {
                setGroupName('');
                loadGroups();
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            setError('Failed to create group');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            const response = await deleteGroup(groupId);
            if (response.status === 200) {
                loadGroups();
            } else {
                throw new Error('Failed to delete group');
            }
        } catch (err) {
            setError(`Failed to delete group: ${err.message}`);
        }
    };

    const handleInviteMember = async (groupId, email) => {
        try {
            const response = await inviteMember(groupId, email);
            if (response.status === 200) {
                alert('Invitation sent successfully');
                setEmail('');
                setSelectedGroupId(null);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            setError('Failed to send invitation');
        }
    };

    const handleShareGroup = async (groupId, email) => {
        try {
            const response = await shareGroup(groupId, email);
            if (response.status === 200) {
                alert('Group shared successfully');
                setEmail('');
                setSelectedGroupId(null);
                loadGroups();
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            setError('Failed to share group');
        }
    };

    const handleGenerateMeetLink = async (groupId) => {
        try {
            const response = await generateMeetLink(groupId);
            if (response.status === 200) {
                setMeetLinks(prevLinks => ({ ...prevLinks, [groupId]: response.data.meetLink }));
                loadGroups();
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            setError('Failed to generate meet link');
        }
    };

    const handleJoinMeeting = (meetLink) => {
        window.location.href = meetLink;
    };

    const handleAction = async (groupId, email, action) => {
        if (action === 'invite') {
            await handleInviteMember(groupId, email);
        } else if (action === 'share') {
            await handleShareGroup(groupId, email);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="bubble-text">
                {"Welcome to ".split("").map((char, idx) => (
                    <span className={bubbleStyles.hoverText} key={idx}>{char}</span>
                ))}
                <span style={{ textDecoration: 'underline', marginLeft: '5px', marginRight: '5px' }}>
                    {username || "User"}
                </span>
                {"'s Dashboard".split("").map((char, idx) => (
                    <span className={bubbleStyles.hoverText} key={idx + 100}>{char}</span>
                ))}
            </h1>

                <button className={buttonStyles.button} onClick={logout}>
                    <span>Logout</span>
                    <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                    <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                    <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                    <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                </button>
            </div>
            <div className="dashboard-content">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter new group name"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                    <button className={`${buttonStyles.button} create-group-button`} onClick={() => handleCreateGroup(groupName)}>
                        <span>Create Group</span>
                        <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                        <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                        <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                    </button>
                </div>
                <div className="dashboard-content-inner">
                    {loading ? (
                        <p>Loading groups...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : groups.length > 0 ? (
                        <ul>
                            {groups.map(group => (
                                <li key={group.id}>
                                    <strong>Group Name:</strong> {group.name}
                                    {group.isOwner ? '' : ` - ( Shared by:  ${group.ownerDetails ? group.ownerDetails.username : 'Unknown'} )`}
                                    <div className="group-actions-container">
                                        {group.isOwner ? (
                                            <>
                                                <button className={buttonStyles.button} onClick={() => handleDeleteGroup(group.id)}>
                                                    <span>Delete Group</span>
                                                    <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                                                    <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                                                    <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                                                    <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                                                </button>
                                                <button className={buttonStyles.button} onClick={() => handleGenerateMeetLink(group.id)}>
                                                    <span>Generate Meet Link</span>
                                                    <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                                                    <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                                                    <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                                                    <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                                                </button>
                                                {meetLinks[group.id] && (
                                                    <div>
                                                        <button className={buttonStyles.button} onClick={() => handleJoinMeeting(meetLinks[group.id])}>
                                                            <span>Go to Meet</span>
                                                            <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                                                            <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                                                            <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                                                            <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="invite-share-container">
                                                    <input
                                                        type="email"
                                                        placeholder="Enter email"
                                                        value={selectedGroupId === group.id ? email : ''}
                                                        onChange={e => {
                                                            setEmail(e.target.value);
                                                            setSelectedGroupId(group.id);
                                                        }}
                                                    />
                                                    <select
                                                        value={action}
                                                        onChange={e => setAction(e.target.value)}
                                                    >
                                                        <option value="invite">Invite Member</option>
                                                        <option value="share">Share Group</option>
                                                    </select>
                                                    <button className={buttonStyles.button} onClick={() => handleAction(group.id, email, action)}>
                                                        <span>Submit</span>
                                                        <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                                                        <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                                                        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                                                        <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            meetLinks[group.id] && (
                                                <button className={buttonStyles.button} onClick={() => handleJoinMeeting(meetLinks[group.id])}>
                                                    <span>Go to Meet</span>
                                                    <span className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-300 transition-all duration-100 group-hover:w-full" />
                                                    <span className="absolute right-0 top-0 h-0 w-[2px] bg-indigo-300 transition-all delay-100 duration-100 group-hover:h-full" />
                                                    <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-indigo-300 transition-all delay-200 duration-100 group-hover:w-full" />
                                                    <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-indigo-300 transition-all delay-300 duration-100 group-hover:h-full" />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no group yet! Click on Create Group</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
