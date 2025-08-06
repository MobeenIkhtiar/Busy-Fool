import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../../../constants/icons'
import { COLORS, FONT, hp, wp } from '../../../constants/StyleGuide'
import TopBar from '../../../components/TopBar'
import IngredientItem from '../../../components/IngredientItem'
import MetricCard from '../../../components/MetricsCard'
import AddIngredientModal from '../../../components/AddIngredientModal'
import { useNavigation } from '@react-navigation/native'

const IngredientsScreen = () => {
    const navigation = useNavigation();
    // Sample ingredient data
    const sampleIngredients = [
        {
            id: '1',
            name: 'Coffee Beans (Arabica)',
            category: 'Coffee',
            quantity: 12,
            unit: 'kg',
            cost: 25.7300,
            stockLevel: 'high' as const,
            lastUpdated: '2 hours ago',
            waste: 5,
            supplier: 'Coffee Roasters Ltd'
        },
        {
            id: '2',
            name: 'Whole Milk',
            category: 'Dairy',
            quantity: 8,
            unit: 'L',
            cost: 12.80,
            stockLevel: 'medium' as const,
            lastUpdated: '1 day ago',
            waste: 3,
            supplier: 'Fresh Dairy Co.'
        },
        {
            id: '3',
            name: 'Vanilla Syrup',
            category: 'Flavoring',
            quantity: 2,
            unit: 'L',
            cost: 18.90,
            stockLevel: 'low' as const,
            lastUpdated: '3 days ago',
            waste: 8,
            supplier: 'Flavor Masters'
        },
        {
            id: '4',
            name: 'Sugar',
            category: 'Sweetener',
            quantity: 15,
            unit: 'kg',
            cost: 8.50,
            stockLevel: 'high' as const,
            lastUpdated: '5 hours ago',
            waste: 2,
            supplier: 'Sweet Supply Co.'
        }
    ];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ingredients, setIngredients] = useState(sampleIngredients);

    // Calculate metrics based on current ingredients
    const calculateMetrics = () => {
        const totalIngredients = ingredients.length;
        const lowStockCount = ingredients.filter(ing => ing.stockLevel === 'low').length;
        const avgWaste = ingredients.length > 0
            ? (ingredients.reduce((sum, ing) => sum + ing.waste, 0) / ingredients.length).toFixed(1)
            : '0.0';
        const totalValue = ingredients.reduce((sum, ing) => sum + ing.cost, 0).toFixed(0);

        return [
            {
                id: '1',
                icon: icons.box,
                label: 'Total Ingredients',
                value: totalIngredients.toString(),
                iconColor: '#10B981',
                iconBackground: '#D1FAE5'
            },
            {
                id: '2',
                icon: icons.exclamation,
                label: 'Low Stock',
                value: lowStockCount.toString(),
                iconColor: '#EF4444',
                iconBackground: '#FEE2E2'
            },
            {
                id: '3',
                icon: icons.percent,
                label: 'Avg Waste',
                value: `${avgWaste}%`,
                iconColor: '#F59E0B',
                iconBackground: ''
            },
            {
                id: '4',
                icon: icons.dollar,
                label: 'Total Value',
                value: `$${totalValue}`,
                iconColor: '#3B82F6',
                iconBackground: ''
            }
        ];
    };

    const metricsData = calculateMetrics();

    const handleIngredientPress = (ingredientId: string) => {
        console.log('Ingredient pressed:', ingredientId);
        // Add navigation or action logic here
    };

    const handleAddIngredient = (formData: any) => {
        console.log('New ingredient data:', formData);

        // Create new ingredient object
        const newIngredient = {
            id: Date.now().toString(), // Generate unique ID
            name: formData.name,
            category: formData.category,
            quantity: parseFloat(formData.currentStockLevel) || 0,
            unit: formData.unit || 'kg',
            cost: parseFloat(formData.purchasePrice),
            stockLevel: 'high' as const, // Default to high stock
            lastUpdated: 'Just now',
            waste: parseFloat(formData.wastePercentage) || 5,
            supplier: formData.supplier || 'Unknown'
        };

        // Add to ingredients list
        setIngredients(prevIngredients => [newIngredient, ...prevIngredients]);

        // Success message could be shown with a toast or inline message
        console.log('Ingredient added successfully!');
    };

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation as any} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Ingredients Management</Text>
                        <Text style={styles.subtitle}>optimize your coffee shop's inventory with ease</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Image source={icons.export} style={styles.buttonIcon} tintColor={COLORS.black} />
                            <Text style={styles.filterButtonText}>Export</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={openModal}>
                            <Image source={icons.plus} style={styles.buttonIcon} />
                            <Text style={styles.addButtonText}>Add Ingredients</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Metrics Section */}
                <View>
                    {metricsData.map((metric) => (
                        <MetricCard
                            key={metric.id}
                            icon={metric.icon}
                            label={metric.label}
                            value={metric.value}
                            iconColor={metric.iconColor}
                            iconBackground={metric.iconBackground}
                        />
                    ))}
                </View>

                {/* Ingredients List */}
                <View style={styles.ingredientsList}>
                    {ingredients.map((ingredient) => (
                        <IngredientItem
                            key={ingredient.id}
                            ingredient={ingredient}
                            onPress={() => handleIngredientPress(ingredient.id)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Add Ingredient Modal */}
            <AddIngredientModal
                visible={isModalVisible}
                onClose={closeModal}
                onSubmit={handleAddIngredient}
            />
        </View>
    )
}

export default IngredientsScreen

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
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: wp(3),
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
        fontSize: wp(3.2),
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
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.white,
        marginLeft: wp(4),
    },
    buttonIcon: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
        tintColor: COLORS.white,
    },
    ingredientsList: {
        marginTop: hp(2),
    },
})