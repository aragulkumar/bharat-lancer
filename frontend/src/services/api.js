import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Jobs API
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  createWithVoice: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return api.post('/jobs/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMatches: (id) => api.get(`/jobs/${id}/matches`),
  apply: (id, data) => api.post(`/jobs/${id}/apply`, data)
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (userId) => api.get(`/chat/messages/${userId}`),
  sendMessage: (data) => api.post('/chat/send', data),
  uploadFile: (formData) => api.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data)
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default api;
