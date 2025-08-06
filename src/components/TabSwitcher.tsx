import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';

const TABS = [
    { label: 'Losing Money' },
    { label: 'Your Winners' },
    { label: 'Quick Wins' },
];

// Accept activeIndex and setActiveIndex as props
const TabSwitcher = ({ activeIndex, setActiveIndex }: { activeIndex: number, setActiveIndex: (idx: number) => void }) => {
    return (
        <View style={styles.tabSwitcher}>
            {TABS.map((tab, idx) => (
                <Animatable.View
                    style={{ flex: 1 }}
                    key={tab.label}
                    animation={idx === activeIndex ? "pulse" : undefined}
                    duration={300}
                    iterationCount={1}
                >
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            idx === activeIndex ? styles.tabActive : styles.tabInactive,
                            idx === 0 && styles.firstTab,
                            idx === TABS.length - 1 && styles.lastTab,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                            setActiveIndex(idx);
                        }}
                    >
                        <Text style={[styles.tabText, idx === activeIndex && styles.tabActiveText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                </Animatable.View>
            ))}
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
        borderColor: COLORS.lightgray,
        backgroundColor: COLORS.white,
    },
    tabInactive: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.lightgray,
    },
    tabActive: {
        backgroundColor: COLORS.brown,
        borderColor: COLORS.brown,
    },
    tabText: {
        color: COLORS.brown,
        fontFamily: FONT.semiBold,
        fontSize: wp(3),
    },
    tabActiveText: {
        color: COLORS.white,
    },
    firstTab: {
        // Optionally, you can add left margin or nothing
    },
    lastTab: {
        // Optionally, you can add right margin or nothing
    },
});

export default TabSwitcher;