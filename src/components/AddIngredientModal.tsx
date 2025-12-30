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
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
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
    const { colors } = useTheme();
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
            <Text style={[styles.label, { color: colors.brown }]}>
                {label}{required && <Text style={[styles.required, { color: colors.red }]}>*</Text>}
            </Text>
            <TouchableOpacity
                style={[
                    styles.dropdownContainer,
                    { borderColor: colors.brown, backgroundColor: '#F5F5F5' },
                    error && [styles.inputError, { borderColor: colors.red }]
                ]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.dropdownText,
                    { color: colors.black },
                    value === '' && [styles.placeholderText, { color: colors.gray }]
                ]}>
                    {value || `Select ${label.toLowerCase()}`}
                </Text>
                <Image
                    source={icons.profit}
                    style={[
                        styles.dropdownIcon,
                        isOpen && styles.dropdownIconRotated
                    ]}
                    tintColor={colors.gray}
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={[styles.dropdownList, { backgroundColor: colors.white, borderColor: colors.lightgray, shadowColor: colors.black }]}>
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
                                <Text style={[styles.dropdownItemText, { color: colors.black }]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {error && (
                <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
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
                <View style={[styles.modalContainer, { backgroundColor: colors.primary }]}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={[styles.closeButtonText, { color: colors.black }]}>×</Text>
                            </TouchableOpacity>
                            <Text style={[styles.title, { color: colors.brown }]}>Add New Ingredient</Text>
                            <Text style={[styles.subtitle, { color: colors.black }]}>Add a new ingredient with waste-aware costing</Text>

                        </View>

                        {/* Form */}
                        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                            {/* Name */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>
                                    Name<Text style={[styles.required, { color: colors.red }]}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { borderColor: colors.brown, backgroundColor: '#F5F5F5', color: colors.black },
                                        validationErrors.name && [styles.inputError, { borderColor: colors.red }]
                                    ]}
                                    placeholder="e.g., Oat Milk"
                                    placeholderTextColor={colors.gray}
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                />
                                {validationErrors.name && (
                                    <Text style={[styles.errorText, { color: colors.red }]}>{validationErrors.name}</Text>
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
                                    <Text style={[styles.label, { color: colors.brown }]}>Package Size</Text>
                                    <TextInput
                                        style={[styles.textInput, { borderColor: colors.brown, backgroundColor: '#F5F5F5', color: colors.black }]}
                                        placeholder="1"
                                        placeholderTextColor={colors.gray}
                                        value={formData.packageSize}
                                        onChangeText={(value) => handleInputChange('packageSize', value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Purchase Price */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>
                                    Purchase Price ($)<Text style={[styles.required, { color: colors.red }]}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { borderColor: colors.brown, backgroundColor: '#F5F5F5', color: colors.black },
                                        validationErrors.purchasePrice && [styles.inputError, { borderColor: colors.red }]
                                    ]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.gray}
                                    value={formData.purchasePrice}
                                    onChangeText={(value) => handleInputChange('purchasePrice', value)}
                                    keyboardType="numeric"
                                />
                                {validationErrors.purchasePrice && (
                                    <Text style={[styles.errorText, { color: colors.red }]}>{validationErrors.purchasePrice}</Text>
                                )}
                            </View>

                            {/* Waste Percentage */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>Waste %</Text>
                                <TextInput
                                    style={[styles.textInput, { borderColor: colors.brown, backgroundColor: '#F5F5F5', color: colors.black }]}
                                    placeholder="5"
                                    placeholderTextColor={colors.gray}
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
                                <Text style={[styles.label, { color: colors.brown }]}>Current Stock Level</Text>
                                <TextInput
                                    style={[styles.textInput, { borderColor: colors.brown, backgroundColor: '#F5F5F5', color: colors.black }]}
                                    placeholder="0"
                                    placeholderTextColor={colors.gray}
                                    value={formData.currentStockLevel}
                                    onChangeText={(value) => handleInputChange('currentStockLevel', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={[styles.actionButtons, { borderTopColor: colors.lightgray }]}>
                            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.white, borderColor: colors.lightgray }]} onPress={onClose}>
                                <Text style={[styles.cancelButtonText, { color: '#000000' }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.brown }]} onPress={handleSubmit}>
                                <Text style={[styles.submitButtonText, { color: colors.white }]}>Add Ingredient</Text>
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
        marginBottom: hp(0.5),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
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
        marginBottom: hp(0.5),
    },
    required: {
        // color is set dynamically
    },
    textInput: {
        height: hp(6),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
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
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
        flex: 1,
    },
    placeholderText: {
        // color is set dynamically
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
        borderWidth: 1,
        borderRadius: wp(2),
        maxHeight: hp(20),
        zIndex: 1000,
        elevation: 5,
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
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        borderTopWidth: .5,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        borderWidth: 1,
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    submitButton: {
        flex: 1,
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    inputError: {
        // borderColor is set dynamically
    },
    errorText: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
        marginLeft: wp(1),
    },
});

export default AddIngredientModal; 