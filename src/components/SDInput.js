import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

/**
 * SDInput — Enhanced input with validation, error state, and helper text
 * 
 * Schema example:
 * {
 *   "type": "input",
 *   "placeholder": "Enter email",
 *   "props": {
 *     "keyboardType": "email-address",
 *     "required": true,
 *     "errorText": "Please enter a valid email",
 *     "helperText": "We'll never share your email"
 *   },
 *   "style": { "marginBottom": 16 }
 * }
 */
export default function SDInput({ 
  placeholder, 
  style, 
  keyboardType = 'default',
  secureTextEntry = false,
  required = false,
  errorText,
  helperText,
  onChangeText,
  ...props 
}) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const hasError = touched && required && !value.trim();
  const showError = hasError && errorText;

  const handleChange = (text) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={[
          styles.default,
          showError && styles.errorInput
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={handleChange}
        onBlur={() => setTouched(true)}
        {...props}
      />
      {showError && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
      {helperText && !showError && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  default: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  errorInput: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});