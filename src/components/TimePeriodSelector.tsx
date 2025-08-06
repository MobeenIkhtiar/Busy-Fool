import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';

interface TimePeriodSelectorProps {
    selectedPeriod: string;
    onPeriodChange: (period: string) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
    const periods = ['Today', '7 Days', '30 Days', '3 Months'];

    return (
        <View style={styles.container}>
            {periods.map((period) => (
                <TouchableOpacity
                    key={period}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.selectedPeriod
                    ]}
                    onPress={() => onPeriodChange(period)}
                >
                    <Text style={[
                        styles.periodText,
                        selectedPeriod === period && styles.selectedPeriodText
                    ]}>
                        {period}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: hp(2),
        gap: wp(2),
    },
    periodButton: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        borderRadius: wp(2),
    },
    selectedPeriod: {
        backgroundColor: COLORS.brown,
    },
    periodText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.brown,
    },
    selectedPeriodText: {
        color: COLORS.white,
    },
});

export default TimePeriodSelector; 