import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.PUBLIC_API_BASE_URL || 'http://salat-notifier-api.test/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const token = localStorage.getItem('auth_token');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default apiClient;