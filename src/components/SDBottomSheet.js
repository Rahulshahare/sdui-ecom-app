import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
} from 'react-native';
import { Logger } from '../utils/Logger';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * SDBottomSheet — Slide-up panel from bottom
 * 
 * Schema example:
 * {
 *   "type": "bottomSheet",
 *   "props": {
 *     "visible": true,
 *     "snapPoints": [0.5, 0.9],     // 50% and 90% of screen height
 *     "initialSnap": 0,              // Start at first snap point
 *     "backdropDismiss": true,         // Tap outside to close
 *     "dragIndicator": true            // Show drag handle
 *   },
 *   "children": [
 *     { "type": "text", "content": "Filter Options" },
 *     { "type": "button", "text": "Apply", "action": { "type": "custom", "handler": "applyFilters" } }
 *   ]
 * }
 */
export default function SDBottomSheet({
  visible = false,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  backdropDismiss = true,
  dragIndicator = true,
  onDismiss,
  style,
  children,
  ...props
}) {
  const animatedValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const currentSnapRef = useRef(initialSnap);
  const panResponderRef = useRef(null);

  const snapTo = (index) => {
    const snapHeight = SCREEN_HEIGHT * (1 - snapPoints[index]);
    Animated.spring(animatedValue, {
      toValue: snapHeight,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    currentSnapRef.current = index;
  };

  const close = () => {
    Animated.timing(animatedValue, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  // Initialize pan responder
  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentSnapHeight = SCREEN_HEIGHT * (1 - snapPoints[currentSnapRef.current]);
        const newValue = currentSnapHeight + gestureState.dy;
        if (newValue >= 0) {
          animatedValue.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentSnapHeight = SCREEN_HEIGHT * (1 - snapPoints[currentSnapRef.current]);
        const velocity = gestureState.vy;
        const moved = gestureState.dy;

        // Swipe down fast or moved significantly down → close
        if (velocity > 0.5 || moved > 100) {
          if (currentSnapRef.current === 0) {
            close();
          } else {
            snapTo(currentSnapRef.current - 1);
          }
        } else if (moved < -100 && currentSnapRef.current < snapPoints.length - 1) {
          snapTo(currentSnapRef.current + 1);
        } else {
          snapTo(currentSnapRef.current);
        }
      },
    });
  }, [snapPoints]);

  // Open/close on visible change
  useEffect(() => {
    if (visible) {
      snapTo(initialSnap);
    } else {
      Animated.timing(animatedValue, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = animatedValue;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={close}
      {...props}
    >
      {/* Backdrop */}
      {backdropDismiss && (
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.backdropOverlay} />
        </Pressable>
      )}

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
          style,
        ]}
        {...(panResponderRef.current?.panHandlers || {})}
      >
        {/* Drag Indicator */}
        {dragIndicator && (
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.95,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
});