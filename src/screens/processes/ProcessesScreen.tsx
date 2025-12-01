import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MachinesScreen from './MachinesScreen';
import ProcessesListScreen from './ProcessesListScreen';
import StandardVariablesScreen from './StandardVariablesScreen';

type TabType = 'machines' | 'processes' | 'variables';

export default function ProcessesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('machines');

  const renderContent = () => {
    switch (activeTab) {
      case 'machines':
        return <MachinesScreen />;
      case 'processes':
        return <ProcessesListScreen />;
      case 'variables':
        return <StandardVariablesScreen />;
      default:
        return <MachinesScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Gestión de Procesos</Text>
        
        {/* Custom Tab Bar */}
        <View className="flex-row bg-gray-100 p-1 rounded-xl">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'machines' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('machines')}
          >
            <Text className={`font-medium ${
              activeTab === 'machines' ? 'text-blue-600' : 'text-gray-500'
            }`}>Máquinas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'processes' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('processes')}
          >
            <Text className={`font-medium ${
              activeTab === 'processes' ? 'text-blue-600' : 'text-gray-500'
            }`}>Procesos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'variables' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('variables')}
          >
            <Text className={`font-medium ${
              activeTab === 'variables' ? 'text-blue-600' : 'text-gray-500'
            }`}>Variables</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
