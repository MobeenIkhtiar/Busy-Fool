import { Platform } from 'react-native';

export const testNetworkConnectivity = async (url: string): Promise<boolean> => {
    try {
        console.log('Testing network connectivity to:', url);
        console.log('Platform:', Platform.OS);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        console.log('Network test response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        return response.ok;
    } catch (error: any) {
        console.error('Network connectivity test failed:', {
            message: error.message,
            name: error.name,
            code: error.code,
        });
        return false;
    }
};

export const getNetworkInfo = () => {
    return {
        platform: Platform.OS,
        version: Platform.Version,
        isIOS: Platform.OS === 'ios',
        isAndroid: Platform.OS === 'android',
    };
}; 