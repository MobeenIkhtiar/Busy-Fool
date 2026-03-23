import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, Image } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

interface CustomInputProps extends TextInputProps {
    label: string;
    showPasswordToggle?: boolean;
    error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, showPasswordToggle = false, secureTextEntry, error, ...props }) => {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const hasError = error && error.trim().length > 0;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.gray }]}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.primary,
                            borderColor: hasError ? '#FF6B6B' : colors.lightgray,
                            color: colors.black,
                        },
                        showPasswordToggle && { paddingRight: wp(13) },
                    ]}
                    placeholderTextColor={colors.gray}
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
                            style={[styles.icon, { tintColor: colors.gray }]}
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
        marginBottom: hp(0.7),
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        height: hp(6),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3.5),
        fontFamily: FONT.regular,
        fontSize: wp(4.2),
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