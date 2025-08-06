import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONT, wp, hp } from '../../../constants/StyleGuide';
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
    const [activeTab, setActiveTab] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
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
                    <Text style={styles.welcomeText}>Welcome back <Text style={styles.emoji}>👋</Text></Text>
                    <Text style={styles.subtitle}>Here's a quick glance at your coffee business today.</Text>
                </Animatable.View>

                <Animatable.View
                    animation={isLoaded ? "fadeInUp" : undefined}
                    duration={1000}
                    delay={400}
                    style={styles.statsSection}
                >
                    <Animatable.View
                        animation={isLoaded ? "slideInLeft" : undefined}
                        duration={600}
                        delay={600}
                    >
                        <StatCard label="Revenue" value="£1243" color={COLORS.brown} valueColor={COLORS.brown} progress={0.8} />
                    </Animatable.View>
                    <Animatable.View
                        animation={isLoaded ? "slideInLeft" : undefined}
                        duration={600}
                        delay={800}
                    >
                        <StatCard label="Cost" value="£872" color={'#F97315'} valueColor={'#F97315'} progress={0.6} />
                    </Animatable.View>
                    <Animatable.View
                        animation={isLoaded ? "slideInLeft" : undefined}
                        duration={600}
                        delay={1000}
                    >
                        <StatCard label="Profit" value="£371" color={COLORS.green} valueColor={COLORS.green} progress={0.3} />
                    </Animatable.View>
                </Animatable.View>

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
                    <Text style={styles.liveProductTitle}>Live Product Suggestions</Text>
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
        backgroundColor: COLORS.primary,
        paddingTop: hp(2),
        paddingHorizontal: wp(4),
    },
    scrollContent: {
        paddingBottom: hp(10),
    },
    headerSection: {
        marginBottom: hp(2),
    },
    welcomeText: {
        fontSize: wp(8),
        fontFamily: FONT.extraBold,
        color: COLORS.brown,
    },
    emoji: {
        fontSize: wp(7),
    },
    subtitle: {
        fontSize: wp(4),
        color: COLORS.gray,
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
        color: COLORS.brown,
        fontFamily: FONT.semiBold,
        fontSize: wp(4.5),
        marginBottom: hp(1),
        marginTop: hp(1)
    },
});