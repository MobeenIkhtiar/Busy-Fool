import React, { useState, useEffect } from 'react';
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

interface EditIngredientModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: EditIngredientFormData) => void;
    ingredient: {
        id: string;
        name: string;
        unit: string;
        quantity: number;
        cost: number;
        waste?: number;
        supplier?: string;
    } | null;
}

interface EditIngredientFormData {
    name: string;
    unit: string;
    quantity: string;
    purchase_price: string;
    waste_percent: string;
    supplier: string;
}

interface ValidationErrors {
    name?: string;
    unit?: string;
    quantity?: string;
    purchase_price?: string;
    waste_percent?: string;
    supplier?: string;
}

const EditIngredientModal: React.FC<EditIngredientModalProps> = ({
    visible,
    onClose,
    onSubmit,
    ingredient,
}) => {
    const { colors } = useTheme();
    const [formData, setFormData] = useState<EditIngredientFormData>({
        name: '',
        unit: '',
        quantity: '',
        purchase_price: '',
        waste_percent: '',
        supplier: '',
    });

    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const units = [
        'kg',
        'L',
        'g',
        'ml',
        'oz',
        'lb',
        'pcs',
        'pack',
        'unit'
    ];

    const suppliers = [
        'Coffee Roasters Ltd',
        'Fresh Dairy Co.',
        'Flavor Masters',
        'Sweet Supply Co.',
        'Premium Ingredients',
        'Local Market',
        'Allan Reeder Ltd.',
        'Galeta Limited',
        'Brakes',
        'Other'
    ];

    // Pre-fill form when ingredient changes
    useEffect(() => {
        if (ingredient) {
            setFormData({
                name: ingredient.name || '',
                unit: ingredient.unit || '',
                quantity: ingredient.quantity?.toString() || '',
                purchase_price: ingredient.cost?.toString() || '',
                waste_percent: ingredient.waste?.toString() || '',
                supplier: ingredient.supplier || '',
            });
            setValidationErrors({});
        }
    }, [ingredient]);

    const handleInputChange = (field: keyof EditIngredientFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = () => {
        // Clear previous validation errors
        setValidationErrors({});

        const errors: ValidationErrors = {};

        // Validate required fields
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.unit) {
            errors.unit = 'Unit is required';
        }
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
            errors.quantity = 'Quantity is required and must be greater than 0';
        }
        if (!formData.purchase_price || parseFloat(formData.purchase_price) <= 0) {
            errors.purchase_price = 'Purchase Price is required and must be greater than 0';
        }
        if (!formData.waste_percent || parseFloat(formData.waste_percent) < 0) {
            errors.waste_percent = 'Waste % is required and must be 0 or greater';
        }
        if (!formData.supplier.trim()) {
            errors.supplier = 'Supplier is required';
        }

        // If there are validation errors, display them and return
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        onSubmit(formData);
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
                    { borderColor: colors.brown, backgroundColor: colors.primary },
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

    if (!ingredient) return null;

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
                            <View style={styles.headerTop}>
                                <Text style={[styles.title, { color: colors.brown }]}>Edit Ingredient</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                    <Text style={[styles.closeButtonText, { color: colors.black }]}>×</Text>
                                </TouchableOpacity>
                            </View>
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
                                        { borderColor: colors.brown, backgroundColor: colors.primary, color: colors.black },
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

                            {/* Unit */}
                            {renderDropdown(
                                'Unit',
                                formData.unit,
                                units,
                                showUnitDropdown,
                                () => setShowUnitDropdown(!showUnitDropdown),
                                (value) => handleInputChange('unit', value),
                                true,
                                validationErrors.unit
                            )}

                            {/* Quantity */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>
                                    Quantity<Text style={[styles.required, { color: colors.red }]}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { borderColor: colors.brown, backgroundColor: colors.primary, color: colors.black },
                                        validationErrors.quantity && [styles.inputError, { borderColor: colors.red }]
                                    ]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.gray}
                                    value={formData.quantity}
                                    onChangeText={(value) => handleInputChange('quantity', value)}
                                    keyboardType="decimal-pad"
                                />
                                {validationErrors.quantity && (
                                    <Text style={[styles.errorText, { color: colors.red }]}>{validationErrors.quantity}</Text>
                                )}
                            </View>

                            {/* Purchase Price */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>
                                    Purchase Price (£)<Text style={[styles.required, { color: colors.red }]}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { borderColor: colors.brown, backgroundColor: colors.primary, color: colors.black },
                                        validationErrors.purchase_price && [styles.inputError, { borderColor: colors.red }]
                                    ]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.gray}
                                    value={formData.purchase_price}
                                    onChangeText={(value) => handleInputChange('purchase_price', value)}
                                    keyboardType="decimal-pad"
                                />
                                {validationErrors.purchase_price && (
                                    <Text style={[styles.errorText, { color: colors.red }]}>{validationErrors.purchase_price}</Text>
                                )}
                            </View>

                            {/* Waste Percentage */}
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.brown }]}>
                                    Waste %<Text style={[styles.required, { color: colors.red }]}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { borderColor: colors.brown, backgroundColor: colors.primary, color: colors.black },
                                        validationErrors.waste_percent && [styles.inputError, { borderColor: colors.red }]
                                    ]}
                                    placeholder="5.00"
                                    placeholderTextColor={colors.gray}
                                    value={formData.waste_percent}
                                    onChangeText={(value) => handleInputChange('waste_percent', value)}
                                    keyboardType="decimal-pad"
                                />
                                {validationErrors.waste_percent && (
                                    <Text style={[styles.errorText, { color: colors.red }]}>{validationErrors.waste_percent}</Text>
                                )}
                            </View>

                            {/* Supplier */}
                            {renderDropdown(
                                'Supplier',
                                formData.supplier,
                                suppliers,
                                showSupplierDropdown,
                                () => setShowSupplierDropdown(!showSupplierDropdown),
                                (value) => handleInputChange('supplier', value),
                                true,
                                validationErrors.supplier
                            )}

                            {/* Action Buttons */}
                            <View style={[styles.actionButtons, { borderTopColor: colors.lightgray }]}>
                                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.white, borderColor: colors.brown }]} onPress={onClose}>
                                    <Text style={[styles.cancelButtonText, { color: colors.brown }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.brown }]} onPress={handleSubmit}>
                                    <Text style={[styles.submitButtonText, { color: colors.white }]}>Update Ingredient</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    },
    modalContent: {
        flex: 1,
    },
    header: {
        paddingHorizontal: wp(5),
        paddingTop: hp(3),
        paddingBottom: hp(1),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
    closeButton: {
        width: wp(8),
        height: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
    },
    formContainer: {
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        paddingBottom: hp(3),
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
        paddingTop: hp(3),
        paddingBottom: hp(1),
        marginTop: hp(2),
        borderTopWidth: 0.5,
    },
    cancelButton: {
        flex: 1,
        height: hp(5),
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
        height: hp(5),
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

export default EditIngredientModal;

