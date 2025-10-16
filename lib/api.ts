import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://206.162.244.131:5007';

export const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Get token directly from localStorage to avoid hook usage in interceptor
        if (typeof window !== 'undefined') {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                try {
                    const authState = JSON.parse(authStorage);
                    const token = authState?.state?.accessToken;
                    if (token) {
                        config.headers.Authorization = token;
                    }
                } catch (error) {
                    console.error('Error parsing auth storage:', error);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    changePassword: async (passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyResetPasswordOtp: async (email: string, otp: string) => {
        const response = await api.post('/auth/verify-reset-password-otp', {
            email,
            otp
        });
        return response.data;
    },

    resetPassword: async (email: string, newPassword: string, confirmPassword: string) => {
        const response = await api.post('/auth/reset-password', {
            email,
            newPassword,
            confirmPassword
        });
        return response.data;
    },
};

// Users API calls
export const usersApi = {
    // Get all users
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Get single user by ID
    getUserById: async (id: string) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Delete user
    deleteUser: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Get all admins (super admin only)
    getAllAdmins: async () => {
        const response = await api.get('/users/get-all/admin');
        return response.data;
    },

    // Invite admin
    inviteAdmin: async (inviteData: {
        email: string;
        fullName: string;
        description: string;
    }) => {
        const response = await api.post('/users/invite-admin', inviteData);
        return response.data;
    },

    // Change user role
    changeUserRole: async (userId: string, role: string) => {
        const response = await api.patch(`/users/chenge/role/${userId}`, { role });
        return response.data;
    },

    // Get dashboard overview
    getDashboardOverview: async (year: string) => {
        const response = await api.get(`/users/dashboard/overview?year=${year}`);
        return response.data;
    },

    // Update user profile
    updateProfile: async (formData: FormData) => {
        const response = await api.patch('/users/update-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    }
};

// Revenue API calls
export const revenueApi = {
    // Get revenue stats
    getRevenueStats: async () => {
        const response = await api.get('/users/get-revenue/stats');
        return response.data;
    },

    // Get subscriptions with pagination
    getSubscriptions: async (page: number = 1, limit: number = 10) => {
        const response = await api.get(`/subscriptions?page=${page}&limit=${limit}`);
        return response.data;
    },
};