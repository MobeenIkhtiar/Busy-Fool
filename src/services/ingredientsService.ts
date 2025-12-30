import apiService from './api';
import { API_CONFIG } from './config';

// Types for ingredient operations
export interface Ingredient {
    id: string | number; // API returns UUID string
    name: string;
    unit: string;
    quantity: string | number; // API returns as string
    purchase_price: string | number; // API returns as string
    waste_percent: string | number; // API returns as string
    supplier: string;
    cost_per_unit: number | null;
    cost_per_ml: number | null;
    cost_per_gram: number | null;
    created_at?: string; // Optional timestamp
}

export interface UpdateIngredientRequest {
    name?: string;
    unit?: string;
    quantity?: number;
    purchase_price?: number;
    waste_percent?: number;
    supplier?: string;
}

export interface BulkDeleteRequest {
    ids: (string | number)[];
}

export interface BulkDeleteResponse {
    deleted: number;
}

export interface ApiError {
    message: string;
    status: number;
}

class IngredientsService {
    // Get all ingredients
    async getIngredients(): Promise<Ingredient[]> {
        try {
            const response = await apiService.get<Ingredient[]>(API_CONFIG.ENDPOINTS.INGREDIENTS.LIST);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Delete ingredient by ID
    async deleteIngredient(id: string | number): Promise<void> {
        try {
            await apiService.delete(`${API_CONFIG.ENDPOINTS.INGREDIENTS.LIST}/${id}`);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update ingredient by ID
    async updateIngredient(id: string | number, ingredientData: UpdateIngredientRequest): Promise<Ingredient> {
        try {
            const response = await apiService.patch<Ingredient>(
                `${API_CONFIG.ENDPOINTS.INGREDIENTS.LIST}/${id}`,
                ingredientData
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Bulk delete ingredients
    async bulkDeleteIngredients(ids: (string | number)[]): Promise<BulkDeleteResponse> {
        try {
            const response = await apiService.post<BulkDeleteResponse>(
                API_CONFIG.ENDPOINTS.INGREDIENTS.BULK_DELETE,
                { ids }
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
export const ingredientsService = new IngredientsService();
export default ingredientsService;

