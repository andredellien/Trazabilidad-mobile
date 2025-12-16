import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { productionApi } from '../../api/production.api';
import { ordersApi } from '../../api/orders.api';
import { rawMaterialsApi } from '../../api/rawMaterials.api';
import { Button } from '../../components/common/Button';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Picker } from '@react-native-picker/picker';

import { MaterialPickerModal } from '../../components/common/MaterialPickerModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CreateBatchScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    order_id: '',
    name: '',
    target_quantity: '',
    observations: '',
  });

  const [selectedMaterials, setSelectedMaterials] = useState<Array<{
    raw_material_id: number;
    name: string;
    planned_quantity: string;
    unit: string;
    available_quantity: number;
  }>>([]);

  // Fetch customer orders for dropdown
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: ordersApi.getOrders,
    retry: false,
  });

  // Fetch raw material bases for selection
  const { data: materialBases, isLoading: loadingMaterials, error: materialsError } = useQuery({
    queryKey: ['rawMaterialBases'],
    queryFn: rawMaterialsApi.getRawMaterialBases,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: productionApi.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      Alert.alert('Éxito', 'Lote de producción creado exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: (error: any) => {
      console.error('Batch creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error al crear lote de producción';
      Alert.alert('Error', typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!formData.order_id) {
      Alert.alert('Error', 'Por favor seleccione una orden de cliente');
      return;
    }

    // Validate raw materials
    const rawMaterialsPayload = selectedMaterials.map(material => ({
      raw_material_id: material.raw_material_id,
      planned_quantity: parseFloat(material.planned_quantity) || 0
    })).filter(rm => rm.planned_quantity > 0);

    // Check for invalid quantities
    const hasInvalidQuantities = selectedMaterials.some(m => {
      const planned = parseFloat(m.planned_quantity) || 0;
      return planned > m.available_quantity;
    });

    if (hasInvalidQuantities) {
      Alert.alert('Error', 'Una o más materias primas exceden la cantidad disponible');
      return;
    }

    const payload = {
      order_id: parseInt(formData.order_id),
      name: formData.name || undefined,
      target_quantity: formData.target_quantity ? parseFloat(formData.target_quantity) : undefined,
      observations: formData.observations || undefined,
      raw_materials: rawMaterialsPayload.length > 0 ? rawMaterialsPayload : undefined,
    };

    console.log('Creating batch with payload:', payload);
    createMutation.mutate(payload);
  };

  const addMaterial = () => {
    if (!materialBases || materialBases.length === 0) {
      Alert.alert('Error', 'No hay materias primas disponibles');
      return;
    }
    
    // Find the first available material that hasn't been added yet
    const availableMaterial = materialBases.find((material: any) => 
      !selectedMaterials.some(selected => selected.raw_material_id === material.material_id)
    );
    
    if (!availableMaterial) {
      Alert.alert('Información', 'Todas las materias primas disponibles ya han sido agregadas');
      return;
    }
    
    const newMaterial = {
      raw_material_id: availableMaterial.material_id,
      name: availableMaterial.nombre || availableMaterial.name || 'Material Desconocido',
      planned_quantity: '',
      unit: availableMaterial.unit?.codigo || availableMaterial.unit?.name || 'unidades',
      available_quantity: availableMaterial.cantidad_disponible || 0
    };
    
    setSelectedMaterials([...selectedMaterials, newMaterial]);
  };

  const removeMaterial = (index: number) => {
    const newMaterials = selectedMaterials.filter((_, i) => i !== index);
    setSelectedMaterials(newMaterials);
  };

  const updateMaterialQuantity = (index: number, quantity: string) => {
    const newMaterials = [...selectedMaterials];
    newMaterials[index].planned_quantity = quantity;
    setSelectedMaterials(newMaterials);
  };

  const openMaterialPicker = (index: number) => {
    setActiveMaterialIndex(index);
    setModalVisible(true);
  };

  const handleMaterialSelect = (material: any) => {
    if (activeMaterialIndex === null) return;

    // Check if material is already selected in another row
    const isAlreadySelected = selectedMaterials.some((m, idx) => 
      idx !== activeMaterialIndex && m.raw_material_id === material.material_id
    );

    if (isAlreadySelected) {
      Alert.alert('Error', 'Este material ya ha sido agregado');
      return;
    }

    const newMaterials = [...selectedMaterials];
    newMaterials[activeMaterialIndex] = {
      raw_material_id: material.material_id,
      name: material.nombre || material.name || 'Material Desconocido',
      planned_quantity: newMaterials[activeMaterialIndex].planned_quantity,
      unit: material.unit?.codigo || material.unit?.name || 'unidades',
      available_quantity: material.cantidad_disponible || 0
    };
    setSelectedMaterials(newMaterials);
    setModalVisible(false);
    setActiveMaterialIndex(null);
  };

  if (loadingOrders || loadingMaterials) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-2">Cargando datos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Nuevo Lote de Producción</Text>

        {/* Error Messages */}
        {ordersError && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <Text className="text-yellow-800 font-medium mb-2">⚠️ Advertencia</Text>
            <Text className="text-yellow-700 text-sm">
              • No se pudieron cargar las órdenes de cliente
            </Text>
          </View>
        )}

        {/* Customer Order */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Orden de Cliente *</Text>
          <View className="bg-white border border-gray-300 rounded-lg">
            <Picker
              selectedValue={formData.order_id}
              onValueChange={(value: string) => setFormData({ ...formData, order_id: value })}
            >
              <Picker.Item label="Seleccione una orden" value="" />
              {Array.isArray(orders) && orders
                .filter((order: any) => (order.status || order.estado) === 'pendiente')
                .map((order: any) => (
                <Picker.Item 
                  key={order.order_id || order.pedido_id} 
                  label={`${order.name || order.nombre || 'Sin descripción'} - ${order.customer?.razon_social || 'Sin cliente'}`} 
                  value={(order.order_id || order.pedido_id).toString()} 
                />
              ))}
            </Picker>
          </View>

          {/* Selected Order Details */}
          {formData.order_id && orders && (
            <View className="mt-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
              {(() => {
                const selectedOrder = orders.find((o: any) => (o.order_id || o.pedido_id).toString() === formData.order_id);
                if (!selectedOrder) return null;

                const products = selectedOrder.order_products || selectedOrder.orderProducts || [];
                const totalQuantity = products.reduce((sum: number, p: any) => sum + (parseFloat(p.quantity || p.cantidad) || 0), 0);

                return (
                  <View>
                    <Text className="font-bold text-blue-900 mb-2">Información del Pedido:</Text>
                    
                    <Text className="text-blue-800 text-sm mb-1">
                      <Text className="font-semibold">Fecha requerida: </Text>
                      {(() => {
                        const dateStr = selectedOrder.delivery_date || selectedOrder.fecha_entrega;
                        if (!dateStr) return 'N/A';
                        try {
                          // Handle "YYYY-MM-DD" strings by creating a date object manually to avoid timezone issues
                          // or just let new Date handle it if it's standard ISO
                          const date = new Date(dateStr);
                          // Check if valid date
                          if (isNaN(date.getTime())) return dateStr;
                          // Format: "15 de diciembre de 2025"
                          return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
                        } catch (e) {
                          return dateStr;
                        }
                      })()}
                    </Text>

                    <Text className="font-semibold text-blue-800 text-sm mt-2 mb-1">Productos solicitados:</Text>
                    {products.length > 0 ? (
                      products.map((prod: any, idx: number) => (
                        <Text key={idx} className="text-blue-700 text-sm ml-2">
                          • {prod.product?.name || prod.product?.nombre || prod.nombre || 'Producto'} ({prod.product?.type || prod.product?.tipo || prod.tipo || 'N/A'}): {parseFloat(prod.quantity || prod.cantidad).toFixed(2)} {prod.product?.unit?.code || prod.product?.unit?.codigo || prod.unidad || ''}
                        </Text>
                      ))
                    ) : (
                      <Text className="text-blue-600 text-sm italic ml-2">No hay productos en este pedido</Text>
                    )}


                  </View>
                );
              })()}
            </View>
          )}
        </View>

        {/* Name */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Nombre del Lote</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ej: Lote Especial Navidad"
          />
        </View>

        {/* Target Quantity */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Cantidad Objetivo</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            value={formData.target_quantity}
            onChangeText={(text) => setFormData({ ...formData, target_quantity: text })}
            placeholder="Cantidad a producir"
            keyboardType="decimal-pad"
          />
          {formData.order_id && orders && (() => {
             const selectedOrder = orders.find((o: any) => (o.order_id || o.pedido_id).toString() === formData.order_id);
             if (!selectedOrder) return null;
             const products = selectedOrder.order_products || selectedOrder.orderProducts || [];
             const totalQuantity = products.reduce((sum: number, p: any) => sum + (parseFloat(p.quantity || p.cantidad) || 0), 0);
             
             if (totalQuantity <= 0) return null;

             return (
               <Text className="text-blue-600 text-xs mt-2 ml-1">
                 Cantidad total requerida por el almacén: <Text className="font-bold">{totalQuantity.toFixed(2)}</Text>
               </Text>
             );
          })()}
        </View>

        {/* Observations */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Observaciones</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            value={formData.observations}
            onChangeText={(text) => setFormData({ ...formData, observations: text })}
            placeholder="Notas adicionales"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Raw Materials */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-700 font-medium">Materias Primas</Text>
            <TouchableOpacity 
              className="bg-blue-600 px-3 py-1.5 rounded-lg flex-row items-center"
              onPress={addMaterial}
            >
              <CustomIcon name="add" size={20} color="white" />
              <Text className="text-white text-sm font-medium ml-1">Agregar</Text>
            </TouchableOpacity>
          </View>

          {selectedMaterials.map((material, index) => (
            <View key={index} className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-gray-900 font-medium">Material #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeMaterial(index)}>
                  <CustomIcon name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-gray-600 text-xs mb-1">Material</Text>
                <TouchableOpacity 
                  className="bg-gray-50 border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                  onPress={() => openMaterialPicker(index)}
                >
                  <View>
                    <Text className="font-medium text-gray-900">{material.name}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      Disponible: {Number(material.available_quantity).toFixed(2)} {material.unit}
                    </Text>
                  </View>
                  <CustomIcon name="arrow-drop-down" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="flex-row">
                <View className="flex-1 mr-4">
                  <Text className="text-gray-600 text-xs mb-1">Cantidad Planeada</Text>
                  <TextInput
                    className={`border rounded-lg px-3 py-2 ${
                      (parseFloat(material.planned_quantity) || 0) > material.available_quantity 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                    value={material.planned_quantity}
                    onChangeText={(text) => updateMaterialQuantity(index, text)}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                  {(parseFloat(material.planned_quantity) || 0) > material.available_quantity && (
                    <Text className="text-red-500 text-xs mt-1">
                      Excede disponible ({material.available_quantity} {material.unit})
                    </Text>
                  )}
                </View>
                <View className="flex-1 justify-center pt-4">
                   <Text className="text-gray-500 text-sm">
                     Unidad: {material.unit}
                   </Text>
                </View>
              </View>
            </View>
          ))}
          
          {selectedMaterials.length === 0 && (
             <Text className="text-gray-500 italic text-center py-4 bg-gray-100 rounded-lg border border-dashed border-gray-300">
               No hay materias primas asignadas
             </Text>
          )}
        </View>

        {/* Buttons */}
        <View className="space-y-3 mb-6">
          <Button
            title={createMutation.isPending ? "Guardando..." : "Guardar"}
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

        {/* Material Picker Modal */}
        <MaterialPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleMaterialSelect}
          materials={materialBases || []}
          selectedId={activeMaterialIndex !== null ? selectedMaterials[activeMaterialIndex]?.raw_material_id : undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
