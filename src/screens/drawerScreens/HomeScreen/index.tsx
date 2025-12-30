import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FONT, wp, hp } from '../../../constants/StyleGuide';
import { useTheme } from '../../../context/ThemeContext';
import TopBar from '../../../components/TopBar';
import StatCard from '../../../components/StatCard';
import TabSwitcher from '../../../components/TabSwitcher';
import QuickWinCard from '../../../components/QuickWinCard';
import ProductSuggestionCard from '../../../components/ProductSuggestionCard';
import { useNavigation } from '@react-navigation/native';

const QUICK_WIN_ITEMS = [
    [
        { title: 'Reduce waste', subtitle: 'Track inventory closely' },
        { title: 'Negotiate supplier rates', subtitle: 'Lower your costs' },
        { title: 'Optimize menu', subtitle: 'Remove low sellers' },
    ],
    [
        { title: 'Top Seller: Espresso', subtitle: 'Highest margin' },
        { title: 'Loyalty Program', subtitle: 'Repeat customers' },
        { title: 'Efficient Staff', subtitle: 'Faster service' },
    ],
    [
        { title: 'Smaller cups', subtitle: 'Less ingredient use' },
        { title: 'Upsell snacks', subtitle: 'Increase average sale' },
        { title: 'Promote specials', subtitle: 'Move more product' },
    ],
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Simulate API call - replace this with actual API call in future
        const fetchStats = async () => {
            try {
                // TODO: Replace with actual API call
                // const stats = await statsService.getStats();
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Set stats data here when API is ready
                setIsStatsLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setIsStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <TopBar navigation={navigation as any} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animatable.View
                    animation={isLoaded ? "fadeInDown" : undefined}
                    duration={800}
                    delay={200}
                    style={styles.headerSection}
                >
                    <Text style={[styles.welcomeText, { color: colors.brown }]}>Welcome back <Text style={styles.emoji}>👋</Text></Text>
                    <Text style={[styles.subtitle, { color: colors.gray }]}>Here's a quick glance at your coffee business today.</Text>
                </Animatable.View>

                {isLoaded && (
                    <Animatable.View
                        animation="fadeInUp"
                        duration={800}
                        delay={400}
                        style={styles.statsSection}
                    >
                        {isStatsLoading ? (
                            <View style={[styles.loaderContainer, { backgroundColor: colors.primary }]}>
                                <ActivityIndicator size="large" color={colors.brown} />
                                <Text style={[styles.loaderText, { color: colors.gray }]}>Loading stats...</Text>
                            </View>
                        ) : (
                            <>
                                <StatCard label="Revenue" value="£1243" color={colors.brown} valueColor={colors.brown} progress={0.8} />
                                <StatCard label="Cost" value="£872" color={colors.orange} valueColor={colors.orange} progress={0.6} />
                                <StatCard label="Profit" value="£371" color={colors.green} valueColor={colors.green} progress={0.3} />
                            </>
                        )}
                    </Animatable.View>
                )}

                <Animatable.View
                    animation={isLoaded ? "zoomIn" : undefined}
                    duration={700}
                    delay={1200}
                >
                    <TabSwitcher activeIndex={activeTab} setActiveIndex={setActiveTab} />
                </Animatable.View>

                {/* Quick Wins Section */}
                <Animatable.View
                    animation={isLoaded ? "fadeInUp" : undefined}
                    duration={800}
                    delay={1400}
                    style={styles.quickWinSection}
                >
                    <QuickWinCard items={QUICK_WIN_ITEMS[activeTab]} />
                </Animatable.View>

                {/* Live Product Suggestions Section */}
                <Animatable.View
                    animation={isLoaded ? "fadeInUp" : undefined}
                    duration={800}
                    delay={1600}
                >
                    <Text style={[styles.liveProductTitle, { color: colors.brown }]}>Live Product Suggestions</Text>
                </Animatable.View>

                <Animatable.View
                    animation={isLoaded ? "slideInRight" : undefined}
                    duration={600}
                    delay={1800}
                >
                    <ProductSuggestionCard name="Oat Latte" profit="+0.25" />
                </Animatable.View>

                <Animatable.View
                    animation={isLoaded ? "slideInRight" : undefined}
                    duration={600}
                    delay={2000}
                >
                    <ProductSuggestionCard name="Iced Matcha" profit="+0.15" />
                </Animatable.View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(2),
        paddingHorizontal: wp(4),
    },
    scrollContent: {
        paddingBottom: hp(4),
    },
    headerSection: {
        marginBottom: hp(2),
    },
    welcomeText: {
        fontSize: wp(8),
        fontFamily: FONT.extraBold,
    },
    emoji: {
        fontSize: wp(7),
    },
    subtitle: {
        fontSize: wp(4),
        fontFamily: FONT.regular,
        marginTop: 4,
    },
    statsSection: {
        marginBottom: hp(2),
    },
    quickWinSection: {
        marginVertical: hp(2),
    },
    liveProductTitle: {
        fontFamily: FONT.semiBold,
        fontSize: wp(4.5),
        marginBottom: hp(1),
        marginTop: hp(1)
    },
    loaderContainer: {
        borderRadius: wp(2),
        padding: wp(8),
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp(15),
        marginHorizontal: wp(1),
    },
    loaderText: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(2),
    },
});