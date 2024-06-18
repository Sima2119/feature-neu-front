// frontend/src/api/index.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchProfile = () => API.get('/profile');
export const createUser = (newUser) => API.post('/auth/register', newUser);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const createGroup = (groupData) => API.post('/groups/create', groupData);
export const fetchGroups = () => API.get('/groups');
export const deleteGroup = (groupId) => API.delete(`/groups/${groupId}`);
export const inviteMember = (groupId, email) => API.post(`/groups/${groupId}/invite`, { email });
export const generateMeetLink = (groupId) => API.post(`/groups/${groupId}/generate-meet`);
export const joinGroup = (token) => API.post(`/groups/join/${token}`);
export const shareGroup = (groupId, email) => API.post(`/groups/${groupId}/share`, { email });
