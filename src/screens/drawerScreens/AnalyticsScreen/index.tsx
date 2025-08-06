import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, wp, hp } from '../../../constants/StyleGuide'
import { icons } from '../../../constants/icons'
import AnalyticsMetricCard from '../../../components/AnalyticsMetricCard'
import TimePeriodSelector from '../../../components/TimePeriodSelector'
import CategorySelector from '../../../components/CategorySelector'
import ProductPerformanceSection from '../../../components/ProductPerformanceSection'
import WasteAnalysisCard from '../../../components/WasteAnalysisCard'
import MissingRecipeDetectionCard from '../../../components/MissingRecipeDetectionCard'
import TopBar from '../../../components/TopBar'
import { useNavigation } from '@react-navigation/native'

// Move data to the top
const metricsData = [
    {
        icon: icons.dollar,
        label: 'Total Revenue',
        value: '£8,647',
        iconColor: COLORS.blue,
        iconBackground: COLORS.lightBlue,
        valueColor: COLORS.blue,
    },
    {
        icon: icons.box,
        label: 'Total Costs',
        value: '£6,234',
        iconColor: '#EA580B',
        iconBackground: COLORS.lightOrange,
        valueColor: COLORS.orange,
    },
    {
        icon: icons.profit,
        label: 'True Profit',
        value: '£2,413',
        iconColor: COLORS.green,
        iconBackground: COLORS.lightGreen,
        valueColor: COLORS.green,
    },
    {
        icon: icons.percent,
        label: 'Avg Margin',
        value: '27.9%',
        iconColor: COLORS.purple,
        iconBackground: COLORS.lightPurple,
        valueColor: COLORS.purple,
    },
    {
        icon: icons.delete,
        label: 'Waste Value',
        value: '£184',
        iconColor: COLORS.red,
        iconBackground: COLORS.lightRed,
        valueColor: COLORS.red,
    },
    {
        icon: icons.exclamation,
        label: 'Lost Opportunity',
        value: '£312',
        iconColor: '#CA8A03',
        iconBackground: COLORS.lightOrange,
        valueColor: '#CA8A03',
    },
];

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

const AnalyticsScreen = ({
    metricsDataProp = metricsData,
    moneyLosersDataProp = moneyLosersData,
    topPerformersDataProp = topPerformersData,
}) => {
    const navigation = useNavigation();
    const [selectedPeriod, setSelectedPeriod] = useState<string>('Today');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Products');

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation as any} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Analytics Dashboard</Text>
                        <Text style={styles.subtitle}>
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
                        {metricsDataProp.map((metric, index) => (
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
        backgroundColor: COLORS.primary,
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
        color: COLORS.brown,
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: wp(3.8),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
        lineHeight: hp(2.5),
    },
    metricsGrid: {
        marginTop: hp(2),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCardWrapper: {
        width: '48%',
        marginBottom: hp(2),
    },
})