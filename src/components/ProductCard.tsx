import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { hp, wp, FONT } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import * as Animatable from 'react-native-animatable';

interface ProductCardProps {
    product: {
        name: string;
        category: string;
        rating: number;
        isProfitable: boolean;
        sellPrice: number;
        totalCost: number;
        profitMargin: number;
        profitPerSale: number;
        salesToday: number;
        todayImpact: number;
        ingredientsCount: number;
        ingredients?: Array<{
            name: string;
            quantity: string;
            cost: number;
        }>;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { colors, theme } = useTheme();
    const [showIngredients, setShowIngredients] = useState(false);
    const isProfitable = product.isProfitable;
    const profitColor = isProfitable ? '#EEFDF4' : '#FDF2F6';
    const impactPrefix = isProfitable ? '+' : '';
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    const cloneButtonBg = theme === 'light' ? colors.white : colors.primary;

    // Default ingredients if not provided
    const defaultIngredients = [
        { name: 'Coffee Beans', quantity: '50g', cost: 0.45 },
        { name: 'Water', quantity: '200ml', cost: 0.05 },
        { name: 'Ice', quantity: '100g', cost: 0.02 },
    ];

    const ingredients = product.ingredients || defaultIngredients.slice(0, product.ingredientsCount);

    const toggleIngredients = () => {
        setShowIngredients(!showIngredients);
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
                borderTopColor: isProfitable ? '#49DE80' : '#F87171',
                borderColor: colors.lightWhite,
            }
        ]}>
            {/* Product Header */}
            <View style={styles.header}>
                <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: colors.black }]}>{product.name}</Text>
                    <View style={styles.tags}>
                        <View style={styles.categoryTag}>
                            <Text style={[styles.categoryText, { color: '#000000' }]}>{product.category}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color="#FFD700" />
                            <Text style={[styles.rating, { color: '#000000' }]}>{product.rating}</Text>
                        </View>
                    </View>
                    <View style={[styles.profitableTag, { backgroundColor: isProfitable ? '#DCFCE7' : '#FEE2E1' }]}>
                        <Text style={[styles.profitableText, { color: isProfitable ? '#166534' : '#DC2626' }]}>
                            <Icon name={isProfitable ? "trending-up" : "trending-down"} size={12} color={isProfitable ? '#166534' : '#DC2626'} /> {isProfitable ? 'Profitable' : 'Losing money'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Price and Cost Cards */}
            <View style={styles.priceCostContainer}>
                <View style={styles.priceCard}>
                    <Icon name="attach-money" size={20} color={'#1F3A8A'} style={styles.cardIcon} />
                    <Text style={[styles.cardLabel, { color: '#1F3A8A' }]}>Sell Price</Text>
                    <Text style={[styles.cardValue, { color: '#1F3A8A' }]}>£{product.sellPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.costCard}>
                    <Icon name="inventory" size={20} color={'#7C2D12'} style={styles.cardIcon} />
                    <Text style={[styles.cardLabel, { color: '#7C2D12' }]}>Total Cost</Text>
                    <Text style={[styles.cardValue, { color: '#7C2D12' }]}>£{product.totalCost.toFixed(2)}</Text>
                </View>
            </View>

            {/* Profit Margin and Sales (Combined Box) */}
            <View style={styles.profitMarginBox}>
                <View style={styles.profitMarginHeaderRow}>
                    <View style={styles.profitMarginTitleSection}>
                        {isProfitable ? (
                            <Icon name="trending-up" size={wp(4)} color={'#17A34A'} style={{ marginRight: 4 }} />
                        ) : (
                            <Icon name="error-outline" size={wp(4)} color={'#DC2626'} style={{ marginRight: 4 }} />
                        )}
                        <Text style={[styles.profitMarginTitle, { color: '#000000' }]}>Profit Margin</Text>
                    </View>
                    <View style={styles.salesTodaySection}>
                        <Text style={[styles.salesTodayLabel, { color: '#6B7280' }]}>Sales Today</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="bar-chart" size={wp(4)} color={'#6B7280'} style={{ marginRight: 2 }} />
                            <Text style={[styles.salesTodayValue, { color: '#000000' }]}>{product.salesToday}</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.profitMarginPercent, { color: isProfitable ? '#17A34A' : '#DC2626' }]}>
                    {isProfitable ? '+' : '-'}{Math.abs(product.profitMargin).toFixed(1)}%
                </Text>
                <Text style={[styles.profitMarginPerSale, { color: '#000000' }]}>
                    £{isProfitable ? '+' : '-'}{Math.abs(product.profitPerSale).toFixed(2)} per sale
                </Text>
                <View style={styles.profitMarginProgressBar}>
                    <View style={[styles.profitMarginProgressFill, { width: `${Math.min((product.salesToday / 200) * 100, 100)}%`, backgroundColor: isProfitable ? '#17A34A' : '#DC2626' }]} />
                </View>
            </View>

            {/* Today's Impact */}
            <View style={[styles.impactCard, { borderColor: isProfitable ? '#BBF7D0' : '#FECACA', backgroundColor: profitColor }]}>
                <View style={styles.impactContent}>
                    <Icon name="target" size={16} color={isProfitable ? '#17A34A' : '#DC2625'} />
                    <Text style={[styles.impactLabel, { color: '#000000' }]}>Today's Impact</Text>
                </View>
                <View style={styles.impactValues}>
                    <Text style={[styles.impactAmount, { color: isProfitable ? '#17A34A' : '#DC2625' }]}>
                        £{impactPrefix}{product.todayImpact.toFixed(2)}
                    </Text>
                    <Text style={[styles.impactCalculation, { color: '#000000' }]}>
                        {product.salesToday} × £{Math.abs(product.profitPerSale).toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Ingredients and Actions */}
            <View style={styles.bottomSection}>
                <Animatable.View
                    style={styles.ingredientsSection}
                    onTouchEnd={toggleIngredients}
                    animation={showIngredients ? 'pulse' : undefined}
                    duration={300}
                    useNativeDriver
                >
                    <Icon name="list-alt" size={wp(4)} color={colors.black} />
                    <Text style={[styles.ingredientsText, { color: colors.black }]}>Ingredients ({product.ingredientsCount})</Text>
                    <Animatable.View
                        animation={showIngredients ? 'rotate' : undefined}
                        duration={300}
                        useNativeDriver
                    >
                        <Icon
                            name={showIngredients ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={wp(6)}
                            color={colors.gray}
                        />
                    </Animatable.View>
                </Animatable.View>

                {/* Ingredients Dropdown */}
                <Animatable.View
                    style={[
                        styles.ingredientsDropdown,
                        { overflow: 'hidden' }
                    ]}
                    duration={1000}
                    useNativeDriver
                    animation={showIngredients ? 'fadeInDown' : undefined}
                    pointerEvents={showIngredients ? 'auto' : 'none'}
                >
                    {showIngredients && (
                        <>
                            {ingredients.map((ingredient, index) => (
                                <View key={index} style={styles.ingredientItem}>
                                    <View style={styles.ingredientInfo}>
                                        <Text style={[styles.ingredientName, { color: colors.black }]}>{ingredient.name}</Text>
                                        <Text style={[styles.ingredientQuantity, { color: colors.gray }]}>{ingredient.quantity}</Text>
                                    </View>
                                    <Text style={[styles.ingredientCost, { color: colors.brown }]}>£{ingredient.cost.toFixed(2)}</Text>
                                </View>
                            ))}
                            {/* <View style={styles.ingredientTotal}>
                                <Text style={styles.ingredientTotalLabel}>Total Cost:</Text>
                                <Text style={styles.ingredientTotalValue}>£{product.totalCost.toFixed(2)}</Text>
                            </View> */}
                        </>
                    )}
                </Animatable.View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.whatIfButton}>
                        <Icon name="calculate" size={16} color={colors.white} />
                        <Text style={styles.whatIfText}>What-If</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.cloneButton,
                        {
                            backgroundColor: cloneButtonBg,
                            borderColor: colors.lightWhite,
                        }
                    ]}>
                        <Icon name="content-copy" size={16} color={colors.gray} />
                        <Text style={[styles.cloneText, { color: colors.gray }]}>Clone</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(4),
        padding: wp(4),
        marginBottom: hp(3),
        shadowOffset: { width: 0, height: hp(0.25) },
        shadowOpacity: 0.1,
        shadowRadius: wp(1),
        elevation: 3,
        borderTopWidth: 8,
        borderWidth: 1,
    },
    header: {
        marginBottom: hp(2),
    },
    productInfo: {
        gap: hp(1),
    },
    productName: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
    tags: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    categoryTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(3),
    },
    categoryText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    rating: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    profitableTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(3),
    },
    profitableText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    priceCostContainer: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
    priceCard: {
        flex: 1,
        backgroundColor: '#E0E7FF',
        borderRadius: wp(3),
        padding: wp(3),
        alignItems: 'center',
    },
    costCard: {
        flex: 1,
        backgroundColor: '#FFEBE7',
        borderRadius: wp(3),
        padding: wp(3),
        alignItems: 'center',
    },
    cardIcon: {
        marginBottom: hp(0.5),
    },
    cardLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: '#1F3A8A',
        marginBottom: hp(0.5),
    },
    cardValue: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: '#1F3A8A',
    },
    profitSalesCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: wp(3),
        padding: wp(3),
        marginBottom: hp(2),
        flexDirection: 'row',
        borderWidth: 1,
    },
    profitSection: {
        flex: 1,
        alignItems: 'center',
    },
    salesSection: {
        flex: 1,
        alignItems: 'center',
    },
    sectionIcon: {
        marginBottom: hp(0.5),
    },
    sectionLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginBottom: hp(0.5),
    },
    profitMargin: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    profitPerSale: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
    },
    salesNumber: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    progressBar: {
        width: wp(15),
        height: hp(0.5),
        borderRadius: wp(0.5),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#22C55E',
        borderRadius: wp(0.5),
    },
    impactCard: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
    },
    impactContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    impactLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
    },
    impactValues: {
        alignItems: 'flex-end',
    },
    impactAmount: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
    },
    impactCalculation: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
    },
    bottomSection: {
        gap: hp(2),
    },
    ingredientsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1),
        // marginVertical: hp(1)
    },
    ingredientsText: {
        flex: 1,
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        marginLeft: wp(2),
    },
    ingredientsDropdown: {
        // backgroundColor: COLORS.lightWhite,
        borderRadius: wp(2),
        marginTop: hp(1),
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
        paddingVertical: hp(1),
        borderWidth: 1,
        borderColor: '#e5e7ebee',
        marginTop: hp(1)
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    ingredientQuantity: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        marginTop: hp(0.2),
    },
    ingredientCost: {
        fontSize: wp(3.3),
        fontFamily: FONT.bold,
        backgroundColor: '#F7F5F4',
        padding: wp(2),
        borderRadius: wp(1.5),
    },
    ingredientTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp(1),
        marginTop: hp(0.5),
        borderTopWidth: 1,
    },
    ingredientTotalLabel: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
    },
    ingredientTotalValue: {
        fontSize: wp(3.8),
        fontFamily: FONT.bold,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
    },
    whatIfButton: {
        flex: 1,
        backgroundColor: '#3cb371',
        borderRadius: wp(3),
        height: hp(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    whatIfText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: '#fff',
    },
    cloneButton: {
        flex: 1,
        borderRadius: wp(3),
        height: hp(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        borderWidth: 1,
    },
    cloneText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
    },
    profitMarginBox: {
        backgroundColor: '#FAFBFB',
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    profitMarginHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    profitMarginTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profitMarginTitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
        marginLeft: wp(1)
    },
    salesTodaySection: {
        gap: wp(1),
    },
    salesTodayLabel: {
        fontSize: wp(3),
        fontFamily: FONT.medium,
        marginRight: 2,
    },
    salesTodayValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.bold,
        marginLeft: 2,
    },
    profitMarginPercent: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: '#17A34A',
        marginBottom: hp(0.5),
    },
    profitMarginPerSale: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginBottom: hp(1),
    },
    profitMarginProgressBar: {
        width: '100%',
        height: hp(0.8),
        backgroundColor: '#E5E7EB',
        borderRadius: wp(1),
        overflow: 'hidden',
        marginTop: hp(0.5),
    },
    profitMarginProgressFill: {
        height: '100%',
        backgroundColor: '#17A34A',
        borderRadius: wp(1),
    },
});

export default ProductCard; 