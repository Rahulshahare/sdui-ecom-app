import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Logger } from '../utils/Logger';

/**
 * SDButton — Enhanced button with disabled, loading, and icon support
 * 
 * Schema example:
 * {
 *   "type": "button",
 *   "text": "Add to Cart",
 *   "props": {
 *     "disabled": false,
 *     "loading": false,
 *     "icon": "🛒"
 *   },
 *   "style": { "backgroundColor": "#007AFF" },
 *   "action": { "type": "custom", "handler": "addToCart", "payload": {...} }
 * }
 */
export default function SDButton({ 
  text, 
  style, 
  textStyle, 
  action, 
  onAction, 
  children,
  disabled = false,
  loading = false,
  icon,
  ...props 
}) {
  
  const handlePress = () => {
    if (disabled || loading) return;
    
    Logger.info('Button pressed:', text);
    if (action && onAction) {
      onAction(action);
    }
  };

  const isTransparent = style?.backgroundColor === 'transparent';
  const isDisabled = disabled || loading;
  const autoTextColor = isTransparent ? '#007AFF' : '#FFFFFF';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.default,
        style,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isTransparent ? '#007AFF' : '#fff'} />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[
            styles.defaultText, 
            { color: autoTextColor },
            textStyle
          ]}>
            {text || children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  defaultText: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});