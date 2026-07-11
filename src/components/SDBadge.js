import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SDBadge({ text, style, textStyle, ...props }) {
  return (
    <View style={[styles.default, style]} {...props}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});