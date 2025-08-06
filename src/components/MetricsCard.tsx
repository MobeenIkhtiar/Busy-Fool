import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';


interface MetricCardProps {
    icon: any;
    label: string;
    value: string;
    iconColor?: string;
    iconBackground?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, iconColor = COLORS.brown, iconBackground = COLORS.lightgray }) => {
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
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.black,
        marginBottom: hp(0.5),
    },
    value: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
    },
});

export default MetricCard; 