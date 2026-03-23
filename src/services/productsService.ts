import apiService from './api';
import { API_CONFIG } from './config';
import { AxiosResponse } from 'axios';

// Types for product operations
export interface ProductIngredient {
    ingredientId: string | number;
    quantity: number;
    unit: string;
    is_optional?: boolean;
}

export interface CreateProductRequest {
    name: string;
    category: string;
    sell_price: number;
    ingredients: ProductIngredient[];
    image?: any; // File object for FormData
}

export interface UpdateProductRequest {
    name?: string;
    category?: string;
    sell_price?: number;
    ingredients?: ProductIngredient[];
    image?: any; // File object for FormData
}

export interface Product {
    id: string | number;
    name: string;
    category: string;
    sell_price: number | string;
    total_cost: number | string;
    margin_amount: number | string;
    margin_percent: number | string;
    status: 'profitable' | 'breaking even' | 'losing money';
    image?: string;
    ingredients?: Array<{
        id?: string | number;
        ingredient?: {
            id: string | number;
            name: string;
            unit?: string;
        };
        name?: string;
        unit?: string;
        quantity?: number;
        selectedQuantity?: number;
        selectedUnit?: string;
        is_optional?: boolean;
        line_cost?: number | string;
    }>;
    quantity_sold?: number | string;
    numberOfSales?: number; // For UI compatibility
    created_at?: string;
    quickWin?: string;
    trending?: 'hot' | 'rising' | null;
    avgRating?: number;
}

export interface WhatIfRequest {
    productIds: (string | number)[];
    priceAdjustment: number;
}

export interface WhatIfResponse {
    id: string | number;
    sell_price: number;
    total_cost: number;
    margin_amount: number;
    margin_percent: number;
    status: 'profitable' | 'breaking even' | 'losing money';
}

export interface MilkSwapRequest {
    productId: string | number;
    originalIngredientId: string | number;
    newIngredientId: string | number;
    upcharge: number;
}

export interface MilkSwapResponse {
    originalMargin: number;
    newMargin: number;
    upchargeCovered: boolean;
}

export interface QuickActionRequest {
    new_sell_price: number;
}

export interface StockItem {
    id: string | number;
    ingredient?: {
        id: string | number;
        name: string;
        unit?: string;
    };
    remaining_quantity: number | string;
    unit: string;
}

export interface ApiError {
    message: string;
    status: number;
}

class ProductsService {
    // Get all products
    async getProducts(): Promise<Product[]> {
        try {
            const response = await apiService.get<Product[]>(API_CONFIG.ENDPOINTS.PRODUCTS.LIST);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Create a new product
    async createProduct(productData: CreateProductRequest, imageUri?: string): Promise<Product> {
        try {
            let response: AxiosResponse<Product>;
            
            if (imageUri) {
                // Use FormData for multipart/form-data
                const formData = new FormData();
                formData.append('name', productData.name);
                formData.append('category', productData.category);
                formData.append('sell_price', String(productData.sell_price));
                formData.append('ingredients', JSON.stringify(productData.ingredients));
                
                // Append image
                formData.append('image', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: 'product_image.jpg',
                } as any);
                
                response = await apiService.post<Product>(
                    API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                // Use JSON for regular data
                response = await apiService.post<Product>(
                    API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
                    {
                        name: productData.name,
                        category: productData.category,
                        sell_price: productData.sell_price,
                        ingredients: productData.ingredients,
                    }
                );
            }
            
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update a product
    async updateProduct(productId: string | number, productData: UpdateProductRequest, imageUri?: string): Promise<Product> {
        try {
            let response: AxiosResponse<Product>;
            
            if (imageUri) {
                // Use FormData for multipart/form-data
                const formData = new FormData();
                if (productData.name) formData.append('name', productData.name);
                if (productData.category) formData.append('category', productData.category);
                if (productData.sell_price !== undefined) formData.append('sell_price', String(productData.sell_price));
                if (productData.ingredients) formData.append('ingredients', JSON.stringify(productData.ingredients));
                
                // Append image
                formData.append('image', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: 'product_image.jpg',
                } as any);
                
                response = await apiService.patch<Product>(
                    `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}/${productId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                // Use JSON for regular data
                const jsonData: any = {};
                if (productData.name) jsonData.name = productData.name;
                if (productData.category) jsonData.category = productData.category;
                if (productData.sell_price !== undefined) jsonData.sell_price = productData.sell_price;
                if (productData.ingredients) jsonData.ingredients = productData.ingredients;
                
                response = await apiService.patch<Product>(
                    `${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}/${productId}`,
                    jsonData
                );
            }
            
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Delete a product
    async deleteProduct(productId: string | number): Promise<void> {
        try {
            await apiService.delete(`${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}/${productId}`);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // What-If Analysis
    async whatIfAnalysis(request: WhatIfRequest): Promise<WhatIfResponse[]> {
        try {
            const response = await apiService.post<WhatIfResponse[]>(
                API_CONFIG.ENDPOINTS.PRODUCTS.WHAT_IF,
                request
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Milk Swap Analysis
    async milkSwapAnalysis(request: MilkSwapRequest): Promise<MilkSwapResponse> {
        try {
            const response = await apiService.post<MilkSwapResponse>(
                API_CONFIG.ENDPOINTS.PRODUCTS.MILK_SWAP,
                request
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Quick Action (What-If with price update)
    async quickAction(productId: string | number, request: QuickActionRequest): Promise<Product> {
        try {
            const response = await apiService.post<Product>(
                API_CONFIG.ENDPOINTS.PRODUCTS.QUICK_ACTION(productId),
                request
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get stock data
    async getStock(): Promise<StockItem[]> {
        try {
            const response = await apiService.get<StockItem[]>(API_CONFIG.ENDPOINTS.STOCK.LIST);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): ApiError {
        if (error.response) {
            return {
                message: error.response.data?.message || 'An error occurred',
                status: error.response.status,
            };
        } else if (error.request) {
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
            };
        } else {
            return {
                message: error.message || 'An unexpected error occurred',
                status: 0,
            };
        }
    }
}

const productsService = new ProductsService();
export default productsService;

