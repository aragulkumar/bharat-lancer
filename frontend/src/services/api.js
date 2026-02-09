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
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  createVoice: (data) => api.post('/jobs/voice', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getMatches: (id) => api.get(`/jobs/${id}/matches`)
};

// Users API
export const usersAPI = {
  getSkillPassport: () => api.get('/users/skill-passport'),
  updateSkillPassport: () => api.post('/users/skill-passport/update'),
  extractSkills: (data) => api.post('/users/extract-skills', data)
};

// Chat API
export const chatAPI = {
  send: (data) => api.post('/chat/send', data),
  upload: (data) => api.post('/chat/upload', data),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (userId) => api.get(`/chat/${userId}`),
  deleteMessage: (id) => api.delete(`/chat/${id}`)
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments/create', data),
  verify: (data) => api.post('/payments/verify', data),
  getUserPayments: () => api.get('/payments/user'),
  getPayment: (id) => api.get(`/payments/${id}`),
  checkAccess: (jobId) => api.get(`/payments/access/${jobId}`)
};

export default api;
