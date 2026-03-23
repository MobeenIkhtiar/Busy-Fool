import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
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
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    const productEntryBg = theme === 'light' ? '#FEFCE8' : colors.primary;

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
                        <Image source={icons.exclamation} style={styles.icon} />
                    </View>
                    <Text style={[styles.title, { color: colors.brown }]}>Missing Recipe Detection</Text>
                </View>
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: colors.lightgray }]}>
                Found products being sold without proper cost tracking:
            </Text>

            {/* Product Entries */}
            {products.map((product, index) => (
                <View key={index} style={[
                    styles.productEntry,
                    { backgroundColor: productEntryBg }
                ]}>
                    <Text style={[styles.productName, { color: colors.brown }]}>{product.name}</Text>
                    <View style={styles.productDetails}>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.brown }]}>Sales found:</Text>
                            <Text style={[styles.detailValue, { color: colors.brown }]}>{product.salesFound}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.brown }]}>Est. loss each:</Text>
                            <Text style={styles.lossValue}>{product.estimatedLoss}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.addRecipeButton, { backgroundColor: colors.brown }]}
                        onPress={() => onAddRecipe?.(product.name)}
                    >
                        <Image source={icons.coffee} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: colors.white }]}>Add Recipe</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(3),
        padding: wp(6),
        marginTop: hp(2),
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: hp(1),
        marginHorizontal: wp(1),
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
    },
    description: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        marginBottom: hp(2),
        lineHeight: hp(2.2),
    },
    productEntry: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1.5),
    },
    productName: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
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
    },
    detailValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    lossValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: '#EA580B',
    },
    addRecipeButton: {
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
        tintColor: '#ffffff',
        marginRight: wp(1.5),
        resizeMode: 'contain'
    },
    buttonText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
});

export default MissingRecipeDetectionCard; 