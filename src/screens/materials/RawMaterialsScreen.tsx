import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialBasesScreen from './MaterialBasesScreen';
import MaterialRequestsScreen from './MaterialRequestsScreen';
import MaterialReceptionsScreen from './MaterialReceptionsScreen';

const Tab = createMaterialTopTabNavigator();

export default function RawMaterialsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIndicatorStyle: {
          backgroundColor: '#2563EB',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          textTransform: 'none',
        },
      }}
    >
      <Tab.Screen 
        name="MaterialBases" 
        component={MaterialBasesScreen} 
        options={{ title: 'Bases' }}
      />
      <Tab.Screen 
        name="MaterialRequests" 
        component={MaterialRequestsScreen} 
        options={{ title: 'Solicitar' }}
      />
      <Tab.Screen 
        name="MaterialReceptions" 
        component={MaterialReceptionsScreen} 
        options={{ title: 'Recepción' }}
      />
    </Tab.Navigator>
  );
}