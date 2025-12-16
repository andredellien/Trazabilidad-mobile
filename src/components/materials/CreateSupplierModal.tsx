import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Alert, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi } from '../../api/suppliers.api';
import { Button } from '../common/Button';
import { CustomIcon } from '../common/CustomIcon';

interface CreateSupplierModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateSupplierModal = ({ visible, onClose, onSuccess }: CreateSupplierModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    business_name: '',
    trading_name: '',
    tax_id: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    active: true,
  });

  const createMutation = useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      Alert.alert('Éxito', 'Proveedor creado exitosamente');
      setFormData({
        business_name: '',
        trading_name: '',
        tax_id: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        active: true,
      });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear proveedor');
    },
  });

  const handleSubmit = () => {
    if (!formData.business_name) {
      Alert.alert('Error', 'El nombre de la empresa es obligatorio');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-gray-50"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
            <Text className="text-xl font-bold text-gray-900">Nuevo Proveedor</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
              <CustomIcon name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
              {/* Business Name */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Razón Social *</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.business_name}
                  onChangeText={(text) => setFormData({ ...formData, business_name: text })}
                  placeholder="Ingrese la razón social"
                />
              </View>

              {/* Trading Name */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Nombre Comercial</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.trading_name}
                  onChangeText={(text) => setFormData({ ...formData, trading_name: text })}
                  placeholder="Ingrese el nombre comercial"
                />
              </View>

              {/* Tax ID */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">NIT / RUC</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.tax_id}
                  onChangeText={(text) => setFormData({ ...formData, tax_id: text })}
                  placeholder="Ingrese el NIT o RUC"
                />
              </View>

              {/* Contact Name */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Nombre de Contacto</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.contact_person}
                  onChangeText={(text) => setFormData({ ...formData, contact_person: text })}
                  placeholder="Ingrese nombre de contacto"
                />
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Teléfono</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Ingrese teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Ingrese email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Address */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Dirección</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Ingrese dirección"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Buttons */}
              <View className="space-y-3 mb-8">
                <Button
                  title={createMutation.isPending ? "Guardando..." : "Guardar Proveedor"}
                  onPress={handleSubmit}
                  variant="primary"
                  disabled={createMutation.isPending}
                />
                <Button
                  title="Cancelar"
                  onPress={onClose}
                  variant="outline"
                />
              </View>
            </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
