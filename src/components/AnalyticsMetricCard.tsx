import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsMetricCardProps {
    icon: any;
    label: string;
    value: string;
    iconColor: string;
    iconBackground: string;
    valueColor: string;
}

const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
    icon,
    label,
    value,
    iconColor,
    iconBackground,
    valueColor
}) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    
    // Text colors: gray in light mode, gray in dark mode (adjusted for visibility)
    const labelColor = theme === 'light' ? '#6B7280' : colors.gray;

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
            }
        ]}>
            <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
                <Image
                    source={icon}
                    style={[styles.icon, { tintColor: iconColor }]}
                    resizeMode="contain"
                />
            </View>
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
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
    },
    iconContainer: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    icon: {
        width: wp(5),
        height: wp(5),
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginBottom: hp(0.5),
        textAlign: 'center',
    },
    value: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        textAlign: 'center',
    },
});

export default AnalyticsMetricCard; 