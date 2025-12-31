import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { hp, wp, FONT } from '../../constants/StyleGuide';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditProfileModal, { ProfileFormData } from '../../components/EditProfileModal';

const ProfileScreen = () => {
    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
    
    // Card background: white in light mode, dark in dark mode
    const cardBg = theme === 'light' ? colors.white : colors.primary;

    const handleEditProfile = () => {
        setIsEditProfileVisible(true);
    };

    const handleCloseEditProfile = () => {
        setIsEditProfileVisible(false);
    };

    const handleUpdateProfile = (data: ProfileFormData) => {
        console.log('Profile updated:', data);
        // TODO: Integrate with API to update profile
        setIsEditProfileVisible(false);
    };
    
    const ProfileIcon = () => (
        <View style={[styles.profileIcon, { backgroundColor: colors.lightBlue }]}>
            <Text style={styles.profileIconText}>👤</Text>
        </View>
    );

    const SettingsIcon = () => (
        <View style={[styles.settingsIcon, { backgroundColor: colors.lightOrange }]}>
            <Text style={styles.settingsIconText}>⚙️</Text>
        </View>
    );

    const BillingIcon = () => (
        <View style={[styles.billingIcon, { backgroundColor: colors.lightPurple }]}>
            <Text style={styles.billingIconText}>💳</Text>
        </View>
    );

    const HelpIcon = () => (
        <View style={[styles.helpIcon, { backgroundColor: colors.lightGreen }]}>
            <Text style={styles.helpIconText}>❓</Text>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.primary }]}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={wp(6)} color={colors.brown} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.brown }]}>Profile</Text>
                    <View style={styles.backButtonPlaceholder} />
                </View>

                {/* Profile Card */}
                {/* <View style={[styles.profileCard, { backgroundColor: colors.white, shadowColor: colors.black }]}>
                    <View style={styles.profileCardContent}>
                        <View style={styles.profileCardImageContainer}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=JD' }}
                                style={styles.profileCardImage}
                            />
                            <View style={[styles.profileCardOnlineIndicator, { backgroundColor: colors.green, borderColor: colors.white }]} />
                        </View>
                        <View style={styles.profileCardInfo}>
                            <Text style={[styles.profileCardName, { color: colors.brown }]}>John Doe</Text>
                            <Text style={[styles.profileCardEmail, { color: colors.lightgray }]}>john.doe@example.com</Text>
                            <Text style={[styles.profileCardType, { color: colors.blue }]}>Premium User</Text>
                        </View>
                    </View>
                </View> */}

                {/* Profile Details Section (formerly modal content) */}
                <View style={[styles.profileDetailsSection, { backgroundColor: cardBg, shadowColor: colors.black }]}>
                    {/* Header Section */}
                    <View style={[styles.headerSection, { backgroundColor: colors.brown }]}>
                        <View style={styles.headerLeft}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/60x60/4CAF50/FFFFFF?text=JD' }}
                                    style={styles.profileImage}
                                />
                                <View style={[styles.onlineIndicator, { backgroundColor: colors.green, borderColor: colors.white }]} />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: colors.white }]}>John Doe</Text>
                                <Text style={[styles.userEmail, { color: colors.white }]}>john.doe@example.com</Text>
                                <Text style={[styles.userType, { color: colors.white }]}>Premium User</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Section */}
                    <View style={[styles.menuSection, { backgroundColor: cardBg }]}>
                        <TouchableOpacity 
                            style={[styles.menuItem, { borderBottomColor: colors.lightWhite }]}
                            onPress={handleEditProfile}
                        >
                            <ProfileIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={[styles.menuItemTitle, { color: colors.black }]}>My Profile</Text>
                                <Text style={[styles.menuItemSubtitle, { color: colors.lightgray }]}>View and edit your profile</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.lightWhite }]}>
                            <SettingsIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={[styles.menuItemTitle, { color: colors.black }]}>Account Settings</Text>
                                <Text style={[styles.menuItemSubtitle, { color: colors.lightgray }]}>Manage your account preferences</Text>
                            </View>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.lightWhite }]}>
                            <BillingIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={[styles.menuItemTitle, { color: colors.brown }]}>Billing & Plans</Text>
                                <Text style={[styles.menuItemSubtitle, { color: colors.lightgray }]}>Manage subscription and billing</Text>
                            </View>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.lightWhite }]}>
                            <HelpIcon />
                            <View style={styles.menuItemContent}>
                                <Text style={[styles.menuItemTitle, { color: colors.black }]}>Help & Support</Text>
                                <Text style={[styles.menuItemSubtitle, { color: colors.lightgray }]}>Get help and contact support</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={[styles.footerSection, { backgroundColor: cardBg, borderTopColor: colors.lightWhite }]}>
                        <Text style={[styles.footerText, { color: colors.lightgray }]}>Member since Jan 2024</Text>
                    </View>
                </View>
            </View>

            {/* Edit Profile Modal */}
            <EditProfileModal
                visible={isEditProfileVisible}
                onClose={handleCloseEditProfile}
                onSubmit={handleUpdateProfile}
                initialData={{
                    fullName: 'Test user',
                    phoneNumber: '+1 (555) 000-0000',
                    dateOfBirth: '',
                    address: '',
                    bio: '',
                }}
            />
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: wp(4),
        paddingTop: hp(4),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(4),
    },
    backButton: {
        padding: wp(1),
    },
    backButtonPlaceholder: {
        width: wp(8),
    },
    title: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
        flex: 1,
        textAlign: 'center',
    },
    profileCard: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
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
        borderWidth: 2,
    },
    profileCardInfo: {
        flex: 1,
    },
    profileCardName: {
        fontSize: wp(5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    profileCardEmail: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        marginBottom: hp(0.5),
    },
    profileCardType: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
    },
    // New section for profile details (formerly modal content)
    profileDetailsSection: {
        borderRadius: wp(3),
        marginBottom: hp(2),
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
        borderWidth: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: wp(5.5),
        fontFamily: FONT.bold,
        marginBottom: hp(0.5),
    },
    userEmail: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        opacity: 0.9,
        marginBottom: hp(0.5),
    },
    userType: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        opacity: 0.8,
    },
    menuSection: {
        padding: wp(4),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: 1,
    },
    profileIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
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
        marginBottom: hp(0.5),
    },
    menuItemSubtitle: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
    },
    footerSection: {
        padding: wp(4),
        borderTopWidth: 1,
    },
    footerText: {
        fontSize: wp(3.5),
        fontFamily: FONT.regular,
        textAlign: 'center',
    },
});