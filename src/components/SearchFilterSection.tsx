import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SearchFilterSectionProps = {
    searchValue: string;
    onSearchChange: (text: string) => void;
    categoryFilter: string;
    onCategoryFilterChange: (category: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
};

const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
    searchValue,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
}) => {
    const { colors, theme } = useTheme();
    const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
    const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);
    const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
    
    // Background: white in light mode, dark in dark mode
    const containerBg = theme === 'light' ? colors.white : colors.primary;
    const searchFilterBg = theme === 'light' ? colors.primary : colors.lightWhite;
    const dropdownBg = theme === 'light' ? colors.white : colors.primary;

    const categories = ['all', 'Coffee', 'Food', 'Iced Drinks', 'Pastries'];
    const statuses = ['all', 'profitable', 'breaking even', 'losing money'];
    const sortOptions = [
        { value: 'margin', label: 'Margin' },
        { value: 'sales', label: 'Sales' },
        { value: 'price', label: 'Price' },
        { value: 'name', label: 'Name' },
        { value: 'impact', label: 'Impact' },
    ];

    const getCategoryLabel = (value: string) => {
        return value === 'all' ? 'Categories' : value;
    };

    const getStatusLabel = (value: string) => {
        const labels: { [key: string]: string } = {
            'all': 'Status',
            'profitable': 'Profitable',
            'breaking even': 'Breaking Even',
            'losing money': 'Losing Money',
        };
        return labels[value] || value;
    };

    const getSortLabel = (value: string) => {
        const option = sortOptions.find(opt => opt.value === value);
        return option ? option.label : 'Sort By';
    };

    const handleCategorySelect = (category: string) => {
        onCategoryFilterChange(category);
        setIsCategoryDropdownVisible(false);
    };

    const handleStatusSelect = (status: string) => {
        onStatusFilterChange(status);
        setIsStatusDropdownVisible(false);
    };

    const handleSortSelect = (sort: string) => {
        onSortChange(sort);
        setIsSortDropdownVisible(false);
    };

    const renderStringDropdown = (
        visible: boolean,
        onClose: () => void,
        data: string[],
        selectedValue: string,
        onSelect: (value: string) => void,
        getLabel: (value: string) => string
    ) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[
                    styles.dropdownContainer,
                    {
                        backgroundColor: dropdownBg,
                        shadowColor: colors.black,
                        borderWidth: theme === 'dark' ? 2 : 0,
                        borderColor: theme === 'dark' ? colors.lightWhite : 'transparent',
                    }
                ]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isSelected = selectedValue === item;
                            
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.lightgray },
                                        isSelected && [styles.selectedItem, { backgroundColor: colors.brown + '20' }]
                                    ]}
                                    onPress={() => onSelect(item)}
                                >
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={wp(4)} color={colors.brown} style={styles.checkIcon} />
                                    )}
                                    <Text style={[
                                        styles.dropdownItemText,
                                        { color: colors.black },
                                        isSelected && [styles.selectedItemText, { color: colors.brown }]
                                    ]}>
                                        {getLabel(item)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderSortDropdown = (
        visible: boolean,
        onClose: () => void,
        data: Array<{ value: string; label: string }>,
        selectedValue: string,
        onSelect: (value: string) => void
    ) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[
                    styles.dropdownContainer,
                    {
                        backgroundColor: dropdownBg,
                        shadowColor: colors.black,
                        borderWidth: theme === 'dark' ? 2 : 0,
                        borderColor: theme === 'dark' ? colors.lightWhite : 'transparent',
                    }
                ]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => {
                            const isSelected = selectedValue === item.value;
                            
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.lightgray },
                                        isSelected && [styles.selectedItem, { backgroundColor: colors.brown + '20' }]
                                    ]}
                                    onPress={() => onSelect(item.value)}
                                >
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={wp(4)} color={colors.brown} style={styles.checkIcon} />
                                    )}
                                    <Text style={[
                                        styles.dropdownItemText,
                                        { color: colors.black },
                                        isSelected && [styles.selectedItemText, { color: colors.brown }]
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: containerBg,
                shadowColor: colors.black,
            }
        ]}>
            {/* Search Bar */}
            <View style={[
                styles.searchContainer,
                { backgroundColor: searchFilterBg }
            ]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={[styles.searchInput, { color: colors.black }]}
                    placeholder="Search products..."
                    placeholderTextColor={colors.lightgray}
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>

            {/* Filter Dropdowns */}
            <View style={styles.filterContainer}>
                <TouchableOpacity 
                    style={[
                        styles.filterButton,
                        { backgroundColor: searchFilterBg }
                    ]}
                    onPress={() => setIsCategoryDropdownVisible(true)}
                >
                    <Text style={[styles.filterText, { color: colors.black }]}>
                        {getCategoryLabel(categoryFilter)}
                    </Text>
                    <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.filterButton,
                        { backgroundColor: searchFilterBg }
                    ]}
                    onPress={() => setIsStatusDropdownVisible(true)}
                >
                    <Text style={[styles.filterText, { color: colors.black }]}>
                        {getStatusLabel(statusFilter)}
                    </Text>
                    <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.filterButton,
                        { backgroundColor: searchFilterBg }
                    ]}
                    onPress={() => setIsSortDropdownVisible(true)}
                >
                    <Text style={[styles.filterText, { color: colors.black }]}>
                        {getSortLabel(sortBy)}
                    </Text>
                    <Ionicons name="chevron-down" size={wp(4)} color={colors.gray} />
                </TouchableOpacity>
            </View>

            {/* Category Dropdown */}
            {renderStringDropdown(
                isCategoryDropdownVisible,
                () => setIsCategoryDropdownVisible(false),
                categories,
                categoryFilter,
                handleCategorySelect,
                getCategoryLabel
            )}

            {/* Status Dropdown */}
            {renderStringDropdown(
                isStatusDropdownVisible,
                () => setIsStatusDropdownVisible(false),
                statuses,
                statusFilter,
                handleStatusSelect,
                getStatusLabel
            )}

            {/* Sort Dropdown */}
            {renderSortDropdown(
                isSortDropdownVisible,
                () => setIsSortDropdownVisible(false),
                sortOptions,
                sortBy,
                handleSortSelect
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(2),
        paddingHorizontal: wp(1),
        paddingVertical:hp(2),
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: hp(4),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        marginBottom: hp(1.5),
    },
    searchIcon: {
        fontSize: wp(4),
        marginRight: wp(2),
    },
    searchInput: {
        flex: 1,
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: wp(2),
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
    },
    filterText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
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
    selectedItem: {
        // backgroundColor is set dynamically
    },
    checkIcon: {
        marginRight: wp(3),
    },
    dropdownItemText: {
        fontSize: wp(4),
        fontFamily: FONT.medium,
    },
    selectedItemText: {
        fontFamily: FONT.semiBold,
    },
});

export default SearchFilterSection; 