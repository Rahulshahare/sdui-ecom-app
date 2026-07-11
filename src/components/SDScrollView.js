import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function SDScrollView({ style, children, ...props }) {
  return (
    <ScrollView 
      style={[styles.default, style]} 
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});