import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { icons } from '../constants/icons';
import { FONT, wp, hp, COLORS } from '../constants/StyleGuide';
import Ionicons from 'react-native-vector-icons/Ionicons';

const menuItems = [
    { label: 'Dashboard', icon: <Ionicons name="grid-outline" size={wp(6)} color="#F6E7A1" />, route: 'Dashboard' },
    { label: 'Products', icon: <Image source={icons.coffee} style={{ width: wp(6), height: wp(6), resizeMode: 'contain', tintColor: '#F6E7A1', }} />, route: 'Products' },
    { label: 'Ingredients', icon: <Ionicons name="leaf-outline" size={wp(6)} color="#F6E7A1" />, route: 'Ingredients' },
    { label: 'Analytics', icon: <Ionicons name="bar-chart-outline" size={wp(6)} color="#F6E7A1" />, route: 'Analytics' },
];

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            {/* Header with logo and close button */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={icons.logo} style={styles.logo} />
                </View>
                <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeBtn}>
                    <Ionicons name="close" size={wp(7)} color="#F6E7A1" />
                </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.route)}
                    >
                        <View style={styles.iconWrapper}>{item.icon}</View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout at bottom */}
            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={wp(7)} color="#F6E7A1" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#332318',
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
        paddingVertical: hp(2.5),
        gap: wp(3),
    },
    iconWrapper: {
        width: wp(6),
        alignItems: 'center',
    },
    menuLabel: {
        color: COLORS.white,
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
        color: COLORS.white,
        fontFamily: FONT.semiBold,
        fontSize: wp(4),
    },
});

export default CustomDrawer; 