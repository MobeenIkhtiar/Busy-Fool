import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';


interface MetricCardProps {
    icon: any;
    label: string;
    value: string;
    iconColor?: string;
    iconBackground?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, iconColor, iconBackground }) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    
    // Default icon colors if not provided
    const defaultIconColor = iconColor || colors.brown;
    const defaultIconBackground = iconBackground || colors.lightgray;
    
    // Text colors: black in light mode, white/light gray in dark mode
    const labelColor = theme === 'light' ? colors.gray : colors.gray;
    const valueColor = theme === 'light' ? colors.black : colors.white;

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
                borderColor: colors.lightWhite,
            }
        ]}>
            {iconBackground && (
                <View style={[styles.iconContainer, { backgroundColor: defaultIconBackground }]}>
                    <Image
                        source={icon}
                        style={[styles.icon, { tintColor: defaultIconColor }]}
                        resizeMode="contain"
                    />
                </View>
            )}
            {!iconBackground && (
                <Image
                    source={icon}
                    style={[styles.icon, { tintColor: defaultIconColor }]}
                    resizeMode="contain"
                />
            )}
            <View style={styles.content}>
                <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
                <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: wp(1),
    },
    iconContainer: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(3),
    },
    icon: {
        width: wp(5),
        height: wp(5),
        marginRight: wp(3),
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginBottom: hp(0.5),
    },
    value: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
    },
});

export default MetricCard; 