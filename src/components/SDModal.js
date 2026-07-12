import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Logger } from '../utils/Logger';

/**
 * SDModal — Centered dialog with backdrop
 * 
 * Schema example:
 * {
 *   "type": "modal",
 *   "props": {
 *     "visible": true,
 *     "title": "Confirm",
 *     "backdropDismiss": true,
 *     "animationType": "fade"        // 'fade', 'slide', 'none'
 *   },
 *   "children": [
 *     { "type": "text", "content": "Are you sure?" },
 *     { "type": "row", "children": [
 *       { "type": "button", "text": "Cancel", "action": { "type": "custom", "handler": "dismissModal" } },
 *       { "type": "button", "text": "Confirm", "action": { "type": "custom", "handler": "confirmAction" } }
 *     ]}
 *   ]
 * }
 */
export default function SDModal({
  visible = false,
  title,
  backdropDismiss = true,
  animationType = 'fade',
  onDismiss,
  style,
  children,
  ...props
}) {
  const handleBackdropPress = () => {
    if (backdropDismiss && onDismiss) {
      Logger.info('Modal dismissed via backdrop');
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={() => {
        if (onDismiss) onDismiss();
      }}
      {...props}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modal, style]}>
              {/* Header */}
              {title && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {backdropDismiss && (
                    <Pressable onPress={onDismiss} style={styles.closeBtn}>
                      <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 12,
  },
  closeText: {
    fontSize: 20,
    color: '#999',
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
});