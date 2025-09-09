// API service for portfolio backend integration

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Profile API
export const profileAPI = {
  get: () => apiClient.get('/profile'),
  update: (data) => apiClient.put('/profile', data),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiClient.get('/skills'),
  create: (skill) => apiClient.post('/skills', skill),
  delete: (id) => apiClient.delete(`/skills/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.featured !== undefined) {
      queryParams.append('featured', params.featured);
    }
    if (params.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/projects?${queryString}` : '/projects';
    
    return apiClient.get(url);
  },
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (project) => apiClient.post('/projects', project),
  update: (id, project) => apiClient.put(`/projects/${id}`, project),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

// Experience API
export const experienceAPI = {
  getAll: () => apiClient.get('/experience'),
  create: (experience) => apiClient.post('/experience', experience),
  update: (id, experience) => apiClient.put(`/experience/${id}`, experience),
  delete: (id) => apiClient.delete(`/experience/${id}`),
};

// Education API
export const educationAPI = {
  getAll: () => apiClient.get('/education'),
  create: (education) => apiClient.post('/education', education),
  update: (id, education) => apiClient.put(`/education/${id}`, education),
  delete: (id) => apiClient.delete(`/education/${id}`),
};

// Research Papers API
export const papersAPI = {
  getAll: () => apiClient.get('/papers'),
  create: (paper) => apiClient.post('/papers', paper),
  update: (id, paper) => apiClient.put(`/papers/${id}`, paper),
  delete: (id) => apiClient.delete(`/papers/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (contactData) => apiClient.post('/contact', contactData),
  getMessages: () => apiClient.get('/contact/messages'),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Health check
export const healthCheck = () => apiClient.get('/');

// Error handling utility
export const handleAPIError = (error, defaultMessage = 'Something went wrong') => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || defaultMessage;
    return message;
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || defaultMessage;
  }
};

// Export default API object
const api = {
  profile: profileAPI,
  skills: skillsAPI,
  projects: projectsAPI,
  experience: experienceAPI,
  education: educationAPI,
  papers: papersAPI,
  contact: contactAPI,
  upload: uploadAPI,
  healthCheck,
  handleAPIError,
};

export default api;