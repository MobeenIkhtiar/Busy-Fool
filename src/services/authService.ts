import apiService from './api';
import { API_CONFIG } from './config';
import { testNetworkConnectivity, getNetworkInfo } from './networkUtils';

// Types for authentication
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    fullName: string;
    email: string;
    role: string;
}

export interface ApiError {
    message: string;
    status: number;
}

class AuthService {
    // Login method
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

            // Console the response
            console.log('Login response:', response);

            // Store token
            await apiService.setToken(response.data.accessToken);

            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Signup method
    async signup(userData: SignupRequest): Promise<AuthResponse> {
        try {
            console.log('Signup request data:', userData);
            console.log('Signup endpoint:', API_CONFIG.ENDPOINTS.AUTH.SIGNUP);
            console.log('API base URL:', API_CONFIG.BASE_URL);

            const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, userData);

            // Console the response
            console.log('Signup response:', response);

            // Store token
            await apiService.setToken(response.data.accessToken);

            return response.data;
        } catch (error: any) {
            console.error('Signup error in authService:', error);
            throw this.handleError(error);
        }
    }

    // Logout method
    async logout(): Promise<void> {
        try {
            // Call logout endpoint if your API requires it
            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            // Console the response
            console.log('Logout response:', response);
        } catch (error) {
            // Even if logout API call fails, clear local tokens
            console.error('Logout API call failed:', error);
        } finally {
            // Always clear local tokens
            await apiService.clearTokens();
        }
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await apiService.getToken();
            // Console the token
            console.log('IsAuthenticated token:', token);
            return !!token;
        } catch (error) {
            return false;
        }
    }

    // Get current user info
    async getCurrentUser(): Promise<Omit<AuthResponse, 'accessToken'> | null> {
        try {
            const response = await apiService.get<Omit<AuthResponse, 'accessToken'>>(API_CONFIG.ENDPOINTS.AUTH.ME);
            // Console the response
            console.log('GetCurrentUser response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Change password
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
                currentPassword,
                newPassword,
            });
            // Console the response
            console.log('ChangePassword response:', response);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Forgot password
    async forgotPassword(email: string): Promise<void> {
        try {
            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            // Console the response
            console.log('ForgotPassword response:', response);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Reset password
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
                token,
                newPassword,
            });
            // Console the response
            console.log('ResetPassword response:', response);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }


    // Error handler
    private handleError(error: any): ApiError {
        console.log('AuthService handleError - error:', error);

        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message ||
                error.response.data?.error ||
                `Server error: ${error.response.status}`;
            return {
                message,
                status: error.response.status,
            };
        } else if (error.request) {
            // Request was made but no response received
            console.log('Network error details:', {
                code: error.code,
                message: error.message,
                isNetworkError: !error.response,
            });

            let message = 'No response from server. Please check your internet connection.';

            // Provide more specific error messages based on error code
            if (error.code === 'ECONNABORTED') {
                message = 'Request timeout. Please check your internet connection and try again.';
            } else if (error.code === 'ENOTFOUND') {
                message = 'Unable to reach the server. Please check your internet connection.';
            } else if (error.code === 'ECONNREFUSED') {
                message = 'Server is not responding. Please try again later.';
            }

            return {
                message,
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
export const authService = new AuthService();
export default authService; 