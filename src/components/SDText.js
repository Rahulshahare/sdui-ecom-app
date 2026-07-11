import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SDText({ content, style, children, ...props }) {
  const mergedStyle = [styles.default, style];

  return (
    <Text style={mergedStyle} {...props}>
      {content || children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
});