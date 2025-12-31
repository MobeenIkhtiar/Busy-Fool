// Export all services
export { default as apiService } from './api';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as fileService } from './fileService';
export { default as ingredientsService } from './ingredientsService';
export { default as settingsService } from './settingsService';
export { default as productsService } from './productsService';

// Export types
export type { LoginRequest, SignupRequest, AuthResponse, Profile, UpdateProfileRequest, ApiError } from './authService';
export type { User, UpdateUserRequest } from './userService';
export type { FileUploadResponse } from './fileService';
export type { Ingredient, UpdateIngredientRequest, BulkDeleteRequest, BulkDeleteResponse } from './ingredientsService';
export type { CategoryTarget, UserSettings, CreateCategoryTargetRequest, UpdateCategoryTargetRequest, CategoryTargetResponse } from './settingsService';
export type { Product, CreateProductRequest, UpdateProductRequest, ProductIngredient, WhatIfRequest, WhatIfResponse, MilkSwapRequest, MilkSwapResponse, QuickActionRequest, StockItem } from './productsService'; 