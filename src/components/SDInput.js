import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SDInput({ 
  placeholder, 
  style, 
  keyboardType = 'default',
  secureTextEntry = false,
  onChangeText,
  ...props 
}) {
  const [value, setValue] = useState('');

  const handleChange = (text) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <TextInput
      style={[styles.default, style]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={handleChange}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
});