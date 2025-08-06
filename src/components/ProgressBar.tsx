import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/StyleGuide';

type ProgressBarProps = {
    progress: number;
    color: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 100);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <View style={styles.progressBarBg}>
            <Animatable.View
                animation="fadeInLeft"
                duration={1000}
                style={[styles.progressBarFill, { width: `${animatedProgress * 100}%`, backgroundColor: color }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarBg: {
        height: 7,
        backgroundColor: COLORS.lightWhite,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 7,
        borderRadius: 4,
    },
});

export default ProgressBar; 