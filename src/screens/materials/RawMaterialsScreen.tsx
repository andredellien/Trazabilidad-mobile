import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { Button } from '../../components/common/Button';

export default function RawMaterialsScreen({ navigation }: any) {
  const { data: materials, isLoading, error, refetch } = useQuery({
    queryKey: ['rawMaterials'],
    queryFn: rawMaterialsApi.getRawMaterials,
  });

  const renderMaterial = ({ item }: any) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-lg shadow-sm"
      onPress={() => navigation.navigate('MaterialDetail', { materialId: item.raw_material_id })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {item.base?.name || 'Unknown Material'}
          </Text>
          <Text className="text-gray-600 mb-1">
            Lot: {item.lot_number}
          </Text>
          <Text className="text-gray-600 mb-1">
            Supplier: {item.supplier?.name || 'Unknown'}
          </Text>
          <Text className="text-gray-700">
            {item.quantity} {item.unit_of_measure?.abbreviation || 'units'}
          </Text>
          {item.expiration_date && (
            <Text className="text-gray-500 text-xs">
              Exp: {new Date(item.expiration_date).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View className="items-end">
          <View className={`px-2 py-1 rounded-full ${
            item.status?.name === 'Available' ? 'bg-green-100' : 
            item.status?.name === 'Low Stock' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Text className={`text-xs font-medium ${
              item.status?.name === 'Available' ? 'text-green-800' : 
              item.status?.name === 'Low Stock' ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {item.status?.name || 'Unknown'}
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
        <Text className="text-red-500 text-center mb-4">Failed to load materials</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">Raw Materials</Text>
          <TouchableOpacity className="bg-blue-600 p-2 rounded-lg">
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={materials || []}
          renderItem={renderMaterial}
          keyExtractor={(item, index) => item?.raw_material_id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">No materials found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}