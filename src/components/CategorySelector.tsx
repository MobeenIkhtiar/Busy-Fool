import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface CategorySelectorProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategoryChange }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const categories = [
        'All Products',
        'Toasties',
        'Coffee',
        'Tea',
        'Pastries',
        'Sandwiches',
        'Smoothies',
    ];

    const handleCategorySelect = (category: string) => {
        onCategoryChange(category);
        setIsDropdownVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setIsDropdownVisible(true)}
            >
                <Text style={styles.selectedText}>{selectedCategory}</Text>
                <Image
                    source={icons.filter}
                    style={styles.chevron}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsDropdownVisible(false)}
                >
                    <View style={styles.dropdownContainer}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        selectedCategory === item && styles.selectedItem
                                    ]}
                                    onPress={() => handleCategorySelect(item)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedCategory === item && styles.selectedItemText
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: hp(2),
    },
    selector: {
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: COLORS.brown,
    },
    chevron: {
        width: wp(4),
        height: wp(4),
        tintColor: COLORS.brown,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        maxHeight: hp(40),
        width: wp(80),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownItem: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightWhite,
    },
    selectedItem: {
        backgroundColor: COLORS.lightBlue,
    },
    dropdownItemText: {
        fontSize: wp(3.8),
        fontFamily: FONT.medium,
        color: COLORS.brown,
    },
    selectedItemText: {
        color: COLORS.blue,
        fontFamily: FONT.semiBold,
    },
});

export default CategorySelector; 