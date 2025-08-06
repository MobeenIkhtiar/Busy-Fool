import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';

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
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
                <Image
                    source={icon}
                    style={[styles.icon, { tintColor: iconColor }]}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        alignItems: 'center',
        shadowColor: '#000',
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
        color: '#6B7280',
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