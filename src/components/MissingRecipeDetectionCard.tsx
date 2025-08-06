import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface MissingRecipeProduct {
    name: string;
    salesFound: number;
    estimatedLoss: string;
}

interface MissingRecipeDetectionCardProps {
    products: MissingRecipeProduct[];
    onAddRecipe?: (productName: string) => void;
}

const MissingRecipeDetectionCard: React.FC<MissingRecipeDetectionCardProps> = ({
    products,
    onAddRecipe
}) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Image source={icons.exclamation} style={styles.icon} />
                    </View>
                    <Text style={styles.title}>Missing Recipe Detection</Text>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>
                Found products being sold without proper cost tracking:
            </Text>

            {/* Product Entries */}
            {products.map((product, index) => (
                <View key={index} style={styles.productEntry}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.productDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Sales found:</Text>
                            <Text style={styles.detailValue}>{product.salesFound}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Est. loss each:</Text>
                            <Text style={styles.lossValue}>{product.estimatedLoss}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.addRecipeButton}
                        onPress={() => onAddRecipe?.(product.name)}
                    >
                        <Image source={icons.coffee} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Add Recipe</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(6),
        shadowColor: '#000',
        marginTop: hp(2),
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: hp(1),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
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
        tintColor: '#CA8A03',
        resizeMode: 'contain'
    },
    title: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
    },
    description: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
        marginBottom: hp(2),
        lineHeight: hp(2.2),
    },
    productEntry: {
        backgroundColor: '#FEFCE8',
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1.5),
    },
    productName: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(1),
    },
    productDetails: {
        marginBottom: hp(1.5),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    detailLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: COLORS.brown,
    },
    detailValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.brown,
    },
    lossValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: '#EA580B',
    },
    addRecipeButton: {
        backgroundColor: COLORS.brown,
        borderRadius: wp(2),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        width: wp(3.5),
        height: wp(3.5),
        tintColor: COLORS.white,
        marginRight: wp(1.5),
        resizeMode: 'contain'
    },
    buttonText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.white,
    },
});

export default MissingRecipeDetectionCard; 