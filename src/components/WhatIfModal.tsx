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
} from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Product } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WhatIfModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
    onApplyChanges?: (updatedProduct: Product) => void;
}

const WhatIfModal: React.FC<WhatIfModalProps> = ({
    visible,
    onClose,
    product,
    onApplyChanges,
}) => {
    const { colors, theme } = useTheme();
    const [step, setStep] = useState(0); // 0: input, 1: result
    const [localPrice, setLocalPrice] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localResult, setLocalResult] = useState<Product | null>(null);
    const [currencySymbol, setCurrencySymbol] = useState('£');

    useEffect(() => {
        if (visible && product) {
            setLocalPrice(String(product.sell_price || ''));
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

    const handleAnalyze = async () => {
        if (!product || !localPrice) {
            setLocalError('Please enter a valid price.');
            return;
        }

        const newPrice = parseFloat(localPrice);
        if (isNaN(newPrice) || newPrice <= 0) {
            setLocalError('Please enter a valid price greater than 0.');
            return;
        }

        setLocalLoading(true);
        setLocalError('');

        try {
            const { productsService } = await import('../services');
            const result = await productsService.quickAction(product.id, {
                new_sell_price: newPrice,
            });
            setLocalResult(result);
            setStep(1);
        } catch (error: any) {
            setLocalError(error.message || 'Failed to calculate what-if analysis.');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleApplyChanges = () => {
        if (localResult && onApplyChanges) {
            onApplyChanges(localResult);
            handleClose();
            Alert.alert('Success', 'Price updated successfully!');
        }
    };

    const handleClose = () => {
        onClose();
        setLocalPrice('');
        setLocalError('');
        setLocalResult(null);
        setStep(0);
    };

    if (!visible || !product) return null;

    const currentPrice = Number(product.sell_price) || 0;
    const totalCost = Number(product.total_cost) || 0;
    const currentMarginAmount = Number(product.margin_amount) || 0;
    const currentMarginPercent = Number(product.margin_percent) || 0;
    const numberOfSales = Number(product.numberOfSales || product.quantity_sold) || 0;

    // Step 0: Input
    const inputStep = (
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
                        <Text style={[styles.infoLabel, { color: colors.gray }]}>Total Cost:</Text>
                        <Text style={[styles.infoValue, { color: colors.black }]}>
                            {currencySymbol}{totalCost.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.gray }]}>Current Margin:</Text>
                        <Text
                            style={[
                                styles.infoValue,
                                { color: currentMarginAmount >= 0 ? colors.green : colors.red },
                            ]}
                        >
                            {currencySymbol}{currentMarginAmount.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.gray }]}>Margin %:</Text>
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

            {/* New Price Input */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.black }]}>
                    New Sell Price ({currencySymbol})
                </Text>
                <TextInput
                    style={[styles.priceInput, { backgroundColor: colors.primary, color: colors.black, borderColor: colors.lightgray }]}
                    placeholder="Enter new price"
                    placeholderTextColor={colors.gray}
                    value={localPrice}
                    onChangeText={(text) => {
                        setLocalPrice(text);
                        setLocalError('');
                    }}
                    keyboardType="decimal-pad"
                    autoFocus
                />
                {localError ? (
                    <Text style={[styles.errorText, { color: colors.red }]}>{localError}</Text>
                ) : null}
            </View>

            {/* Price Comparison Preview */}
            {localPrice &&
                !isNaN(parseFloat(localPrice)) &&
                parseFloat(localPrice) > 0 && (
                    <View style={[styles.previewCard, { backgroundColor: '#E0F2FE' }]}>
                        <Text style={[styles.previewTitle, { color: '#0369A1' }]}>
                            Price Change Preview
                        </Text>
                        <View style={styles.previewRow}>
                            <Text style={[styles.previewLabel, { color: '#0369A1' }]}>Current → New:</Text>
                            <View style={styles.previewValues}>
                                <Text style={[styles.previewValue, { color: '#0369A1' }]}>
                                    {currencySymbol}{currentPrice.toFixed(2)}
                                </Text>
                                <Ionicons name="arrow-forward" size={wp(4)} color="#0369A1" />
                                <Text style={[styles.previewValueNew, { color: '#075985' }]}>
                                    {currencySymbol}{parseFloat(localPrice).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.previewRow}>
                            <Text style={[styles.previewLabel, { color: '#0369A1' }]}>Difference:</Text>
                            <Text
                                style={[
                                    styles.previewDifference,
                                    {
                                        color:
                                            parseFloat(localPrice) - currentPrice >= 0
                                                ? colors.green
                                                : colors.red,
                                    },
                                ]}
                            >
                                {parseFloat(localPrice) - currentPrice >= 0 ? '+' : ''}
                                {currencySymbol}
                                {(parseFloat(localPrice) - currentPrice).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                )}

            <TouchableOpacity
                style={[styles.analyzeButton, { backgroundColor: colors.brown }]}
                onPress={handleAnalyze}
                disabled={
                    localLoading ||
                    !localPrice ||
                    isNaN(parseFloat(localPrice)) ||
                    parseFloat(localPrice) <= 0
                }
            >
                {localLoading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <>
                        <Ionicons name="calculator-outline" size={wp(4)} color={colors.white} />
                        <Text style={[styles.analyzeButtonText, { color: colors.white }]}>
                            Analyze Impact
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );

    // Step 1: Result
    const resultStep = localResult ? (
        <View style={styles.stepContent}>
            {/* Results Header */}
            <View style={styles.resultHeader}>
                <View style={[styles.resultIconContainer, { backgroundColor: colors.green + '20' }]}>
                    <Ionicons name="bar-chart-outline" size={wp(8)} color={colors.green} />
                </View>
                <Text style={[styles.resultTitle, { color: colors.black }]}>Analysis Complete</Text>
                <Text style={[styles.resultSubtitle, { color: colors.gray }]}>
                    Here's how the price change would affect your product
                </Text>
            </View>

            {/* Results Comparison */}
            <View style={[styles.resultsCard, { backgroundColor: colors.primary }]}>
                <Text style={[styles.resultsCardTitle, { color: colors.black }]}>
                    Updated Product Metrics
                </Text>

                <View style={styles.metricsGrid}>
                    <View style={[styles.metricCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary }]}>
                        <Text style={[styles.metricLabel, { color: colors.gray }]}>New Price</Text>
                        <Text style={[styles.metricValue, { color: colors.black }]}>
                            {currencySymbol}{Number(localResult.sell_price || 0).toFixed(2)}
                        </Text>
                    </View>
                    <View style={[styles.metricCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary }]}>
                        <Text style={[styles.metricLabel, { color: colors.gray }]}>Total Cost</Text>
                        <Text style={[styles.metricValue, { color: colors.black }]}>
                            {currencySymbol}{Number(localResult.total_cost || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.marginCard, { backgroundColor: theme === 'light' ? colors.white : colors.primary }]}>
                    <View style={styles.marginHeader}>
                        <Text style={[styles.marginLabel, { color: colors.gray }]}>New Profit Margin</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor:
                                        localResult.status === 'profitable'
                                            ? '#DCFCE7'
                                            : localResult.status === 'losing money'
                                            ? '#FEE2E2'
                                            : '#FEF3C7',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            localResult.status === 'profitable'
                                                ? '#166534'
                                                : localResult.status === 'losing money'
                                                ? '#DC2626'
                                                : '#92400E',
                                    },
                                ]}
                            >
                                {localResult.status || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.marginContent}>
                        <View>
                            <Text
                                style={[
                                    styles.marginPercent,
                                    {
                                        color:
                                            Number(localResult.margin_percent || 0) >= 0
                                                ? colors.green
                                                : colors.red,
                                    },
                                ]}
                            >
                                {Number(localResult.margin_percent || 0) > 0 ? '+' : ''}
                                {Number(localResult.margin_percent || 0).toFixed(1)}%
                            </Text>
                            <Text style={[styles.marginAmount, { color: colors.gray }]}>
                                {currencySymbol}
                                {Number(localResult.margin_amount || 0) > 0 ? '+' : ''}
                                {Number(localResult.margin_amount || 0).toFixed(2)} per sale
                            </Text>
                        </View>
                        <View style={[styles.progressBar, { backgroundColor: colors.lightgray }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                (Number(localResult.margin_percent || 0) + 20) * 1.25
                                            )
                                        )}%`,
                                        backgroundColor:
                                            Number(localResult.margin_percent || 0) >= 0
                                                ? colors.green
                                                : colors.red,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Impact Summary */}
            <View style={[styles.impactCard, { backgroundColor: '#E0E7FF' }]}>
                <Text style={[styles.impactTitle, { color: '#3730A3' }]}>Impact Summary</Text>
                <View style={styles.impactList}>
                    <View style={styles.impactRow}>
                        <Text style={[styles.impactLabel, { color: '#4F46E5' }]}>Margin Change:</Text>
                        <Text
                            style={[
                                styles.impactValue,
                                {
                                    color:
                                        Number(localResult.margin_amount || 0) - currentMarginAmount >= 0
                                            ? colors.green
                                            : colors.red,
                                },
                            ]}
                        >
                            {Number(localResult.margin_amount || 0) - currentMarginAmount >= 0 ? '+' : ''}
                            {currencySymbol}
                            {(Number(localResult.margin_amount || 0) - currentMarginAmount).toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.impactRow}>
                        <Text style={[styles.impactLabel, { color: '#4F46E5' }]}>Percentage Change:</Text>
                        <Text
                            style={[
                                styles.impactValue,
                                {
                                    color:
                                        Number(localResult.margin_percent || 0) - currentMarginPercent >= 0
                                            ? colors.green
                                            : colors.red,
                                },
                            ]}
                        >
                            {Number(localResult.margin_percent || 0) - currentMarginPercent >= 0 ? '+' : ''}
                            {(Number(localResult.margin_percent || 0) - currentMarginPercent).toFixed(1)}%
                        </Text>
                    </View>
                    {numberOfSales > 0 && (
                        <View style={styles.impactRow}>
                            <Text style={[styles.impactLabel, { color: '#4F46E5' }]}>
                                Daily Impact ({numberOfSales} sales):
                            </Text>
                            <Text
                                style={[
                                    styles.impactValue,
                                    {
                                        color:
                                            (Number(localResult.margin_amount || 0) - currentMarginAmount) *
                                                numberOfSales >=
                                            0
                                                ? colors.green
                                                : colors.red,
                                    },
                                ]}
                            >
                                {(Number(localResult.margin_amount || 0) - currentMarginAmount) *
                                    numberOfSales >=
                                0
                                    ? '+'
                                    : ''}
                                {currencySymbol}
                                {(
                                    (Number(localResult.margin_amount || 0) - currentMarginAmount) *
                                    numberOfSales
                                ).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.primary, borderColor: colors.lightgray }]}
                    onPress={() => setStep(0)}
                >
                    <Text style={[styles.backButtonText, { color: colors.black }]}>Try Different Price</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.brown }]}
                    onPress={handleApplyChanges}
                >
                    <Ionicons name="checkmark-circle" size={wp(4)} color={colors.white} />
                    <Text style={[styles.applyButtonText, { color: colors.white }]}>Apply Changes</Text>
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
                            <View style={[styles.headerIcon, { backgroundColor: colors.brown + '20' }]}>
                                <Ionicons name="calculator-outline" size={wp(5)} color={colors.brown} />
                            </View>
                            <View>
                                <Text style={[styles.modalTitle, { color: colors.black }]}>
                                    What-If Analysis
                                </Text>
                                <Text style={[styles.modalSubtitle, { color: colors.gray }]}>
                                    {product.name}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={wp(6)} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {step === 0 && inputStep}
                        {step === 1 && resultStep}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default WhatIfModal;

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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        flex: 1,
    },
    headerIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(2.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
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
    inputGroup: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginBottom: hp(1),
    },
    priceInput: {
        height: hp(6),
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        fontSize: wp(5),
        fontFamily: FONT.semiBold,
    },
    errorText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(1),
    },
    previewCard: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
    },
    previewTitle: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1),
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    previewLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    previewValues: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    previewValue: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    previewValueNew: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    previewDifference: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
    analyzeButton: {
        height: hp(5.5),
        borderRadius: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    analyzeButtonText: {
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
    metricsGrid: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(2),
    },
    metricCard: {
        flex: 1,
        borderRadius: wp(2),
        padding: wp(3),
    },
    metricLabel: {
        fontSize: wp(2.5),
        fontFamily: FONT.regular,
        marginBottom: hp(0.5),
    },
    metricValue: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
    },
    marginCard: {
        borderRadius: wp(2),
        padding: wp(4),
    },
    marginHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    marginLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    statusBadge: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(3),
    },
    statusText: {
        fontSize: wp(2.5),
        fontFamily: FONT.semiBold,
    },
    marginContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    marginPercent: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    marginAmount: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    progressBar: {
        width: wp(20),
        height: hp(0.8),
        borderRadius: wp(1),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: wp(1),
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
    applyButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
    },
    applyButtonText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
    },
});

