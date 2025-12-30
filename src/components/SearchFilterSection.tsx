import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

type SearchFilterSectionProps = {
    searchValue: string;
    onSearchChange: (text: string) => void;
    categoryFilter: string;
    onCategoryFilterChange: (category: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
};

const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
    searchValue,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange: _onCategoryFilterChange,
    statusFilter,
    onStatusFilterChange: _onStatusFilterChange
}) => {
    const { colors, theme } = useTheme();
    
    // Background: white in light mode, dark in dark mode
    const containerBg = theme === 'light' ? colors.white : colors.primary;
    const searchFilterBg = theme === 'light' ? colors.primary : colors.lightWhite;

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
                    placeholder="Search products, ingredients, or categories"
                    placeholderTextColor={colors.lightgray}
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>

            {/* Filter Dropdowns */}
            <View style={styles.filterContainer}>
                <TouchableOpacity style={[
                    styles.filterButton,
                    { backgroundColor: searchFilterBg }
                ]}>
                    <Text style={[styles.filterText, { color: colors.black }]}>{categoryFilter}</Text>
                    <Text style={[styles.chevronIcon, { color: colors.lightgray }]}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[
                    styles.filterButton,
                    { backgroundColor: searchFilterBg }
                ]}>
                    <Text style={[styles.filterText, { color: colors.black }]}>{statusFilter}</Text>
                    <Text style={[styles.chevronIcon, { color: colors.lightgray }]}>▼</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp(2),
        padding: wp(4),
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
        paddingVertical: hp(1.5),
        marginBottom: hp(2),
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
        gap: wp(3),
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
    },
    filterText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    chevronIcon: {
        fontSize: wp(3),
    },
});

export default SearchFilterSection; 