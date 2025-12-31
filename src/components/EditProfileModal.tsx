import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
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
        fullName: initialData?.fullName || '',
        phoneNumber: initialData?.phoneNumber || '',
        dateOfBirth: initialData?.dateOfBirth || '',
        address: initialData?.address || '',
        bio: initialData?.bio || '',
        profileImage: initialData?.profileImage,
    });

    const [profileImageUri, setProfileImageUri] = useState<string | undefined>(initialData?.profileImage);
    const [newImageSelected, setNewImageSelected] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form data when initialData changes or modal opens
    useEffect(() => {
        if (visible) {
            if (initialData) {
                console.log('EditProfileModal: Updating form with initialData:', initialData);
                setFormData({
                    fullName: initialData.fullName || '',
                    phoneNumber: initialData.phoneNumber || '',
                    dateOfBirth: initialData.dateOfBirth || '',
                    address: initialData.address || '',
                    bio: initialData.bio || '',
                    profileImage: initialData.profileImage,
                });
                setProfileImageUri(initialData.profileImage);
            } else {
                // Reset to empty if no initialData
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    address: '',
                    bio: '',
                    profileImage: undefined,
                });
                setProfileImageUri(undefined);
            }
            setNewImageSelected(false);
            setIsSubmitting(false); // Reset loading state when modal opens
        }
    }, [initialData, visible]);

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
                                const imageUri = response.assets[0].uri;
                                setProfileImageUri(imageUri);
                                setFormData({ ...formData, profileImage: imageUri });
                                setNewImageSelected(true);
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
                                const imageUri = response.assets[0].uri;
                                setProfileImageUri(imageUri);
                                setFormData({ ...formData, profileImage: imageUri });
                                setNewImageSelected(true);
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

    // Format phone number for API (US format: +1XXXXXXXXXX or +1-XXX-XXX-XXXX)
    // Backend uses @IsPhoneNumber('US') which accepts standard US formats
    const formatPhoneForAPI = (phone: string): string | null => {
        if (!phone || !phone.trim()) return null;
        
        // Remove all non-digit characters except +
        let cleaned = phone.trim();
        
        // Remove all non-digit characters to get just digits
        const digits = cleaned.replace(/\D/g, '');
        
        // Handle different input formats
        let phoneDigits = digits;
        
        // If it has 11 digits and starts with 1, remove the leading 1
        if (digits.length === 11 && digits.startsWith('1')) {
            phoneDigits = digits.substring(1);
        }
        // If it already has +1 prefix in the original string, extract digits after +1
        else if (cleaned.startsWith('+1')) {
            phoneDigits = digits.substring(1); // Remove the 1 after +
        }
        // If it starts with just + (without 1), treat remaining as 10 digits
        else if (cleaned.startsWith('+')) {
            phoneDigits = digits; // Use all digits
        }
        
        // Must be exactly 10 digits for US phone number
        if (phoneDigits.length === 10) {
            // Format as +1XXXXXXXXXX (backend accepts this format)
            return `+1${phoneDigits}`;
        }
        
        // If already in +1XXXXXXXXXX format, return as is
        if (cleaned.startsWith('+1') && phoneDigits.length === 10) {
            return cleaned.replace(/\D/g, '').replace(/^1/, '+1');
        }
        
        // Invalid format
        return null;
    };

    // Validate US phone number (backend uses @IsPhoneNumber('US'))
    const isValidUSPhone = (phone: string): boolean => {
        if (!phone || !phone.trim()) return true; // Optional field (can be null)
        
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        
        // Handle different formats
        let phoneDigits = digits;
        
        // If it has 11 digits and starts with 1, remove the leading 1
        if (digits.length === 11 && digits.startsWith('1')) {
            phoneDigits = digits.substring(1);
        }
        // If it starts with +1, extract 10 digits after +1
        else if (phone.trim().startsWith('+1')) {
            phoneDigits = digits.substring(1); // Remove the 1
        }
        
        // Must be exactly 10 digits for US phone number
        return phoneDigits.length === 10;
    };

    // Format date of birth to YYYY-MM-DD format
    const formatDOBForAPI = (dob: string): string | undefined => {
        if (!dob || !dob.trim()) return undefined;
        
        const trimmedDob = dob.trim();
        
        // If already in YYYY-MM-DD format, validate and return
        const yyyyMMddRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = trimmedDob.match(yyyyMMddRegex);
        if (match) {
            const [, year, month, day] = match;
            const monthNum = parseInt(month, 10);
            const dayNum = parseInt(day, 10);
            
            // Basic validation
            if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                return trimmedDob;
            }
        }
        
        // Try to parse DD/MM/YYYY or MM/DD/YYYY format
        const slashFormat = trimmedDob.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (slashFormat) {
            const [, part1, part2, year] = slashFormat;
            const part1Num = parseInt(part1, 10);
            const part2Num = parseInt(part2, 10);
            
            let month: number, day: number;
            
            // If part2 > 12, it must be DD/MM/YYYY (day/month/year)
            if (part2Num > 12) {
                day = part2Num;
                month = part1Num;
            } else if (part1Num > 12) {
                // If part1 > 12, it must be DD/MM/YYYY
                day = part1Num;
                month = part2Num;
            } else {
                // Ambiguous: assume DD/MM/YYYY (more common internationally)
                day = part1Num;
                month = part2Num;
            }
            
            // Validate month and day
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                const monthStr = String(month).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                return `${year}-${monthStr}-${dayStr}`;
            }
        }
        
        // Try DD-MM-YYYY or MM-DD-YYYY format
        const dashFormat = trimmedDob.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (dashFormat) {
            const [, part1, part2, year] = dashFormat;
            const part1Num = parseInt(part1, 10);
            const part2Num = parseInt(part2, 10);
            
            let month: number, day: number;
            
            // If part2 > 12, it must be DD-MM-YYYY
            if (part2Num > 12) {
                day = part2Num;
                month = part1Num;
            } else if (part1Num > 12) {
                // If part1 > 12, it must be DD-MM-YYYY
                day = part1Num;
                month = part2Num;
            } else {
                // Ambiguous: assume DD-MM-YYYY
                day = part1Num;
                month = part2Num;
            }
            
            // Validate month and day
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                const monthStr = String(month).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                return `${year}-${monthStr}-${dayStr}`;
            }
        }
        
        // Try to parse as Date object (handles various formats)
        const dateObj = new Date(trimmedDob);
        if (!isNaN(dateObj.getTime()) && dateObj.getFullYear() > 1900 && dateObj.getFullYear() < 2100) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        // Invalid format, return as is (will be validated)
        return trimmedDob;
    };

    const handleReset = () => {
        setFormData({
            fullName: initialData?.fullName || '',
            phoneNumber: initialData?.phoneNumber || '',
            dateOfBirth: initialData?.dateOfBirth || '',
            address: initialData?.address || '',
            bio: initialData?.bio || '',
            profileImage: initialData?.profileImage,
        });
        setProfileImageUri(initialData?.profileImage);
        setNewImageSelected(false);
    };

    const handleSubmit = async () => {
        if (!formData.fullName.trim()) {
            Alert.alert('Validation Error', 'Full Name is required');
            return;
        }
        
        // Validate phone number if provided
        if (formData.phoneNumber && formData.phoneNumber.trim()) {
            if (!isValidUSPhone(formData.phoneNumber)) {
                Alert.alert(
                    'Validation Error', 
                    'Please provide a valid US phone number with exactly 10 digits.\n\nExample: (555) 123-4567 or 5551234567'
                );
                return;
            }
        }
        
        // Format phone number for API (backend expects +1XXXXXXXXXX or null)
        const formattedPhone = formatPhoneForAPI(formData.phoneNumber);
        
        // If phone was provided but couldn't be formatted, show error
        if (formData.phoneNumber && formData.phoneNumber.trim() && !formattedPhone) {
            Alert.alert(
                'Validation Error', 
                'Please provide a valid US phone number with exactly 10 digits.\n\nExamples:\n• (555) 123-4567\n• 5551234567\n• +1 555 123 4567'
            );
            return;
        }
        
        // Format date of birth for API
        const formattedDOB = formatDOBForAPI(formData.dateOfBirth);
        
        // Validate date format
        if (formattedDOB && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDOB)) {
            Alert.alert('Validation Error', 'Date of birth must be in YYYY-MM-DD format (e.g., 1990-01-15)');
            return;
        }
        
        // Only include profileImage if a new image was selected
        // Backend expects phoneNumber as string | null
        const submitData: ProfileFormData = {
            ...formData,
            phoneNumber: formattedPhone || '', // Will be converted to null in API call if empty
            dateOfBirth: formattedDOB || '',
            profileImage: newImageSelected ? formData.profileImage : undefined,
        };
        
        // Console log the data being sent to API
        console.log('=== EditProfileModal - Data being sent to API ===');
        console.log('Full Name:', submitData.fullName);
        console.log('Phone Number (formatted):', submitData.phoneNumber || 'null');
        console.log('Date of Birth (formatted):', submitData.dateOfBirth || 'null');
        console.log('Address:', submitData.address || 'null');
        console.log('Bio:', submitData.bio || 'null');
        console.log('Profile Image:', submitData.profileImage ? 'New image selected' : 'No new image');
        console.log('Complete Submit Data:', JSON.stringify(submitData, null, 2));
        console.log('================================================');
        
        // Set loading state
        setIsSubmitting(true);
        
        try {
            if (onSubmit) {
                await onSubmit(submitData);
                // On success, modal will be closed by parent, so loading state will reset
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            // Reset loading state on error so user can try again
            setIsSubmitting(false);
            // Error alert is shown by parent component
        }
    };

    const inputBg = theme === 'light' ? colors.primary : colors.lightWhite;
    const inputTextColor = theme === 'light' ? colors.black : colors.white;
    const placeholderColor = colors.lightgray;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={isSubmitting ? undefined : onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.primary }]}>
                    {/* Loading Overlay */}
                    {isSubmitting && (
                        <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                            <View style={[styles.loadingContainer, { backgroundColor: colors.primary }]}>
                                <ActivityIndicator size="large" color={colors.brown} />
                                <Text style={[styles.loadingText, { color: colors.black }]}>
                                    {newImageSelected ? 'Uploading image...' : 'Updating profile...'}
                                </Text>
                                <Text style={[styles.loadingSubtext, { color: colors.gray }]}>
                                    Please wait
                                </Text>
                            </View>
                        </View>
                    )}
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={!isSubmitting}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.headerTitle, { color: colors.brown }]}>Edit Profile</Text>
                            <TouchableOpacity 
                                onPress={onClose} 
                                style={[styles.closeButton, { opacity: isSubmitting ? 0.5 : 1 }]}
                                disabled={isSubmitting}
                            >
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
                                    placeholder="(555) 123-4567"
                                    placeholderTextColor={placeholderColor}
                                    value={formData.phoneNumber}
                                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                    keyboardType="phone-pad"
                                    maxLength={20}
                                />
                                <Text style={[styles.helperText, { color: colors.lightgray }]}>
                                    US format: 10 digits (e.g., 5551234567 or (555) 123-4567)
                                </Text>
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
                                        placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
                                        placeholderTextColor={placeholderColor}
                                        value={formData.dateOfBirth}
                                        onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                                    />
                                    <Ionicons name="calendar-outline" size={wp(5)} color={inputTextColor} style={styles.calendarIcon} />
                                </View>
                                <Text style={[styles.helperText, { color: colors.lightgray }]}>
                                    Format: YYYY-MM-DD (e.g., 1990-01-15)
                                </Text>
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
                                        opacity: isSubmitting ? 0.5 : 1,
                                    },
                                ]}
                                onPress={handleReset}
                                disabled={isSubmitting}
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
    helperText: {
        fontSize: wp(2.8),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
        fontStyle: 'italic',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingContainer: {
        borderRadius: wp(3),
        padding: wp(6),
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: wp(60),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        fontSize: wp(4),
        fontFamily: FONT.semiBold,
        marginTop: hp(2),
        textAlign: 'center',
    },
    loadingSubtext: {
        fontSize: wp(3),
        fontFamily: FONT.regular,
        marginTop: hp(0.5),
        textAlign: 'center',
    },
});

export default EditProfileModal;

