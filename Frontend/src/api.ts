import axios from 'axios'

// Get the backend URL from environment or use default
const API_URL =
  import.meta.env.VITE_API_URL || "https://todo-mnagementapp.onrender.com";

// create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Send cookies with requests (for sessions)
});

// ============ AUTH ENDPOINTS =============

export const authAPI = {
    signup: (email: string, password: string, name: string) =>
     api.post('/api/auth/signup', { email, password, name }),

  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  logout: () =>
    api.post('/api/auth/logout'),

  getProfile: () =>
    api.get('/api/auth/profile'),
};

// ============ TASK ENDPOINTS ============

export const taskAPI = {
  createTask: (title: string, description?: string, priority?: string, dueDate?: string) =>
    api.post('/api/tasks', { title, description, priority, dueDate }),

  getTasks: (status?: string) => {
    const params = status ? { status } : {};
    return api.get('/api/tasks', { params });
  },

  getTask: (id: string) =>
    api.get(`/api/tasks/${id}`),

  updateTask: (id: string, data: any) =>
    api.put(`/api/tasks/${id}`, data),

  deleteTask: (id: string) =>
    api.delete(`/api/tasks/${id}`),
};

export default api;