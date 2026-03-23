import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import { icons } from '../constants/icons';

interface CategorySelectorProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategoryChange }) => {
    const { colors, theme } = useTheme();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    // Card background: white in light mode, dark in dark mode
    const selectorBg = theme === 'light' ? colors.white : colors.primary;
    const dropdownBg = theme === 'light' ? colors.white : colors.primary;

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
                style={[
                    styles.selector,
                    {
                        backgroundColor: selectorBg,
                        shadowColor: colors.black,
                    }
                ]}
                onPress={() => setIsDropdownVisible(true)}
            >
                <Text style={[styles.selectedText, { color: colors.brown }]}>{selectedCategory}</Text>
                <Image
                    source={icons.filter}
                    style={[styles.chevron, { tintColor: colors.brown }]}
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
                    <View style={[
                        styles.dropdownContainer,
                        {
                            backgroundColor: dropdownBg,
                            shadowColor: colors.black,
                        }
                    ]}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.lightWhite },
                                        selectedCategory === item && [styles.selectedItem, { backgroundColor: colors.lightBlue }]
                                    ]}
                                    onPress={() => handleCategorySelect(item)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        { color: colors.brown },
                                        selectedCategory === item && [styles.selectedItemText, { color: colors.blue }]
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
        marginHorizontal: wp(1),
    },
    selector: {
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    chevron: {
        width: wp(4),
        height: wp(4),
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
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
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
});

export default CategorySelector; 