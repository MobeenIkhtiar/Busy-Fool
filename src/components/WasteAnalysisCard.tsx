import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface WasteItem {
    name: string;
    purchased: string;
    used: string;
    wasted: string;
    wastePercentage: string;
    wasteValue: string;
}

interface WasteAnalysisCardProps {
    wasteItems: WasteItem[];
    totalWasteValue: string;
}

const WasteAnalysisCard: React.FC<WasteAnalysisCardProps> = ({
    wasteItems,
    totalWasteValue
}) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Image source={icons.delete} style={styles.icon} />
                    </View>
                    <Text style={styles.title}>Waste Analysis</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.totalLabel}>Total Waste Value</Text>
                    <Text style={styles.totalValue}>{totalWasteValue}</Text>
                </View>
            </View>

            {/* Waste Items */}
            {wasteItems.map((item, index) => (
                <View key={index} style={styles.wasteItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Purchased:</Text>
                            <Text style={styles.detailValue}>{item.purchased}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Used:</Text>
                            <Text style={styles.detailValue}>{item.used}</Text>
                        </View>
                        <View style={[styles.detailRow, { borderBottomWidth: 1, borderBottomColor: '#FED7AA', paddingBottom: hp(1) }]}>
                            <Text style={styles.detailLabel}>Wasted:</Text>
                            <Text style={styles.wastedValue}>{item.wasted} ({item.wastePercentage})</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Waste Value:</Text>
                            <Text style={[styles.wasteValue, { fontFamily: FONT.bold }]}>{item.wasteValue}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: wp(2),
    },
    icon: {
        width: wp(4),
        height: wp(4),
        tintColor: '#EA580B',
        resizeMode: 'contain'
    },
    title: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    totalValue: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: '#EA580B',
    },
    wasteItem: {
        marginBottom: hp(3),
        paddingBottom: hp(2),
        backgroundColor: '#FFFBF5',
        borderWidth: 1,
        borderColor: '#FFEDD5',
        borderRadius: wp(2.5),
        padding: wp(4),
    },
    itemName: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(1.5),
    },
    itemDetails: {
        gap: hp(1),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: '#4B5563',
    },
    detailValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.brown,
    },
    wastedValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: '#EA580B',
    },
    wasteValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: '#EA580B',
    },
});

export default WasteAnalysisCard; 