import apiService from './api';
import { API_CONFIG } from './config';

// Types for settings operations
export interface CategoryTarget {
    id: number;
    category: string;
    target_margin_percent: number;
}

export interface UserSettings {
    currency: string;
    [key: string]: any; // Allow other settings fields
}

export interface CreateCategoryTargetRequest {
    category: string;
    target_margin_percent: number;
}

export interface UpdateCategoryTargetRequest {
    target_margin_percent: number;
}

export interface CategoryTargetResponse {
    productsUpdated: number;
    [key: string]: any;
}

export interface ApiError {
    message: string;
    status: number;
}

class SettingsService {
    // Get all categories
    async getCategories(): Promise<string[]> {
        try {
            const response = await apiService.get<string[]>(API_CONFIG.ENDPOINTS.SETTINGS.CATEGORIES);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get all category targets
    async getCategoryTargets(): Promise<CategoryTarget[]> {
        try {
            const response = await apiService.get<CategoryTarget[]>(API_CONFIG.ENDPOINTS.SETTINGS.CATEGORY_TARGETS);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get user settings (including currency)
    async getSettings(): Promise<UserSettings> {
        try {
            const response = await apiService.get<UserSettings>(API_CONFIG.ENDPOINTS.SETTINGS.BASE);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Create a new category target
    async createCategoryTarget(data: CreateCategoryTargetRequest): Promise<CategoryTargetResponse> {
        try {
            const response = await apiService.post<CategoryTargetResponse>(
                API_CONFIG.ENDPOINTS.SETTINGS.CATEGORY_TARGETS,
                data
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update an existing category target
    async updateCategoryTarget(
        category: string,
        data: UpdateCategoryTargetRequest
    ): Promise<CategoryTargetResponse> {
        try {
            // URL encode the category parameter
            const encodedCategory = encodeURIComponent(category);
            const response = await apiService.patch<CategoryTargetResponse>(
                `${API_CONFIG.ENDPOINTS.SETTINGS.CATEGORY_TARGETS}/${encodedCategory}`,
                data
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Delete a category target
    async deleteCategoryTarget(category: string): Promise<CategoryTargetResponse> {
        try {
            // URL encode the category parameter
            const encodedCategory = encodeURIComponent(category);
            const response = await apiService.delete<CategoryTargetResponse>(
                `${API_CONFIG.ENDPOINTS.SETTINGS.CATEGORY_TARGETS}/${encodedCategory}`
            );
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
            // Request made but no response
            return {
                message: 'No response from server. Please check your connection.',
                status: 0,
            };
        } else {
            // Error in request setup
            return {
                message: error.message || 'An unexpected error occurred',
                status: 0,
            };
        }
    }
}

const settingsService = new SettingsService();
export default settingsService;

