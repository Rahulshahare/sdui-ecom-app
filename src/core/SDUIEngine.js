import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getComponent } from './ComponentRegistry';
import { SchemaValidator } from './SchemaValidator';
import { Logger } from '../utils/Logger';

export function renderNode(node, index = 0, onAction = null) {
  if (!node) return null;

  if (typeof node === 'string') {
    return <Text key={`text-${index}`}>{node}</Text>;
  }

  if (!node.type) {
    Logger.error('Node missing "type" field:', node);
    return (
      <View key={`error-${index}`} style={styles.errorBox}>
        <Text style={styles.errorText}>Invalid node: missing "type"</Text>
      </View>
    );
  }

  const Component = getComponent(node.type);

  if (!Component) {
    return (
      <View key={`unknown-${index}`} style={styles.unknownBox}>
        <Text style={styles.unknownText}>Unknown type: "{node.type}"</Text>
      </View>
    );
  }

  // Build props — node.props FIRST (lowest priority)
  const props = {
    key: `${node.type}-${index}-${node.id || Math.random().toString(36).substr(2, 9)}`,
    ...node.props,
    onAction: onAction,
  };

  // Handle children recursively
  if (node.children && Array.isArray(node.children)) {
    props.children = node.children.map((child, childIndex) => 
      renderNode(child, childIndex, onAction)
    );
  }

  // Handle list items
  if (node.type === 'list' && node.items) {
    props.items = node.items;
    props.renderItem = (item, itemIndex) => renderNode(item, itemIndex, onAction);
  }

  // Handle product data
  if (node.type === 'productCard' && node.product) {
    props.product = node.product;
  }

  // Handle content for text
  if (node.type === 'text' && node.content) {
    props.content = node.content;
  }

  // Handle source for image
  if (node.type === 'image' && node.source) {
    props.source = node.source;
  }

  // Handle text for button
  if (node.type === 'button' && node.text) {
    props.text = node.text;
  }

  // Handle icon for button
  if (node.type === 'button' && node.icon) {
    props.icon = node.icon;
  }

  // Handle placeholder for input
  if (node.type === 'input' && node.placeholder) {
    props.placeholder = node.placeholder;
  }

  // Handle text for badge
  if (node.type === 'badge' && node.text) {
    props.text = node.text;
  }

  // Handle style LAST (highest priority — overrides node.props)
  if (node.style) {
    props.style = node.style;
  }

  // Handle action LAST (highest priority)
  if (node.action) {
    props.action = node.action;
  }

  return <Component {...props} />;
}

export function renderScreen(schema, onAction = null) {
  const validation = SchemaValidator.validate(schema);
  
  if (!validation.valid) {
    Logger.error('Schema validation failed:', validation.errors);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Schema Error</Text>
        {validation.errors.map((err, i) => (
          <Text key={`err-${i}`} style={styles.errorDetail}>{err}</Text>
        ))}
      </View>
    );
  }

  return renderNode(schema, 0, onAction);
}

export function handleAction(action, navigation = null, customHandlers = {}) {
  if (!action || !action.type) {
    Logger.warn('Invalid action: missing type');
    return;
  }

  Logger.info('Handling action:', action.type, action);

  switch (action.type) {
    case 'navigate':
      if (navigation && action.screen) {
        navigation.navigate(action.screen, action.params || {});
      } else {
        Logger.warn('Navigation not available or screen not specified');
      }
      break;

    case 'openUrl':
      if (action.url) {
        Logger.info('Opening URL:', action.url);
      }
      break;

    case 'submit':
      Logger.info('Submitting data:', action.data);
      break;

    case 'custom':
      const handler = customHandlers[action.handler];
      if (handler) {
        handler(action.payload);
      } else {
        Logger.warn('No custom handler found for:', action.handler);
      }
      break;

    default:
      Logger.warn('Unknown action type:', action.type);
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#c62828',
    marginBottom: 5,
  },
  errorBox: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    margin: 5,
  },
  errorText: {
    color: '#c62828',
    fontSize: 12,
  },
  unknownBox: {
    padding: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
    margin: 5,
  },
  unknownText: {
    color: '#e65100',
    fontSize: 12,
  },
});