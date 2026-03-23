import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { hp, wp, FONT } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import { icons } from '../constants/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IngredientItemProps {
    ingredient: {
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
    };
    onPress?: () => void;
    onDelete?: (id: string) => void;
    onEdit?: (ingredient: IngredientItemProps['ingredient']) => void;
    isDeleting?: boolean;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelection?: () => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ 
    ingredient, 
    onPress, 
    onDelete, 
    onEdit, 
    isDeleting = false,
    isSelectionMode = false,
    isSelected = false,
    onToggleSelection
}) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;

    const handleDelete = () => {
        if (onDelete && !isDeleting) {
            onDelete(ingredient.id);
        }
    };

    const handleEdit = () => {
        if (onEdit && !isSelectionMode) {
            onEdit(ingredient);
        }
    };

    return (
        <TouchableOpacity style={[
            styles.container,
            {
                backgroundColor: cardBg,
                shadowColor: colors.black,
                borderColor: isSelected ? colors.brown : 'transparent',
                borderWidth: isSelected ? 2 : 0,
            }
        ]} onPress={onPress}>
            {/* Header Section with Name and Action Icons */}
            <View style={styles.header}>
                {isSelectionMode && (
                    <TouchableOpacity 
                        style={styles.checkboxContainer}
                        onPress={(e) => {
                            e.stopPropagation();
                            onToggleSelection?.();
                        }}
                    >
                        <Ionicons 
                            name={isSelected ? "checkbox" : "checkbox-outline"} 
                            size={wp(6)} 
                            color={isSelected ? colors.brown : colors.gray} 
                        />
                    </TouchableOpacity>
                )}
                <Text style={[styles.name, { color: colors.black }]}>{ingredient.name}</Text>
                {!isSelectionMode && (
                    <View style={styles.actionIcons}>
                        <TouchableOpacity 
                            style={styles.iconButton}
                            onPress={(e) => {
                                e.stopPropagation(); // Prevent triggering parent onPress
                                handleEdit();
                            }}
                        >
                            <View style={styles.editIcon}>
                                <Image
                                    source={icons.edit}
                                    style={styles.iconImage}
                                    tintColor={'#D97708'}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.iconButton, isDeleting && styles.iconButtonDisabled]}
                            onPress={(e) => {
                                e.stopPropagation(); // Prevent triggering parent onPress
                                handleDelete();
                            }}
                            disabled={isDeleting}
                        >
                            <View style={styles.deleteIcon}>
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#DC2625" />
                                ) : (
                                    <Image
                                        source={icons.delete}
                                        style={styles.iconImage}
                                        tintColor={'#DC2625'}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Category Tag */}
            <View style={[styles.categoryTag, { borderColor: colors.brown }]}>
                <Text style={[styles.categoryText, { color: colors.brown }]}>{ingredient.category}</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
                {/* First Row */}
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.black }]}>True Cost:</Text>
                        <Text style={styles.costValue}>${ingredient.cost.toFixed(4)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.black }]}>Waste:</Text>
                        <View style={styles.wastePill}>
                            <Text style={[styles.wasteValue, { color: colors.gray }]}>{ingredient.waste || 5}%</Text>
                        </View>
                    </View>
                </View>

                {/* Second Row */}
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.black }]}>Stock:</Text>
                        <View style={styles.stockContainer}>
                            <View style={styles.packageIcon}>
                                <Image
                                    source={icons.box}
                                    style={{ width: wp(3), height: wp(3), resizeMode: 'contain' }}
                                    tintColor={colors.black}
                                />
                            </View>
                            <Text style={[styles.stockValue, { color: colors.black }]}>{ingredient.quantity}</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.black }]}>Supplier:</Text>
                        <Text style={[styles.supplierValue, { color: colors.black }]}>{ingredient.supplier || 'Coffee Roasters Ltd'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        shadowOffset: { width: 0, height: hp(0.25) },
        shadowOpacity: 0.1,
        shadowRadius: wp(1),
        elevation: 3,
        marginHorizontal: wp(1),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: hp(1.5),
    },
    name: {
        fontSize: wp(4.2),
        fontFamily: FONT.bold,
        flex: 1,
        marginRight: wp(2),
        marginLeft: wp(2),
    },
    checkboxContainer: {
        padding: wp(1),
        marginRight: wp(1),
    },
    actionIcons: {
        flexDirection: 'row',
        gap: wp(2),
    },
    iconButton: {
        padding: wp(1),
    },
    iconButtonDisabled: {
        opacity: 0.5,
    },
    editIcon: {
        width: wp(5),
        height: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        width: wp(5),
        height: wp(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: wp(4.5),
        height: wp(4.5),
        resizeMode: 'contain',
    },
    categoryTag: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(1.5),
        marginBottom: hp(2),
    },
    categoryText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    detailsGrid: {
        gap: hp(1.5),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
        gap: hp(0.5),
    },
    detailLabel: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    costValue: {
        fontSize: wp(3.5),
        fontFamily: FONT.bold,
        color: '#17803D',
    },
    wastePill: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.3),
        borderRadius: wp(2),
        alignSelf: 'flex-start',
    },
    wasteValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    packageIcon: {
        width: wp(3.5),
        height: wp(3.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    packageIconText: {
        fontSize: wp(3),
    },
    stockValue: {
        fontSize: wp(3.8),
        fontFamily: FONT.bold,
    },
    supplierValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
    },
});

export default IngredientItem; 