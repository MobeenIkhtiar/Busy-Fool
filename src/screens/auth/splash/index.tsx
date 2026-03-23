import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { icons } from '../../../constants/icons'
import { COLORS, hp, wp } from '../../../constants/StyleGuide'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import * as Animatable from 'react-native-animatable'
import { authService } from '../../../services'
import apiService from '../../../services/api'

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

const Splash = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // First, check if token exists in AsyncStorage
                const token = await apiService.getToken();
                console.log('=== SPLASH SCREEN AUTH CHECK ===');
                console.log('Token exists in AsyncStorage:', token ? 'YES' : 'NO');
                console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
                
                if (!token) {
                    console.log('No token found, navigating to Login');
                    setTimeout(() => {
                        navigation.replace('Login');
                    }, 2000);
                    return;
                }

                // Check if user has a valid token by calling /auth/profile API
                // This is the same endpoint used on the website for auto-login check
                console.log('Calling /auth/profile API...');
                const profile = await authService.getProfile();
                console.log('/auth/profile API response:', profile);
                
                // If API call succeeds (200 response), user is authenticated
                if (profile) {
                    console.log('User authenticated successfully, navigating to Home');
                    // User is authenticated, navigate to Home
                    setTimeout(() => {
                        navigation.replace('Home');
                    }, 2000);
                } else {
                    console.log('No profile data returned, navigating to Login');
                    // No valid profile data, navigate to Login
                    setTimeout(() => {
                        navigation.replace('Login');
                    }, 2000);
                }
            } catch (error: any) {
                // Token expired, invalid, or API failed - navigate to Login
                console.log('=== AUTHENTICATION CHECK FAILED ===');
                console.log('Error:', error);
                console.log('Error message:', error?.message);
                console.log('Error status:', error?.status);
                console.log('Error response status:', error?.response?.status);
                console.log('Navigating to Login screen');
                setTimeout(() => {
                    navigation.replace('Login');
                }, 2000);
            }
        };

        checkAuthentication();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animatable.Image
                animation="fadeIn"
                duration={2000}
                source={icons.logo}
                style={styles.logo}
            />
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: hp(16),
        height: hp(16),
        resizeMode: 'contain',
        borderRadius: hp(1.5),
    },
    logoContainer: {
        borderRadius: hp(1.5),
    },
})