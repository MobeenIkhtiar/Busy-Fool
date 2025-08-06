import apiService from './api';
import { API_CONFIG } from './config';

// Types for user operations
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // Add any other user fields
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    // Add any other updatable fields
}

export interface ApiError {
    message: string;
    status: number;
}

class UserService {
    // Get user profile
    async getUserProfile(): Promise<User> {
        try {
            const response = await apiService.get<User>(API_CONFIG.ENDPOINTS.USER.PROFILE);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update user profile
    async updateUserProfile(userData: UpdateUserRequest): Promise<User> {
        try {
            const response = await apiService.put<User>(API_CONFIG.ENDPOINTS.USER.PROFILE, userData);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Upload profile picture
    async uploadProfilePicture(imageUri: string): Promise<{ imageUrl: string }> {
        try {
            const formData = new FormData();
            formData.append('profile_picture', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'profile_picture.jpg',
            } as any);

            const response = await apiService.post<{ imageUrl: string }>(API_CONFIG.ENDPOINTS.USER.PROFILE_PICTURE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Delete user account
    async deleteAccount(password: string): Promise<void> {
        try {
            await apiService.delete(API_CONFIG.ENDPOINTS.USER.ACCOUNT, {
                data: { password },
            });
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get user preferences
    async getUserPreferences(): Promise<any> {
        try {
            const response = await apiService.get(API_CONFIG.ENDPOINTS.USER.PREFERENCES);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update user preferences
    async updateUserPreferences(preferences: any): Promise<any> {
        try {
            const response = await apiService.put(API_CONFIG.ENDPOINTS.USER.PREFERENCES, preferences);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Error handler
    private handleError(error: any): ApiError {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || 'An error occurred',
                status: error.response.status,
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                message: 'No response from server. Please check your internet connection.',
                status: 0,
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'An unexpected error occurred',
                status: 0,
            };
        }
    }
}

// Create and export a single instance
export const userService = new UserService();
export default userService; 