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
  getMatches: (id) => api.get(`/jobs/${id}/matches`),
  create: (data) => api.post('/jobs', data),
  createWithVoice: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return api.post('/jobs/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  applyForJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  contactFreelancer: (jobId, freelancerId) => api.post(`/jobs/${jobId}/contact/${freelancerId}`),
  updateApplicationStatus: (jobId, applicationId, data) => api.put(`/jobs/${jobId}/applications/${applicationId}/status`, data)
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (userId) => api.get(`/chat/${userId}`),
  sendMessage: (data) => api.post('/chat/send', data),
  uploadFile: (formData) => api.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMessage: (id) => api.delete(`/chat/${id}`)
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data)
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateSkills: (skills) => api.put('/users/skills', { skills })
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

// AI API
export const aiAPI = {
  voiceToJob: (data) => api.post('/ai/voice-to-job', data)
};

export default api;
