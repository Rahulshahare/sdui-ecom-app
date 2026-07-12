import { Logger } from '../utils/Logger';

import SDText from '../components/SDText';
import SDImage from '../components/SDImage';
import SDButton from '../components/SDButton';
import SDContainer from '../components/SDContainer';
import SDList from '../components/SDList';
import SDProductCard from '../components/SDProductCard';
import SDScrollView from '../components/SDScrollView';
import SDHorizontalScrollView from '../components/SDHorizontalScrollView';
import SDRow from '../components/SDRow';
import SDColumn from '../components/SDColumn';
import SDSpacer from '../components/SDSpacer';
import SDDivider from '../components/SDDivider';
import SDCard from '../components/SDCard';
import SDBadge from '../components/SDBadge';
import SDInput from '../components/SDInput';
import SDIcon from '../components/SDIcon';
import SDBottomSheet from '../components/SDBottomSheet';
import SDModal from '../components/SDModal';  
const registry = {
  // Layout containers
  screen: SDContainer,
  container: SDContainer,
  scrollView: SDScrollView,
  horizontalScrollView: SDHorizontalScrollView,
  row: SDRow,
  column: SDColumn,
  bottomSheet: SDBottomSheet,
  modal: SDModal,
  
  // Basic elements
  text: SDText,
  image: SDImage,
  icon: SDIcon,
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

export function getComponent(type) {
  const component = registry[type];
  
  if (!component) {
    Logger.warn(`Unknown component type: "${type}". Did you register it in ComponentRegistry?`);
    return null;
  }
  
  return component;
}

export function registerComponent(type, component) {
  if (registry[type]) {
    Logger.warn(`Overwriting existing component type: "${type}"`);
  }
  registry[type] = component;
  Logger.info(`Registered component: "${type}"`);
}

export function hasComponent(type) {
  return !!registry[type];
}

export function getRegisteredTypes() {
  return Object.keys(registry);
}

export default registry;