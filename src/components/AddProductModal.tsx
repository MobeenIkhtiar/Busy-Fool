import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Ingredient, ProductIngredient } from '../services';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: ProductFormData) => Promise<void>;
    ingredients: Ingredient[];
    isSubmitting?: boolean;
}

export interface ProductFormData {
    name: string;
    category: string;
    sell_price: string;
    ingredients: Array<{
        id: string | number;
        name: string;
        unit: string;
        selectedQuantity: number;
        selectedUnit: string;
        is_optional: boolean;
    }>;
    image: string | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
    visible,
    onClose,
    onSubmit,
    ingredients,
    isSubmitting = false,
}) => {
    const { colors, theme } = useTheme();
    const [step, setStep] = useState(0);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: '',
        sell_price: '',
        ingredients: [],
        image: null,
    });

    const categories = ['Coffee', 'Food', 'Iced Drinks', 'Pastries'];
    const steps = ['Details', 'Ingredients', 'Review'];

    useEffect(() => {
        if (visible) {
            setStep(0);
            setFormData({
                name: '',
                category: '',
                sell_price: '',
                ingredients: [],
                image: null,
            });
            setSearch('');
            setError('');
        }
    }, [visible]);

    const handleImagePicker = () => {
        Alert.alert(
            'Select Product Image',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        const options: CameraOptions = {
                            mediaType: 'photo',
                            quality: 0.8,
                            maxWidth: 800,
                            maxHeight: 800,
                        };
                        launchCamera(options, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets[0] && response.assets[0].uri) {
                                setFormData({ ...formData, image: response.assets[0].uri });
                                setError('');
                            }
                        });
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        const options: ImageLibraryOptions = {
                            mediaType: 'photo',
                            quality: 0.8,
                            maxWidth: 800,
                            maxHeight: 800,
                        };
                        launchImageLibrary(options, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets[0] && response.assets[0].uri) {
                                setFormData({ ...formData, image: response.assets[0].uri });
                                setError('');
                            }
                        });
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const toggleIngredient = (ingredient: Ingredient, checked: boolean) => {
        if (checked) {
            if (formData.ingredients.some((i) => i.id === ingredient.id)) return;
            setFormData({
                ...formData,
                ingredients: [
                    ...formData.ingredients,
                    {
                        id: ingredient.id,
                        name: ingredient.name,
                        unit: ingredient.unit,
                        selectedQuantity: 1,
                        selectedUnit: ingredient.unit === 'L' ? 'ml' : ingredient.unit === 'kg' ? 'g' : ingredient.unit,
                        is_optional: false,
                    },
                ],
            });
        } else {
            setFormData({
                ...formData,
                ingredients: formData.ingredients.filter((i) => i.id !== ingredient.id),
            });
        }
    };

    const updateIngredientQuantity = (ingredientId: string | number, quantity: number) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.map((i) =>
                i.id === ingredientId ? { ...i, selectedQuantity: Math.max(1, quantity) } : i
            ),
        });
    };

    const toggleOptional = (ingredientId: string | number, isOptional: boolean) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.map((i) =>
                i.id === ingredientId ? { ...i, is_optional: isOptional } : i
            ),
        });
    };

    const handleNext = () => {
        setError('');
        if (step === 0) {
            if (!formData.name || !formData.category || !formData.sell_price) {
                setError('Please fill all product details.');
                return;
            }
            const price = parseFloat(formData.sell_price);
            if (isNaN(price) || price <= 0) {
                setError('Please enter a valid price greater than 0.');
                return;
            }
        }
        if (step === 1) {
            if (formData.ingredients.length === 0) {
                setError('Select at least one ingredient.');
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setError('');
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to add product. Please try again.');
        }
    };

    const filteredIngredients = ingredients.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    // Step 0: Details
    const detailsStep = (
        <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>Product Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.primary, color: colors.black, borderColor: colors.lightgray }]}
                    placeholder="Enter product name"
                    placeholderTextColor={colors.gray}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>Category</Text>
                <TouchableOpacity
                    style={[styles.dropdownContainer, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                    onPress={() => setIsCategoryDropdownVisible(true)}
                >
                    <Text style={[styles.dropdownText, { color: formData.category ? colors.black : colors.gray }]}>
                        {formData.category || 'Select category'}
                    </Text>
                    <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>Sell Price (£)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.primary, color: colors.black, borderColor: colors.lightgray }]}
                    placeholder="0.00"
                    placeholderTextColor={colors.gray}
                    value={formData.sell_price}
                    onChangeText={(text) => setFormData({ ...formData, sell_price: text })}
                    keyboardType="decimal-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>Product Image</Text>
                {formData.image ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setFormData({ ...formData, image: null })}
                        >
                            <Ionicons name="close-circle" size={wp(6)} color={colors.red} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.imageUploadButton, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                        onPress={handleImagePicker}
                    >
                        <Ionicons name="camera-outline" size={wp(6)} color={colors.brown} />
                        <Text style={[styles.imageUploadText, { color: colors.black }]}>Click to upload</Text>
                        <Text style={[styles.imageUploadHint, { color: colors.gray }]}>PNG, JPG, GIF, WEBP (MAX. 5MB)</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    // Step 1: Ingredients
    const ingredientsStep = (
        <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>Search Ingredients</Text>
                <View style={[styles.searchContainer, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}>
                    <Ionicons name="search" size={wp(4)} color={colors.gray} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.black }]}
                        placeholder="Search by name..."
                        placeholderTextColor={colors.gray}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView style={[styles.ingredientsList, { backgroundColor: colors.primary, borderColor: colors.lightgray }]} nestedScrollEnabled>
                {filteredIngredients.length === 0 ? (
                    <Text style={[styles.emptyText, { color: colors.gray }]}>No ingredients found.</Text>
                ) : (
                    filteredIngredients.map((ingredient) => {
                        const checked = formData.ingredients.some((i) => i.id === ingredient.id);
                        const selected = formData.ingredients.find((i) => i.id === ingredient.id);
                        const costPerUnit = Number(ingredient.cost_per_unit) || 0;
                        const costPerMl = Number(ingredient.cost_per_ml) || 0;
                        const costPerGram = Number(ingredient.cost_per_gram) || 0;
                        const price = ingredient.unit === 'ml' || ingredient.unit === 'L' ? costPerMl : ingredient.unit === 'g' || ingredient.unit === 'kg' ? costPerGram : costPerUnit;

                        return (
                            <View
                                key={ingredient.id}
                                style={[styles.ingredientItem, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }]}
                            >
                                <TouchableOpacity
                                    style={styles.ingredientCheckbox}
                                    onPress={() => toggleIngredient(ingredient, !checked)}
                                >
                                    <Ionicons
                                        name={checked ? 'checkbox' : 'checkbox-outline'}
                                        size={wp(5)}
                                        color={checked ? colors.brown : colors.gray}
                                    />
                                </TouchableOpacity>
                                <View style={styles.ingredientInfo}>
                                    <Text style={[styles.ingredientName, { color: colors.black }]}>{ingredient.name}</Text>
                                    <Text style={[styles.ingredientPrice, { color: colors.gray }]}>£{price.toFixed(4)}</Text>
                                </View>
                                {checked && selected && (
                                    <View style={styles.ingredientControls}>
                                        <View style={styles.quantityContainer}>
                                            <TextInput
                                                style={[styles.quantityInput, { backgroundColor: colors.primary, color: colors.black, borderColor: colors.lightgray }]}
                                                value={String(selected.selectedQuantity)}
                                                onChangeText={(text) => {
                                                    const val = Math.max(1, parseInt(text) || 1);
                                                    updateIngredientQuantity(ingredient.id, val);
                                                }}
                                                keyboardType="numeric"
                                            />
                                            <Text style={[styles.unitText, { color: colors.gray }]}>
                                                {ingredient.unit === 'L' ? 'ml' : ingredient.unit === 'kg' ? 'g' : ingredient.unit}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.optionalCheckbox}
                                            onPress={() => toggleOptional(ingredient.id, !selected.is_optional)}
                                        >
                                            <Ionicons
                                                name={selected.is_optional ? 'checkbox' : 'checkbox-outline'}
                                                size={wp(4)}
                                                color={selected.is_optional ? colors.brown : colors.gray}
                                            />
                                            <Text style={[styles.optionalLabel, { color: colors.black }]}>Optional</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );

    // Step 2: Review
    const reviewStep = (
        <View style={styles.stepContent}>
            <Text style={[styles.reviewTitle, { color: colors.black }]}>Review Product</Text>
            <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, { color: colors.gray }]}>Name:</Text>
                <Text style={[styles.reviewValue, { color: colors.black }]}>{formData.name}</Text>
            </View>
            <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, { color: colors.gray }]}>Category:</Text>
                <Text style={[styles.reviewValue, { color: colors.black }]}>{formData.category}</Text>
            </View>
            <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, { color: colors.gray }]}>Sell Price:</Text>
                <Text style={[styles.reviewValue, { color: colors.black }]}>£{formData.sell_price}</Text>
            </View>
            <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, { color: colors.gray }]}>Ingredients:</Text>
                {formData.ingredients.map((ing) => (
                    <Text key={ing.id} style={[styles.reviewIngredient, { color: colors.black }]}>
                        • {ing.name} ({ing.selectedQuantity} {ing.selectedUnit}){ing.is_optional ? ' (Optional)' : ''}
                    </Text>
                ))}
            </View>
        </View>
    );

    const handleCategorySelect = (category: string) => {
        setFormData({ ...formData, category });
        setIsCategoryDropdownVisible(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.primary }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.black }]}>Add New Product</Text>
                        <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                            <Ionicons name="close" size={wp(6)} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                    {/* Stepper */}
                    <View style={styles.stepper}>
                        {steps.map((label, idx) => (
                            <View key={label} style={styles.stepIndicator}>
                                <View
                                    style={[
                                        styles.stepCircle,
                                        {
                                            backgroundColor: step === idx ? colors.brown : colors.lightgray,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.stepNumber, { color: step === idx ? colors.white : colors.black }]}>
                                        {idx + 1}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.stepLabel,
                                        {
                                            color: step === idx ? colors.brown : colors.gray,
                                        },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Step Content */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {step === 0 && detailsStep}
                        {step === 1 && ingredientsStep}
                        {step === 2 && reviewStep}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
                            </View>
                        ) : null}
                    </ScrollView>

                    {/* Stepper Controls */}
                    <View style={styles.controls}>
                        {step > 0 && (
                            <TouchableOpacity
                                style={[styles.backButton, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                                onPress={handleBack}
                                disabled={isSubmitting}
                            >
                                <Text style={[styles.backButtonText, { color: colors.black }]}>Back</Text>
                            </TouchableOpacity>
                        )}
                        {step < steps.length - 1 ? (
                            <TouchableOpacity
                                style={[styles.nextButton, { backgroundColor: colors.brown }]}
                                onPress={handleNext}
                                disabled={isSubmitting}
                            >
                                <Text style={[styles.nextButtonText, { color: colors.white }]}>Next</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: colors.brown }]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={colors.white} />
                                ) : (
                                    <Text style={[styles.submitButtonText, { color: colors.white }]}>Add Product</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Category Dropdown Modal - Rendered inside main modal for proper z-index */}
                {isCategoryDropdownVisible && (
                    <View style={styles.categoryModalOverlay} pointerEvents="box-none">
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill}
                            activeOpacity={1}
                            onPress={() => setIsCategoryDropdownVisible(false)}
                        />
                        <View style={[
                            styles.categoryDropdownContainer, 
                            { 
                                backgroundColor: colors.primary,
                                borderWidth: theme === 'dark' ? 2 : 0,
                                borderColor: theme === 'dark' ? colors.lightWhite : 'transparent',
                            }
                        ]}>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryDropdownItem,
                                            { borderBottomColor: colors.lightgray },
                                            formData.category === item && [styles.categorySelectedItem, { backgroundColor: colors.brown + '20' }]
                                        ]}
                                        onPress={() => handleCategorySelect(item)}
                                    >
                                        {formData.category === item && (
                                            <Ionicons name="checkmark" size={wp(4)} color={colors.brown} style={styles.categoryCheckIcon} />
                                        )}
                                        <Text style={[
                                            styles.categoryDropdownItemText,
                                            { color: colors.black },
                                            formData.category === item && [styles.categorySelectedItemText, { color: colors.brown }]
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddProductModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '90%',
        borderRadius: wp(4),
        padding: wp(5),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    modalTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
    stepper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(3),
    },
    stepIndicator: {
        flex: 1,
        alignItems: 'center',
    },
    stepCircle: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumber: {
        fontSize: wp(3.5),
        fontFamily: FONT.bold,
    },
    stepLabel: {
        fontSize: wp(2.5),
        fontFamily: FONT.medium,
        marginTop: hp(0.5),
    },
    content: {
        maxHeight: hp(50),
        marginBottom: hp(2),
    },
    stepContent: {
        paddingVertical: hp(1),
    },
    inputGroup: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginBottom: hp(1),
    },
    input: {
        height: hp(5.5),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        fontSize: wp(4),
        fontFamily: FONT.regular,
    },
    dropdownContainer: {
        height: hp(5.5),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: wp(4),
        fontFamily: FONT.regular,
    },
    categoryModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 1000,
    },
    categoryDropdownContainer: {
        borderRadius: wp(2),
        maxHeight: hp(40),
        width: wp(80),
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 1001,
        zIndex: 1001,
    },
    categoryDropdownItem: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categorySelectedItem: {
        // backgroundColor is set dynamically
    },
    categoryCheckIcon: {
        marginRight: wp(3),
    },
    categoryDropdownItemText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
    },
    categorySelectedItemText: {
        fontFamily: FONT.semiBold,
    },
    imageUploadButton: {
        height: hp(12),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(4),
    },
    imagePreviewContainer: {
        position: 'relative',
        width: wp(32),
        height: wp(32),
        borderRadius: wp(2),
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: wp(1),
        right: wp(1),
    },
    imageUploadText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(1),
    },
    imageUploadHint: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(5),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
    },
    searchIcon: {
        marginRight: wp(2),
    },
    searchInput: {
        flex: 1,
        fontSize: wp(4),
        fontFamily: FONT.regular,
    },
    ingredientsList: {
        maxHeight: hp(30),
        borderWidth: 1,
        borderRadius: wp(2),
        padding: wp(2),
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(3),
        marginBottom: hp(1),
        borderRadius: wp(2),
        borderWidth: 1,
    },
    ingredientCheckbox: {
        marginRight: wp(3),
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    ingredientPrice: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginTop: hp(0.3),
    },
    ingredientControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    quantityInput: {
        width: wp(16),
        height: hp(4),
        borderWidth: 1,
        borderRadius: wp(1.5),
        paddingHorizontal: wp(2),
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        textAlign: 'center',
    },
    unitText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
    },
    optionalCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    optionalLabel: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
    },
    emptyText: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        textAlign: 'center',
        padding: hp(2),
    },
    reviewTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        marginBottom: hp(2),
    },
    reviewSection: {
        marginBottom: hp(1.5),
    },
    reviewLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    reviewValue: {
        fontSize: wp(4),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    reviewIngredient: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
        marginLeft: wp(2),
    },
    errorContainer: {
        marginTop: hp(2),
        padding: wp(3),
        borderRadius: wp(2),
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    errorText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    controls: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(2),
    },
    backButton: {
        flex: 1,
        height: hp(5),
        borderWidth: 1,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
    },
    nextButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        color: '#FFFFFF',
    },
    submitButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
});

