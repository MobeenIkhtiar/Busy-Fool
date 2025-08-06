import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

interface ProductSuggestionCardProps {
    name: string;
    profit: string;
}

const ProductSuggestionCard: React.FC<ProductSuggestionCardProps> = ({ name, profit }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animatable.View
            animation={isVisible ? "slideInRight" : undefined}
            duration={600}
            style={styles.card}
        >
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Animatable.Text
                    animation={isVisible ? "pulse" : undefined}
                    duration={1000}
                    delay={300}
                    iterationCount="infinite"
                    style={styles.profit}
                >
                    {profit} profit
                </Animatable.Text>
            </View>
            <Animatable.Image
                source={icons.coffee}
                style={styles.icon}
                resizeMode="contain"
                animation={isVisible ? "bounceIn" : undefined}
                duration={800}
                delay={200}
            />
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: wp(4),
        marginVertical: hp(0.7),
        shadowColor: COLORS.black,
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
        color: COLORS.brown,
        marginBottom: 2,
    },
    profit: {
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
        color: COLORS.green,
    },
    icon: {
        width: wp(5),
        height: wp(5),
        marginLeft: wp(2),
    },
});

export default ProductSuggestionCard; 