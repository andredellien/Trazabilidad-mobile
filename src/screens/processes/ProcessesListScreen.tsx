import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { processesApi } from '../../api/processes.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function ProcessesListScreen() {
  const navigation = useNavigation<any>();
  
  const { data: processes, isLoading, error, refetch } = useQuery({
    queryKey: ['processes'],
    queryFn: () => processesApi.getProcesses(),
  });

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
        <Text className="text-red-500 text-center mb-4">Error al cargar procesos</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-medium">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={processes}
        keyExtractor={(item) => item.process_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProcessDetail', { processId: item.process_id })}
            activeOpacity={0.7}
          >
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                  <Text className="text-xs text-blue-600 font-medium">{item.code}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${item.active ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={`text-xs font-medium ${item.active ? 'text-green-700' : 'text-red-700'}`}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
              
              {item.description && (
                <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-500 text-center">No hay procesos registrados</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('CreateProcess')}
      >
        <CustomIcon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
