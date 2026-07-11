import React from 'react';
import { View, Text, Image, Pressable, ScrollView, FlatList, TextInput } from 'react-native';
import { Logger } from '../utils/Logger';

// Import all SDUI components
import SDText from '../components/SDText';
import SDImage from '../components/SDImage';
import SDButton from '../components/SDButton';
import SDContainer from '../components/SDContainer';
import SDList from '../components/SDList';
import SDProductCard from '../components/SDProductCard';
import SDScrollView from '../components/SDScrollView';
import SDRow from '../components/SDRow';
import SDColumn from '../components/SDColumn';
import SDSpacer from '../components/SDSpacer';
import SDDivider from '../components/SDDivider';
import SDCard from '../components/SDCard';
import SDBadge from '../components/SDBadge';
import SDInput from '../components/SDInput';

/**
 * Component Registry
 * Maps SDUI type strings to actual React components
 * 
 * This is where you register new components as your app grows!
 */
const registry = {
  // Layout containers
  screen: SDContainer,
  container: SDContainer,
  scrollView: SDScrollView,
  row: SDRow,
  column: SDColumn,
  
  // Basic elements
  text: SDText,
  image: SDImage,
  button: SDButton,
  spacer: SDSpacer,
  divider: SDDivider,
  
  // Lists
  list: SDList,
  
  // E-commerce components
  productCard: SDProductCard,
  card: SDCard,
  badge: SDBadge,
  input: SDInput,
};

/**
 * Get component by type name
 * @param {string} type - The SDUI component type
 * @returns {React.Component} - The React component or null
 */
export function getComponent(type) {
  const component = registry[type];
  
  if (!component) {
    Logger.warn(`Unknown component type: "${type}". Did you register it in ComponentRegistry?`);
    return null;
  }
  
  return component;
}

/**
 * Register a new component (useful for dynamic plugin loading)
 * @param {string} type - Unique type name
 * @param {React.Component} component - The React component
 */
export function registerComponent(type, component) {
  if (registry[type]) {
    Logger.warn(`Overwriting existing component type: "${type}"`);
  }
  registry[type] = component;
  Logger.info(`Registered component: "${type}"`);
}

/**
 * Check if a component type exists
 * @param {string} type 
 * @returns {boolean}
 */
export function hasComponent(type) {
  return !!registry[type];
}

/**
 * Get all registered component types
 * @returns {string[]}
 */
export function getRegisteredTypes() {
  return Object.keys(registry);
}

export default registry;