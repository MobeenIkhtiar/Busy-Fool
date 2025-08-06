import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface ProductCardProps {
    name: string;
    sold: number;
    totalLoss?: string;
    totalProfit?: string;
    margin?: string;
    perUnitValue: string;
    trend: 'up' | 'down' | 'steady';
    isLosing: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    name,
    sold,
    totalLoss,
    totalProfit,
    margin,
    perUnitValue,
    isLosing
}) => {

    return (
        <View style={[
            styles.productCard,
            { backgroundColor: isLosing ? '#FEF2F2' : '#EFFDF4' }
        ]}>
            <View style={styles.productHeader}>
                <Text style={styles.productName}>{name}</Text>
                <Text style={styles.detailsText}>
                    {sold} sold • {isLosing ? totalLoss : `${margin} margin`}
                </Text>
            </View>

            <View style={styles.valueRow}>
                <Text style={[
                    styles.perUnitValue,
                    { color: isLosing ? COLORS.red : '#17A34A' }
                ]}>
                    {perUnitValue}
                </Text>

                {!isLosing && totalProfit && (
                    <Text style={styles.totalProfit}>{totalProfit}</Text>
                )}
            </View>
        </View>
    );
};

interface ProductSectionProps {
    title: string;
    subtitle: string;
    products: Array<{
        name: string;
        sold: number;
        totalLoss?: string;
        totalProfit?: string;
        margin?: string;
        perUnitValue: string;
        trend: 'up' | 'down' | 'steady';
        isLosing: boolean;
    }>;
    viewAllText: string;
    iconColor: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    subtitle,
    products,
    viewAllText,
    iconColor
}) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.titleRow}>
                    <Image
                        source={icons.profit}
                        style={[styles.sectionIcon, { tintColor: iconColor }]}
                    />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.sectionSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.productsContainer}>
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        name={product.name}
                        sold={product.sold}
                        totalLoss={product.totalLoss}
                        totalProfit={product.totalProfit}
                        margin={product.margin}
                        perUnitValue={product.perUnitValue}
                        trend={product.trend}
                        isLosing={product.isLosing}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>{viewAllText}</Text>
                <Image
                    source={icons.arrowRight}
                    style={styles.arrowIcon}
                />
            </TouchableOpacity>
        </View>
    );
};

interface ProductPerformanceSectionProps {
    moneyLosersData?: Array<{
        name: string;
        sold: number;
        totalLoss: string;
        perUnitValue: string;
        trend: 'up' | 'down' | 'steady';
    }>;
    topPerformersData?: Array<{
        name: string;
        sold: number;
        margin: string;
        perUnitValue: string;
        totalProfit: string;
    }>;
    showFooter?: boolean;
}

const ProductPerformanceSection: React.FC<ProductPerformanceSectionProps> = ({
    moneyLosersData = [],
    topPerformersData = [],
}) => {
    // No default data; use only provided data

    // Transform data for the component
    const transformedMoneyLosers = (moneyLosersData || []).map(item => ({
        ...item,
        isLosing: true,
    }));

    const transformedTopPerformers = (topPerformersData || []).map(item => ({
        ...item,
        trend: 'up' as const,
        isLosing: false,
    }));

    return (
        <View style={styles.container}>
            {/* Money Losers Section */}
            <ProductSection
                title="Money Losers"
                subtitle="Per unit loss"
                products={transformedMoneyLosers}
                viewAllText="View All Losing Products"
                iconColor={COLORS.red}
            />

            {/* Top Performers Section */}
            <ProductSection
                title="Top Performers"
                subtitle="Per unit profit"
                products={transformedTopPerformers}
                viewAllText="View All Profitable Products"
                iconColor={COLORS.green}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        // paddingHorizontal: wp(5),
        paddingTop: hp(2),
    },
    section: {
        marginBottom: hp(3),
        backgroundColor: COLORS.white,
        paddingHorizontal: wp(7),
        paddingVertical: hp(2),
        borderRadius: wp(2.5),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIcon: {
        width: wp(4),
        height: wp(4),
        marginRight: wp(2),
    },
    sectionTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
    },
    sectionSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: '#6B7280',
    },
    productsContainer: {
        gap: hp(1.5),
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        padding: wp(3),
        borderRadius: wp(2.5),
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productHeader: {
        marginBottom: hp(0.5),
    },
    productName: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        color: COLORS.brown,
    },
    detailsText: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        color: '#4B5563',
        marginTop: hp(.5)
    },
    valueRow: {
        marginBottom: hp(0.5),
    },
    perUnitValue: {
        fontSize: wp(4.2),
        fontFamily: FONT.bold,
        textAlign: 'right'
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendIcon: {
        width: wp(3),
        height: wp(3),
        marginRight: wp(1),
    },
    trendText: {
        fontSize: wp(3),
        fontFamily: FONT.medium,
    },
    steadyText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
    },
    totalProfit: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        color: '#17A34A',
        marginTop: hp(.5)
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
        paddingVertical: hp(1),
    },
    viewAllText: {
        fontSize: wp(3.8),
        fontFamily: FONT.semiBold,
        color: COLORS.brown,
        marginRight: wp(1),
    },
    arrowIcon: {
        width: wp(4),
        height: wp(4),
        tintColor: COLORS.brown,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(4),
        paddingTop: hp(2),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    lockIcon: {
        width: wp(3),
        height: wp(3),
        marginRight: wp(1),
    },
    footerText: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: COLORS.black,
    },
});

export default ProductPerformanceSection; 