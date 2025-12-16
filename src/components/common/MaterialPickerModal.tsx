import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import { CustomIcon } from './CustomIcon';

interface Material {
  material_id: number;
  nombre?: string;
  name?: string;
  cantidad_disponible: number;
  unit?: {
    codigo?: string;
    name?: string;
  };
}

interface MaterialPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (material: Material) => void;
  materials: Material[];
  selectedId?: number;
}

export function MaterialPickerModal({
  visible,
  onClose,
  onSelect,
  materials,
  selectedId
}: MaterialPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = useMemo(() => {
    if (!searchQuery) return materials;
    const query = searchQuery.toLowerCase();
    return materials.filter(m => {
      const name = (m.nombre || m.name || '').toLowerCase();
      return name.includes(query);
    });
  }, [materials, searchQuery]);

  const renderItem = ({ item }: { item: Material }) => {
    const name = item.nombre || item.name || 'Desconocido';
    const unit = item.unit?.codigo || item.unit?.name || '';
    const available = Number(item.cantidad_disponible || 0).toFixed(2);
    const isSelected = item.material_id === selectedId;

    return (
      <TouchableOpacity
        className={`p-4 border-b border-gray-100 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className={`text-base ${isSelected ? 'font-bold text-blue-700' : 'font-medium text-gray-900'}`}>
              {name}
            </Text>
            <View className="flex-row items-center mt-1">
              <CustomIcon 
                name="inventory" 
                size={14} 
                color={Number(available) > 0 ? '#6B7280' : '#EF4444'} 
              />
              <Text className={`ml-1 text-sm ${Number(available) > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                Disponible: {available} {unit}
              </Text>
            </View>
          </View>
          {isSelected && (
            <CustomIcon name="check-circle" size={20} color="#2563EB" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
          <Text className="text-xl font-bold text-gray-900">Seleccionar Material</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
            <CustomIcon name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="p-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5">
            <CustomIcon name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900"
              placeholder="Buscar material..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <CustomIcon name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredMaterials}
          renderItem={renderItem}
          keyExtractor={item => item.material_id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-center">No se encontraron materiales</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}
