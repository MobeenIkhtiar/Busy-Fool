import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, hp, wp, FONT } from '../../constants/StyleGuide';

const ProfileScreen = () => {
    const ProfileIcon = () => (
        <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
        </View>
    );

    const SettingsIcon = () => (
        <View style={styles.settingsIcon}>
            <Text style={styles.settingsIconText}>⚙️</Text>
        </View>
    );

    const BillingIcon = () => (
        <View style={styles.billingIcon}>
            <Text style={styles.billingIconText}>💳</Text>
        </View>
    );

    const HelpIcon = () => (
        <View style={styles.helpIcon}>
            <Text style={styles.helpIconText}>❓</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Profile</Text>

                {/* Profile Card */}
                {/* <View style={styles.profileCard}>
                    <View style={styles.profileCardContent}>
                        <View style={styles.profileCardImageContainer}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=JD' }}
                                style={styles.profileCardImage}
                            />
                            <View style={styles.profileCardOnlineIndicator} />
                        </View>
                        <View style={styles.profileCardInfo}>
                            <Text style={styles.profileCardName}>John Doe</Text>
                            <Text style={styles.profileCardEmail}>john.doe@example.com</Text>
                            <Text style={styles.profileCardType}>Premium User</Text>
                        </View>
                    </View>
                </View> */}

                {/* Profile Details Section (formerly modal content) */}
                <View style={styles.profileDetailsSection}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.headerLeft}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/60x60/4CAF50/FFFFFF?text=JD' }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.onlineIndicator} />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>John Doe</Text>
                                <Text style={styles.userEmail}>john.doe@example.com</Text>
                                <Text style={styles.userType}>Premium User</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Section */}
                    <View style={styles.menuSection}>
                        <TouchableOpacity style={styles.menuItem}>
                            <ProfileIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={styles.menuItemTitle}>My Profile</Text>
                                <Text style={styles.menuItemSubtitle}>View and edit your profile</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <SettingsIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={styles.menuItemTitle}>Account Settings</Text>
                                <Text style={styles.menuItemSubtitle}>Manage your account preferences</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <BillingIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={styles.menuItemTitle}>Billing & Plans</Text>
                                <Text style={styles.menuItemSubtitle}>Manage subscription and billing</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <HelpIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={styles.menuItemTitle}>Help & Support</Text>
                                <Text style={styles.menuItemSubtitle}>Get help and contact support</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footerSection}>
                        <Text style={styles.footerText}>Member since Jan 2024</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    content: {
        paddingHorizontal: wp(4),
        paddingTop: hp(4),
    },
    title: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(4),
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileCardImageContainer: {
        position: 'relative',
        marginRight: wp(4),
    },
    profileCardImage: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
    },
    profileCardOnlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: wp(4),
        height: wp(4),
        borderRadius: wp(2),
        backgroundColor: COLORS.green,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    profileCardInfo: {
        flex: 1,
    },
    profileCardName: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    profileCardEmail: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
        marginBottom: hp(0.5),
    },
    profileCardType: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.blue,
    },
    // New section for profile details (formerly modal content)
    profileDetailsSection: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        marginBottom: hp(2),
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    headerSection: {
        backgroundColor: COLORS.brown,
        padding: wp(5),
        borderTopLeftRadius: wp(3),
        borderTopRightRadius: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: wp(4),
    },
    profileImage: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(7.5),
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: wp(3),
        height: wp(3),
        borderRadius: wp(1.5),
        backgroundColor: COLORS.green,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: wp(5.5),
        fontFamily: FONT.bold,
        color: COLORS.white,
        marginBottom: hp(0.5),
    },
    userEmail: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: hp(0.5),
    },
    userType: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        color: COLORS.white,
        opacity: 0.8,
    },
    menuSection: {
        padding: wp(4),
        backgroundColor: COLORS.white,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightWhite,
    },
    profileIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: COLORS.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    profileIconText: {
        fontSize: wp(4),
    },
    settingsIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: COLORS.lightOrange,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    settingsIconText: {
        fontSize: wp(4),
    },
    billingIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: COLORS.lightPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    billingIconText: {
        fontSize: wp(4),
    },
    helpIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: COLORS.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    helpIconText: {
        fontSize: wp(4),
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: wp(4.5),
        fontFamily: FONT.bold,
        color: COLORS.brown,
        marginBottom: hp(0.5),
    },
    menuItemSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
    },
    footerSection: {
        padding: wp(4),
        borderTopWidth: 1,
        borderTopColor: COLORS.lightWhite,
        backgroundColor: COLORS.white,
    },
    footerText: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        color: COLORS.lightgray,
        textAlign: 'center',
    },
});