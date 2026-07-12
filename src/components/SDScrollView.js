import React from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

/**
 * SDScrollView — Enhanced scrollable container with keyboard handling
 * 
 * Features:
 * - Vertical scrolling (default)
 * - Keyboard avoiding on iOS (auto)
 * - Tap-through to inputs while keyboard is open
 * - Keyboard dismiss on scroll drag
 * - Optional RefreshControl for pull-to-refresh
 * 
 * Schema example:
 * {
 *   "type": "scrollView",
 *   "style": { "flex": 1 },
 *   "props": {
 *     "keyboardAvoiding": true,        // Enable KeyboardAvoidingView wrapper
 *     "keyboardVerticalOffset": 64,      // Offset for headers
 *     "showsVerticalScrollIndicator": false
 *   },
 *   "children": [...]
 * }
 */
export default function SDScrollView({ 
  style, 
  children, 
  keyboardAvoiding = true,
  keyboardVerticalOffset,
  refreshControl,
  ...props 
}) {
  const scrollViewContent = (
    <ScrollView
      style={[styles.default, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={refreshControl}
      {...props}
    >
      {children}
    </ScrollView>
  );

  // Wrap with KeyboardAvoidingView on iOS when enabled
  if (keyboardAvoiding && Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={keyboardVerticalOffset || 0}
      >
        {scrollViewContent}
      </KeyboardAvoidingView>
    );
  }

  return scrollViewContent;
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});