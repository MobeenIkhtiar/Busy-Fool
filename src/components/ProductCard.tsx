import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, hp, wp, FONT } from '../constants/StyleGuide';
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
    const [showIngredients, setShowIngredients] = useState(false);
    const isProfitable = product.isProfitable;
    const profitColor = isProfitable ? '#EEFDF4' : '#FDF2F6';
    const impactPrefix = isProfitable ? '+' : '';

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
        <View style={[styles.container, { borderTopColor: isProfitable ? '#49DE80' : '#F87171' }]}>
            {/* Product Header */}
            <View style={styles.header}>
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.tags}>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{product.category}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color="#FFD700" />
                            <Text style={styles.rating}>{product.rating}</Text>
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
                    <Text style={styles.cardLabel}>Sell Price</Text>
                    <Text style={styles.cardValue}>£{product.sellPrice.toFixed(2)}</Text>
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
                        <Text style={[styles.profitMarginTitle]}>Profit Margin</Text>
                    </View>
                    <View style={styles.salesTodaySection}>
                        <Text style={styles.salesTodayLabel}>Sales Today</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="bar-chart" size={wp(4)} color={COLORS.gray} style={{ marginRight: 2 }} />
                            <Text style={styles.salesTodayValue}>{product.salesToday}</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.profitMarginPercent, { color: isProfitable ? '#17A34A' : '#DC2626' }]}>
                    {isProfitable ? '+' : '-'}{Math.abs(product.profitMargin).toFixed(1)}%
                </Text>
                <Text style={[styles.profitMarginPerSale]}>
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
                    <Text style={styles.impactLabel}>Today's Impact</Text>
                </View>
                <View style={styles.impactValues}>
                    <Text style={[styles.impactAmount, { color: isProfitable ? '#17A34A' : '#DC2625' }]}>
                        £{impactPrefix}{product.todayImpact.toFixed(2)}
                    </Text>
                    <Text style={styles.impactCalculation}>
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
                    <Icon name="list-alt" size={wp(4)} color={COLORS.black} />
                    <Text style={styles.ingredientsText}>Ingredients ({product.ingredientsCount})</Text>
                    <Animatable.View
                        animation={showIngredients ? 'rotate' : undefined}
                        duration={300}
                        useNativeDriver
                    >
                        <Icon
                            name={showIngredients ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={wp(6)}
                            color={COLORS.gray}
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
                                        <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                        <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
                                    </View>
                                    <Text style={styles.ingredientCost}>£{ingredient.cost.toFixed(2)}</Text>
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
                        <Icon name="calculate" size={16} color={COLORS.white} />
                        <Text style={styles.whatIfText}>What-If</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cloneButton}>
                        <Icon name="content-copy" size={16} color={COLORS.gray} />
                        <Text style={styles.cloneText}>Clone</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: wp(4),
        padding: wp(4),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(0.25) },
        shadowOpacity: 0.1,
        shadowRadius: wp(1),
        elevation: 3,
        borderTopWidth: 8,
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
        color: COLORS.black,
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
        color: COLORS.black,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    rating: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.black,
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
        backgroundColor: COLORS.lightBlue,
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
        borderColor: COLORS.lightWhite,
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
        color: COLORS.black,
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
        color: COLORS.black,
    },
    salesNumber: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.black,
        marginBottom: hp(0.5),
    },
    progressBar: {
        width: wp(15),
        height: hp(0.5),
        backgroundColor: COLORS.lightWhite,
        borderRadius: wp(0.5),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.green,
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
        color: COLORS.black,
    },
    impactValues: {
        alignItems: 'flex-end',
    },
    impactAmount: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.white,
    },
    impactCalculation: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        color: COLORS.black,
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
        color: COLORS.black,
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
        color: COLORS.black,
    },
    ingredientQuantity: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: COLORS.gray,
        marginTop: hp(0.2),
    },
    ingredientCost: {
        fontSize: wp(3.3),
        fontFamily: FONT.bold,
        color: COLORS.brown,
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
        borderTopColor: COLORS.lightWhite,
    },
    ingredientTotalLabel: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: COLORS.black,
    },
    ingredientTotalValue: {
        fontSize: wp(3.8),
        fontFamily: FONT.bold,
        color: COLORS.black,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
    },
    whatIfButton: {
        flex: 1,
        backgroundColor: COLORS.brown,
        borderRadius: wp(3),
        padding: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    whatIfText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: COLORS.white,
    },
    cloneButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        borderWidth: 1,
        borderColor: COLORS.lightWhite,
    },
    cloneText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: COLORS.gray,
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
        color: COLORS.black,
        marginLeft: wp(1)
    },
    salesTodaySection: {
        gap: wp(1),
    },
    salesTodayLabel: {
        fontSize: wp(3),
        fontFamily: FONT.medium,
        color: COLORS.gray,
        marginRight: 2,
    },
    salesTodayValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.bold,
        color: COLORS.black,
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
        color: COLORS.black,
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