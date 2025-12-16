import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function MaterialBasesScreen() {
  const navigation = useNavigation<any>();

  const { data: bases, isLoading, refetch } = useQuery({
    queryKey: ['materialBases'],
    queryFn: rawMaterialsApi.getRawMaterialBases,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderBaseItem = ({ item }: any) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{item.nombre || item.name}</Text>
          <Text className="text-gray-500 text-sm mb-1">{item.codigo}</Text>
          <Text className="text-gray-700">
            Disponible: <Text className="font-bold text-blue-600">{Number(item.cantidad_disponible || 0).toFixed(2)}</Text> {item.unit?.codigo}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            Categoría: {item.category?.nombre || 'N/A'}
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
        data={bases || []}
        renderItem={renderBaseItem}
        keyExtractor={(item) => item.material_id.toString()}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No hay materias primas base</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('CreateMaterialBase')}
      >
        <CustomIcon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
