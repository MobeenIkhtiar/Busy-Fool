import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import { icons } from '../constants/icons';

interface ProductSuggestionCardProps {
    name: string;
    profit: string;
}

const ProductSuggestionCard: React.FC<ProductSuggestionCardProps> = ({ name, profit }) => {
    const { colors, theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Card background: white in light mode, dark in dark mode
    const cardBackgroundColor = theme === 'light' ? colors.white : colors.primary;

    return (
        <Animatable.View
            animation={isVisible ? "slideInRight" : undefined}
            duration={600}
            style={[
                styles.card,
                {
                    backgroundColor: cardBackgroundColor,
                    shadowColor: colors.black,
                    borderColor: colors.lightWhite,
                }
            ]}
        >
            <View style={styles.textContainer}>
                <Text style={[styles.name, { color: colors.brown }]}>{name}</Text>
                <Animatable.Text
                    animation={isVisible ? "pulse" : undefined}
                    duration={1000}
                    delay={300}
                    iterationCount="infinite"
                    style={[styles.profit, { color: colors.green }]}
                >
                    {profit} profit
                </Animatable.Text>
            </View>
            <Animatable.Image
                source={icons.coffee}
                style={[styles.icon, { tintColor: colors.black }]}
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
        borderRadius: 12,
        padding: wp(4),
        marginVertical: hp(0.7),
        borderWidth: 1,
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: wp(1),
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
        marginBottom: 2,
    },
    profit: {
        fontFamily: FONT.regular,
        fontSize: wp(3.5),
    },
    icon: {
        width: wp(5),
        height: wp(5),
        marginLeft: wp(2),
    },
});

export default ProductSuggestionCard; 