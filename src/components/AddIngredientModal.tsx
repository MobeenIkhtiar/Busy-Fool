import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface AddIngredientModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: IngredientFormData) => void;
}

interface IngredientFormData {
    name: string;
    category: string;
    unit: string;
    packageSize: string;
    purchasePrice: string;
    wastePercentage: string;
    supplier: string;
    currentStockLevel: string;
}

interface ValidationErrors {
    name?: string;
    category?: string;
    purchasePrice?: string;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<IngredientFormData>({
        name: '',
        category: '',
        unit: '',
        packageSize: '1',
        purchasePrice: '0.00',
        wastePercentage: '',
        supplier: '',
        currentStockLevel: '',
    });

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const categories = [
        'Coffee',
        'Dairy',
        'Flavoring',
        'Sweetener',
        'Tea',
        'Syrup',
        'Topping',
        'Other'
    ];

    const units = [
        'kg',
        'L',
        'g',
        'ml',
        'oz',
        'lb',
        'pcs',
        'pack'
    ];

    const suppliers = [
        'Coffee Roasters Ltd',
        'Fresh Dairy Co.',
        'Flavor Masters',
        'Sweet Supply Co.',
        'Premium Ingredients',
        'Local Market',
        'Other'
    ];

    const handleInputChange = (field: keyof IngredientFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Clear previous validation errors
        setValidationErrors({});

        const errors: ValidationErrors = {};

        // Validate required fields
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.category) {
            errors.category = 'Category is required';
        }
        if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
            errors.purchasePrice = 'Purchase Price is required and must be greater than 0';
        }

        // If there are validation errors, display them and return
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        onSubmit(formData);
        onClose();
        // Reset form
        setFormData({
            name: '',
            category: '',
            unit: '',
            packageSize: '1',
            purchasePrice: '0.00',
            wastePercentage: '',
            supplier: '',
            currentStockLevel: '',
        });
        setValidationErrors({});
    };

    const renderDropdown = (
        label: string,
        value: string,
        options: string[],
        isOpen: boolean,
        onToggle: () => void,
        onSelect: (value: string) => void,
        required: boolean = false,
        error?: string
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}{required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
                style={[
                    styles.dropdownContainer,
                    error && styles.inputError
                ]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.dropdownText,
                    value === '' && styles.placeholderText
                ]}>
                    {value || `Select ${label.toLowerCase()}`}
                </Text>
                <Image
                    source={icons.profit}
                    style={[
                        styles.dropdownIcon,
                        isOpen && styles.dropdownIconRotated
                    ]}
                    tintColor={COLORS.gray}
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onSelect(option);
                                    onToggle();
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Add New Ingredient</Text>
                            <Text style={styles.subtitle}>Add a new ingredient with waste-aware costing</Text>

                        </View>

                        {/* Form */}
                        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                            {/* Name */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>
                                    Name<Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        validationErrors.name && styles.inputError
                                    ]}
                                    placeholder="e.g., Oat Milk"
                                    placeholderTextColor={COLORS.gray}
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                />
                                {validationErrors.name && (
                                    <Text style={styles.errorText}>{validationErrors.name}</Text>
                                )}
                            </View>

                            {/* Category */}
                            {renderDropdown(
                                'Category',
                                formData.category,
                                categories,
                                showCategoryDropdown,
                                () => setShowCategoryDropdown(!showCategoryDropdown),
                                (value) => handleInputChange('category', value),
                                true,
                                validationErrors.category
                            )}

                            {/* Unit and Package Size Row */}
                            <View style={styles.rowContainer}>
                                <View style={[styles.inputContainer, styles.halfWidth]}>
                                    {renderDropdown(
                                        'Unit',
                                        formData.unit,
                                        units,
                                        showUnitDropdown,
                                        () => setShowUnitDropdown(!showUnitDropdown),
                                        (value) => handleInputChange('unit', value)
                                    )}
                                </View>
                                <View style={[styles.inputContainer, styles.halfWidth]}>
                                    <Text style={styles.label}>Package Size</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="1"
                                        placeholderTextColor={COLORS.gray}
                                        value={formData.packageSize}
                                        onChangeText={(value) => handleInputChange('packageSize', value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Purchase Price */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>
                                    Purchase Price ($)<Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        validationErrors.purchasePrice && styles.inputError
                                    ]}
                                    placeholder="0.00"
                                    placeholderTextColor={COLORS.gray}
                                    value={formData.purchasePrice}
                                    onChangeText={(value) => handleInputChange('purchasePrice', value)}
                                    keyboardType="numeric"
                                />
                                {validationErrors.purchasePrice && (
                                    <Text style={styles.errorText}>{validationErrors.purchasePrice}</Text>
                                )}
                            </View>

                            {/* Waste Percentage */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Waste %</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="5"
                                    placeholderTextColor={COLORS.gray}
                                    value={formData.wastePercentage}
                                    onChangeText={(value) => handleInputChange('wastePercentage', value)}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Supplier */}
                            {renderDropdown(
                                'Supplier',
                                formData.supplier,
                                suppliers,
                                showSupplierDropdown,
                                () => setShowSupplierDropdown(!showSupplierDropdown),
                                (value) => handleInputChange('supplier', value)
                            )}

                            {/* Current Stock Level */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Current Stock Level</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="0"
                                    placeholderTextColor={COLORS.gray}
                                    value={formData.currentStockLevel}
                                    onChangeText={(value) => handleInputChange('currentStockLevel', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Add Ingredient</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: wp(3),
        paddingTop: hp(4),
        paddingBottom: hp(5),
    },
    modalContent: {
        flex: 1,
    },
    header: {
        paddingHorizontal: wp(5),
        paddingTop: hp(3),
        paddingBottom: hp(1),
    },
    title: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        color: COLORS.black,
        marginBottom: hp(1),
        textAlign: 'center'
    },
    closeButton: {
        width: wp(8),
        alignSelf: 'flex-end',
        height: wp(8),
    },
    closeButtonText: {
        fontSize: wp(6),
        color: COLORS.black,
        fontFamily: FONT.bold,
    },
    formContainer: {
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        paddingBottom: hp(10),
    },
    inputContainer: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    required: {
        color: COLORS.red,
    },
    textInput: {
        height: hp(6),
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        backgroundColor: '#F5F5F5',
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
        color: COLORS.black,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: wp(3),
    },
    halfWidth: {
        flex: 1,
    },
    dropdownContainer: {
        height: hp(6),
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
        color: COLORS.black,
        flex: 1,
    },
    placeholderText: {
        color: COLORS.gray,
    },
    dropdownIcon: {
        width: wp(4),
        height: wp(4),
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }],
    },
    dropdownIconRotated: {
        transform: [{ rotate: '270deg' }],
    },
    dropdownList: {
        position: 'absolute',
        top: hp(6.5),
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightgray,
        borderRadius: wp(2),
        maxHeight: hp(20),
        zIndex: 1000,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownScroll: {
        maxHeight: hp(20),
    },
    dropdownItem: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
    },
    dropdownItemText: {
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
        color: COLORS.black,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        borderTopWidth: .5,
        borderTopColor: COLORS.lightgray,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightgray,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.black,
    },
    submitButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        backgroundColor: COLORS.brown,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.white,
    },
    inputError: {
        borderColor: COLORS.red,
    },
    errorText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        color: COLORS.red,
        marginTop: hp(0.5),
        marginLeft: wp(1),
    },
});

export default AddIngredientModal; 