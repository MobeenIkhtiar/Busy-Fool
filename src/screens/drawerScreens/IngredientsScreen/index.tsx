import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { icons } from '../../../constants/icons'
import { FONT, hp, wp } from '../../../constants/StyleGuide'
import { useTheme } from '../../../context/ThemeContext'
import TopBar from '../../../components/TopBar'
import IngredientItem from '../../../components/IngredientItem'
import MetricCard from '../../../components/MetricsCard'
import AddIngredientModal from '../../../components/AddIngredientModal'
import EditIngredientModal from '../../../components/EditIngredientModal'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pick } from '@react-native-documents/picker'
import { fileService, ingredientsService, ApiError, Ingredient, UpdateIngredientRequest } from '../../../services'

// Type for component's ingredient format
interface ComponentIngredient {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    cost: number;
    stockLevel: 'high' | 'medium' | 'low';
    lastUpdated: string;
    waste?: number;
    supplier?: string;
}

const IngredientsScreen = () => {
    const navigation = useNavigation();
    const { colors, theme } = useTheme();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<ComponentIngredient | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [ingredients, setIngredients] = useState<ComponentIngredient[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingIngredientId, setDeletingIngredientId] = useState<string | null>(null);

    // Helper function to determine stock level based on quantity
    const getStockLevel = (quantity: number): 'high' | 'medium' | 'low' => {
        if (quantity >= 10) return 'high';
        if (quantity >= 5) return 'medium';
        return 'low';
    };

    // Helper function to map API ingredient to component format
    const mapApiIngredientToComponent = (apiIngredient: Ingredient): ComponentIngredient => {
        // Parse string values to numbers
        const quantity = typeof apiIngredient.quantity === 'string' 
            ? parseFloat(apiIngredient.quantity) || 0 
            : apiIngredient.quantity;
        
        const purchasePrice = typeof apiIngredient.purchase_price === 'string' 
            ? parseFloat(apiIngredient.purchase_price) || 0 
            : apiIngredient.purchase_price;
        
        const wastePercent = typeof apiIngredient.waste_percent === 'string' 
            ? parseFloat(apiIngredient.waste_percent) || 0 
            : apiIngredient.waste_percent;

        return {
            id: apiIngredient.id.toString(),
            name: apiIngredient.name,
            category: 'General', // Default category, can be enhanced if API provides it
            quantity: quantity,
            unit: apiIngredient.unit,
            cost: purchasePrice,
            stockLevel: getStockLevel(quantity),
            lastUpdated: 'Recently', // Default, can be enhanced if API provides timestamp
            waste: wastePercent,
            supplier: apiIngredient.supplier || 'Unknown'
        };
    };

    // Fetch ingredients from API
    const fetchIngredients = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching ingredients from API...');
            const apiIngredients = await ingredientsService.getIngredients();
            console.log('Ingredients fetched successfully:', apiIngredients);
            
            // Map API response to component format
            const mappedIngredients = apiIngredients.map(mapApiIngredientToComponent);
            setIngredients(mappedIngredients);
        } catch (err: any) {
            const apiError = err as ApiError;
            console.error('Error fetching ingredients:', apiError);
            setError(apiError.message || 'Failed to fetch ingredients. Please try again.');
            
            // Show error alert
            Alert.alert(
                'Error',
                apiError.message || 'Failed to fetch ingredients. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch ingredients on component mount
    useEffect(() => {
        fetchIngredients();
    }, []);

    // Refresh ingredients when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchIngredients();
        }, [])
    );

    // Calculate metrics based on current ingredients
    const calculateMetrics = () => {
        const totalIngredients = ingredients.length;
        const lowStockCount = ingredients.filter(ing => ing.stockLevel === 'low').length;
        const avgWaste = ingredients.length > 0
            ? (ingredients.reduce((sum, ing) => sum + (ing.waste || 0), 0) / ingredients.length).toFixed(1)
            : '0.0';
        const totalValue = ingredients.length > 0
            ? ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0).toFixed(2)
            : '0.00';

        return [
            {
                id: '1',
                icon: icons.box,
                label: 'Total Ingredients',
                value: totalIngredients.toString(),
                iconColor: '#10B981',
                iconBackground: ''
            },
            {
                id: '2',
                icon: icons.exclamation,
                label: 'Low Stock',
                value: lowStockCount.toString(),
                iconColor: '#EF4444',
                iconBackground: ''
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

    const handleDeleteIngredient = async (ingredientId: string) => {
        Alert.alert(
            'Delete Ingredient',
            'Are you sure you want to delete this ingredient?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingIngredientId(ingredientId);
                        try {
                            console.log('Deleting ingredient:', ingredientId);
                            await ingredientsService.deleteIngredient(ingredientId);
                            console.log('Ingredient deleted successfully');
                            
                            // Refresh the ingredients list
                            await fetchIngredients();
                            
                            // Show success message
                            Alert.alert('Success', 'Ingredient deleted successfully.');
                        } catch (err: any) {
                            const apiError = err as ApiError;
                            console.error('Error deleting ingredient:', apiError);
                            Alert.alert(
                                'Error',
                                apiError.message || 'Failed to delete ingredient. Please try again.'
                            );
                        } finally {
                            setDeletingIngredientId(null);
                        }
                    },
                },
            ]
        );
    };

    const handleAddIngredient = (formData: any) => {
        console.log('New ingredient data:', formData);

        // Note: In a real app, you would call an API to add the ingredient
        // For now, we'll refresh the list to get the latest data from the server
        // This ensures consistency with the backend data
        
        // Refresh ingredients list after adding
        fetchIngredients();
        
        console.log('Ingredient added successfully! List refreshed.');
    };

    const handleEditIngredient = (ingredient: ComponentIngredient) => {
        setEditingIngredient(ingredient);
        setIsEditModalVisible(true);
    };

    const handleUpdateIngredient = async (formData: any) => {
        if (!editingIngredient) return;

        setIsUpdating(true);
        try {
            console.log('Updating ingredient:', editingIngredient.id, formData);
            
            const updateData: UpdateIngredientRequest = {
                name: formData.name,
                unit: formData.unit,
                quantity: parseFloat(formData.quantity),
                purchase_price: parseFloat(formData.purchase_price),
                waste_percent: parseFloat(formData.waste_percent),
                supplier: formData.supplier,
            };

            await ingredientsService.updateIngredient(editingIngredient.id, updateData);
            console.log('Ingredient updated successfully');
            
            // Close modal and refresh list
            setIsEditModalVisible(false);
            setEditingIngredient(null);
            await fetchIngredients();
            
            Alert.alert('Success', 'Ingredient updated successfully.');
        } catch (err: any) {
            const apiError = err as ApiError;
            console.error('Error updating ingredient:', apiError);
            Alert.alert(
                'Error',
                apiError.message || 'Failed to update ingredient. Please try again.'
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const closeEditModal = () => {
        setIsEditModalVisible(false);
        setEditingIngredient(null);
    };

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
        
        setIsUploading(true);
        
        try {
            // Call the API to upload the file
            // Pass file object with uri, name, and type
            const response = await fileService.uploadDocument({
                uri: file.uri,
                name: file.name,
                type: file.type,
            });
            
            console.log('File uploaded successfully:', response);
            
            // Show success message with summary
            const summary = response.summary;
            Alert.alert(
                'Success',
                `${response.message}\n\n` +
                `Files processed: ${summary.successfullyProcessed}/${summary.totalFiles}\n` +
                `Ingredients created: ${summary.ingredientsCreated}\n` +
                `Ingredients updated: ${summary.ingredientsUpdated}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Refresh ingredients list after successful upload
                            fetchIngredients();
                        }
                    }
                ]
            );
        } catch (error: any) {
            const apiError = error as ApiError;
            console.error('File upload error:', apiError);
            Alert.alert('Error', apiError.message || 'Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
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
                            style={[styles.filterButton, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }]}
                            onPress={handleUploadDoc}
                        >
                            <Ionicons name="cloud-upload-outline" size={wp(4)} color={colors.black} />
                            <Text style={[styles.filterButtonText, { color: colors.black }]}>Upload Doc</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Row 2: Export CSV & Import CSV */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }]}>
                            <Image source={icons.export} style={[styles.buttonIcon, { tintColor: colors.black }]} />
                            <Text style={[styles.filterButtonText, { color: colors.black }]}>Export CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }]}>
                            <Ionicons name="cloud-download-outline" size={wp(4)} color={colors.black} />
                            <Text style={[styles.filterButtonText, { color: colors.black }]}>Import CSV</Text>
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
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.brown} />
                        <Text style={[styles.loadingText, { color: colors.gray }]}>Loading ingredients...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: colors.brown }]}
                            onPress={fetchIngredients}
                        >
                            <Text style={[styles.retryButtonText, { color: colors.white }]}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : ingredients.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.gray }]}>No ingredients found</Text>
                    </View>
                ) : (
                    <View style={styles.ingredientsList}>
                        {ingredients.map((ingredient) => (
                            <IngredientItem
                                key={ingredient.id}
                                ingredient={ingredient}
                                onPress={() => handleIngredientPress(ingredient.id)}
                                onDelete={handleDeleteIngredient}
                                onEdit={handleEditIngredient}
                                isDeleting={deletingIngredientId === ingredient.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Add Ingredient Modal */}
            <AddIngredientModal
                visible={isModalVisible}
                onClose={closeModal}
                onSubmit={handleAddIngredient}
            />

            {/* Edit Ingredient Modal */}
            <EditIngredientModal
                visible={isEditModalVisible}
                onClose={closeEditModal}
                onSubmit={handleUpdateIngredient}
                ingredient={editingIngredient ? {
                    id: editingIngredient.id,
                    name: editingIngredient.name,
                    unit: editingIngredient.unit,
                    quantity: editingIngredient.quantity,
                    cost: editingIngredient.cost,
                    waste: editingIngredient.waste,
                    supplier: editingIngredient.supplier,
                } : null}
            />

            {/* Upload Loading Modal */}
            <Modal
                visible={isUploading}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.loaderOverlay}>
                    <View style={[styles.loaderContainer, { backgroundColor: colors.primary }]}>
                        <ActivityIndicator size="large" color={colors.brown} />
                        <Text style={[styles.loaderText, { color: colors.black }]}>Uploading file...</Text>
                        <Text style={[styles.loaderSubtext, { color: colors.gray }]}>Please wait</Text>
                    </View>
                </View>
            </Modal>
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
        height: hp(5),
        borderWidth: 1,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    filterButtonText: {
        fontSize: wp(3.2),
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
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginLeft: wp(2),
    },
    buttonIcon: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
    },
    ingredientsList: {
        marginTop: hp(2),
    },
    loaderOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        borderRadius: wp(3),
        padding: wp(6),
        alignItems: 'center',
        minWidth: wp(60),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loaderText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginTop: hp(2),
    },
    loaderSubtext: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    loadingContainer: {
        padding: wp(8),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp(20),
    },
    loadingText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(2),
    },
    errorContainer: {
        padding: wp(6),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp(15),
    },
    errorText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        textAlign: 'center',
        marginBottom: hp(2),
    },
    retryButton: {
        paddingHorizontal: wp(6),
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        marginTop: hp(1),
    },
    retryButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
    },
    emptyContainer: {
        padding: wp(8),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp(15),
    },
    emptyText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
})