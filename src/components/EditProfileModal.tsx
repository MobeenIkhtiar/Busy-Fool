import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { FONT, wp, hp } from '../constants/StyleGuide';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from './CustomButton';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit?: (data: ProfileFormData) => void;
    initialData?: ProfileFormData;
}

export interface ProfileFormData {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    bio: string;
    profileImage?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    visible,
    onClose,
    onSubmit,
    initialData,
}) => {
    const { colors, theme } = useTheme();
    
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: initialData?.fullName || 'Test user',
        phoneNumber: initialData?.phoneNumber || '+1 (555) 000-0000',
        dateOfBirth: initialData?.dateOfBirth || '',
        address: initialData?.address || '',
        bio: initialData?.bio || '',
        profileImage: initialData?.profileImage,
    });

    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(initialData?.profileImage);

    const handleImagePicker = () => {
        Alert.alert(
            'Select Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => {
                        const options: CameraOptions = {
                            mediaType: 'photo',
                            quality: 0.8,
                            maxWidth: 400,
                            maxHeight: 400,
                        };
                        launchCamera(options, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets[0] && response.assets[0].uri) {
                                setProfileImageUri(response.assets[0].uri);
                                setFormData({ ...formData, profileImage: response.assets[0].uri });
                            }
                        });
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => {
                        const options: ImageLibraryOptions = {
                            mediaType: 'photo',
                            quality: 0.8,
                            maxWidth: 400,
                            maxHeight: 400,
                        };
                        launchImageLibrary(options, (response: ImagePickerResponse) => {
                            if (response.assets && response.assets[0] && response.assets[0].uri) {
                                setProfileImageUri(response.assets[0].uri);
                                setFormData({ ...formData, profileImage: response.assets[0].uri });
                            }
                        });
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleReset = () => {
        setFormData({
            fullName: initialData?.fullName || 'Test user',
            phoneNumber: initialData?.phoneNumber || '+1 (555) 000-0000',
            dateOfBirth: initialData?.dateOfBirth || '',
            address: initialData?.address || '',
            bio: initialData?.bio || '',
            profileImage: initialData?.profileImage,
        });
        setProfileImageUri(initialData?.profileImage);
    };

    const handleSubmit = () => {
        if (!formData.fullName.trim()) {
            Alert.alert('Validation Error', 'Full Name is required');
            return;
        }
        
        if (onSubmit) {
            onSubmit(formData);
        }
        onClose();
    };

    const inputBg = theme === 'light' ? colors.primary : colors.lightWhite;
    const inputTextColor = theme === 'light' ? colors.black : colors.white;
    const placeholderColor = colors.lightgray;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.primary }]}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.headerTitle, { color: colors.brown }]}>Edit Profile</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={wp(6)} color={colors.black} />
                            </TouchableOpacity>
                        </View>

                        {/* Profile Picture Section */}
                        <View style={styles.profilePictureSection}>
                            <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
                                {profileImageUri ? (
                                    <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
                                ) : (
                                    <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.lightgray }]}>
                                        <Ionicons name="person" size={wp(12)} color={colors.gray} />
                                    </View>
                                )}
                                <View style={[styles.editIconContainer, { backgroundColor: colors.brown }]}>
                                    <Ionicons name="camera" size={wp(4)} color={colors.white} />
                                </View>
                            </TouchableOpacity>
                            <Text style={[styles.profileImageHint, { color: colors.gray }]}>
                                Click to change your profile picture
                            </Text>
                            <Text style={[styles.profileImageSubHint, { color: colors.lightgray }]}>
                                Recommended: 400x400px, max 5MB
                            </Text>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.formSection}>
                            {/* Full Name */}
                            <View style={styles.formField}>
                                <Text style={[styles.label, { color: inputTextColor }]}>
                                    Full Name <Text style={{ color: colors.red }}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: inputBg,
                                            color: inputTextColor,
                                            borderColor: colors.lightWhite,
                                        },
                                    ]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={placeholderColor}
                                    value={formData.fullName}
                                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                                />
                            </View>

                            {/* Phone Number */}
                            <View style={styles.formField}>
                                <Text style={[styles.label, { color: inputTextColor }]}>Phone Number</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: inputBg,
                                            color: inputTextColor,
                                            borderColor: colors.lightWhite,
                                        },
                                    ]}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={placeholderColor}
                                    value={formData.phoneNumber}
                                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Date of Birth */}
                            <View style={styles.formField}>
                                <Text style={[styles.label, { color: inputTextColor }]}>Date of Birth</Text>
                                <View style={styles.dateInputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.dateInput,
                                            {
                                                backgroundColor: inputBg,
                                                color: inputTextColor,
                                                borderColor: colors.lightWhite,
                                            },
                                        ]}
                                        placeholder="dd/mm/yyyy"
                                        placeholderTextColor={placeholderColor}
                                        value={formData.dateOfBirth}
                                        onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                                    />
                                    <Ionicons name="calendar-outline" size={wp(5)} color={inputTextColor} style={styles.calendarIcon} />
                                </View>
                            </View>

                            {/* Address */}
                            <View style={styles.formField}>
                                <Text style={[styles.label, { color: inputTextColor }]}>Address</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: inputBg,
                                            color: inputTextColor,
                                            borderColor: colors.lightWhite,
                                        },
                                    ]}
                                    placeholder="Street, City, State, ZIP"
                                    placeholderTextColor={placeholderColor}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    multiline
                                />
                            </View>

                            {/* Bio */}
                            <View style={styles.formField}>
                                <Text style={[styles.label, { color: inputTextColor }]}>Bio</Text>
                                <View style={styles.bioContainer}>
                                    <TextInput
                                        style={[
                                            styles.bioInput,
                                            {
                                                backgroundColor: inputBg,
                                                color: inputTextColor,
                                                borderColor: colors.lightWhite,
                                            },
                                        ]}
                                        placeholder="Tell us a little about yourself..."
                                        placeholderTextColor={placeholderColor}
                                        value={formData.bio}
                                        onChangeText={(text) => {
                                            if (text.length <= 500) {
                                                setFormData({ ...formData, bio: text });
                                            }
                                        }}
                                        multiline
                                        numberOfLines={4}
                                        maxLength={500}
                                    />
                                    <Text style={[styles.charCounter, { color: colors.lightgray }]}>
                                        {formData.bio.length}/500
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.resetButton,
                                    {
                                        backgroundColor: theme === 'light' ? colors.white : colors.primary,
                                        borderColor: colors.lightgray,
                                    },
                                ]}
                                onPress={handleReset}
                            >
                                <Ionicons name="refresh-outline" size={wp(4.5)} color={colors.black} />
                                <Text style={[styles.resetButtonText, { color: colors.black }]}>Reset</Text>
                            </TouchableOpacity>
                            <CustomButton
                                title="Update Profile"
                                iconName="checkmark-circle"
                                backgroundColor={colors.brown}
                                textColor={colors.white}
                                onPress={handleSubmit}
                                style={styles.updateButton}
                            />
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        marginTop: hp(8),
        borderTopLeftRadius: wp(5),
        borderTopRightRadius: wp(5),
    },
    scrollContent: {
        padding: wp(4),
        paddingBottom: hp(4),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    headerTitle: {
        fontSize: wp(6),
        fontFamily: FONT.bold,
    },
    closeButton: {
        padding: wp(1),
    },
    profilePictureSection: {
        alignItems: 'center',
        marginBottom: hp(4),
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: hp(1),
    },
    profileImage: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
    },
    profileImagePlaceholder: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileImageHint: {
        fontSize: wp(3.5),
        fontFamily: FONT.medium,
        marginTop: hp(1),
    },
    profileImageSubHint: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
    },
    formSection: {
        marginBottom: hp(3),
    },
    formField: {
        marginBottom: hp(2.5),
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
        marginBottom: hp(1),
    },
    input: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: 1,
        fontSize: wp(3.8),
        fontFamily: FONT.regular,
    },
    dateInputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    dateInput: {
        paddingRight: wp(12),
    },
    calendarIcon: {
        position: 'absolute',
        right: wp(4),
    },
    bioContainer: {
        position: 'relative',
    },
    bioInput: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        paddingBottom: hp(6),
        borderRadius: wp(2),
        borderWidth: 1,
        fontSize: wp(3.8),
        fontFamily: FONT.regular,
        minHeight: hp(12),
        textAlignVertical: 'top',
    },
    charCounter: {
        position: 'absolute',
        bottom: hp(1.5),
        right: wp(4),
        fontSize: wp(3),
        fontFamily: FONT.regular,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(2),
    },
    resetButton: {
        flex: 1,
        height: hp(5.5),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        gap: wp(2),
    },
    resetButtonText: {
        fontSize: wp(3.5),
        fontFamily: FONT.semiBold,
    },
    updateButton: {
        flex: 1,
    },
});

export default EditProfileModal;

