import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from './CustomButton';
import { settingsService, CategoryTarget, ApiError } from '../services';
import { useFocusEffect } from '@react-navigation/native';

interface CategoryTargetMarginsProps {
    onAddTarget?: () => void;
}

const CategoryTargetMargins: React.FC<CategoryTargetMarginsProps> = ({ onAddTarget }) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    const textColor = theme === 'light' ? colors.black : colors.white;
    const subtitleColor = theme === 'light' ? colors.gray : colors.gray;
    const infoBg = theme === 'light' ? '#EFF6FF' : '#1E3A8A';
    const infoBorderColor = theme === 'light' ? '#3B82F6' : '#60A5FA';
    const infoTextColor = theme === 'light' ? colors.black : colors.white;
    const formCardBg = theme === 'light' ? colors.white : colors.primary;
    const inputBg = theme === 'light' ? colors.primary : colors.lightWhite;
    const inputTextColor = theme === 'light' ? colors.black : colors.white;
    const inputPlaceholderColor = colors.lightgray;
    
    const [targets, setTargets] = useState<CategoryTarget[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Select category...');
    const [targetMargin, setTargetMargin] = useState<string>('');
    const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingTarget, setEditingTarget] = useState<CategoryTarget | null>(null);
    const [editingMargin, setEditingMargin] = useState<string>('');
    
    // Get available categories (categories that don't have targets yet)
    const availableCategories = categories.filter(
        (cat) => !targets.some((target) => target.category === cat)
    );
    
    // Fetch categories and targets
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [categoriesData, targetsData] = await Promise.all([
                settingsService.getCategories(),
                settingsService.getCategoryTargets(),
            ]);
            setCategories(categoriesData);
            setTargets(targetsData);
        } catch (error: any) {
            const apiError = error as ApiError;
            console.error('Error fetching settings data:', apiError);
            Alert.alert('Error', apiError.message || 'Failed to load settings data');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch data on mount and when screen comes into focus
    useEffect(() => {
        fetchData();
    }, []);
    
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );
    
    const handleAddTargetPress = () => {
        setShowForm(!showForm);
        if (!showForm) {
            // Reset form when opening
            setSelectedCategory('Select category...');
            setTargetMargin('');
            setEditingTarget(null);
        }
        if (onAddTarget) {
            onAddTarget();
        }
    };
    
    const handleCategorySelect = (category: string) => {
        if (category === 'Select category...') return;
        setSelectedCategory(category);
        setIsCategoryDropdownVisible(false);
    };
    
    const handleSave = async () => {
        if (selectedCategory === 'Select category...' || !targetMargin.trim()) {
            Alert.alert('Validation Error', 'Please fill in all fields');
            return;
        }
        
        const marginValue = parseFloat(targetMargin);
        if (isNaN(marginValue) || marginValue < 0 || marginValue > 100) {
            Alert.alert('Validation Error', 'Target margin must be between 0 and 100');
            return;
        }
        
        setIsSaving(true);
        try {
            const response = await settingsService.createCategoryTarget({
                category: selectedCategory,
                target_margin_percent: marginValue,
            });
            
            // Refresh targets list
            await fetchData();
            
            Alert.alert(
                'Success',
                `Target saved! ${response.productsUpdated || 0} product(s) recalculated.`
            );
            
            // Reset form
            setShowForm(false);
            setSelectedCategory('Select category...');
            setTargetMargin('');
        } catch (error: any) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message || 'Failed to save target');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setShowForm(false);
        setSelectedCategory('Select category...');
        setTargetMargin('');
        setEditingTarget(null);
    };
    
    const handleEdit = (target: CategoryTarget) => {
        setEditingTarget(target);
        setEditingMargin(target.target_margin_percent.toString());
    };
    
    const handleUpdate = async () => {
        if (!editingTarget || !editingMargin.trim()) {
            Alert.alert('Validation Error', 'Please enter a target margin');
            return;
        }
        
        const marginValue = parseFloat(editingMargin);
        if (isNaN(marginValue) || marginValue < 0 || marginValue > 100) {
            Alert.alert('Validation Error', 'Target margin must be between 0 and 100');
            return;
        }
        
        setIsSaving(true);
        try {
            const response = await settingsService.updateCategoryTarget(editingTarget.category, {
                target_margin_percent: marginValue,
            });
            
            // Refresh targets list
            await fetchData();
            
            Alert.alert(
                'Success',
                `Target updated! ${response.productsUpdated || 0} product(s) recalculated.`
            );
            
            setEditingTarget(null);
            setEditingMargin('');
        } catch (error: any) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message || 'Failed to update target');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async (category: string) => {
        Alert.alert(
            'Delete Target',
            `Delete target for "${category}"? Products will revert to 0% target.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            const response = await settingsService.deleteCategoryTarget(category);
                            
                            // Refresh targets list
                            await fetchData();
                            
                            Alert.alert(
                                'Success',
                                `Target deleted! ${response.productsUpdated || 0} product(s) recalculated.`
                            );
                        } catch (error: any) {
                            const apiError = error as ApiError;
                            Alert.alert('Error', apiError.message || 'Failed to delete target');
                        } finally {
                            setIsSaving(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
                borderColor: colors.lightWhite,
            }
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                        <Ionicons name="target" size={wp(5)} color={colors.white} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: textColor }]}>Category Target Margins</Text>
                        <Text style={[styles.subtitle, { color: subtitleColor }]}>
                            Set profit targets for each product category
                        </Text>
                    </View>
                </View>
                {!showForm && availableCategories.length > 0 && (
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: '#10B981' }]}
                        onPress={handleAddTargetPress}
                    >
                        <Ionicons name="add" size={wp(4.5)} color={colors.white} />
                        <Text style={[styles.addButtonText, { color: colors.white }]}>Add Target</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* New Category Target Form */}
            {showForm && (
                <View style={[
                    styles.formCard,
                    {
                        backgroundColor: formCardBg,
                        borderColor: colors.lightWhite,
                    }
                ]}>
                    <Text style={[styles.formTitle, { color: textColor }]}>New Category Target</Text>
                    
                    {/* Category Dropdown */}
                    <View style={styles.formField}>
                        <Text style={[styles.fieldLabel, { color: textColor }]}>Category</Text>
                        <TouchableOpacity
                            style={[
                                styles.dropdown,
                                {
                                    backgroundColor: inputBg,
                                    borderColor: '#10B981',
                                }
                            ]}
                            onPress={() => setIsCategoryDropdownVisible(true)}
                        >
                            <Text style={[
                                styles.dropdownText,
                                { 
                                    color: selectedCategory === 'Select category...' 
                                        ? inputPlaceholderColor 
                                        : inputTextColor 
                                }
                            ]}>
                                {selectedCategory}
                            </Text>
                            <Ionicons name="chevron-down" size={wp(4)} color={inputTextColor} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Target Margin Input */}
                    <View style={styles.formField}>
                        <Text style={[styles.fieldLabel, { color: textColor }]}>Target Margin (%)</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: inputBg,
                                    borderColor: '#10B981',
                                    color: inputTextColor,
                                }
                            ]}
                            placeholder="e.g. 70"
                            placeholderTextColor={inputPlaceholderColor}
                            value={targetMargin}
                            onChangeText={setTargetMargin}
                            keyboardType="numeric"
                        />
                    </View>
                    
                    {/* Action Buttons */}
                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                {
                                    backgroundColor: theme === 'light' ? colors.white : colors.primary,
                                    borderColor: colors.lightgray,
                                }
                            ]}
                            onPress={handleCancel}
                        >
                            <Text style={[styles.cancelButtonText, { color: subtitleColor }]}>Cancel</Text>
                        </TouchableOpacity>
                        <CustomButton
                            title="Save"
                            iconName="save-outline"
                            backgroundColor="#10B981"
                            textColor={colors.white}
                            onPress={handleSave}
                            disabled={isSaving}
                            style={styles.saveButtonForm}
                        />
                        {isSaving && (
                            <ActivityIndicator size="small" color={colors.white} style={styles.loadingIndicator} />
                        )}
                    </View>
                </View>
            )}

            {/* Content */}
            {isLoading ? (
                <View style={styles.emptyState}>
                    <ActivityIndicator size="large" color={colors.brown} />
                    <Text style={[styles.emptyText, { color: textColor, marginTop: hp(2) }]}>
                        Loading targets...
                    </Text>
                </View>
            ) : targets.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="target-outline" size={wp(15)} color={colors.lightgray} />
                    <Text style={[styles.emptyText, { color: textColor }]}>
                        No category targets set yet.
                    </Text>
                    <Text style={[styles.emptySubtext, { color: subtitleColor }]}>
                        Products default to 0% target (any positive margin is profitable).
                    </Text>
                </View>
            ) : (
                <View style={styles.targetsList}>
                    {targets.map((target) => (
                        <View
                            key={target.id || target.category}
                            style={[
                                styles.targetItem,
                                {
                                    backgroundColor: formCardBg,
                                    borderColor: colors.lightWhite,
                                }
                            ]}
                        >
                            {editingTarget?.category === target.category ? (
                                <View style={styles.targetItemEdit}>
                                    <Text style={[styles.targetCategory, { color: textColor }]}>
                                        {target.category}
                                    </Text>
                                    <View style={styles.editInputContainer}>
                                        <TextInput
                                            style={[
                                                styles.editInput,
                                                {
                                                    backgroundColor: inputBg,
                                                    borderColor: '#10B981',
                                                    color: inputTextColor,
                                                }
                                            ]}
                                            value={editingMargin}
                                            onChangeText={setEditingMargin}
                                            keyboardType="numeric"
                                            placeholder="0"
                                        />
                                        <Text style={[styles.percentLabel, { color: subtitleColor }]}>%</Text>
                                        <TouchableOpacity
                                            onPress={handleUpdate}
                                            disabled={isSaving}
                                            style={styles.editButton}
                                        >
                                            {isSaving ? (
                                                <ActivityIndicator size="small" color="#10B981" />
                                            ) : (
                                                <Ionicons name="checkmark-circle" size={wp(5)} color="#10B981" />
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setEditingTarget(null);
                                                setEditingMargin('');
                                            }}
                                            style={styles.editButton}
                                        >
                                            <Ionicons name="close-circle" size={wp(5)} color={colors.gray} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.targetItemContent}>
                                        <Text style={[styles.targetCategory, { color: textColor }]}>
                                            {target.category}
                                        </Text>
                                        <View style={[styles.targetBadge, { backgroundColor: '#10B981' + '20' }]}>
                                            <Text style={[styles.targetBadgeText, { color: '#10B981' }]}>
                                                {target.target_margin_percent}%
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.targetActions}>
                                        <TouchableOpacity
                                            onPress={() => handleEdit(target)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="pencil" size={wp(4)} color={subtitleColor} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(target.category)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="trash-outline" size={wp(4)} color={colors.red} />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Category Dropdown Modal */}
            <Modal
                visible={isCategoryDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsCategoryDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsCategoryDropdownVisible(false)}
                >
                    <View style={[
                        styles.dropdownContainer,
                        {
                            backgroundColor: formCardBg,
                            shadowColor: colors.black,
                        }
                    ]}>
                        <FlatList
                            data={['Select category...', ...availableCategories]}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.lightWhite },
                                        selectedCategory === item && [
                                            styles.selectedItem,
                                            { backgroundColor: colors.lightBlue }
                                        ]
                                    ]}
                                    onPress={() => handleCategorySelect(item)}
                                >
                                    {selectedCategory === item && item !== 'Select category...' && (
                                        <Ionicons name="checkmark" size={wp(4)} color={colors.blue} style={styles.checkIcon} />
                                    )}
                                    <Text style={[
                                        styles.dropdownItemText,
                                        { 
                                            color: item === 'Select category...' 
                                                ? inputPlaceholderColor 
                                                : textColor 
                                        },
                                        selectedCategory === item && item !== 'Select category...' && [
                                            styles.selectedItemText,
                                            { color: colors.blue }
                                        ]
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Info Box */}
            <View style={[
                styles.infoBox,
                {
                    backgroundColor: infoBg,
                    borderColor: infoBorderColor,
                }
            ]}>
                <Text style={[styles.infoTitle, { color: infoTextColor }]}>How it works</Text>
                <Text style={[styles.infoText, { color: infoTextColor }]}>
                    When a product's actual margin is below its category's target, it's marked as{' '}
                    <Text style={[styles.highlightRed, { color: '#EF4444' }]}>"Losing Money"</Text>.
                    When it meets or exceeds the target, it's{' '}
                    <Text style={[styles.highlightGreen, { color: '#10B981' }]}>"Profitable"</Text>.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(3),
        borderWidth: 1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        marginBottom: hp(3),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: hp(2),
    },
    iconContainer: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(3),
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        gap: wp(2),
    },
    addButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(6),
    },
    emptyText: {
        fontSize: wp(3.8),
        fontFamily: FONT.semiBold,
        marginTop: hp(2),
        marginBottom: hp(1),
    },
    emptySubtext: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        textAlign: 'center',
        paddingHorizontal: wp(4),
    },
    targetsList: {
        marginTop: hp(2),
    },
    infoBox: {
        marginTop: hp(3),
        padding: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
    },
    infoTitle: {
        fontSize: wp(3.8),
        fontFamily: FONT.bold,
        marginBottom: hp(1),
    },
    infoText: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        lineHeight: hp(2.5),
    },
    highlightRed: {
        fontFamily: FONT.semiBold,
    },
    highlightGreen: {
        fontFamily: FONT.semiBold,
    },
    formCard: {
        marginBottom: hp(3),
        padding: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
    },
    formTitle: {
        fontSize: wp(4),
        fontFamily: FONT.bold,
        marginBottom: hp(2.5),
    },
    formField: {
        marginBottom: hp(2),
    },
    fieldLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1),
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
    },
    dropdownText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        flex: 1,
    },
    input: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
    },
    formActions: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(2),
    },
    cancelButton: {
        flex: 1,
        height: hp(5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
    },
    saveButtonForm: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
        borderRadius: wp(2),
        maxHeight: hp(40),
        width: wp(80),
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
    },
    checkIcon: {
        marginRight: wp(2),
    },
    selectedItem: {
        // backgroundColor is set dynamically
    },
    dropdownItemText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
    },
    selectedItemText: {
        fontFamily: FONT.semiBold,
    },
    loadingIndicator: {
        marginLeft: wp(2),
    },
    targetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
        marginBottom: hp(1.5),
    },
    targetItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        flex: 1,
    },
    targetCategory: {
        fontSize: wp(3.8),
        fontFamily: FONT.semiBold,
    },
    targetBadge: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(2),
    },
    targetBadgeText: {
        fontSize: wp(3.2),
        fontFamily: FONT.semiBold,
    },
    targetActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    actionButton: {
        padding: wp(2),
    },
    targetItemEdit: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    editInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        flex: 1,
        marginLeft: wp(3),
    },
    editInput: {
        width: wp(20),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: wp(2),
        borderWidth: 1,
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    percentLabel: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    editButton: {
        padding: wp(1),
    },
});

export default CategoryTargetMargins;

