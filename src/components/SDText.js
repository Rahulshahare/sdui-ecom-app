import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * SDText — Enhanced text with truncation and text-specific props
 * 
 * Schema example:
 * {
 *   "type": "text",
 *   "content": "Very long product name that might need truncation...",
 *   "props": {
 *     "numberOfLines": 2,
 *     "ellipsizeMode": "tail"
 *   },
 *   "style": { "fontSize": 16, "fontWeight": "bold" }
 * }
 */
export default function SDText({ content, style, children, numberOfLines, ellipsizeMode, ...props }) {
  const mergedStyle = [styles.default, style];

  return (
    <Text 
      style={mergedStyle} 
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
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