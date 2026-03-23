import apiService from './api';
import { API_CONFIG } from './config';

// Types for file operations based on backend response
export interface IngredientDetail {
    filename: string;
    ingredientName: string;
    action: 'created' | 'updated';
    ingredient: {
        name: string;
        unit: string;
        quantity: number;
        purchase_price: number;
        supplier: string;
    };
}

export interface FileUploadResponse {
    message: string;
    summary: {
        totalFiles: number;
        successfullyProcessed: number;
        ingredientsCreated: number;
        ingredientsUpdated: number;
        errors: number;
        totalProcessingTimeMs: number;
        averageTimePerFile: number;
    };
    timing: {
        ocrTimeMs: number;
        openAiTimeMs: number;
        databaseTimeMs: number;
        totalTimeMs: number;
        breakdown: string;
    };
    details: {
        createdIngredients: IngredientDetail[];
        errors: any[];
        files: any[];
        anomalies: any[];
        suggestions: any[];
    };
}

export interface ApiError {
    message: string;
    status: number;
}

interface FileInfo {
    uri: string;
    name?: string;
    type?: string;
}

class FileService {
    // Upload document/file(s) to Mindee endpoint
    // Can upload 1-10 files at once
    async uploadDocument(files: FileInfo | FileInfo[]): Promise<FileUploadResponse> {
        try {
            const formData = new FormData();
            
            // Convert single file to array for consistent handling
            const fileArray = Array.isArray(files) ? files : [files];
            
            // Validate file count (1-10 files)
            if (fileArray.length === 0 || fileArray.length > 10) {
                throw {
                    message: 'Please select 1 to 10 files',
                    status: 400,
                };
            }

            // Append each file with field name 'files' (not 'file')
            fileArray.forEach((fileInfo) => {
                const fileUri = fileInfo.uri;
                const fileName = fileInfo.name || fileUri.split('/').pop() || 'document';
                
                // Determine file type from extension or use provided type
                let mimeType = fileInfo.type || 'application/pdf';
                if (!fileInfo.type) {
                    const extension = fileName.split('.').pop()?.toLowerCase();
                    if (extension === 'pdf') {
                        mimeType = 'application/pdf';
                    } else if (extension === 'jpg' || extension === 'jpeg') {
                        mimeType = 'image/jpeg';
                    } else if (extension === 'png') {
                        mimeType = 'image/png';
                    }
                }

                // Validate file type (PDF, JPEG, JPG, PNG only)
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(mimeType)) {
                    throw {
                        message: `File type not allowed. Only PDF, JPEG, JPG, PNG are allowed.`,
                        status: 400,
                    };
                }

                // Append file with field name 'files' (as per backend requirement)
                formData.append('files', {
                    uri: fileUri,
                    type: mimeType,
                    name: fileName,
                } as any);
            });

            // Make API call
            // Note: Authorization header is automatically added by apiService interceptor
            const response = await apiService.post<FileUploadResponse>(
                API_CONFIG.ENDPOINTS.MINDEE.UPLOAD,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('File upload response:', response);
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
                message: error.response.data?.message || 'An error occurred while uploading the file',
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
export const fileService = new FileService();
export default fileService;

