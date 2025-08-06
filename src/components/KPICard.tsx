import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';

type KPICardProps = {
    icon: any;
    iconBackground: string;
    label: string;
    value: string;
    contextualText: string;
    backgroundColor: string;
    valueColor: string;
};

const KPICard: React.FC<KPICardProps> = ({
    icon,
    iconBackground,
    label,
    value,
    contextualText,
    backgroundColor,
    valueColor
}) => {
    return (
        <View style={[styles.card, { backgroundColor }]}>
            <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: iconBackground, borderRadius: wp(2) }]}>
                    <Image source={icon} style={styles.iconImage} />
                </View>
                <Text style={styles.contextualText}>{contextualText}</Text>
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
        flex: 1,
        borderRadius: wp(2),
        padding: wp(4),
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    iconContainer: {
        alignSelf: 'flex-start',
        padding: wp(2.5),
        marginRight: wp(2),
    },
    iconImage: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
        tintColor: COLORS.white
    },
    content: {
        flex: 1,
    },
    contextualText: {
        fontSize: wp(2.8),
        fontFamily: FONT.regular,
        color: '#6B7280',
        backgroundColor: '#F5F4F2',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(2),
        marginLeft: wp(2),
    },
    label: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.black,
        marginBottom: hp(0.5),
    },
    value: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
});

export default KPICard; 