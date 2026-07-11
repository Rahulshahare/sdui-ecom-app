import React from 'react';
import { View } from 'react-native';

/**
 * SDSpacer - Empty space for layout
 * 
 * Supports:
 * - style.height / style.width
 * - props.size (shorthand for both height and width)
 */
export default function SDSpacer({ style, size, ...props }) {
  // Priority: style.height > props.size > default 16
  const height = style?.height || size || 16;
  const width = style?.width || (size && !style?.height ? size : undefined);

  return (
    <View 
      style={[
        { height, width },
        style
      ]} 
      {...props} 
    />
  );
}