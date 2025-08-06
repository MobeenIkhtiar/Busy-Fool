import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, View, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import { COLORS, FONT, wp, hp } from '../../../constants/StyleGuide';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Loader from '../../../components/Loader';
import { authService } from '../../../services/authService';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
};

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Signup: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [submitting, setSubmitting] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [showLoader, setShowLoader] = useState<boolean>(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const newErrors = validate();
        setErrors(newErrors);
        console.log('handleBlur - field:', field);
        console.log('handleBlur - touched:', { ...touched, [field]: true });
        console.log('handleBlur - errors:', newErrors);
    };

    const handleSubmit = async () => {
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
        });
        const validationErrors = validate();
        setErrors(validationErrors);
        // console.log('handleSubmit - validationErrors:', validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setShowLoader(true);
            setSubmitting(true);

            try {
                await authService.signup({
                    name: name,
                    email: email.trim(),
                    password: password,
                    role: 'owner'
                });
                setSubmitting(false);
                setShowLoader(false);
                navigation.navigate('Login');
            } catch (error: any) {
                setSubmitting(false);
                setShowLoader(false);

                // Handle API errors
                const errorMessage = error.message || 'Signup failed. Please try again.';
                console.error('Signup error details:', {
                    message: error.message,
                    status: error.status,
                    fullError: error,
                });

                Alert.alert(
                    "Signup Error",
                    errorMessage,
                    [{ text: "OK" }],
                    { cancelable: false }
                );
            }
        } else {
            setShowLoader(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.primary }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(30) }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animatable.View
                    animation="fadeInDown"
                    duration={900}
                    style={styles.header}
                >
                    <Text style={styles.welcome}>Welcome to{`\n`}Busy Fool <Text style={styles.coffee}>☕️</Text></Text>
                    <Text style={styles.subtitle}>Track your margins. Own your{`\n`}menu. Make every latte count.</Text>
                    <Text style={styles.accountText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginInstead}>Login instead</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Animatable.View
                        animation="fadeInUp"
                        delay={400}
                        style={styles.formContainer}
                    >
                        <Text style={styles.signupTitle}>Create your account</Text>
                        <CustomInput
                            label="Name"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={text => {
                                setName(text);
                                if (touched.name) setErrors(validate());
                            }}
                            onBlur={() => handleBlur('name')}
                            autoCapitalize="words"
                            autoCorrect={false}
                            returnKeyType="next"
                            error={touched.name && errors.name ? errors.name : undefined}
                        />
                        <CustomInput
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={text => {
                                setEmail(text);
                                if (touched.email) setErrors(validate());
                            }}
                            onBlur={() => handleBlur('email')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            error={touched.email && errors.email ? errors.email : undefined}
                        />
                        <CustomInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={text => {
                                setPassword(text);
                                if (touched.password) setErrors(validate());
                            }}
                            onBlur={() => handleBlur('password')}
                            showPasswordToggle={true}
                            secureTextEntry={true}
                            returnKeyType="next"
                            error={touched.password && errors.password ? errors.password : undefined}
                        />
                        <CustomInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={text => {
                                setConfirmPassword(text);
                                if (touched.confirmPassword) setErrors(validate());
                            }}
                            onBlur={() => handleBlur('confirmPassword')}
                            showPasswordToggle={true}
                            secureTextEntry={true}
                            returnKeyType="done"
                            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                        />
                        <CustomButton
                            title={submitting ? "Creating..." : "Create Account"}
                            onPress={handleSubmit}
                            disabled={submitting}
                        />
                    </Animatable.View>
                </View>
            </ScrollView>
            {/* Loader */}
            <Loader visible={showLoader} />
        </KeyboardAvoidingView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7B4A22',
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
        lineHeight: hp(5),
    },
    coffee: {
        fontSize: wp(8),
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
    loginInstead: {
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
    signupTitle: {
        color: '#7B4A22',
        fontFamily: FONT.bold,
        fontSize: wp(7),
        marginBottom: hp(3),
    },
});
