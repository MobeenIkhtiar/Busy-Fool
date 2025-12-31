import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from './CustomButton';

interface Currency {
    code: string;
    name: string;
    symbol: string;
}

const currencies: Currency[] = [
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
];

interface CurrencySettingsProps {
    onSave?: (currency: Currency) => void;
}

const CurrencySettings: React.FC<CurrencySettingsProps> = ({ onSave }) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;
    const textColor = theme === 'light' ? colors.black : colors.white;
    const subtitleColor = theme === 'light' ? colors.gray : colors.gray;
    const dropdownBg = theme === 'light' ? colors.primary : colors.lightWhite;
    const dropdownTextColor = theme === 'light' ? colors.black : colors.white;
    
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

    // Check if currency has changed
    const isCurrencyChanged = selectedCurrency.code !== currentCurrency.code;

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setIsDropdownVisible(false);
    };

    const handleSave = () => {
        if (!isCurrencyChanged) return; // Prevent save if no change
        setCurrentCurrency(selectedCurrency);
        if (onSave) {
            onSave(selectedCurrency);
        }
    };

    const getCurrencyDisplay = (currency: Currency) => {
        return `${currency.symbol} - ${currency.name} (${currency.code})`;
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
                        <Ionicons name="cash-outline" size={wp(5)} color={colors.white} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: textColor }]}>Currency Settings</Text>
                        <Text style={[styles.subtitle, { color: subtitleColor }]}>
                            Choose your preferred currency
                        </Text>
                    </View>
                </View>
            </View>

            {/* Currency Selector */}
            <View style={styles.currencySection}>
                <Text style={[styles.label, { color: textColor }]}>Display Currency</Text>
                <TouchableOpacity
                    style={[
                        styles.dropdown,
                        {
                            backgroundColor: dropdownBg,
                            borderColor: colors.lightWhite,
                        }
                    ]}
                    onPress={() => setIsDropdownVisible(true)}
                >
                    <Text style={[styles.dropdownText, { color: dropdownTextColor }]}>
                        {getCurrencyDisplay(selectedCurrency)}
                    </Text>
                    <Ionicons name="chevron-down" size={wp(4)} color={dropdownTextColor} />
                </TouchableOpacity>
            </View>

            {/* Save Button */}
            <CustomButton
                title="Save Currency"
                iconName="save-outline"
                backgroundColor={isCurrencyChanged ? '#10B981' : undefined}
                textColor={colors.white}
                disabled={!isCurrencyChanged}
                onPress={handleSave}
                style={styles.saveButton}
            />

            {/* Current Currency */}
            <Text style={[styles.currentCurrency, { color: subtitleColor }]}>
                Current currency: {currentCurrency.code}
            </Text>

            {/* Dropdown Modal */}
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
                            backgroundColor: cardBg,
                            shadowColor: colors.black,
                        }
                    ]}>
                        <FlatList
                            data={currencies}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.lightWhite },
                                        selectedCurrency.code === item.code && [
                                            styles.selectedItem,
                                            { backgroundColor: colors.lightBlue }
                                        ]
                                    ]}
                                    onPress={() => handleCurrencySelect(item)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        { color: textColor },
                                        selectedCurrency.code === item.code && [
                                            styles.selectedItemText,
                                            { color: colors.blue }
                                        ]
                                    ]}>
                                        {getCurrencyDisplay(item)}
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
    currencySection: {
        marginBottom: hp(3),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1.5),
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
    saveButton: {
        marginBottom: hp(2),
    },
    currentCurrency: {
        fontSize: wp(3.2),
        fontFamily: FONT.regular,
        textAlign: 'center',
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

export default CurrencySettings;

