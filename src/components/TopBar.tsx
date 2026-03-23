import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { icons } from '../constants/icons';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TopBarProps = {
    navigation?: any;
};

const MenuIcon = ({ colors }: { colors: any }) => (
    <View style={styles.menuIconBox}>
        <Image source={icons.drawer} style={[styles.menuIcon, { tintColor: colors.brown }]} />
    </View>
);
const BellIcon = ({ colors }: { colors: any }) => (
    <View style={styles.bellIconContainer}>
        <Image source={icons.notification} style={[styles.menuIcon, { tintColor: colors.brown }]} />
    </View>
);
const ProfileImage = ({ navigation, colors }: TopBarProps & { colors: any }) => (
    <TouchableOpacity style={[styles.profileImage, { backgroundColor: colors.brown }]} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileText}>P</Text>
    </TouchableOpacity>
);

const TopBar = ({ navigation }: TopBarProps) => {
    const { theme, toggleTheme, colors } = useTheme();
    
    return (
        <View style={styles.topBar}>
            <TouchableOpacity
                onPress={() => {
                    if (navigation && typeof navigation.openDrawer === 'function') {
                        navigation.openDrawer();
                    }
                }}
            >
                <MenuIcon colors={colors} />
            </TouchableOpacity>
            <View style={styles.rightSection}>
                {/* <View style={styles.bellWrapper}>
                    <BellIcon colors={colors} />
                    <View style={[styles.badge, { backgroundColor: colors.red }]}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </View> */}
                <TouchableOpacity 
                    onPress={toggleTheme}
                    style={styles.themeToggle}
                >
                    <Ionicons 
                        name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} 
                        size={wp(6)} 
                        color={colors.brown} 
                    />
                </TouchableOpacity>
                <ProfileImage navigation={navigation} colors={colors} />
            </View>
        </View>
    );
};

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
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    bellDot: {
        width: wp(2),
        height: wp(2),
        borderRadius: wp(1),
        marginTop: 2,
    },
    profileImage: {
        width: wp(9),
        height: wp(9),
        borderRadius: wp(4.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        color: '#fff',
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
    themeToggle: {
        marginRight: wp(4),
        padding: wp(1),
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        zIndex: 1,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: FONT.bold,
    },
});

export default TopBar; 