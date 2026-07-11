import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Logger } from '../utils/Logger';

export default function SDButton({ text, style, textStyle, action, onAction, children, ...props }) {
  
  const handlePress = () => {
    Logger.info('Button pressed:', text);
    
    if (action && onAction) {
      onAction(action);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.default,
        style,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      {...props}
    >
      <Text style={[styles.defaultText, textStyle]}>
        {text || children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});