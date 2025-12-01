import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomIcon } from '../components/common/CustomIcon';

import HomeScreen from '../screens/home/HomeScreen';
import BatchListScreen from '../screens/production/BatchListScreen';
import BatchDetailScreen from '../screens/production/BatchDetailScreen';
import CreateBatchScreen from '../screens/production/CreateBatchScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RawMaterialsScreen from '../screens/materials/RawMaterialsScreen';
import CreateMaterialScreen from '../screens/materials/CreateMaterialScreen';
import CreateMaterialBaseScreen from '../screens/materials/CreateMaterialBaseScreen';
import CreateSupplierScreen from '../screens/materials/CreateSupplierScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProcessesScreen from '../screens/processes/ProcessesScreen';
import CreateMachineScreen from '../screens/processes/CreateMachineScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProductionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BatchList" component={BatchListScreen} options={{ title: 'Lotes de Producción' }} />
      <Stack.Screen name="BatchDetail" component={BatchDetailScreen} options={{ title: 'Detalle del Lote' }} />
      <Stack.Screen name="CreateBatch" component={CreateBatchScreen} options={{ title: 'Nuevo Lote' }} />
    </Stack.Navigator>
  );
}

function MaterialsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RawMaterials" component={RawMaterialsScreen} options={{ title: 'Materias Primas' }} />
      <Stack.Screen name="CreateMaterial" component={CreateMaterialScreen} options={{ title: 'Nueva Materia Prima' }} />
      <Stack.Screen name="CreateMaterialBase" component={CreateMaterialBaseScreen} options={{ title: 'Nueva Base' }} />
      <Stack.Screen name="CreateSupplier" component={CreateSupplierScreen} options={{ title: 'Nuevo Proveedor' }} />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Órdenes' }} />
    </Stack.Navigator>
  );
}

function ProcessesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Processes" component={ProcessesScreen} options={{ title: 'Gestión de Procesos' }} />
      <Stack.Screen name="CreateMachine" component={CreateMachineScreen} options={{ title: 'Nueva Máquina' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Production':
              iconName = 'factory';
              break;
            case 'Materials':
              iconName = 'inventory';
              break;
            case 'Orders':
              iconName = 'assignment';
              break;
            case 'Processes':
              iconName = 'settings';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <CustomIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Production" component={ProductionStack} options={{ headerShown: false, title: 'Producción' }} />
      <Tab.Screen name="Materials" component={MaterialsStack} options={{ headerShown: false, title: 'Materiales' }} />
      <Tab.Screen name="Processes" component={ProcessesStack} options={{ headerShown: false, title: 'Procesos' }} />
      <Tab.Screen name="Orders" component={OrdersStack} options={{ headerShown: false, title: 'Órdenes' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false, title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
