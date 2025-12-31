import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import TopBar from '../../../components/TopBar'
import ProductCard from '../../../components/ProductCard'
import UrgentAlertCard from '../../../components/UrgentAlertCard'
import KPICard from '../../../components/KPICard'
import SearchFilterSection from '../../../components/SearchFilterSection'
import AddProductModal, { ProductFormData } from '../../../components/AddProductModal'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { hp, wp, FONT } from '../../../constants/StyleGuide';
import { useTheme } from '../../../context/ThemeContext';
import { icons } from '../../../constants/icons'
import { productsService, ingredientsService, Product, Ingredient, ApiError } from '../../../services';

const ProductScreen = () => {
    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const [searchValue, setSearchValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    // Stock endpoint doesn't exist on backend (404), so we'll skip it for now
    // const [stockData, setStockData] = useState<StockItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

    // Fetch data from APIs
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch products and ingredients
            // Note: /stock endpoint doesn't exist on backend (returns 404), so we skip it
            const [productsData, ingredientsData] = await Promise.all([
                productsService.getProducts(),
                ingredientsService.getIngredients(),
            ]);

            // Map products to include numberOfSales from quantity_sold
            const mappedProducts = productsData.map((product) => ({
                ...product,
                numberOfSales: Number(product.quantity_sold) || 0,
            }));

            setProducts(mappedProducts);
            setIngredients(ingredientsData);
            
            console.log('Products fetched:', mappedProducts.length);
            console.log('Ingredients fetched:', ingredientsData.length);
        } catch (error: any) {
            const apiError = error as ApiError;
            console.error('Error fetching products data:', apiError);
            setError(apiError.message || 'Failed to load products');
            Alert.alert('Error', apiError.message || 'Failed to load products. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    // Calculate KPI Data from real products
    const profitableProducts = products.filter(p => p.status === 'profitable');
    const losingMoneyProducts = products.filter(p => p.status === 'losing money');
    const avgMargin = products.length > 0
        ? products.reduce((sum, p) => sum + (Number(p.margin_percent) || 0), 0) / products.length
        : 0;

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
                value: String(products.length),
                contextualText: `${products.length} products`,
                backgroundColor: "#ECE8E5",
                valueColor: colors.brown
            },
            {
                icon: icons.profit,
                iconBackground: "#159746",
                label: "Profitable",
                value: String(profitableProducts.length),
                contextualText: `${profitableProducts.length} profitable`,
                backgroundColor: '#EDFEF4',
                valueColor: colors.green
            },
            {
                icon: icons.exclamation,
                iconBackground: "#C62020",
                label: "Losing Money",
                value: String(losingMoneyProducts.length),
                contextualText: "Fix these!",
                backgroundColor: "#FEF2F7",
                valueColor: colors.red
            },
            {
                icon: icons.chart,
                iconBackground: "#2056E0",
                label: "Avg Margin",
                value: `${avgMargin.toFixed(1)}%`,
                contextualText: "Average margin",
                backgroundColor: "#EEF3FF",
                valueColor: colors.blue
            }
        ];

    // Calculate alert data from losing money products
    const alertProducts = losingMoneyProducts.slice(0, 2).map(product => {
        const marginAmount = Number(product.margin_amount) || 0;
        const numberOfSales = Number(product.numberOfSales) || 0;
        const totalLoss = Math.abs(marginAmount * numberOfSales);
        
        return {
            name: product.name,
            lossAmount: `-£${totalLoss.toFixed(2)}`,
            suggestion: product.quickWin || `Adjust price to improve margin`,
        };
    });

    const totalDailyLoss = losingMoneyProducts.reduce((sum, product) => {
        const marginAmount = Number(product.margin_amount) || 0;
        const numberOfSales = Number(product.numberOfSales) || 0;
        return sum + Math.abs(marginAmount * numberOfSales);
    }, 0);

    const handleCloseAlert = () => {
        // Handle alert close
        console.log('Alert closed');
    };

    const handleFixNow = (productName: string) => {
        console.log(`Fix now clicked for ${productName}`);
        // TODO: Implement what-if analysis modal
    };

    const handleAddProduct = async (formData: ProductFormData) => {
        setIsSubmittingProduct(true);
        try {
            // Map form data to API format
            const productData = {
                name: formData.name,
                category: formData.category,
                sell_price: parseFloat(formData.sell_price),
                ingredients: formData.ingredients.map((ing) => ({
                    ingredientId: ing.id,
                    quantity: ing.selectedQuantity,
                    unit: ing.selectedUnit,
                    is_optional: ing.is_optional,
                })),
            };

            // Create product with or without image
            const newProduct = await productsService.createProduct(productData, formData.image || undefined);

            // Add the new product to the list with numberOfSales = 0
            setProducts((prev) => [...prev, { ...newProduct, numberOfSales: 0 }]);

            // Close modal and show success
            setShowAddProductModal(false);
            Alert.alert('Success', 'Product added successfully!');
            
            // Refresh data to get latest from API
            await fetchData();
        } catch (error: any) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message || 'Failed to add product. Please try again.');
            throw error; // Re-throw to let modal handle it
        } finally {
            setIsSubmittingProduct(false);
        }
    };

    // Map API Product to ProductCard format
    const mapProductToCardFormat = (product: Product) => {
        const sellPrice = Number(product.sell_price) || 0;
        const totalCost = Number(product.total_cost) || 0;
        const profitMargin = Number(product.margin_percent) || 0;
        const profitPerSale = Number(product.margin_amount) || 0;
        const salesToday = Number(product.numberOfSales) || 0;
        const todayImpact = profitPerSale * salesToday;
        
        // Map ingredients
        const mappedIngredients = product.ingredients?.map((ing) => ({
            name: ing.ingredient?.name || ing.name || 'Unknown',
            quantity: `${ing.selectedQuantity ?? ing.quantity ?? 0}${ing.selectedUnit || ing.unit || ''}`,
            cost: Number(ing.line_cost) || 0,
        })) || [];

        return {
            name: product.name,
            category: product.category,
            rating: product.avgRating || 4.5, // Default rating if not provided
            isProfitable: product.status === 'profitable',
            sellPrice,
            totalCost,
            profitMargin,
            profitPerSale,
            salesToday,
            todayImpact,
            ingredientsCount: product.ingredients?.length || 0,
            ingredients: mappedIngredients,
        };
    };

    // Filter products based on search and filters
    const getFilteredProducts = () => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            // API returns: 'profitable', 'breaking even', 'losing money'
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter.toLowerCase();
            return matchesSearch && matchesCategory && matchesStatus;
        });
    };

    const filteredProductsRaw = getFilteredProducts();
    const filteredProducts = filteredProductsRaw.map(mapProductToCardFormat);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <TopBar navigation={navigation as any} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} >

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.brown }]}>Products</Text>
                        <Text style={[styles.subtitle, { color: colors.black }]}>Smart margin tracking for your coffee shop.</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }]}>
                            <Image source={icons.filter} style={[styles.buttonIcon, { tintColor: colors.black }]} />
                            <Text style={[styles.filterButtonText, { color: colors.black }]}>Filters</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.addButton, { backgroundColor: colors.brown }]}
                            onPress={() => setShowAddProductModal(true)}
                        >
                            <Image source={icons.plus} style={[styles.buttonIcon, { tintColor: colors.white }]} />
                            <Text style={[styles.addButtonText, { color: colors.white }]}>Add Product</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Urgent Alert Section */}
                {losingMoneyProducts.length > 0 && (
                    <UrgentAlertCard
                        totalLoss={totalDailyLoss.toFixed(2)}
                        productCount={losingMoneyProducts.length}
                        products={alertProducts}
                        onClose={handleCloseAlert}
                        onFixNow={handleFixNow}
                    />
                )}


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
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.brown} />
                        <Text style={[styles.loadingText, { color: colors.black }]}>Loading products...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: colors.brown }]}
                            onPress={fetchData}
                        >
                            <Text style={[styles.retryButtonText, { color: colors.white }]}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredProducts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.black }]}>No products found</Text>
                        <Text style={[styles.emptySubtext, { color: colors.gray }]}>
                            {searchValue || categoryFilter !== 'all' || statusFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Add your first product to get started'}
                        </Text>
                    </View>
                ) : (
                    filteredProducts.map((mappedProduct, index) => {
                        const originalProduct = filteredProductsRaw[index];
                        return (
                            <ProductCard key={originalProduct?.id || index} product={mappedProduct} />
                        );
                    })
                )}
            </ScrollView>

            {/* Add Product Modal */}
            <AddProductModal
                visible={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onSubmit={handleAddProduct}
                ingredients={ingredients}
                isSubmitting={isSubmittingProduct}
            />
        </View>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(2),
        paddingHorizontal: wp(4),
    },
    scrollContent: {
        paddingBottom: hp(4),
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
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
    },
    filterButton: {
        flex: 1,
        height: hp(5),
        borderWidth: 1,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    filterButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
        marginLeft: wp(2),
    },
    addButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
        marginLeft: wp(4),
    },
    buttonIcon: {
        width: wp(4),
        height: wp(4),
        resizeMode: 'contain',
    },
    kpiSection: {
        marginBottom: hp(3),
    },
    kpiRow: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
    loadingContainer: {
        padding: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: hp(2),
        fontSize: wp(4),
        fontFamily: FONT.medium,
    },
    errorContainer: {
        padding: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
        marginBottom: hp(2),
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: wp(6),
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
    },
    retryButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    emptyContainer: {
        padding: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        marginBottom: hp(1),
    },
    emptySubtext: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        textAlign: 'center',
    },
});
