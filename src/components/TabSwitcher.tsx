import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

const TABS = [
    { label: 'Losing Money' },
    { label: 'Your Winners' },
    { label: 'Quick Wins' },
];

// Accept activeIndex and setActiveIndex as props
const TabSwitcher = ({ activeIndex, setActiveIndex }: { activeIndex: number, setActiveIndex: (idx: number) => void }) => {
    const { colors, theme } = useTheme();
    
    // Card background: white in light mode, dark in dark mode
    const tabBackgroundColor = theme === 'light' ? colors.white : colors.primary;
    
    return (
        <View style={styles.tabSwitcher}>
            {TABS.map((tab, idx) => {
                const isActive = idx === activeIndex;
                return (
                    <Animatable.View
                        style={{ flex: 1 }}
                        key={tab.label}
                        animation={isActive ? "pulse" : undefined}
                        duration={300}
                        iterationCount={1}
                    >
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: isActive ? colors.brown : tabBackgroundColor,
                                    borderColor: isActive ? colors.brown : colors.lightgray,
                                },
                                idx === 0 && styles.firstTab,
                                idx === TABS.length - 1 && styles.lastTab,
                            ]}
                            activeOpacity={0.85}
                            onPress={() => {
                                setActiveIndex(idx);
                            }}
                        >
                            <Text style={[
                                styles.tabText,
                                {
                                    color: isActive ? colors.white : colors.brown,
                                }
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabSwitcher: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1),
        marginBottom: hp(1),
        // No backgroundColor or borderRadius here
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.2),
        marginHorizontal: wp(1),
        borderRadius: wp(5),
        borderWidth: 1,
    },
    firstTab: {
        // Optionally, you can add left margin or nothing
    },
    lastTab: {
        // Optionally, you can add right margin or nothing
    },
    tabText: {
        fontFamily: FONT.semiBold,
        fontSize: wp(3),
    },
});

export default TabSwitcher;