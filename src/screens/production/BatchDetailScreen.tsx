import React from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productionApi } from '../../api/production.api';
import { Button } from '../../components/common/Button';

export default function BatchDetailScreen({ route, navigation }: any) {
  const { batchId } = route.params;
  
  const { data: batch, isLoading, error, refetch } = useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => productionApi.getBatch(batchId),
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error || !batch) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-red-500 text-center mb-4">Failed to load batch details</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg p-6 mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-2xl font-bold text-gray-900">{batch.product_name}</Text>
            <View className={`px-3 py-1 rounded-full ${statusColors[batch.status].split(' ')[0]}`}>
              <Text className={`text-sm font-medium ${statusColors[batch.status].split(' ')[1]}`}>
                {batch.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-500 text-sm">Batch ID</Text>
              <Text className="text-lg font-semibold">#{batch.batch_id}</Text>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Quantity</Text>
                <Text className="text-lg font-semibold">{batch.quantity} units</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Operator</Text>
                <Text className="text-lg font-semibold">{batch.operator_name}</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Start Date</Text>
                <Text className="text-lg font-semibold">{new Date(batch.start_date).toLocaleDateString()}</Text>
              </View>
              {batch.end_date && (
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">End Date</Text>
                  <Text className="text-lg font-semibold">{new Date(batch.end_date).toLocaleDateString()}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <Button
            title="Process Transformation"
            onPress={() => navigation.navigate('ProcessTransformation', { batchId })}
            variant="primary"
          />
          
          <Button
            title="Quality Control"
            onPress={() => navigation.navigate('QualityControl', { batchId })}
            variant="secondary"
          />
          
          <Button
            title="Material Usage"
            onPress={() => navigation.navigate('MaterialUsage', { batchId })}
            variant="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}