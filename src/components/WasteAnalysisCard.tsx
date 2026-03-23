import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
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
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    const wasteItemBg = theme === 'light' ? '#FFFBF5' : colors.primary;
    const wasteItemBorder = theme === 'light' ? '#FFEDD5' : colors.lightWhite;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
            }
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Image source={icons.delete} style={styles.icon} />
                    </View>
                    <Text style={[styles.title, { color: colors.brown }]}>Waste Analysis</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={[styles.totalLabel, { color: colors.brown }]}>Total Waste Value</Text>
                    <Text style={styles.totalValue}>{totalWasteValue}</Text>
                </View>
            </View>

            {/* Waste Items */}
            {wasteItems.map((item, index) => (
                <View key={index} style={[
                    styles.wasteItem,
                    {
                        backgroundColor: wasteItemBg,
                        borderColor: wasteItemBorder,
                    }
                ]}>
                    <Text style={[styles.itemName, { color: colors.brown }]}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme === 'light' ? '#4B5563' : colors.gray }]}>Purchased:</Text>
                            <Text style={[styles.detailValue, { color: colors.brown }]}>{item.purchased}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme === 'light' ? '#4B5563' : colors.gray }]}>Used:</Text>
                            <Text style={[styles.detailValue, { color: colors.brown }]}>{item.used}</Text>
                        </View>
                        <View style={[styles.detailRow, { borderBottomWidth: 1, borderBottomColor: theme === 'light' ? '#FED7AA' : colors.lightWhite, paddingBottom: hp(1) }]}>
                            <Text style={[styles.detailLabel, { color: theme === 'light' ? '#4B5563' : colors.gray }]}>Wasted:</Text>
                            <Text style={styles.wastedValue}>{item.wasted} ({item.wastePercentage})</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme === 'light' ? '#4B5563' : colors.gray }]}>Waste Value:</Text>
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
        marginHorizontal: wp(1),
        borderRadius: wp(3),
        padding: wp(4),
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
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
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
        borderWidth: 1,
        borderRadius: wp(2.5),
        padding: wp(4),
    },
    itemName: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
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
    },
    detailValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
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