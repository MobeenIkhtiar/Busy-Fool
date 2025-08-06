import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import { COLORS, FONT, wp, hp } from '../../../constants/StyleGuide';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { authService, ApiError } from '../../../services';
import Loader from '../../../components/Loader';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

const Login: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await authService.login({ email, password });
            navigation.replace('Home');
        } catch (error: any) {
            const apiError = error as ApiError;
            Alert.alert('Login Failed', apiError.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.primary }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <Animatable.View
                    animation="fadeInDown"
                    duration={900}
                    style={styles.header}
                >
                    <Text style={styles.welcome}>Welcome back</Text>
                    <Animatable.Text animation="bounceIn" delay={300} style={styles.wave}>👋</Animatable.Text>
                    <Text style={styles.subtitle}>Let’s get back to making your{`\n`}menu more profitable.</Text>
                    <Text style={styles.accountText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.createAccount}>Create one now</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={400}
                    style={styles.formContainer}
                >
                    <Text style={styles.loginTitle}>Log in to Busy Fool</Text>
                    <CustomInput
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <CustomInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        showPasswordToggle={true}
                        returnKeyType="done"
                    />
                    <CustomButton
                        title={isLoading ? "Logging In..." : "Log In"}
                        onPress={handleLogin}
                        disabled={isLoading}
                    />

                </Animatable.View>

                {isLoading && <Loader visible={isLoading} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.brown,
        borderBottomLeftRadius: wp(8),
        borderBottomRightRadius: wp(8),
        paddingTop: hp(7),
        paddingBottom: hp(4.5),
        paddingHorizontal: wp(6),
        alignItems: 'flex-start',
    },
    welcome: {
        color: COLORS.white,
        fontFamily: FONT.bold,
        fontSize: wp(9),
        marginBottom: hp(0.5),
    },
    wave: {
        fontSize: wp(8),
        marginBottom: hp(2),
    },
    subtitle: {
        color: COLORS.white,
        fontFamily: FONT.regular,
        fontSize: wp(5),
        marginBottom: hp(3),
        lineHeight: hp(3.5),
    },
    accountText: {
        color: COLORS.lightWhite,
        fontFamily: FONT.regular,
        fontSize: wp(4),
        marginBottom: hp(0.25),
    },
    createAccount: {
        color: COLORS.white,
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
        textDecorationLine: 'underline',
        marginBottom: hp(0.5),
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: wp(6),
        paddingTop: hp(4),
    },
    loginTitle: {
        color: '#7B4A22',
        fontFamily: FONT.bold,
        fontSize: wp(7),
        marginBottom: hp(3),
    },
    loaderContainer: {
        marginTop: hp(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
});