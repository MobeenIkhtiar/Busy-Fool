import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, hp, wp } from '../constants/StyleGuide';

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
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products, ingredients, or categories"
                    placeholderTextColor={COLORS.lightgray}
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>

            {/* Filter Dropdowns */}
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>{categoryFilter}</Text>
                    <Text style={styles.chevronIcon}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>{statusFilter}</Text>
                    <Text style={styles.chevronIcon}>▼</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        padding: wp(4),
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: hp(4),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
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
        color: COLORS.black,
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
        backgroundColor: COLORS.primary,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
    },
    filterText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.black,
    },
    chevronIcon: {
        fontSize: wp(3),
        color: COLORS.lightgray,
    },
});

export default SearchFilterSection; 