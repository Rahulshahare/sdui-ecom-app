import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SDRow({ style, children, ...props }) {
  return (
    <View style={[styles.default, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});