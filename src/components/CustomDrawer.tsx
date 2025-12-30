import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { icons } from '../constants/icons';
import { FONT, wp, hp, COLORS } from '../constants/StyleGuide';
import Ionicons from 'react-native-vector-icons/Ionicons';

const menuItems = [
    { label: 'Dashboard', iconName: 'grid-outline', iconType: 'ionicons', route: 'Dashboard' },
    { label: 'Products', iconName: 'coffee', iconType: 'image', route: 'Products' },
    { label: 'Ingredients', iconName: 'leaf-outline', iconType: 'ionicons', route: 'Ingredients' },
    { label: 'Analytics', iconName: 'bar-chart-outline', iconType: 'ionicons', route: 'Analytics' },
];

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
    const activeRouteName = state.routes[state.index].name;
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <LinearGradient
            colors={['#c6f6d5', '#d4f5e0', '#e8f5ec']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.sidebar}
        >
            <View style={styles.container}>
                {/* Header with logo and close button */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={icons.logo} style={styles.logo} />
                    </View>
                    <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeBtn}>
                        <Ionicons name="close" size={wp(7)} color={COLORS.brown} />
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item) => {
                        const isActive = activeRouteName === item.route;
                        const iconColor = isActive ? COLORS.white : COLORS.black;
                        const textColor = isActive ? COLORS.white : COLORS.black;
                        
                        return (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    styles.menuItem,
                                    isActive && styles.menuItemActive
                                ]}
                                onPress={() => navigation.navigate(item.route)}
                            >
                                <View style={styles.iconWrapper}>
                                    {item.iconType === 'ionicons' ? (
                                        <Ionicons name={item.iconName as any} size={wp(6)} color={iconColor} />
                                    ) : (
                                        <Image 
                                            source={icons.coffee} 
                                            style={{ 
                                                width: wp(6), 
                                                height: wp(6), 
                                                resizeMode: 'contain', 
                                                tintColor: iconColor 
                                            }} 
                                        />
                                    )}
                                </View>
                                <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Logout at bottom */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={wp(7)} color={COLORS.brown} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: hp(4),
        paddingHorizontal: wp(5),
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(4),
        paddingHorizontal: wp(2),
        borderBottomWidth: .4,
        borderBlockColor: COLORS.lightWhite,
        paddingBottom: hp(2),
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    logo: {
        width: wp(20),
        height: wp(20),
        resizeMode: 'contain',
    },
    logoText: {
        color: '#F6E7A1',
        fontFamily: FONT.bold,
        fontSize: wp(4.5),
    },
    closeBtn: {
        padding: 4,
    },
    menuSection: {
        flex: 1,
        paddingHorizontal: wp(2),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        gap: wp(3),
        borderRadius: wp(2),
        marginVertical: hp(0.5),
    },
    menuItemActive: {
        backgroundColor: COLORS.brown,
    },
    iconWrapper: {
        width: wp(6),
        alignItems: 'center',
    },
    menuLabel: {
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
    },
    logoutSection: {
        paddingHorizontal: wp(2),
        paddingVertical: hp(3),
        marginBottom: hp(5)
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    logoutText: {
        color: COLORS.brown,
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
    },
});

export default CustomDrawer; 