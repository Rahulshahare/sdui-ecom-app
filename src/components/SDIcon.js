import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * SDIcon — Emoji or text-based icon
 * 
 * Schema example:
 * {
 *   "type": "icon",
 *   "content": "🛒",
 *   "style": { "fontSize": 24 }
 * }
 * 
 * Or with icon font (if you add react-native-vector-icons later):
 * {
 *   "type": "icon",
 *   "content": "home",
 *   "props": { "fontFamily": "Ionicons" },
 *   "style": { "fontSize": 24, "color": "#007AFF" }
 * }
 */
export default function SDIcon({ content, style, ...props }) {
  return (
    <Text style={[styles.default, style]} {...props}>
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 20,
  },
});