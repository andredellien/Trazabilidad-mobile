import React from 'react';
import { View, Text } from 'react-native';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function CertificatesScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <CustomIcon name="assignment" size={64} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg mt-4">Certificados</Text>
      <Text className="text-gray-400 text-sm mt-2">Próximamente</Text>
    </View>
  );
}
