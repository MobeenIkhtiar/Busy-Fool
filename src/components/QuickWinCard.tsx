import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

// Accept items as a prop
interface QuickWinItem {
    title: string;
    subtitle: string;
}

const QuickWinCard = ({ items }: { items: QuickWinItem[] }) => {
    const { colors, theme } = useTheme();
    const [currentItems, setCurrentItems] = useState(items);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (JSON.stringify(currentItems) !== JSON.stringify(items)) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentItems(items);
                setIsAnimating(false);
            }, 200);
        }
    }, [items, currentItems]);

    // Card background: white in light mode, dark in dark mode
    const cardBackgroundColor = theme === 'light' ? colors.white : colors.primary;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
        >
            {currentItems.map((item, idx) => (
                <Animatable.View
                    key={`${item.title}-${idx}`}
                    animation={isAnimating ? "fadeOut" : "fadeIn"}
                    duration={300}
                    delay={idx * 100}
                    style={[
                        styles.card,
                        {
                            backgroundColor: cardBackgroundColor,
                            borderColor: colors.lightWhite,
                        }
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.brown }]}>{item.title}</Text>
                        <Text style={[styles.subtitle, { color: colors.gray }]}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>✨</Text>
                    </View>
                </Animatable.View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    horizontalList: {
        flexDirection: 'row',
        paddingVertical: hp(0.5),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(2),
        padding: wp(3),
        marginRight: wp(3),
        borderWidth: 1,
    },
    iconContainer: {
        width: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: wp(6),
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: wp(2),
    },
    title: {
        fontFamily: FONT.semiBold,
        fontSize: wp(3.5),
        marginBottom: 2,
    },
    subtitle: {
        fontFamily: FONT.regular,
        fontSize: wp(3),
    },
});

export default QuickWinCard; 