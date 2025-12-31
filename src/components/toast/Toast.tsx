import { StyleSheet, View, Animated, Text, Pressable, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { COLORS, FONT, hp, wp } from '../../constants/StyleGuide'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose()
    })
  }

  const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336'
  const iconBgColor = type === 'success' ? '#4CAF50' : '#F44336'
  const icon = type === 'success' ? '✓' : '✗'

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.content}>
        {/* Icon Circle */}
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {message}
          </Text>
        </View>

        {/* Close Button */}
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>
            ✕
          </Text>
        </Pressable>
      </View>

      {/* Accent Line */}
      <View style={[styles.accentLine, { backgroundColor }]} />
    </Animated.View>
  )
}

export default Toast

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(2) : 0,
    left: wp(5),
    right: wp(5),
    backgroundColor: '#212121',
    borderRadius: hp(1),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 9999,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
  iconContainer: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  icon: {
    fontFamily: FONT.bold,
    fontSize: wp(4.8),
    color: COLORS.white,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontFamily: FONT.medium,
    fontSize: wp(3.73),
    color: COLORS.white,
  },
  closeButton: {
    padding: wp(1),
    marginLeft: wp(2),
  },
  closeIcon: {
    fontFamily: FONT.bold,
    fontSize: wp(4.27),
    color: COLORS.white,
  },
  accentLine: {
    height: 3,
    width: '100%',
  },
})
