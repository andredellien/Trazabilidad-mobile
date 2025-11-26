import React from 'react';
import { View, Text, SafeAreaView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen({ navigation }: any) {
  const { login, isLoading } = useAuthStore();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <View className="mb-10 items-center">
          <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Text className="text-white font-bold text-2xl">T</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">Trazabilidad</Text>
          <Text className="text-gray-500 mt-2">Sign in to your account</Text>
        </View>

        <Input
          control={control}
          name="username"
          label="Username"
          placeholder="Enter your username"
          autoCapitalize="none"
          error={errors.username?.message}
        />

        <Input
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password?.message}
        />

        <View className="mt-6">
          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </View>

        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Text 
            className="text-blue-600 font-bold"
            onPress={() => (navigation as any).navigate('Register')}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
