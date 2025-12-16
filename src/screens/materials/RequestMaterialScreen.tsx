import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { ordersApi } from '../../api/orders.api';
import { Button } from '../../components/common/Button';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function RequestMaterialScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    pedido_id: '',
    fecha_requerida: new Date().toISOString().split('T')[0],
    direccion: '',
    observaciones: '',
    materials: [] as { material_id: string; cantidad_solicitada: string }[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch orders for dropdown
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getOrders,
  });

  // Fetch material bases for dropdown
  const { data: materialBases } = useQuery({
    queryKey: ['materialBases'],
    queryFn: rawMaterialsApi.getRawMaterialBases,
  });

  const createMutation = useMutation({
    mutationFn: rawMaterialsApi.createMaterialRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialRequests'] });
      Alert.alert('Éxito', 'Solicitud creada exitosamente');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear solicitud');
    },
  });

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { material_id: '', cantidad_solicitada: '' }],
    });
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...formData.materials];
    newMaterials.splice(index, 1);
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleSubmit = () => {
    if (!formData.pedido_id || !formData.direccion || formData.materials.length === 0) {
      Alert.alert('Error', 'Por favor complete los campos requeridos y agregue al menos un material');
      return;
    }

    // Validate materials
    for (const m of formData.materials) {
      if (!m.material_id || !m.cantidad_solicitada) {
        Alert.alert('Error', 'Complete la información de todos los materiales');
        return;
      }
    }

    createMutation.mutate({
      pedido_id: parseInt(formData.pedido_id),
      fecha_requerida: formData.fecha_requerida,
      direccion: formData.direccion,
      observaciones: formData.observaciones,
      materials: formData.materials.map(m => ({
        material_id: parseInt(m.material_id),
        cantidad_solicitada: parseFloat(m.cantidad_solicitada),
      })),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Solicitar Materia Prima</Text>

        {/* Order */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Pedido *</Text>
          <View className="bg-white border border-gray-300 rounded-lg">
            <Picker
              selectedValue={formData.pedido_id}
              onValueChange={(value) => setFormData({ ...formData, pedido_id: value })}
            >
              <Picker.Item label="Seleccione un pedido" value="" />
              {Array.isArray(orders) && orders.map((order: any) => (
                <Picker.Item 
                  key={order.order_id || order.pedido_id || order.id} 
                  label={`${order.nombre || order.description || 'Pedido sin nombre'}`} 
                  value={(order.order_id || order.pedido_id || order.id)?.toString() || ''} 
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Required Date */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Fecha Requerida *</Text>
          <TouchableOpacity 
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-900">{formData.fecha_requerida}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.fecha_requerida)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setFormData({ ...formData, fecha_requerida: selectedDate.toISOString().split('T')[0] });
                }
              }}
            />
          )}
        </View>

        {/* Address */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Dirección de Entrega *</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            value={formData.direccion}
            onChangeText={(text) => setFormData({ ...formData, direccion: text })}
            placeholder="Ingrese la dirección"
            multiline
          />
        </View>

        {/* Observations */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Observaciones</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            value={formData.observaciones}
            onChangeText={(text) => setFormData({ ...formData, observaciones: text })}
            placeholder="Observaciones adicionales"
            multiline
          />
        </View>

        {/* Materials Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Materiales</Text>
            <TouchableOpacity 
              className="bg-blue-600 px-3 py-1 rounded-lg"
              onPress={handleAddMaterial}
            >
              <Text className="text-white font-medium">+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {formData.materials.map((material, index) => (
            <View key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-medium text-gray-700">Material #{index + 1}</Text>
                <TouchableOpacity onPress={() => handleRemoveMaterial(index)}>
                  <CustomIcon name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-gray-600 text-sm mb-1">Material Base</Text>
                <View className="bg-gray-50 border border-gray-300 rounded-lg">
                  <Picker
                    selectedValue={material.material_id}
                    onValueChange={(value) => handleMaterialChange(index, 'material_id', value)}
                  >
                    <Picker.Item label="Seleccione material" value="" />
                    {/* Handle both array and paginated object structure */}
                    {(() => {
                      const basesList = Array.isArray(materialBases) ? materialBases : (materialBases as any)?.data || [];
                      return basesList.map((base: any) => (
                        <Picker.Item key={base.material_id} label={base.name || base.nombre} value={base.material_id?.toString() || ''} />
                      ));
                    })()}
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="text-gray-600 text-sm mb-1">Cantidad Solicitada</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                  value={material.cantidad_solicitada}
                  onChangeText={(text) => handleMaterialChange(index, 'cantidad_solicitada', text)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ))}
          
          {formData.materials.length === 0 && (
            <Text className="text-gray-500 text-center italic">No hay materiales agregados</Text>
          )}
        </View>

        {/* Buttons */}
        <View className="space-y-3 mb-10">
          <Button
            title={createMutation.isPending ? "Guardando..." : "Crear Solicitud"}
            onPress={handleSubmit}
            variant="primary"
            disabled={createMutation.isPending}
          />
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
