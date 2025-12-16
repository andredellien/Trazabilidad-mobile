import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function MaterialRequestsScreen() {
  const navigation = useNavigation<any>();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['materialRequests'],
    queryFn: rawMaterialsApi.getMaterialRequests,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderRequestItem = ({ item }: any) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            {item.details?.[0]?.material?.nombre || item.details?.[0]?.material?.name || 'Material Desconocido'}
            {item.details?.length > 1 ? ` (+${item.details.length - 1})` : ''}
          </Text>

          <Text className="text-gray-700 mb-1">
            Pedido: {item.order?.nombre || 'N/A'}
          </Text>
          <Text className="text-gray-600 text-sm">
            Dirección: {item.direccion}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${item.estado === 'completada' ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <Text className={`text-xs font-medium ${item.estado === 'completada' ? 'text-green-800' : 'text-yellow-800'}`}>
            {item.estado || 'Pendiente'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={requests || []}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.solicitud_id.toString()}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No hay solicitudes</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('RequestMaterial')}
      >
        <CustomIcon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
