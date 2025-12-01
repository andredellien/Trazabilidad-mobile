import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../../api/customers.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function OrderDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['customerOrder', orderId],
    queryFn: () => customersApi.getCustomerOrder(orderId),
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.deleteCustomerOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      Alert.alert('Éxito', 'Pedido eliminado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Error al eliminar pedido');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro que deseas eliminar este pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(orderId),
        },
      ]
    );
  };

  const getStatusInfo = (priority: number) => {
    if (priority === 0) {
      return { label: 'Completado', bg: 'bg-green-600', icon: 'checkmark-circle' };
    } else if (priority > 5) {
      return { label: 'Urgente', bg: 'bg-red-600', icon: 'alert-circle' };
    } else if (priority > 0) {
      return { label: 'Pendiente', bg: 'bg-yellow-500', icon: 'time' };
    }
    return { label: 'En Proceso', bg: 'bg-blue-600', icon: 'refresh-circle' };
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <CustomIcon name="alert" size={48} color="#EF4444" />
        <Text className="text-red-500 text-center mt-4">Error al cargar pedido</Text>
      </View>
    );
  }

  const status = getStatusInfo(order.priority);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Status Header */}
        <View className={`${status.bg} p-6`}>
          <View className="items-center">
            <View className="bg-white w-16 h-16 rounded-full items-center justify-center mb-3">
              <CustomIcon name={status.icon} size={32} color={status.bg.replace('bg-', '#')} />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">{status.label}</Text>
            <Text className="text-white/90">{order.order_number || `Pedido #${order.order_id}`}</Text>
          </View>
        </View>

        <View className="p-4">
          {/* Customer Info */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">Información del Cliente</Text>
            <View className="space-y-2">
              <View className="flex-row items-center mb-2">
                <CustomIcon name="business" size={16} color="#6B7280" />
                <Text className="text-gray-900 font-semibold ml-2">
                  {order.customer?.business_name || order.customer?.trading_name || 'N/A'}
                </Text>
              </View>
              {order.customer?.contact_person && (
                <View className="flex-row items-center mb-2">
                  <CustomIcon name="person" size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2">{order.customer.contact_person}</Text>
                </View>
              )}
              {order.customer?.email && (
                <View className="flex-row items-center mb-2">
                  <CustomIcon name="mail" size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2">{order.customer.email}</Text>
                </View>
              )}
              {order.customer?.phone && (
                <View className="flex-row items-center">
                  <CustomIcon name="call" size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2">{order.customer.phone}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Order Details */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-3">Detalles del Pedido</Text>
            
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Descripción</Text>
              <Text className="text-base text-gray-900 mt-1">{order.description || 'Sin descripción'}</Text>
            </View>

            {order.quantity && (
              <View className="mb-3">
                <Text className="text-sm text-gray-600">Cantidad</Text>
                <Text className="text-base font-semibold text-gray-900 mt-1">{order.quantity}</Text>
              </View>
            )}

            <View className="mb-3">
              <Text className="text-sm text-gray-600">Prioridad</Text>
              <Text className="text-base font-semibold text-gray-900 mt-1">
                {order.priority > 5 ? 'Urgente' : order.priority > 0 ? 'Normal' : 'Completado'}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-gray-600">Fecha de Creación</Text>
              <Text className="text-base text-gray-900 mt-1">
                {new Date(order.creation_date).toLocaleDateString()}
              </Text>
            </View>

            {order.delivery_date && (
              <View className="mb-3">
                <Text className="text-sm text-gray-600">Fecha de Entrega</Text>
                <Text className="text-base text-gray-900 mt-1">
                  {new Date(order.delivery_date).toLocaleDateString()}
                </Text>
              </View>
            )}

            {order.observations && (
              <View>
                <Text className="text-sm text-gray-600">Observaciones</Text>
                <Text className="text-base text-gray-900 mt-1">{order.observations}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-red-600 py-4 rounded-xl shadow-lg mb-3"
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Text className="text-white font-bold text-lg text-center">
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Pedido'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-700 font-semibold text-center">Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
