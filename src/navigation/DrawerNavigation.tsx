import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/drawerScreens/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import ProductScreen from '../screens/drawerScreens/ProductScreen';
import IngredientsScreen from '../screens/drawerScreens/IngredientsScreen';
import AnalyticsScreen from '../screens/drawerScreens/AnalyticsScreen';
import { wp } from '../constants/StyleGuide';
import SettingsScreen from '../screens/drawerScreens/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerType: 'front',
            overlayColor: 'transparent',
            drawerStyle: {
                width: wp(70), // 70% of screen width (reduced from default ~80%)
            },
        }}
    >
        <Drawer.Screen name="Dashboard" component={HomeScreen} />
        <Drawer.Screen name="Products" component={ProductScreen} />
        <Drawer.Screen name="Ingredients" component={IngredientsScreen} />
        <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
);

export default DrawerNavigator; 