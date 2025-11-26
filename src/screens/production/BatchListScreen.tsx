import React from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productionApi } from '../../api/production.api';
import { BatchCard } from '../../components/production/BatchCard';
import { Button } from '../../components/common/Button';

export default function BatchListScreen({ navigation }: any) {
  const { data: batches, isLoading, error, refetch } = useQuery({
    queryKey: ['batches'],
    queryFn: productionApi.getBatches,
  });

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
        <Text className="text-red-500 text-center mb-4">Failed to load batches</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={batches}
        keyExtractor={(item) => item.batch_id.toString()}
        renderItem={({ item }) => (
          <BatchCard 
            batch={item} 
            onPress={() => navigation.navigate('BatchDetail', { batchId: item.batch_id })} 
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text className="text-2xl font-bold text-gray-900 mb-4">Production Batches</Text>
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No batches found</Text>
        }
      />
    </SafeAreaView>
  );
}
