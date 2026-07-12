import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

/**
 * SDImage — Web-safe image with lazy loading, placeholder, error state
 * 
 * Schema example:
 * {
 *   "type": "image",
 *   "source": "https://example.com/image.jpg",
 *   "style": { "width": 200, "height": 200, "borderRadius": 10 },
 *   "props": {
 *     "resizeMode": "cover",
 *     "placeholderColor": "#f0f0f0"
 *   }
 * }
 */
export default function SDImage({
  source,
  style,
  resizeMode = 'cover',
  placeholderColor,
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSource = typeof source === 'string' ? { uri: source } : source;
  const bgColor = placeholderColor || '#f0f0f0';
  const isWeb = Platform.OS === 'web';

  // Web: Use native img onLoad via ref hack
  useEffect(() => {
    if (isWeb && imageSource?.uri) {
      const img = new window.Image();
      img.onload = () => {
        setLoading(false);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setLoading(false);
        setError(true);
      };
      img.src = imageSource.uri;
    }
  }, [imageSource?.uri, isWeb]);

  const handleLoadStart = () => {
    if (!isWeb) setLoading(true);
  };

  const handleLoadEnd = () => {
    if (!isWeb) {
      setLoading(false);
      setImageLoaded(true);
    }
  };

  const handleError = () => {
    if (!error) {
      setLoading(false);
      setError(true);
    }
  };

  // Hide placeholder once loaded
  const showPlaceholder = loading && !imageLoaded && !error;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, style]}>
      {/* Image */}
      <Image
        source={imageSource}
        style={[
          styles.image,
          style,
          !imageLoaded && isWeb && styles.hidden, // Hide until loaded on web
        ]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />

      {/* Loading placeholder */}
      {showPlaceholder && (
        <View style={[styles.overlay, { backgroundColor: bgColor }]}>
          <ActivityIndicator color="#999" size="small" />
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={[styles.overlay, { backgroundColor: bgColor }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  errorLabel: {
    color: '#999',
    fontSize: 12,
  },
});