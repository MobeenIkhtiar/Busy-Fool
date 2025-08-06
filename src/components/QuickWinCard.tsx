import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';

// Accept items as a prop
interface QuickWinItem {
    title: string;
    subtitle: string;
}

const QuickWinCard = ({ items }: { items: QuickWinItem[] }) => {
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
                    style={styles.card}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
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
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        padding: wp(3),
        marginRight: wp(3),
        borderWidth: 1,
        borderColor: COLORS.lightWhite

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
        color: COLORS.brown,
        marginBottom: 2,
    },
    subtitle: {
        fontFamily: FONT.regular,
        fontSize: wp(3),
        color: COLORS.gray,
    },
});

export default QuickWinCard; 