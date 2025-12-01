import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customersApi } from '../../api/customers.api';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function CreateOrderScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    description: '',
    quantity: undefined as number | undefined,
    priority: 1,
    delivery_date: undefined as string | undefined,
    observations: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const createMutation = useMutation({
    mutationFn: (data: any) => customersApi.createCustomerOrder({ ...data, customer_id: 1 }), // Default customer
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      Alert.alert('Éxito', 'Pedido creado exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear pedido');
    },
  });

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        delivery_date: date.toISOString().split('T')[0],
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.description?.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    createMutation.mutate(formData);
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'Normal';
    if (priority <= 5) return 'Alta';
    return 'Urgente';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Nuevo Pedido</Text>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">
            Descripción <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descripción del pedido"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Quantity */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Cantidad</Text>
          <TextInput
            className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3"
            value={formData.quantity?.toString() || ''}
            onChangeText={(text) => setFormData({ ...formData, quantity: text ? parseFloat(text) : undefined })}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        {/* Priority */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Prioridad</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg border-2 ${formData.priority === 1 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
              onPress={() => setFormData({ ...formData, priority: 1 })}
            >
              <Text className={`text-center font-semibold ${formData.priority === 1 ? 'text-white' : 'text-gray-700'}`}>
                Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg border-2 ${formData.priority === 3 ? 'bg-yellow-500 border-yellow-500' : 'bg-white border-gray-300'}`}
              onPress={() => setFormData({ ...formData, priority: 3 })}
            >
              <Text className={`text-center font-semibold ${formData.priority === 3 ? 'text-white' : 'text-gray-700'}`}>
                Alta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg border-2 ${formData.priority === 7 ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'}`}
              onPress={() => setFormData({ ...formData, priority: 7 })}
            >
              <Text className={`text-center font-semibold ${formData.priority === 7 ? 'text-white' : 'text-gray-700'}`}>
                Urgente
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Date */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Fecha de Entrega</Text>
          <TouchableOpacity
            className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className={formData.delivery_date ? 'text-gray-900' : 'text-gray-400'}>
              {formData.delivery_date || 'Seleccionar fecha'}
            </Text>
            <CustomIcon name="calendar" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Observations */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Observaciones</Text>
          <TextInput
            className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3"
            value={formData.observations}
            onChangeText={(text) => setFormData({ ...formData, observations: text })}
            placeholder="Observaciones adicionales (opcional)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl shadow-lg"
          onPress={handleSubmit}
          disabled={createMutation.isPending}
        >
          <Text className="text-white font-bold text-lg text-center">
            {createMutation.isPending ? 'Creando...' : 'Crear Pedido'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
