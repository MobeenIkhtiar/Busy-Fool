import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';

interface CustomInputProps extends TextInputProps {
    label: string;
    showPasswordToggle?: boolean;
    error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, showPasswordToggle = false, secureTextEntry, error, ...props }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const hasError = error && error.trim().length > 0;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        showPasswordToggle && { paddingRight: wp(13) },
                        hasError && styles.inputError
                    ]}
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
                    {...props}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                    >
                        <Image
                            source={isPasswordVisible ? require('../assets/icons/crossed-eye.png') : require('../assets/icons/eye.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {hasError && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp(2),
    },
    label: {
        fontFamily: FONT.semiBold,
        fontSize: wp(4.2),
        color: COLORS.gray,
        marginBottom: hp(0.7),
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        height: hp(6),
        borderWidth: 1,
        borderColor: COLORS.lightgray,
        borderRadius: wp(2),
        paddingHorizontal: wp(3.5),
        backgroundColor: COLORS.white,
        fontFamily: FONT.regular,
        fontSize: wp(4.2),
        color: COLORS.black,
    },
    inputError: {
        borderColor: '#FF6B6B',
    },
    eyeIcon: {
        position: 'absolute',
        right: wp(3.5),
        top: hp(1.5),
        padding: wp(1),
    },
    icon: {
        width: wp(5),
        height: wp(5),
        tintColor: COLORS.gray,
    },
    errorText: {
        fontFamily: FONT.regular,
        fontSize: wp(3.2),
        color: '#FF6B6B',
        marginTop: hp(0.5),
        marginLeft: wp(1),
    },
});

export default CustomInput; 