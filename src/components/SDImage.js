import React, { useState } from 'react';
import { Image, View, ActivityIndicator, Text, StyleSheet, Platform  } from 'react-native';

/**
 * SDImage — Enhanced image with lazy loading, blur placeholder, error state
 * 
 * Schema example:
 * {
 *   "type": "image",
 *   "source": "https://example.com/image.jpg",
 *   "style": { "width": 200, "height": 200, "borderRadius": 10 },
 *   "props": {
 *     "resizeMode": "cover",
 *     "placeholderColor": "#f0f0f0",
 *     "blurRadius": 5
 *   }
 * }
 * 
 */
export default function SDImage({ source, style, resizeMode = 'cover', placeholderColor, blurRadius, ...props }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageSource = typeof source === 'string' ? { uri: source } : source;
  const bgColor = placeholderColor || '#f0f0f0';

  // Web doesn't support blurRadius well, skip it
  const effectiveBlurRadius = Platform.OS === 'web' ? 0 : (blurRadius || 0);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, style]}>
      <Image
        source={imageSource}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        blurRadius={effectiveBlurRadius}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...props}
      />
      
      {loading && !error && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#999" />
        </View>
      )}
      
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorLabel}>Failed to load</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240,240,240,0.9)',
  },
  errorText: {
    fontSize: 32,
    marginBottom: 4,
  },
  errorLabel: {
    color: '#999',
    fontSize: 12,
  },
});