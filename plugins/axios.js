import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const token = localStorage.getItem('auth_token');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default apiClient;