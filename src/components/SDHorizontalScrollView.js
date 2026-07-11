import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

/**
 * SDHorizontalScrollView — Horizontal scrolling container
 * 
 * Schema example:
 * {
 *   "type": "horizontalScrollView",
 *   "style": { "height": 200 },
 *   "props": {
 *     "showsHorizontalScrollIndicator": false,
 *     "pagingEnabled": true,
 *     "snapToInterval": 200
 *   },
 *   "children": [
 *     { "type": "image", "source": "...", "style": { "width": 300, "height": 200 } },
 *     { "type": "image", "source": "...", "style": { "width": 300, "height": 200 } }
 *   ]
 * }
 */
export default function SDHorizontalScrollView({ style, children, ...props }) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={[styles.contentContainer, style]}
      decelerationRate="fast"
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    // gap: 12,
  },
});