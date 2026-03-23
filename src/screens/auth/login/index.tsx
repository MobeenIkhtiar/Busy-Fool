import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import { FONT, wp, hp } from '../../../constants/StyleGuide';
import { useTheme } from '../../../context/ThemeContext';
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
    const { colors } = useTheme();
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
            style={{ flex: 1, backgroundColor: colors.primary }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <LinearGradient
                    colors={colors.gradientColors}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.gradient}
                >
                    <Animatable.View
                        animation="fadeInDown"
                        duration={900}
                        style={styles.header}
                    >
                    <Text style={[styles.welcome, { color: colors.white }]}>Welcome back</Text>
                    <Animatable.Text animation="bounceIn" delay={300} style={styles.wave}>👋</Animatable.Text>
                    <Text style={[styles.subtitle, { color: colors.white }]}>Let's get back to making your{`\n`}menu more profitable.</Text>
                    <Text style={[styles.accountText, { color: colors.lightWhite }]}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={[styles.createAccount, { color: colors.white }]}>Create one now</Text>
                    </TouchableOpacity>
                    </Animatable.View>
                </LinearGradient>

                <Animatable.View
                    animation="fadeInUp"
                    delay={400}
                    style={styles.formContainer}
                >
                    <Text style={[styles.loginTitle, { color: colors.brown }]}>Log in to Busy Fool</Text>
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
                        style={styles.loginButton}
                    />

                </Animatable.View>

                {isLoading && <Loader visible={isLoading} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    gradient: {
        borderBottomLeftRadius: wp(8),
        borderBottomRightRadius: wp(8),
    },
    header: {
        paddingTop: hp(7),
        paddingBottom: hp(4.5),
        paddingHorizontal: wp(6),
        alignItems: 'flex-start',
    },
    welcome: {
        fontFamily: FONT.bold,
        fontSize: wp(9),
        marginBottom: hp(0.5),
    },
    wave: {
        fontSize: wp(8),
        marginBottom: hp(2),
    },
    subtitle: {
        fontFamily: FONT.regular,
        fontSize: wp(5),
        marginBottom: hp(3),
        lineHeight: hp(3.5),
    },
    accountText: {
        fontFamily: FONT.regular,
        fontSize: wp(4),
        marginBottom: hp(0.25),
    },
    createAccount: {
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
        fontFamily: FONT.bold,
        fontSize: wp(7),
        marginBottom: hp(3),
    },
    loaderContainer: {
        marginTop: hp(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        marginTop: hp(2),
    },
});