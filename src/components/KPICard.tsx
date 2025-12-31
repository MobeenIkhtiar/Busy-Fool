import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT, hp, wp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';

type KPICardProps = {
    icon: any;
    iconBackground: string;
    label: string;
    value: string;
    contextualText: string;
    backgroundColor: string;
    valueColor: string;
};

const KPICard: React.FC<KPICardProps> = ({
    icon,
    iconBackground,
    label,
    value,
    contextualText,
    backgroundColor,
    valueColor
}) => {
    const { colors, theme } = useTheme();
    
    // Contextual text background: light in light mode, dark in dark mode
    const contextualBg = theme === 'light' ? '#F5F4F2' : colors.lightWhite;
    const contextualTextColor = theme === 'light' ? '#6B7280' : colors.gray;
    
    // Label color: Use black for light backgrounds, white for dark backgrounds
    // Check if backgroundColor is a dark color (starts with #0 or is colors.primary)
    const isDarkBackground = backgroundColor === colors.primary || backgroundColor.startsWith('#0') || backgroundColor.toLowerCase().includes('dark');
    const labelColor = isDarkBackground ? colors.white : '#000000';

    return (
        <View style={[
            styles.card,
            {
                backgroundColor,
                shadowColor: colors.black,
            }
        ]}>
            <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: iconBackground, borderRadius: wp(2) }]}>
                    <Image source={icon} style={styles.iconImage} />
                </View>
                {contextualText && (
                    <Text style={[styles.contextualText, { backgroundColor: contextualBg, color: contextualTextColor }]}>
                        {contextualText}
                    </Text>
                )}
            </View>
            <View style={styles.content}>
                <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
                <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 0, // Important for flex items to shrink properly
        borderRadius: wp(2),
        padding: wp(3),
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    iconContainer: {
        alignSelf: 'flex-start',
        padding: wp(2.5),
        marginRight: wp(2),
        flexShrink: 0, // Prevent icon from shrinking
    },
    iconImage: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: 'contain',
        tintColor: '#fff'
    },
    content: {
        flex: 1,
        minWidth: 0, // Important for flex items to shrink properly
    },
    contextualText: {
        fontSize: wp(2.8),
        fontFamily: FONT.regular,
        paddingHorizontal: wp(1.5),
        paddingVertical: hp(0.5),
        borderRadius: wp(2),
        flexShrink: 1, // Allow text to shrink if needed
        maxWidth: '100%', // Prevent overflow
    },
    label: {
        fontSize: wp(3.2),
        fontFamily: FONT.medium,
        marginBottom: hp(0.5),
    },
    value: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
    },
});

export default KPICard; 