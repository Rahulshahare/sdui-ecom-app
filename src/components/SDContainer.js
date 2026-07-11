import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SDContainer({ style, children, ...props }) {
  return (
    <View style={[styles.default, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
});