import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

interface AlertProduct {
    name: string;
    lossAmount: string;
    suggestion: string;
}

interface UrgentAlertCardProps {
    totalLoss: string;
    productCount: number;
    products: AlertProduct[];
    onClose?: () => void;
    onFixNow?: (productName: string) => void;
}

const UrgentAlertCard: React.FC<UrgentAlertCardProps> = ({
    totalLoss,
    productCount,
    products,
    onClose,
    onFixNow
}) => {
    const { colors, theme } = useTheme();
    
    // Alert section background: light red tint in light mode, dark in dark mode
    const alertSectionBg = theme === 'light' ? '#FEF3F1' : colors.primary;
    const alertSectionBorder = theme === 'light' ? '#F6C3C3' : colors.lightWhite;
    const alertCardBg = theme === 'light' ? colors.white : colors.primary;
    const alertCardBorder = theme === 'light' ? '#F6C3C3' : colors.lightWhite;

    return (
        <View style={[
            styles.alertSection,
            {
                backgroundColor: alertSectionBg,
                borderColor: alertSectionBorder,
            }
        ]}>
            <View style={styles.alertHeader}>
                <View style={styles.alertIcons}>
                    {/* <View style={styles.redCircle}>
                        <Text style={styles.exclamationMark}>!</Text>
                    </View> */}
                    <View style={styles.yellowTriangle}>
                        <Text style={[styles.triangleExclamation, { color: colors.black }]}>!</Text>
                    </View>
                </View>
                <Text style={[styles.alertTitle, { color: theme === 'light' ? '#991B1B' : colors.red }]}>Urgent: Products Losing Money</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={[styles.closeButtonText, { color: colors.red }]}>×</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.alertSummary, { color: theme === 'light' ? '#D32F2F' : colors.red }]}>
                You're losing <Text style={styles.boldText}>£{totalLoss}</Text> daily from {productCount} products
            </Text>

            {products.map((product, index) => (
                <View key={index} style={[
                    styles.alertCard,
                    {
                        backgroundColor: alertCardBg,
                        borderColor: alertCardBorder,
                    }
                ]}>
                    <View style={styles.productRow}>
                        <Text style={[styles.productName, { color: colors.black }]}>{product.name}</Text>
                        <Text style={[styles.lossAmount, { color: colors.red }]}>{product.lossAmount}</Text>
                    </View>
                    <Text style={[styles.suggestionText, { color: colors.black }]}>{product.suggestion}</Text>
                    <TouchableOpacity
                        style={styles.fixButton}
                        onPress={() => onFixNow?.(product.name)}
                    >
                        <Text style={[styles.fixButtonText, { color: colors.white }]}>Fix Now</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    alertSection: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(3),
        borderWidth: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    alertIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: wp(2),
    },
    redCircle: {
        width: wp(4),
        height: wp(4),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(1),
    },
    exclamationMark: {
        fontSize: wp(3),
        fontFamily: FONT.bold,
    },
    yellowTriangle: {
        width: wp(4),
        height: wp(4),
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(0.5),
    },
    triangleExclamation: {
        fontSize: wp(3),
        fontFamily: FONT.bold,
    },
    alertTitle: {
        flex: 1,
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    closeButton: {
        width: wp(6),
        height: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
    alertSummary: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        marginBottom: hp(2),
        marginLeft: wp(6),
    },
    boldText: {
        fontFamily: FONT.bold,
    },
    alertCard: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1.5),
        borderWidth: 1,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    productName: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    lossAmount: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
    },
    suggestionText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginBottom: hp(2),
    },
    fixButton: {
        backgroundColor: '#DC2625',
        borderRadius: wp(10),
        paddingVertical: wp(1),
        paddingHorizontal: wp(3),
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    fixButtonText: {
        fontSize: wp(3),
        fontFamily: FONT.medium,
    },
});

export default UrgentAlertCard; 