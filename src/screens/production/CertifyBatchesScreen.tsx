import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productionApi } from '../../api/production.api';
import { CustomIcon } from '../../components/common/CustomIcon';

type FilterType = 'all' | 'pending' | 'in_progress' | 'ready';

export default function CertifyBatchesScreen({ navigation }: any) {
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: batches, isLoading, error, refetch } = useQuery({
    queryKey: ['batches'],
    queryFn: productionApi.getBatches,
  });

  const getFilteredBatches = () => {
    if (!batches) return [];
    
    // TODO: Implement filtering logic based on certification status
    // For now, return all batches
    return batches;
  };

  const filteredBatches = getFilteredBatches();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <CustomIcon name="alert" size={48} color="#EF4444" />
        <Text className="text-red-500 text-center mb-4 mt-4">Error al cargar lotes</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Filter Tabs */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-100'}`}
            onPress={() => setFilter('all')}
          >
            <Text className={`text-center font-semibold text-sm ${filter === 'all' ? 'text-white' : 'text-gray-700'}`}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${filter === 'pending' ? 'bg-blue-600' : 'bg-gray-100'}`}
            onPress={() => setFilter('pending')}
          >
            <Text className={`text-center font-semibold text-sm ${filter === 'pending' ? 'text-white' : 'text-gray-700'}`}>
              Pendientes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${filter === 'ready' ? 'bg-blue-600' : 'bg-gray-100'}`}
            onPress={() => setFilter('ready')}
          >
            <Text className={`text-center font-semibold text-sm ${filter === 'ready' ? 'text-white' : 'text-gray-700'}`}>
              Listos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Batch List */}
      <FlatList
        data={filteredBatches}
        keyExtractor={(item) => item.batch_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4"
            onPress={() => navigation.navigate('ProcessTransformation', { batchId: item.batch_id })}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.product_name}</Text>
                <Text className="text-xs text-blue-600 font-medium">Lote #{item.batch_id}</Text>
              </View>
              <View className="bg-yellow-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-yellow-800">PENDIENTE</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <CustomIcon name="assignment" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">Sin proceso asignado</Text>
            </View>

            <View className="flex-row items-center pt-3 border-t border-gray-100">
              <View className="flex-1 flex-row items-center">
                <CustomIcon name="time" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">
                  {new Date(item.start_date).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs text-blue-600 font-semibold mr-1">Iniciar</Text>
                <CustomIcon name="arrow-forward" size={14} color="#2563EB" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <CustomIcon name="assignment" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-center mt-4 font-medium">No hay lotes para certificar</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">
              Los lotes aparecerán aquí cuando estén listos
            </Text>
          </View>
        }
      />
    </View>
  );
}
