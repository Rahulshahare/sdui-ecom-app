import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SDDivider({ style, ...props }) {
  return <View style={[styles.default, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
});