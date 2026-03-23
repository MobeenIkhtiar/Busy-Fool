import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar'
import { useNavigation } from '@react-navigation/native'
import { hp, wp, FONT } from '../../../constants/StyleGuide'
import { useTheme } from '../../../context/ThemeContext'
import CategoryTargetMargins from '../../../components/CategoryTargetMargins'
import CurrencySettings from '../../../components/CurrencySettings'

const SettingsScreen = () => {
  const navigation = useNavigation()
  const { colors, theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'target' | 'currency'>('target')

  const handleAddTarget = () => {
    // Handle add target action
    console.log('Add target clicked')
  }

  const handleSaveCurrency = (currency: any) => {
    // Handle save currency action
    console.log('Currency saved:', currency)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <TopBar navigation={navigation as any} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.brown }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.black }]}>Manage your account and preferences.</Text>
          </View>
        </View>

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'target' && [
                styles.toggleButtonActive,
                { backgroundColor: colors.brown }
              ],
              activeTab !== 'target' && [
                { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }
              ]
            ]}
            onPress={() => setActiveTab('target')}
          >
            <Text style={[
              styles.toggleButtonText,
              { color: activeTab === 'target' ? colors.white : colors.black }
            ]}>
              Target
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'currency' && [
                styles.toggleButtonActive,
                { backgroundColor: colors.brown }
              ],
              activeTab !== 'currency' && [
                { backgroundColor: theme === 'light' ? colors.white : colors.primary, borderColor: colors.lightgray }
              ]
            ]}
            onPress={() => setActiveTab('currency')}
          >
            <Text style={[
              styles.toggleButtonText,
              { color: activeTab === 'currency' ? colors.white : colors.black }
            ]}>
              Currency
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Components */}
        <View style={styles.settingsContainer}>
          {activeTab === 'target' ? (
            <CategoryTargetMargins onAddTarget={handleAddTarget} />
          ) : (
            <CurrencySettings onSave={handleSaveCurrency} />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default SettingsScreen

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
    marginBottom: hp(3),
  },
  titleContainer: {
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(6),
    fontFamily: FONT.bold,
    marginBottom: hp(0.5),
  },
  subtitle: {
    fontSize: wp(3.2),
    fontFamily: FONT.regular,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: wp(3),
    marginBottom: hp(3),
  },
  toggleButton: {
    flex: 1,
    height: hp(5),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleButtonActive: {
    // backgroundColor is set dynamically
  },
  toggleButtonText: {
    fontSize: wp(3.5),
    fontFamily: FONT.semiBold,
  },
  settingsContainer: {
    marginTop: hp(1),
  },
})