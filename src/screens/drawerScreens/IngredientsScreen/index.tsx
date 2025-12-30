import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../../../constants/icons'
import { FONT, hp, wp } from '../../../constants/StyleGuide'
import { useTheme } from '../../../context/ThemeContext'
import TopBar from '../../../components/TopBar'
import IngredientItem from '../../../components/IngredientItem'
import MetricCard from '../../../components/MetricsCard'
import AddIngredientModal from '../../../components/AddIngredientModal'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pick } from '@react-native-documents/picker'

const IngredientsScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
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

    const handleUploadDoc = async () => {
        try {
            const result = await pick({
                allowMultiSelection: false,
            });

            if (result && result.length > 0) {
                const selectedFile = result[0];
                console.log('Selected file:', {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size,
                    uri: selectedFile.uri,
                });
                
                // You can process the file here
                const fileSize = selectedFile.size ? (selectedFile.size / 1024).toFixed(2) : 'Unknown';
                
                Alert.alert(
                    'File Selected',
                    `File: ${selectedFile.name}\nSize: ${fileSize} KB`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => {
                                console.log('User cancelled file upload');
                            }
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                handleFileUpload(selectedFile);
                            }
                        }
                    ]
                );
            }
        } catch (err: any) {
            // Check if user cancelled (error code or message)
            if (err?.message?.includes('cancel') || err?.code === 'DOCUMENT_PICKER_CANCELED') {
                // User cancelled the picker
                console.log('User cancelled document picker');
            } else {
                // Handle other errors
                console.error('Document picker error:', err);
                Alert.alert('Error', 'Failed to pick document. Please try again.');
            }
        }
    };

    const handleFileUpload = async (file: any) => {
        console.log('handleFileUpload called with file:', {
            name: file.name,
            type: file.type,
            size: file.size,
            uri: file.uri,
        });
        
        // TODO: Call API here
        // Example:
        // try {
        //     const response = await uploadFile(file);
        //     console.log('File uploaded successfully:', response);
        // } catch (error) {
        //     console.error('File upload error:', error);
        //     Alert.alert('Error', 'Failed to upload file. Please try again.');
        // }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <TopBar navigation={navigation as any} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.brown }]}>Ingredients Management</Text>
                        <Text style={[styles.subtitle, { color: colors.black }]}>optimize your coffee shop's inventory with ease</Text>
                    </View>

                    {/* Row 1: Add Ingredient & Upload Doc */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.brown }]} onPress={openModal}>
                            <Image source={icons.plus} style={[styles.buttonIcon, { tintColor: colors.white }]} />
                            <Text style={[styles.addButtonText, { color: colors.white }]}>Add Ingredient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.filterButton, { backgroundColor: colors.white, borderColor: colors.lightgray }]}
                            onPress={handleUploadDoc}
                        >
                            <Ionicons name="cloud-upload-outline" size={wp(4)} color="#000000" />
                            <Text style={[styles.filterButtonText, { color: '#374151' }]}>Upload Doc</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Row 2: Export CSV & Import CSV */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.white, borderColor: colors.lightgray }]}>
                            <Image source={icons.export} style={[styles.buttonIcon, { tintColor: '#000000' }]} />
                            <Text style={[styles.filterButtonText, { color: '#374151' }]}>Export CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.white, borderColor: colors.lightgray }]}>
                            <Ionicons name="cloud-download-outline" size={wp(4)} color="#000000" />
                            <Text style={[styles.filterButtonText, { color: '#374151' }]}>Import CSV</Text>
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
        fontSize: wp(5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(1.5),
    },
    filterButton: {
        flex: 1,
        paddingVertical: hp(1),
        borderWidth: 1,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    filterButtonText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginLeft: wp(4),
    },
    addButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addButtonText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginLeft: wp(4),
    },
    buttonIcon: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
    },
    ingredientsList: {
        marginTop: hp(2),
    },
})