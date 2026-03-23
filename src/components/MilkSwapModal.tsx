import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Product, Ingredient, MilkSwapResponse } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MilkSwapModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
    allIngredients: Ingredient[];
}

const MilkSwapModal: React.FC<MilkSwapModalProps> = ({
    visible,
    onClose,
    product,
    allIngredients,
}) => {
    const { colors, theme } = useTheme();
    const [step, setStep] = useState(0); // 0: selection, 1: result
    const [selectedOriginalIngredient, setSelectedOriginalIngredient] = useState<string | number>('');
    const [selectedNewIngredient, setSelectedNewIngredient] = useState<string | number>('');
    const [upcharge, setUpcharge] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localResult, setLocalResult] = useState<MilkSwapResponse | null>(null);
    const [isOriginalDropdownVisible, setIsOriginalDropdownVisible] = useState(false);
    const [isNewDropdownVisible, setIsNewDropdownVisible] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState('£');

    useEffect(() => {
        if (visible && product) {
            setSelectedOriginalIngredient('');
            setSelectedNewIngredient('');
            setUpcharge('');
            setLocalError('');
            setLocalResult(null);
            setStep(0);
            loadCurrency();
        }
    }, [visible, product]);

    const loadCurrency = async () => {
        try {
            const savedCurrency = await AsyncStorage.getItem('nina-currency');
            const currencyCode = savedCurrency || 'GBP';
            const symbols: { [key: string]: string } = { GBP: '£', EUR: '€', USD: '$' };
            setCurrencySymbol(symbols[currencyCode] || '£');
        } catch (error) {
            console.error('Error loading currency:', error);
        }
    };

    const getIngredientPrice = (ingredient: Ingredient): number => {
        if (ingredient.unit === 'ml' || ingredient.unit === 'L') {
            return Number(ingredient.cost_per_ml) || 0;
        }
        if (ingredient.unit === 'g' || ingredient.unit === 'kg') {
            return Number(ingredient.cost_per_gram) || 0;
        }
        return Number(ingredient.cost_per_unit) || 0;
    };

    const handleCalculateSwap = async () => {
        if (!product || !selectedOriginalIngredient || !selectedNewIngredient) {
            setLocalError('Please select both original and new ingredients.');
            return;
        }

        if (selectedOriginalIngredient === selectedNewIngredient) {
            setLocalError('Please select different ingredients for the swap.');
            return;
        }

        const upchargeValue = parseFloat(upcharge) || 0;
        if (upchargeValue < 0) {
            setLocalError('Upcharge cannot be negative.');
            return;
        }

        setLocalLoading(true);
        setLocalError('');

        try {
            const { productsService } = await import('../services');
            const result = await productsService.milkSwapAnalysis({
                productId: product.id,
                originalIngredientId: selectedOriginalIngredient,
                newIngredientId: selectedNewIngredient,
                upcharge: upchargeValue,
            });
            setLocalResult(result);
            setStep(1);
        } catch (error: any) {
            setLocalError(error.message || 'Failed to calculate milk swap analysis.');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedOriginalIngredient('');
        setSelectedNewIngredient('');
        setUpcharge('');
        setLocalError('');
        setLocalResult(null);
        setStep(0);
    };

    if (!visible || !product) return null;

    // Get product ingredients for selection
    const productIngredients = Array.isArray(product.ingredients)
        ? product.ingredients.map((i) => ({
              id: i.ingredient?.id || i.id,
              name: i.ingredient?.name || i.name,
          }))
        : [];

    // Get all available ingredients for new ingredient selection
    const availableIngredients = allIngredients.filter(
        (ing) => !productIngredients.some((prodIng) => prodIng.id === ing.id)
    );

    const currentPrice = Number(product.sell_price) || 0;
    const currentMarginPercent = Number(product.margin_percent) || 0;

    const selectedOriginalIngredientObj = productIngredients.find(
        (ing) => ing.id === selectedOriginalIngredient
    );
    const selectedNewIngredientObj = allIngredients.find(
        (ing) => ing.id === selectedNewIngredient
    );

    // Step 0: Selection
    const selectionStep = (
        <View style={styles.stepContent}>
            {/* Current Product Info */}
            <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
                <Text style={[styles.infoCardTitle, { color: colors.black }]}>
                    Current Product Details
                </Text>
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.gray }]}>Current Price:</Text>
                        <Text style={[styles.infoValue, { color: colors.black }]}>
                            {currencySymbol}{currentPrice.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.gray }]}>Current Margin:</Text>
                        <Text
                            style={[
                                styles.infoValue,
                                { color: currentMarginPercent >= 0 ? colors.green : colors.red },
                            ]}
                        >
                            {currentMarginPercent.toFixed(1)}%
                        </Text>
                    </View>
                </View>
            </View>

            {/* Ingredient Selection */}
            <View style={styles.selectionContainer}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.black }]}>
                        Original Ingredient (to replace)
                    </Text>
                    <TouchableOpacity
                        style={[styles.dropdownContainer, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                        onPress={() => setIsOriginalDropdownVisible(true)}
                    >
                        <Text style={[styles.dropdownText, { color: selectedOriginalIngredient ? colors.black : colors.gray }]}>
                            {selectedOriginalIngredientObj?.name || 'Select ingredient to replace'}
                        </Text>
                        <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.swapIconContainer}>
                    <Ionicons name="swap-horizontal" size={wp(6)} color={colors.brown} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.black }]}>
                        New Ingredient (replacement)
                    </Text>
                    <TouchableOpacity
                        style={[styles.dropdownContainer, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                        onPress={() => setIsNewDropdownVisible(true)}
                    >
                        <Text style={[styles.dropdownText, { color: selectedNewIngredient ? colors.black : colors.gray }]}>
                            {selectedNewIngredientObj
                                ? `${selectedNewIngredientObj.name} - ${currencySymbol}${getIngredientPrice(selectedNewIngredientObj).toFixed(4)}`
                                : 'Select replacement ingredient'}
                        </Text>
                        <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.black }]}>
                        Upcharge ({currencySymbol}) <Text style={[styles.optionalLabel, { color: colors.gray }]}>(optional)</Text>
                    </Text>
                    <TextInput
                        style={[styles.upchargeInput, { backgroundColor: colors.primary, color: colors.black, borderColor: colors.lightgray }]}
                        placeholder="0.00"
                        placeholderTextColor={colors.gray}
                        value={upcharge}
                        onChangeText={(text) => {
                            setUpcharge(text);
                            setLocalError('');
                        }}
                        keyboardType="decimal-pad"
                    />
                    <Text style={[styles.hintText, { color: colors.gray }]}>
                        Additional charge to customer for premium ingredient
                    </Text>
                </View>

                {localError ? (
                    <Text style={[styles.errorText, { color: colors.red }]}>{localError}</Text>
                ) : null}

                <TouchableOpacity
                    style={[
                        styles.calculateButton,
                        { backgroundColor: colors.brown },
                        (!selectedOriginalIngredient || !selectedNewIngredient || localLoading) && { opacity: 0.5 },
                    ]}
                    onPress={handleCalculateSwap}
                    disabled={localLoading || !selectedOriginalIngredient || !selectedNewIngredient}
                >
                    {localLoading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            <Ionicons name="shuffle-outline" size={wp(4)} color={colors.white} />
                            <Text style={[styles.calculateButtonText, { color: colors.white }]}>
                                Calculate Swap Impact
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    // Step 1: Result
    const resultStep = localResult ? (
        <View style={styles.stepContent}>
            {/* Results Header */}
            <View style={styles.resultHeader}>
                <View style={[styles.resultIconContainer, { backgroundColor: colors.brown + '20' }]}>
                    <Ionicons name="shuffle-outline" size={wp(8)} color={colors.brown} />
                </View>
                <Text style={[styles.resultTitle, { color: colors.black }]}>Swap Analysis Complete</Text>
                <Text style={[styles.resultSubtitle, { color: colors.gray }]}>
                    Here's how the ingredient swap would affect your margins
                </Text>
            </View>

            {/* Results Comparison */}
            <View style={[styles.resultsCard, { backgroundColor: colors.primary }]}>
                <Text style={[styles.resultsCardTitle, { color: colors.black }]}>Margin Comparison</Text>

                <View style={styles.marginComparisonGrid}>
                    <View style={[styles.marginCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderLeftColor: colors.gray }]}>
                        <Text style={[styles.marginLabel, { color: colors.gray }]}>Original Margin</Text>
                        <Text style={[styles.marginValue, { color: colors.black }]}>
                            {Number(localResult.originalMargin || 0).toFixed(2)}%
                        </Text>
                    </View>
                    <View style={[styles.marginCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderLeftColor: colors.green }]}>
                        <Text style={[styles.marginLabel, { color: colors.gray }]}>New Margin</Text>
                        <Text
                            style={[
                                styles.marginValue,
                                {
                                    color:
                                        Number(localResult.newMargin || 0) >= Number(localResult.originalMargin || 0)
                                            ? colors.green
                                            : colors.red,
                                },
                            ]}
                        >
                            {Number(localResult.newMargin || 0).toFixed(2)}%
                        </Text>
                    </View>
                </View>

                {/* Upcharge Coverage */}
                <View style={[styles.upchargeCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary }]}>
                    <View style={styles.upchargeHeader}>
                        <Text style={[styles.upchargeLabel, { color: colors.gray }]}>Upcharge Coverage</Text>
                        <View
                            style={[
                                styles.coverageBadge,
                                {
                                    backgroundColor: localResult.upchargeCovered
                                        ? '#DCFCE7'
                                        : '#FEE2E2',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.coverageText,
                                    {
                                        color: localResult.upchargeCovered ? '#166534' : '#DC2626',
                                    },
                                ]}
                            >
                                {localResult.upchargeCovered ? 'Covered' : 'Not Covered'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.upchargeDescription, { color: colors.gray }]}>
                        {localResult.upchargeCovered
                            ? 'The upcharge is sufficient to maintain profitability'
                            : 'The upcharge may not fully cover the increased cost'}
                    </Text>
                </View>
            </View>

            {/* Impact Summary */}
            <View style={[styles.impactCard, { backgroundColor: '#E9D5FF' }]}>
                <Text style={[styles.impactTitle, { color: '#6B21A8' }]}>Impact Summary</Text>
                <View style={styles.impactList}>
                    <View style={styles.impactRow}>
                        <Text style={[styles.impactLabel, { color: '#7C3AED' }]}>Margin Change:</Text>
                        <Text
                            style={[
                                styles.impactValue,
                                {
                                    color:
                                        Number(localResult.newMargin || 0) - Number(localResult.originalMargin || 0) >= 0
                                            ? colors.green
                                            : colors.red,
                                },
                            ]}
                        >
                            {Number(localResult.newMargin || 0) - Number(localResult.originalMargin || 0) >= 0 ? '+' : ''}
                            {(Number(localResult.newMargin || 0) - Number(localResult.originalMargin || 0)).toFixed(2)}%
                        </Text>
                    </View>
                    {upcharge && parseFloat(upcharge) > 0 && (
                        <View style={styles.impactRow}>
                            <Text style={[styles.impactLabel, { color: '#7C3AED' }]}>Applied Upcharge:</Text>
                            <Text style={[styles.impactValue, { color: colors.black }]}>
                                +{currencySymbol}{parseFloat(upcharge).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.brown, borderColor: colors.brown }]}
                    onPress={() => setStep(0)}
                >
                    <Text style={[styles.backButtonText, { color: colors.white }]}>Try Different Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: colors.brown }]}
                    onPress={handleClose}
                >
                    <Ionicons name="checkmark-circle" size={wp(4)} color={colors.white} />
                    <Text style={[styles.doneButtonText, { color: colors.white }]}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : null;

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
                            <View style={styles.headerLeft}>
                                <View style={[styles.headerIcon, { backgroundColor: colors.brown }]}>
                                    <Ionicons name="shuffle-outline" size={wp(4.5)} color={colors.white} />
                                </View>
                                <View style={styles.headerTextContainer}>
                                    <Text style={[styles.modalTitle, { color: colors.black }]}>
                                        Ingredient Swap Analysis
                                    </Text>
                                    <Text style={[styles.modalSubtitle, { color: colors.gray }]}>
                                        {product.name}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Ionicons name="close" size={wp(6)} color={colors.black} />
                            </TouchableOpacity>
                        </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {step === 0 && selectionStep}
                        {step === 1 && resultStep}
                    </ScrollView>

                    {/* Original Ingredient Dropdown - Rendered inside main modal for proper z-index */}
                    {isOriginalDropdownVisible && (
                        <View style={styles.dropdownModalOverlay} pointerEvents="box-none">
                            <TouchableOpacity
                                style={StyleSheet.absoluteFill}
                                activeOpacity={1}
                                onPress={() => setIsOriginalDropdownVisible(false)}
                            />
                            <View style={[
                                styles.dropdownModalContainer, 
                                { 
                                    backgroundColor: colors.primary,
                                    borderWidth: theme === 'dark' ? 2 : 0,
                                    borderColor: theme === 'dark' ? colors.lightWhite : 'transparent',
                                }
                            ]}>
                                <FlatList
                                    data={productIngredients}
                                    keyExtractor={(item) => String(item.id)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.dropdownItem,
                                                { borderBottomColor: colors.lightgray },
                                                selectedOriginalIngredient === item.id && [
                                                    styles.selectedDropdownItem,
                                                    { backgroundColor: colors.brown + '20' },
                                                ],
                                            ]}
                                            onPress={() => {
                                                if (item.id) {
                                                    setSelectedOriginalIngredient(item.id);
                                                    setIsOriginalDropdownVisible(false);
                                                    setLocalError('');
                                                }
                                            }}
                                        >
                                            {selectedOriginalIngredient === item.id && (
                                                <Ionicons name="checkmark" size={wp(4)} color={colors.brown} style={styles.checkIcon} />
                                            )}
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    { color: colors.black },
                                                    selectedOriginalIngredient === item.id && [
                                                        styles.selectedDropdownItemText,
                                                        { color: colors.brown },
                                                    ],
                                                ]}
                                            >
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    )}

                    {/* New Ingredient Dropdown - Rendered inside main modal for proper z-index */}
                    {isNewDropdownVisible && (
                        <View style={styles.dropdownModalOverlay} pointerEvents="box-none">
                            <TouchableOpacity
                                style={StyleSheet.absoluteFill}
                                activeOpacity={1}
                                onPress={() => setIsNewDropdownVisible(false)}
                            />
                            <View style={[
                                styles.dropdownModalContainer, 
                                { 
                                    backgroundColor: colors.primary,
                                    borderWidth: theme === 'dark' ? 2 : 0,
                                    borderColor: theme === 'dark' ? colors.lightWhite : 'transparent',
                                }
                            ]}>
                                <FlatList
                                    data={allIngredients}
                                    keyExtractor={(item) => String(item.id)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.dropdownItem,
                                                { borderBottomColor: colors.lightgray },
                                                selectedNewIngredient === item.id && [
                                                    styles.selectedDropdownItem,
                                                    { backgroundColor: colors.brown + '20' },
                                                ],
                                            ]}
                                            onPress={() => {
                                                if (item.id) {
                                                    setSelectedNewIngredient(item.id);
                                                    setIsNewDropdownVisible(false);
                                                    setLocalError('');
                                                }
                                            }}
                                        >
                                            {selectedNewIngredient === item.id && (
                                                <Ionicons name="checkmark" size={wp(4)} color={colors.brown} style={styles.checkIcon} />
                                            )}
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    { color: colors.black },
                                                    selectedNewIngredient === item.id && [
                                                        styles.selectedDropdownItemText,
                                                        { color: colors.brown },
                                                    ],
                                                ]}
                                            >
                                                {item.name} - {currencySymbol}{getIngredientPrice(item).toFixed(4)}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default MilkSwapModal;

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
        gap: wp(3),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2.5),
        flex: 1,
    },
    headerIcon: {
        width: wp(9),
        height: wp(9),
        borderRadius: wp(2.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        marginRight: wp(2),
    },
    modalTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
    closeButton: {
        padding: wp(1),
    },
    modalSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    content: {
        maxHeight: hp(60),
    },
    stepContent: {
        paddingVertical: hp(1),
    },
    infoCard: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
    },
    infoCardTitle: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1.5),
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(4),
    },
    infoItem: {
        flex: 1,
        minWidth: '45%',
    },
    infoLabel: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginBottom: hp(0.5),
    },
    infoValue: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
    },
    selectionContainer: {
        gap: hp(2),
    },
    inputGroup: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginBottom: hp(1),
    },
    optionalLabel: {
        fontSize: wp(3),
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
        flex: 1,
    },
    swapIconContainer: {
        alignItems: 'center',
        marginVertical: hp(1),
    },
    upchargeInput: {
        height: hp(5.5),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        fontSize: wp(4),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    hintText: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    errorText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(1),
    },
    calculateButton: {
        height: hp(5.5),
        borderRadius: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        marginTop: hp(1),
    },
    calculateButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    resultHeader: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    resultIconContainer: {
        width: wp(16),
        height: wp(16),
        borderRadius: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    resultTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    resultSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        textAlign: 'center',
    },
    resultsCard: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
    },
    resultsCardTitle: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginBottom: hp(2),
    },
    marginComparisonGrid: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
    marginCard: {
        flex: 1,
        borderRadius: wp(2),
        padding: wp(3),
        borderLeftWidth: 4,
    },
    marginLabel: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginBottom: hp(0.5),
    },
    marginValue: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
    },
    upchargeCard: {
        borderRadius: wp(2),
        padding: wp(4),
    },
    upchargeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    upchargeLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    coverageBadge: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(3),
    },
    coverageText: {
        fontSize: wp(2.5),
        fontFamily: FONT.semiBold,
    },
    upchargeDescription: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
    },
    impactCard: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
    },
    impactTitle: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1.5),
    },
    impactList: {
        gap: hp(1),
    },
    impactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    impactLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    impactValue: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    actionButtons: {
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
    doneButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    doneButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    dropdownModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 1000,
    },
    dropdownModalContainer: {
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
    dropdownItem: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedDropdownItem: {
        // backgroundColor is set dynamically
    },
    checkIcon: {
        marginRight: wp(3),
    },
    dropdownItemText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
    },
    selectedDropdownItemText: {
        fontFamily: FONT.semiBold,
    },
});

