import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
    title, 
    style, 
    disabled, 
    iconName,
    iconSize = wp(4.5),
    iconColor,
    backgroundColor,
    textColor: textColorProp,
    ...props 
}) => {
    const { colors } = useTheme();
    
    const buttonBg = backgroundColor || (disabled ? colors.lightgray : colors.brown);
    const textColor = textColorProp || (disabled ? colors.gray : colors.white);
    const iconColorFinal = iconColor || textColor;
    
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: buttonBg,
                    opacity: disabled ? 0.6 : 1,
                },
                style
            ]}
            disabled={disabled}
            {...props}
        >
            <View style={styles.buttonContent}>
                {iconName && (
                    <Ionicons name={iconName as any} size={iconSize} color={iconColorFinal} />
                )}
                <Text style={[
                    styles.text,
                    { color: textColor },
                    iconName && styles.textWithIcon
                ]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        minHeight: hp(5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    text: {
        fontFamily: FONT.semiBold,
        fontSize: wp(3.5),
    },
    textWithIcon: {
        marginLeft: 0,
    },
});

export default CustomButton; 