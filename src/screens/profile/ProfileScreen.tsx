import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-gray-600 mb-1">@{user?.username}</Text>
          <Text className="text-gray-600 mb-1">{user?.email}</Text>
          <Text className="text-blue-600 font-semibold">
            {user?.role?.name}
          </Text>
        </View>

        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Settings</Text>
          
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-700">Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-700">Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3">
            <Text className="text-gray-700">Language</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-auto">
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}