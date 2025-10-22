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
    register: async (userData: { email: string }) => {
        const response = await api.post('/auth/register-user', { email: userData.email });
        return response.data;
    },

    verifyOtp: async (verifyData: {
        otpCode: string;
        data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            age: string;
            hobbies: string;
            profilePic: string;
            language: string;
        };
    }) => {
        const response = await api.post('/auth/verify-otp', verifyData);
        return response.data;
    },

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

// Plans API calls
export const plansApi = {
    // Get all plans
    getAllPlans: async () => {
        const response = await api.get('/plans');
        return response.data;
    },

    // Get single plan by ID
    getPlanById: async (id: string) => {
        const response = await api.get(`/plans/${id}`);
        return response.data
    }
}

export const subscriptionApi = {
    // Create subscription intent
    createSubscription: async (planId: string) => {
        const response = await api.post('/subscriptions/create-subscription', { planId });
        return response.data;
    },

    // Get user's current subscription
    getMySubscription: async () => {
        const response = await api.get('/subscriptions/my-subscription');
        return response.data;
    },

    // Get family members (for family plans)
    getFamilyMembers: async (subscriptionId: string) => {
        const response = await api.get(`/subscriptions/family-members/${subscriptionId}`);
        return response.data;
    },

    // Add family member
    addFamilyMember: async (subscriptionId: string, memberEmail: string) => {
        const response = await api.post('/subscriptions/add-member', {
            subscriptionId,
            memberEmail
        });
        return response.data;
    },

    // Remove family member
    removeFamilyMember: async (subscriptionId: string, memberId: string) => {
        const response = await api.post(`/subscriptions/remove-member/${memberId}`, {
            subscriptionId
        });
        return response.data;
    }
};


// Audio Recording API calls (For Test purpose)
export const audioApi = {
    // Upload audio file
    uploadAudio: async (formData: FormData) => {
        const response = await api.post('/upload-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    },

    // Get all audio files
    getAllAudio: async () => {
        const response = await api.get('/upload-audio');
        return response.data;
    },

    // Delete audio file by ID
    deleteAudio: async (id: string) => {
        const response = await api.delete(`/upload-audio/${id}`);
        return response.data;
    },
};