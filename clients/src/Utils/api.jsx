import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});

// Response interceptor to catch 401 & 403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.clear();
      window.location.href = "/"; // Force redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
