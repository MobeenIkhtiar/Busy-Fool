import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import ProgressBar from './ProgressBar';

type StatCardProps = {
    label: string;
    value: string;
    color: string;
    valueColor: string;
    progress: number;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, color, valueColor, progress }) => {
    const { colors, theme } = useTheme();
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 500);
        return () => clearTimeout(timer);
    }, [progress]);

    // Card background: white in light mode, dark in dark mode
    const cardBackgroundColor = theme === 'light' ? colors.white : colors.primary;

    return (
        <Animatable.View
            animation={isVisible ? "fadeIn" : undefined}
            duration={600}
            style={[styles.card, { backgroundColor: cardBackgroundColor, shadowColor: colors.black }]}
        >
            <Text style={[styles.cardLabel, { color: colors.gray }]}>{label}</Text>
            <Animatable.Text
                animation={isVisible ? "zoomIn" : undefined}
                duration={800}
                delay={200}
                style={[styles.cardValue, { color: valueColor }]}
            >
                {value}
            </Animatable.Text>
            <ProgressBar progress={animatedProgress} color={color} />
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: wp(2),
        padding: wp(5),
        marginBottom: 16,
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: wp(1),
    },
    cardLabel: {
        fontSize: wp(3),
        fontFamily: FONT.medium,
        marginBottom: hp(.5),
        textAlign: 'center',
    },
    cardValue: {
        fontSize: wp(5),
        fontFamily: FONT.extraBold,
        textAlign: 'center',
        marginBottom: 8,
    },
});

export default StatCard; 