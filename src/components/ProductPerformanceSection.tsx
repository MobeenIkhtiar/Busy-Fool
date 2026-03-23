import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
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
    const { colors, theme } = useTheme();
    
    // Card background: light colors in light mode, dark in dark mode
    const cardBg = theme === 'light' 
        ? (isLosing ? '#FEF2F2' : '#EFFDF4')
        : colors.primary;

    return (
        <View style={[
            styles.productCard,
            { backgroundColor: cardBg }
        ]}>
            <View style={styles.productHeader}>
                <Text style={[styles.productName, { color: colors.brown }]}>{name}</Text>
                <Text style={[styles.detailsText, { color: theme === 'light' ? '#4B5563' : colors.gray }]}>
                    {sold} sold • {isLosing ? totalLoss : `${margin} margin`}
                </Text>
            </View>

            <View style={styles.valueRow}>
                <Text style={[
                    styles.perUnitValue,
                    { color: isLosing ? colors.red : '#17A34A' }
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
    const { colors, theme } = useTheme();
    
    // Section background: white in light mode, dark in dark mode
    const sectionBg = theme === 'light' ? colors.white : colors.primary;

    return (
        <View style={[
            styles.section,
            {
                backgroundColor: sectionBg,
                shadowColor: colors.black,
            }
        ]}>
            <View style={styles.sectionHeader}>
                <View style={styles.titleRow}>
                    <Image
                        source={icons.profit}
                        style={[styles.sectionIcon, { tintColor: iconColor }]}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.brown }]}>{title}</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme === 'light' ? '#6B7280' : colors.gray }]}>{subtitle}</Text>
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
                <Text style={[styles.viewAllText, { color: colors.brown }]}>{viewAllText}</Text>
                <Image
                    source={icons.arrowRight}
                    style={[styles.arrowIcon, { tintColor: colors.brown }]}
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
    const { colors } = useTheme();
    
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
                iconColor="#F04438"
            />

            {/* Top Performers Section */}
            <ProductSection
                title="Top Performers"
                subtitle="Per unit profit"
                products={transformedTopPerformers}
                viewAllText="View All Profitable Products"
                iconColor="#22C55E"
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: wp(5),
        paddingTop: hp(2),
        
    },
    section: {
        marginBottom: hp(3),
        paddingHorizontal: wp(7),
        paddingVertical: hp(2),
        borderRadius: wp(2.5),
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      marginHorizontal: wp(1),
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
    },
    sectionSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
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
    },
    detailsText: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
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
        marginRight: wp(1),
    },
    arrowIcon: {
        width: wp(4),
        height: wp(4),
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
    },
});

export default ProductPerformanceSection; 