import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { icons } from '../../../constants/icons'
import { COLORS, wp } from '../../../constants/StyleGuide'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import * as Animatable from 'react-native-animatable'

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
};

const Splash = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animatable.Image
                animation="fadeIn"
                duration={2000}
                source={icons.logo}
                style={styles.logo}
            />
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: wp(50),
        height: wp(50),
        resizeMode: 'contain'
    }
})