import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface CustomIconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

export const CustomIcon = ({ name, size, color, style }: CustomIconProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Ionicons name="home" size={size} color={color} style={style} />;
      case 'factory':
        return <MaterialIcons name="factory" size={size} color={color} style={style} />;
      case 'inventory':
        return <MaterialIcons name="inventory" size={size} color={color} style={style} />;
      case 'assignment':
        return <MaterialIcons name="assignment" size={size} color={color} style={style} />;
      case 'person':
        return <Ionicons name="person" size={size} color={color} style={style} />;
      case 'flash-on':
        return <Ionicons name="flash" size={size} color={color} style={style} />;
      case 'warning':
        return <Ionicons name="warning" size={size} color={color} style={style} />;
      case 'add-circle':
        return <Ionicons name="add-circle" size={size} color={color} style={style} />;
      case 'add-circle-outline':
        return <Ionicons name="add-circle-outline" size={size} color={color} style={style} />;
      case 'assessment':
        return <MaterialIcons name="assessment" size={size} color={color} style={style} />;
      case 'add':
        return <Ionicons name="add" size={size} color={color} style={style} />;
      case 'trash':
        return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
      case 'delete':
        return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
      case 'settings':
        return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
      case 'help':
        return <Ionicons name="help-circle" size={size} color={color} style={style} />;
      case 'time':
        return <Ionicons name="time-outline" size={size} color={color} style={style} />;
      case 'edit':
        return <Ionicons name="create-outline" size={size} color={color} style={style} />;
      case 'arrow-up':
        return <Ionicons name="arrow-up" size={size} color={color} style={style} />;
      case 'arrow-down':
        return <Ionicons name="arrow-down" size={size} color={color} style={style} />;
      case 'close':
        return <Ionicons name="close" size={size} color={color} style={style} />;
      case 'checkmark':
        return <Ionicons name="checkmark" size={size} color={color} style={style} />;
      case 'calculator':
        return <Ionicons name="calculator" size={size} color={color} style={style} />;
      case 'cash':
        return <Ionicons name="cash" size={size} color={color} style={style} />;
      case 'pricetag':
        return <Ionicons name="pricetag" size={size} color={color} style={style} />;
      case 'calendar':
        return <Ionicons name="calendar" size={size} color={color} style={style} />;
      case 'plus':
        return <Ionicons name="add" size={size} color={color} style={style} />;
      case 'trash-2':
        return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
      case 'bar-chart':
        return <MaterialIcons name="bar-chart" size={size} color={color} style={style} />;
      case 'arrow-forward':
        return <Ionicons name="arrow-forward" size={size} color={color} style={style} />;
      case 'arrow-back':
        return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
      case 'login':
        return <MaterialIcons name="login" size={size} color={color} style={style} />;
      case 'checkmark-circle':
        return <Ionicons name="checkmark-circle" size={size} color={color} style={style} />;
      case 'alert-circle':
        return <Ionicons name="alert-circle" size={size} color={color} style={style} />;
      case 'arrow-drop-down':
        return <MaterialIcons name="arrow-drop-down" size={size} color={color} style={style} />;
      case 'check-circle':
        return <MaterialIcons name="check-circle" size={size} color={color} style={style} />;
      case 'search':
        return <Ionicons name="search" size={size} color={color} style={style} />;
      case 'close-circle':
        return <Ionicons name="close-circle" size={size} color={color} style={style} />;
      default:
        return <Ionicons name="help-circle" size={size} color={color} style={style} />;
    }
  };

  return getIcon(name);
};