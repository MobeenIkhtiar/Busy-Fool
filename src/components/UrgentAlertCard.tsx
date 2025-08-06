import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';

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
    return (
        <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
                <View style={styles.alertIcons}>
                    {/* <View style={styles.redCircle}>
                        <Text style={styles.exclamationMark}>!</Text>
                    </View> */}
                    <View style={styles.yellowTriangle}>
                        <Text style={styles.triangleExclamation}>!</Text>
                    </View>
                </View>
                <Text style={styles.alertTitle}>Urgent: Products Losing Money</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.alertSummary}>
                You're losing <Text style={styles.boldText}>£{totalLoss}</Text> daily from {productCount} products
            </Text>

            {products.map((product, index) => (
                <View key={index} style={styles.alertCard}>
                    <View style={styles.productRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.lossAmount}>{product.lossAmount}</Text>
                    </View>
                    <Text style={styles.suggestionText}>{product.suggestion}</Text>
                    <TouchableOpacity
                        style={styles.fixButton}
                        onPress={() => onFixNow?.(product.name)}
                    >
                        <Text style={styles.fixButtonText}>Fix Now</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    alertSection: {
        backgroundColor: '#FEF3F1',
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(3),
        borderWidth: 1,
        borderColor: '#F6C3C3',
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
        backgroundColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(1),
    },
    exclamationMark: {
        color: COLORS.white,
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
        color: COLORS.black,
        fontSize: wp(3),
        fontFamily: FONT.bold,
    },
    alertTitle: {
        flex: 1,
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        color: '#991B1B',
    },
    closeButton: {
        width: wp(6),
        height: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: wp(5),
        color: COLORS.red,
        fontFamily: FONT.bold,
    },
    alertSummary: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: '#D32F2F',
        marginBottom: hp(2),
        marginLeft: wp(6),
    },
    boldText: {
        fontFamily: FONT.bold,
    },
    alertCard: {
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1.5),
        borderWidth: 1,
        borderColor: '#F6C3C3',
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
        color: COLORS.black,
    },
    lossAmount: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
        color: COLORS.red,
    },
    suggestionText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        color: COLORS.black,
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
        color: COLORS.white,
    },
});

export default UrgentAlertCard; 