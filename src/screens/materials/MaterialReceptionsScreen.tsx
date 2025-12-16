import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function MaterialReceptionsScreen() {
  const navigation = useNavigation<any>();

  const { data: materials, isLoading: loadingMaterials, refetch: refetchMaterials } = useQuery({
    queryKey: ['rawMaterials'],
    queryFn: rawMaterialsApi.getRawMaterials,
  });

  const { data: pendingRequests, isLoading: loadingPending, refetch: refetchPending } = useQuery({
    queryKey: ['pendingMaterialRequests'],
    queryFn: rawMaterialsApi.getPendingMaterialRequests,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetchMaterials();
      refetchPending();
    }, [refetchMaterials, refetchPending])
  );

  const renderPendingRequestItem = ({ item }: any) => {
    // Flatten details to render individual cards
    return (
      <View>
        {item.details?.map((detail: any, index: number) => (
          <TouchableOpacity 
            key={`${item.solicitud_id}-${index}`}
            className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100"
            onPress={() => navigation.navigate('CreateMaterial', { 
              request: item,
              detail: detail
            })}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {detail.material?.nombre || 'Material ' + detail.material_id}
                </Text>
                <Text className="text-gray-600 mb-1">
                  Pedido: {item.order?.numero_pedido || 'N/A'}
                </Text>
                <Text className="text-gray-700">
                  Cant: {Number(detail.cantidad_solicitada).toFixed(2)} {detail.material?.unit?.codigo}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Fecha Req: {new Date(item.fecha_requerida).toLocaleDateString()}
                </Text>
              </View>
              <CustomIcon name="login" size={20} color="#2563EB" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReceptionItem = ({ item }: any) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('MaterialDetail', { materialId: item.raw_material_id })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            {item.material_base?.name || item.material_base?.nombre || 'Unknown Material'}
          </Text>
          <Text className="text-gray-600 mb-1">
            Prov: {item.supplier?.business_name || item.supplier?.trading_name || 'Desconocido'}
          </Text>
          <Text className="text-gray-700">
            Cant: {Number(item.quantity || 0).toFixed(2)} {item.material_base?.unit?.codigo}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            Fecha: {new Date(item.receipt_date || item.fecha_recepcion).toLocaleDateString()}
          </Text>
        </View>
        {item.receipt_conformity ? (
          <CustomIcon name="checkmark-circle" size={20} color="#10B981" />
        ) : (
          <CustomIcon name="alert-circle" size={20} color="#EF4444" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loadingMaterials || loadingPending) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={materials || []}
        renderItem={renderReceptionItem}
        keyExtractor={(item) => item.raw_material_id.toString()}
        ListHeaderComponent={() => (
          <View>
            {pendingRequests && pendingRequests.length > 0 && (
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-2">Solicitudes Pendientes</Text>
                {pendingRequests.map((item: any) => (
                  <View key={item.solicitud_id}>
                    {renderPendingRequestItem({ item })}
                  </View>
                ))}
              </View>
            )}
            <Text className="text-lg font-bold text-gray-800 mb-2">Historial de Recepciones</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No hay recepciones</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

     
    </View>
  );
}
