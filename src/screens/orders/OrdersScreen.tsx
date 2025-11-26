import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { CustomIcon } from '../../components/common/CustomIcon';
import { customersApi } from '../../api/customers.api';
import { Button } from '../../components/common/Button';

export default function OrdersScreen({ navigation }: any) {
  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: customersApi.getCustomerOrders,
  });

  const renderOrder = ({ item }: any) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-lg shadow-sm"
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.order_id })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {item.customer?.business_name || item.customer?.trading_name || 'Cliente Desconocido'}
          </Text>
          <Text className="text-gray-600 mb-1">{item.description || item.order_number}</Text>
          <Text className="text-gray-700">
            Prioridad: {item.priority || 1}
          </Text>
          {item.delivery_date && (
            <Text className="text-gray-500 text-sm">
              Vencimiento: {new Date(item.delivery_date).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View className="items-end">
          <View className="px-2 py-1 rounded-full bg-yellow-100">
            <Text className="text-xs font-medium text-yellow-800">
              Pendiente
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-red-500 text-center mb-4">Error al cargar órdenes</Text>
        <Button title="Reintentar" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">Órdenes de Clientes</Text>
          <TouchableOpacity className="bg-blue-600 p-2 rounded-lg">
            <CustomIcon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={orders || []}
          renderItem={renderOrder}
          keyExtractor={(item, index) => item?.order_id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">No se encontraron órdenes</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}