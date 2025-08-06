export const API_CONFIG = {
    // Base URL - Change this to your actual API URL
    BASE_URL: 'https://busy-fool-backend-1-0.onrender.com',

    // Timeout settings
    TIMEOUT: 10000,

    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,

    // Headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    // Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            SIGNUP: '/auth/register',
            LOGOUT: '/auth/logout',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            CHANGE_PASSWORD: '/auth/change-password',
            ME: '/auth/me',
        },
        USER: {
            PROFILE: '/user/profile',
            PROFILE_PICTURE: '/user/profile-picture',
            PREFERENCES: '/user/preferences',
            ACCOUNT: '/user/account',
        },
    },

    // Storage keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'auth_token',
        USER_DATA: 'user_data',
    },
};

// Just return the base URL from config
export const getApiUrl = (): string => API_CONFIG.BASE_URL;