import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, style, disabled, ...props }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
                style
            ]}
            disabled={disabled}
            {...props}
        >
            <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: hp(6), // 48px ≈ 6% of 800px screen height
        backgroundColor: COLORS.brown,
        borderRadius: wp(2), // 12px ≈ 3% of 375px screen width
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(2), // 16px ≈ 2% of 800px screen height
    },
    buttonDisabled: {
        backgroundColor: COLORS.gray,
        opacity: 0.6,
    },
    text: {
        color: COLORS.white,
        fontFamily: FONT.semiBold,
        fontSize: wp(4.8), // 18px ≈ 4.8% of 375px screen width
    },
    textDisabled: {
        color: COLORS.lightgray,
    },
});

export default CustomButton; 