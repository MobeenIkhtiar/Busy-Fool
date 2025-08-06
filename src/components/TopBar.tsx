import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';

type TopBarProps = {
    navigation?: any;
};

const MenuIcon = () => (
    <View style={styles.menuIconBox}>
        <Image source={icons.drawer} style={styles.menuIcon} />
    </View>
);
const BellIcon = () => (
    <View style={styles.bellIconContainer}>
        <Image source={icons.notification} style={styles.menuIcon} />
    </View>
);
const ProfileImage = ({ navigation }: TopBarProps) => (
    <TouchableOpacity style={styles.profileImage} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileText}>P</Text>
    </TouchableOpacity>
);

const TopBar = ({ navigation }: TopBarProps) => (
    <View style={styles.topBar}>
        <TouchableOpacity
            onPress={() => {
                if (navigation && typeof navigation.openDrawer === 'function') {
                    navigation.openDrawer();
                }
            }}
        >
            <MenuIcon />
        </TouchableOpacity>
        <View style={styles.rightSection}>
            <View style={styles.bellWrapper}>
                <BellIcon />
                <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </View>
            <ProfileImage navigation={navigation} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    menuIconBox: {
        justifyContent: 'center',
    },
    menuIcon: {
        resizeMode: 'contain',
        width: wp(6),
        height: wp(6),
    },
    bellIconContainer: {
        width: wp(7),
        height: wp(7),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bellIcon: {
        width: wp(5),
        height: wp(5),
        borderRadius: wp(2.5),
        borderWidth: 2,
        borderColor: COLORS.brown,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    bellDot: {
        width: wp(2),
        height: wp(2),
        backgroundColor: COLORS.brown,
        borderRadius: wp(1),
        marginTop: 2,
    },
    profileImage: {
        width: wp(9),
        height: wp(9),
        borderRadius: wp(4.5),
        backgroundColor: COLORS.lightgray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        color: COLORS.brown,
        fontFamily: FONT.bold,
        fontSize: wp(5),
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellWrapper: {
        marginRight: wp(4),
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: COLORS.red,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        zIndex: 1,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: FONT.bold,
    },
});

export default TopBar; 