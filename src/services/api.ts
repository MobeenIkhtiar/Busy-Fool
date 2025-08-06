import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getApiUrl } from './config';

// API Configuration
const API_BASE_URL = getApiUrl();

// Token storage key
const TOKEN_KEY = API_CONFIG.STORAGE_KEYS.AUTH_TOKEN;

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: API_CONFIG.DEFAULT_HEADERS,
        });

        // Request interceptor to add token
        this.api.interceptors.request.use(
            async (config) => {
                console.log('API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    baseURL: config.baseURL,
                    fullURL: `${config.baseURL}${config.url}`,
                    headers: config.headers,
                });

                const token = await this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for better error handling
        this.api.interceptors.response.use(
            (response) => {
                console.log('API Response:', {
                    status: response.status,
                    url: response.config.url,
                    data: response.data,
                });
                return response;
            },
            (error) => {
                console.error('API Error:', {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    url: error.config?.url,
                    data: error.response?.data,
                    isNetworkError: !error.response,
                });
                return Promise.reject(error);
            }
        );
    }

    // Token management methods
    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    }

    async clearTokens(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }

    // API methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get(url, config);
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.post(url, data, config);
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.put(url, data, config);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.delete(url, config);
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.patch(url, data, config);
    }
}

// Create and export a single instance
export const apiService = new ApiService();
export default apiService; 