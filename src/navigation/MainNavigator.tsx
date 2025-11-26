import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import BatchListScreen from '../screens/production/BatchListScreen';
import BatchDetailScreen from '../screens/production/BatchDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RawMaterialsScreen from '../screens/materials/RawMaterialsScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProductionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BatchList" component={BatchListScreen} options={{ title: 'Production Batches' }} />
      <Stack.Screen name="BatchDetail" component={BatchDetailScreen} options={{ title: 'Batch Details' }} />
    </Stack.Navigator>
  );
}

function MaterialsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RawMaterials" component={RawMaterialsScreen} options={{ title: 'Raw Materials' }} />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconText: string;

          switch (route.name) {
            case 'Home':
              iconText = '🏠';
              break;
            case 'Production':
              iconText = '🏭';
              break;
            case 'Materials':
              iconText = '📦';
              break;
            case 'Orders':
              iconText = '📋';
              break;
            case 'Profile':
              iconText = '👤';
              break;
            default:
              iconText = '❓';
          }

          return <Text style={{ fontSize: size, color }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Production" component={ProductionStack} options={{ headerShown: false }} />
      <Tab.Screen name="Materials" component={MaterialsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Orders" component={OrdersStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
