import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SDCard({ style, children, ...props }) {
  return (
    <View style={[styles.default, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
  },
});