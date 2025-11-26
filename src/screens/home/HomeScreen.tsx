import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export default function HomeScreen() {
  const { logout, user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="text-2xl font-bold mb-4">Welcome, {user?.first_name}!</Text>
        <Text className="text-gray-600 mb-8">Role: {user?.role?.name}</Text>
        
        <Button title="Logout" onPress={logout} variant="outline" />
      </View>
    </SafeAreaView>
  );
}
