import React, { useState } from 'react';
import { Image, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function SDImage({ source, style, resizeMode = 'cover', ...props }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...props}
      />
      
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#999" />
        </View>
      )}
      
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: '#999',
    fontSize: 12,
  },
});