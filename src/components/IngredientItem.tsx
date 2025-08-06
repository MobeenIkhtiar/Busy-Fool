import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, hp, wp, FONT } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

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
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Header Section with Name and Action Icons */}
            <View style={styles.header}>
                <Text style={styles.name}>{ingredient.name}</Text>
                <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <View style={styles.editIcon}>
                            <Image
                                source={icons.edit}
                                style={styles.iconImage}
                                tintColor={'#D97708'}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <View style={styles.deleteIcon}>
                            <Image
                                source={icons.delete}
                                style={styles.iconImage}
                                tintColor={'#DC2625'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category Tag */}
            <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{ingredient.category}</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
                {/* First Row */}
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>True Cost:</Text>
                        <Text style={styles.costValue}>${ingredient.cost.toFixed(4)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Waste:</Text>
                        <View style={styles.wastePill}>
                            <Text style={styles.wasteValue}>{ingredient.waste || 5}%</Text>
                        </View>
                    </View>
                </View>

                {/* Second Row */}
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Stock:</Text>
                        <View style={styles.stockContainer}>
                            <View style={styles.packageIcon}>
                                <Image
                                    source={icons.box}
                                    style={{ width: wp(3), height: wp(3), resizeMode: 'contain' }}
                                    tintColor={COLORS.black}
                                />
                            </View>
                            <Text style={styles.stockValue}>{ingredient.quantity}</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Supplier:</Text>
                        <Text style={styles.supplierValue}>{ingredient.supplier || 'Coffee Roasters Ltd'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(0.25) },
        shadowOpacity: 0.1,
        shadowRadius: wp(1),
        elevation: 3,
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
        color: COLORS.black,
        flex: 1,
        marginRight: wp(2),
    },
    actionIcons: {
        flexDirection: 'row',
        gap: wp(2),
    },
    iconButton: {
        padding: wp(1),
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
        borderColor: '#FBD44C',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: wp(1.5),
        marginBottom: hp(2),
    },
    categoryText: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: '#B4540A',
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
        color: COLORS.black,
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
        color: COLORS.gray,
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
        color: COLORS.black,
    },
    supplierValue: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        color: COLORS.black,
    },
});

export default IngredientItem; 