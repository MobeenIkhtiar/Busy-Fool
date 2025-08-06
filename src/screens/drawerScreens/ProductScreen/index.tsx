import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar'
import ProductCard from '../../../components/ProductCard'
import UrgentAlertCard from '../../../components/UrgentAlertCard'
import KPICard from '../../../components/KPICard'
import SearchFilterSection from '../../../components/SearchFilterSection'
import { useNavigation } from '@react-navigation/native';
import { COLORS, hp, wp, FONT } from '../../../constants/StyleGuide';
import { products } from '../../../constants/Data';
import { icons } from '../../../constants/icons'

const ProductScreen = () => {
    const navigation = useNavigation();
    const [searchValue, setSearchValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Coffee');
    const [statusFilter, setStatusFilter] = useState('Profitable');

    // KPI Data
    const kpiData: Array<{
        icon: string;
        iconBackground: string;
        label: string;
        value: string;
        contextualText: string;
        backgroundColor: string;
        valueColor: string;
    }> = [
            {
                icon: icons.coffee,
                iconBackground: "#653D23",
                label: "Total Products",
                value: "5",
                contextualText: "+2 this week",
                backgroundColor: "#ECE8E5",
                valueColor: COLORS.brown
            },
            {
                icon: icons.profit,
                iconBackground: "#159746",
                label: "Profitable",
                value: "3",
                contextualText: "+1 today",
                backgroundColor: '#EDFEF4',
                valueColor: COLORS.green
            },
            {
                icon: icons.exclamation,
                iconBackground: "#C62020",
                label: "Losing Money",
                value: "2",
                contextualText: "Fix these!",
                backgroundColor: "#FEF2F7",
                valueColor: COLORS.red
            },
            {
                icon: icons.chart,
                iconBackground: "#2056E0",
                label: "Avg Margin",
                value: "32.1%",
                contextualText: "+2.3% vs\nyesterday",
                backgroundColor: "#EEF3FF",
                valueColor: COLORS.blue
            }
        ];

    // Alert data
    const alertProducts = [
        {
            name: "Rose Latte",
            lossAmount: "-£0.47",
            suggestion: "Remove edible petals to save £0.40 per drink."
        },
        {
            name: "Oat Latte",
            lossAmount: "-£0.23",
            suggestion: "Increase price by £1.00 to achieve 15% margin."
        }
    ];

    const handleCloseAlert = () => {
        // Handle alert close
        console.log('Alert closed');
    };

    const handleFixNow = (productName: string) => {
        console.log(`Fix now clicked for ${productName}`);
    };

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation as any} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} >

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Products</Text>
                        <Text style={styles.subtitle}>Smart margin tracking for your coffee shop.</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Image source={icons.filter} style={styles.buttonIcon} tintColor={COLORS.black} />
                            <Text style={styles.filterButtonText}>Filters</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton}>
                            <Image source={icons.plus} style={styles.buttonIcon} />
                            <Text style={styles.addButtonText}>Add Product</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Urgent Alert Section */}
                <UrgentAlertCard
                    totalLoss="52.85"
                    productCount={2}
                    products={alertProducts}
                    onClose={handleCloseAlert}
                    onFixNow={handleFixNow}
                />


                {/* KPI Cards Section */}
                <View style={styles.kpiSection}>
                    <View style={styles.kpiRow}>
                        {kpiData.slice(0, 2).map((kpi, index) => (
                            <KPICard
                                key={index}
                                icon={kpi.icon}
                                iconBackground={kpi.iconBackground}
                                label={kpi.label}
                                value={kpi.value}
                                contextualText={kpi.contextualText}
                                backgroundColor={kpi.backgroundColor}
                                valueColor={kpi.valueColor}
                            />
                        ))}
                    </View>
                    <View style={styles.kpiRow}>
                        {kpiData.slice(2, 4).map((kpi, index) => (
                            <KPICard
                                key={index + 2}
                                icon={kpi.icon}
                                iconBackground={kpi.iconBackground}
                                label={kpi.label}
                                value={kpi.value}
                                contextualText={kpi.contextualText}
                                backgroundColor={kpi.backgroundColor}
                                valueColor={kpi.valueColor}
                            />
                        ))}
                    </View>
                </View>

                {/* Search and Filter Section */}
                <SearchFilterSection
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={setCategoryFilter}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                {/* Products List */}
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </ScrollView>
        </View>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: hp(2),
        paddingHorizontal: wp(4),
    },
    scrollContent: {
        paddingBottom: hp(10)
    },
    headerSection: {
        marginBottom: hp(3),
    },
    titleContainer: {
        marginBottom: hp(2),
    },
    title: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        color: COLORS.black,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
    },
    filterButton: {
        flex: 1,
        paddingVertical: hp(1),
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightgray,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    filterButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
        color: '#374151',
        marginLeft: wp(4),
    },
    addButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        backgroundColor: COLORS.brown,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
        color: COLORS.white,
        marginLeft: wp(4),
    },
    buttonIcon: {
        width: wp(4),
        height: wp(4),
        resizeMode: 'contain',
        tintColor: COLORS.white,
    },
    kpiSection: {
        marginBottom: hp(3),
    },
    kpiRow: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
});
