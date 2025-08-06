import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/drawerScreens/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import ProductScreen from '../screens/drawerScreens/ProductScreen';
import IngredientsScreen from '../screens/drawerScreens/IngredientsScreen';
import AnalyticsScreen from '../screens/drawerScreens/AnalyticsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerType: 'front',
            overlayColor: 'transparent',
        }}
    >
        <Drawer.Screen name="Dashboard" component={HomeScreen} />
        <Drawer.Screen name="Products" component={ProductScreen} />
        <Drawer.Screen name="Ingredients" component={IngredientsScreen} />
        <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
    </Drawer.Navigator>
);

export default DrawerNavigator; 