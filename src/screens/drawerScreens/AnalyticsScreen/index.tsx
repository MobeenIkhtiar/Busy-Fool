import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { FONT, wp, hp } from '../../../constants/StyleGuide'
import { useTheme } from '../../../context/ThemeContext'
import { icons } from '../../../constants/icons'
import AnalyticsMetricCard from '../../../components/AnalyticsMetricCard'
import TimePeriodSelector from '../../../components/TimePeriodSelector'
import CategorySelector from '../../../components/CategorySelector'
import ProductPerformanceSection from '../../../components/ProductPerformanceSection'
import WasteAnalysisCard from '../../../components/WasteAnalysisCard'
import MissingRecipeDetectionCard from '../../../components/MissingRecipeDetectionCard'
import TopBar from '../../../components/TopBar'
import { useNavigation } from '@react-navigation/native'

// Move data to the top - will be created inside component to use theme colors

// Explicitly type trend for moneyLosersData
const moneyLosersData: {
    name: string;
    sold: number;
    totalLoss: string;
    perUnitValue: string;
    trend: 'up' | 'steady' | 'down';
}[] = [
        {
            name: 'Rose Latte',
            sold: 87,
            totalLoss: '£40.89 total loss',
            perUnitValue: '-£0.47',
            trend: 'up',
        },
        {
            name: 'Lavender Honey Oat',
            sold: 52,
            totalLoss: '£11.96 total loss',
            perUnitValue: '-£0.23',
            trend: 'steady',
        },
        {
            name: 'Matcha Cloud',
            sold: 34,
            totalLoss: '£5.1 total loss',
            perUnitValue: '-£0.15',
            trend: 'down',
        },
    ];

const topPerformersData = [
    {
        name: 'Cold Brew',
        sold: 143,
        margin: '76%',
        perUnitValue: '+£4.2',
        totalProfit: '£600.6 total',
    },
    {
        name: 'Vanilla Latte',
        sold: 94,
        margin: '68%',
        perUnitValue: '+£3.8',
        totalProfit: '£357.2 total',
    },
    {
        name: 'Americano',
        sold: 156,
        margin: '82%',
        perUnitValue: '+£2.95',
        totalProfit: '£460.2 total',
    },
];

const wasteAnalysisData = [
    {
        name: 'Oat Milk',
        purchased: '40L',
        used: '30L',
        wasted: '10L',
        wastePercentage: '25%',
        wasteValue: '£45',
    },
    {
        name: 'Rose Syrup',
        purchased: '2L',
        used: '1.3L',
        wasted: '0.7L',
        wastePercentage: '35%',
        wasteValue: '£28',
    },
    {
        name: 'Edible Flowers',
        purchased: '100g',
        used: '65g',
        wasted: '35g',
        wastePercentage: '35%',
        wasteValue: '£42',
    },
];

const missingRecipeData = [
    {
        name: 'Maple Oat Latte',
        salesFound: 23,
        estimatedLoss: '£0.3',
    },
    {
        name: 'Cinnamon Cloud',
        salesFound: 18,
        estimatedLoss: '£0.25',
    },
    {
        name: 'Honey Americano',
        salesFound: 12,
        estimatedLoss: '£0.2',
    },
];

interface AnalyticsScreenProps {
    metricsDataProp?: Array<{
        icon: any;
        label: string;
        value: string;
        iconColor: string;
        iconBackground: string;
        valueColor: string;
    }>;
    moneyLosersDataProp?: typeof moneyLosersData;
    topPerformersDataProp?: typeof topPerformersData;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
    metricsDataProp,
    moneyLosersDataProp = moneyLosersData,
    topPerformersDataProp = topPerformersData,
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<string>('Today');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Products');

    // Create metrics data with theme colors
    const metricsData = [
        {
            icon: icons.dollar,
            label: 'Total Revenue',
            value: '£8,647',
            iconColor: colors.blue,
            iconBackground: colors.lightBlue,
            valueColor: colors.blue,
        },
        {
            icon: icons.box,
            label: 'Total Costs',
            value: '£6,234',
            iconColor: '#EA580B',
            iconBackground: colors.lightOrange,
            valueColor: colors.orange,
        },
        {
            icon: icons.profit,
            label: 'True Profit',
            value: '£2,413',
            iconColor: colors.green,
            iconBackground: colors.lightGreen,
            valueColor: colors.green,
        },
        {
            icon: icons.percent,
            label: 'Avg Margin',
            value: '27.9%',
            iconColor: colors.purple,
            iconBackground: colors.lightPurple,
            valueColor: colors.purple,
        },
        {
            icon: icons.delete,
            label: 'Waste Value',
            value: '£184',
            iconColor: colors.red,
            iconBackground: colors.lightRed,
            valueColor: colors.red,
        },
        {
            icon: icons.exclamation,
            label: 'Lost Opportunity',
            value: '£312',
            iconColor: '#CA8A03',
            iconBackground: colors.lightOrange,
            valueColor: '#CA8A03',
        },
    ];

    const finalMetricsData = metricsDataProp || metricsData;

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <TopBar navigation={navigation as any} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.brown }]}>Analytics Dashboard</Text>
                        <Text style={[styles.subtitle, { color: colors.lightgray }]}>
                            Deep insights into your coffee shop's true performance
                        </Text>
                    </View>

                    {/* Time Period Selector */}
                    <TimePeriodSelector
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={setSelectedPeriod}
                    />

                    {/* Category Selector */}
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    {/* Metrics Grid */}
                    <View style={styles.metricsGrid}>
                        {finalMetricsData.map((metric: any, index: number) => (
                            <View key={index} style={styles.metricCardWrapper}>
                                <AnalyticsMetricCard
                                    icon={metric.icon}
                                    label={metric.label}
                                    value={metric.value}
                                    iconColor={metric.iconColor}
                                    iconBackground={metric.iconBackground}
                                    valueColor={metric.valueColor}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Product Performance Section */}
                    <ProductPerformanceSection
                        moneyLosersData={moneyLosersDataProp}
                        topPerformersData={topPerformersDataProp}
                        showFooter={true}
                    />

                    {/* Waste Analysis Card */}
                    <WasteAnalysisCard
                        wasteItems={wasteAnalysisData}
                        totalWasteValue="£184"
                    />

                    {/* Missing Recipe Detection Card */}
                    <MissingRecipeDetectionCard
                        products={missingRecipeData}
                        onAddRecipe={(productName) => {
                            console.log(`Adding recipe for: ${productName}`);
                            // Handle recipe addition logic here
                        }}
                    />


                </View>
            </ScrollView>
        </View>
    )
}

export default AnalyticsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(2),
        paddingHorizontal: wp(4),
    },
    content: {
        paddingTop: hp(2),
        paddingBottom: hp(4),
    },
    header: {
        marginBottom: hp(2),
    },
    title: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: wp(3.8),
        fontFamily: FONT.regular,
        lineHeight: hp(2.5),
    },
    metricsGrid: {
        marginTop: hp(2),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: wp(1),
    },
    metricCardWrapper: {
        width: '48%',
        marginBottom: hp(2),
    },
})