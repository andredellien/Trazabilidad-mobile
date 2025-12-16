import React, { useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { useAuthStore } from '../../store/authStore';
import { productionApi } from '../../api/production.api';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { customersApi } from '../../api/customers.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function ReportsScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const screenWidth = Dimensions.get('window').width;

  // Fetch data
  const { data: batches, isLoading: batchesLoading, refetch: refetchBatches } = useQuery({
    queryKey: ['dashboard-batches'],
    queryFn: productionApi.getBatches,
  });

  const { data: materials, isLoading: materialsLoading, refetch: refetchMaterials } = useQuery({
    queryKey: ['dashboard-materials'],
    queryFn: rawMaterialsApi.getRawMaterialBases,
  });

  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: customersApi.getCustomerOrders,
  });

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchBatches();
      refetchMaterials();
      refetchOrders();
    }, [refetchBatches, refetchMaterials, refetchOrders])
  );

  const isLoading = batchesLoading || materialsLoading || ordersLoading;

  const onRefresh = () => {
    refetchBatches();
    refetchMaterials();
    refetchOrders();
  };

  // Calculate metrics for charts
  
  // 1. Batch Status Distribution (Pie Chart)
  const batchStatusCounts = {
    pending: batches?.filter((b: any) => b.status === 'pending')?.length || 0,
    in_progress: batches?.filter((b: any) => b.status === 'in_progress')?.length || 0,
    completed: batches?.filter((b: any) => b.status === 'completed')?.length || 0,
    certified: batches?.filter((b: any) => b.status === 'certified' || b.status === 'completed')?.length || 0,
    failed: batches?.filter((b: any) => b.status === 'failed' || b.status === 'not_certified')?.length || 0,
  };

  const pieChartData = [
    {
      name: 'Pendiente',
      population: batchStatusCounts.pending,
      color: '#FCD34D', // yellow-300
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'En Proceso',
      population: batchStatusCounts.in_progress,
      color: '#60A5FA', // blue-400
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Certificado',
      population: batchStatusCounts.certified,
      color: '#4ADE80', // green-400
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Fallido',
      population: batchStatusCounts.failed,
      color: '#F87171', // red-400
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ].filter(item => item.population > 0);

  // 2. Production Timeline (Line Chart - Last 7 days)
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Use local date string YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  // Helper to normalize date to GMT-4 YYYY-MM-DD
  const normalizeDate = (dateString: string) => {
    if (!dateString) return null;
    
    // Create date object from string (assuming UTC if no timezone specified)
    let isoString = dateString.replace(' ', 'T');
    if (isoString.length > 10 && !isoString.endsWith('Z') && !isoString.includes('+') && !isoString.includes('-')) {
      isoString += 'Z';
    }
    
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return dateString.split('T')[0].split(' ')[0];

    // Adjust to GMT-4 (subtract 4 hours)
    // We use the UTC time and subtract 4 hours to get the local time in Bolivia/GMT-4
    const gmt4Date = new Date(date.getTime() - (4 * 60 * 60 * 1000));
    
    const year = gmt4Date.getUTCFullYear();
    const month = String(gmt4Date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(gmt4Date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const last7Days = getLast7Days();
  
  const productionData = last7Days.map(date => {
    return batches?.filter((b: any) => {
      const batchDate = normalizeDate(b.creation_date || b.fecha_creacion);
      return batchDate === date;
    })?.length || 0;
  });

  const lineChartData = {
    labels: last7Days.map(d => d.split('-')[2]), // Just the day
    datasets: [
      {
        data: productionData,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // blue-600
        strokeWidth: 2
      }
    ],
    legend: ["Lotes Creados"]
  };

  // 3. Material Stock (Bar Chart - Top 5 lowest stock)
  // Use RawMaterialBase properties (nombre, cantidad_disponible)
  const sortedMaterials = [...(materials || [])]
    .sort((a: any, b: any) => parseFloat(a.cantidad_disponible || a.available_quantity || 0) - parseFloat(b.cantidad_disponible || b.available_quantity || 0))
    .slice(0, 5);
  
  const barChartData = {
    labels: sortedMaterials.map((m: any) => (m.nombre || m.name || 'Sin nombre').substring(0, 10) + ((m.nombre || m.name || '').length > 10 ? '...' : '')),
    datasets: [
      {
        data: sortedMaterials.map((m: any) => parseFloat(m.cantidad_disponible || m.available_quantity || 0))
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <CustomIcon name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Reportes de Producción</Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        <View className="px-4 mt-6 pb-8">
          {/* Status Distribution */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6 items-center">
            <Text className="text-gray-700 font-semibold mb-2 self-start">Estado de Lotes</Text>
            {pieChartData.length > 0 ? (
              <PieChart
                data={pieChartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
              />
            ) : (
              <Text className="text-gray-400 py-10">No hay datos suficientes</Text>
            )}
          </View>

          {/* Production Timeline */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Producción (Últimos 7 días)</Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>

          {/* Low Stock Materials */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Materias Primas (Stock Bajo)</Text>
            {sortedMaterials.length > 0 ? (
              <BarChart
                data={barChartData}
                width={screenWidth - 48}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`, // red-600 for low stock
                }}
                verticalLabelRotation={30}
              />
            ) : (
              <Text className="text-gray-400 py-10">No hay datos de materias primas</Text>
            )}
          </View>

          {/* Sales Timeline (Last 7 days) */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Ventas Totales (Últimos 7 días)</Text>
            <LineChart
              data={{
                labels: last7Days.map(d => d.split('-')[2]),
                datasets: [{
                  data: last7Days.map(date => {
                    return orders?.filter((o: any) => {
                      // Handle both English and Spanish field names
                      const orderDate = normalizeDate(o.fecha_creacion || o.creation_date);
                      return orderDate === date;
                    }).reduce((sum: number, o: any) => sum + (parseFloat(o.total_price) || 0), 0) || 0;
                  }),
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // green-500
                  strokeWidth: 2
                }],
                legend: ["Ventas ($)"]
              }}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          {/* Orders Count (Last 7 days) */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Pedidos por Día</Text>
            <BarChart
              data={{
                labels: last7Days.map(d => d.split('-')[2]),
                datasets: [{
                  data: last7Days.map(date => {
                    return orders?.filter((o: any) => {
                      // Handle both English and Spanish field names
                      const orderDate = normalizeDate(o.fecha_creacion || o.creation_date);
                      return orderDate === date;
                    }).length || 0;
                  })
                }]
              }}
              width={screenWidth - 48}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // indigo-500
              }}
              verticalLabelRotation={0}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
