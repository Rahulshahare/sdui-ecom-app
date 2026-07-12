import { Logger } from '../utils/Logger';

export const SchemaValidator = {
  VALID_TYPES: [
    'screen', 'container', 'text', 'image', 'button',
    'list', 'productCard', 'scrollView', 'row', 'column',
    'spacer', 'divider', 'card', 'badge', 'input','horizontalScrollView','icon', 'bottomSheet', 'modal'
  ],

  REQUIRED_FIELDS: {
    screen: ['type', 'children'],
    container: ['type'],
    text: ['type', 'content'],
    image: ['type', 'source'],
    button: ['type', 'text'],
    list: ['type', 'items'],
    productCard: ['type', 'product'],
    scrollView: ['type', 'children'],
    horizontalScrollView: ['type', 'children'],
    icon: ['type', 'content'],
    row: ['type', 'children'],
    column: ['type', 'children'],
    spacer: ['type'],
    divider: ['type'],
    card: ['type', 'children'],
    badge: ['type', 'text'],
    input: ['type', 'placeholder'],
  },

  validate(schema) {
    const errors = [];

    if (!schema || typeof schema !== 'object') {
      return { valid: false, errors: ['Schema must be a valid object'] };
    }

    this._validateNode(schema, errors, 'root');

    const isValid = errors.length === 0;
    
    if (!isValid) {
      Logger.error('Schema validation failed:', errors);
    } else {
      Logger.debug('Schema validation passed');
    }

    return { valid: isValid, errors };
  },

  _validateNode(node, errors, path) {
    if (!node.type) {
      errors.push(`${path}: Missing required field "type"`);
      return;
    }

    if (!this.VALID_TYPES.includes(node.type)) {
      errors.push(`${path}: Invalid type "${node.type}"`);
      return;
    }

    const required = this.REQUIRED_FIELDS[node.type] || [];
    for (const field of required) {
      if (node[field] === undefined || node[field] === null) {
        errors.push(`${path}: Missing required field "${field}" for type "${node.type}"`);
      }
    }

    if (node.children) {
      if (!Array.isArray(node.children)) {
        errors.push(`${path}: "children" must be an array`);
      } else {
        node.children.forEach((child, index) => {
          this._validateNode(child, errors, `${path}.children[${index}]`);
        });
      }
    }

    if (node.type === 'list' && node.items) {
      if (!Array.isArray(node.items)) {
        errors.push(`${path}: "items" must be an array`);
      }
    }

    if (node.action && typeof node.action !== 'object') {
      errors.push(`${path}: "action" must be an object`);
    }

    if (node.style && typeof node.style !== 'object') {
      errors.push(`${path}: "style" must be an object`);
    }
  },

  isValidQuick(schema) {
    return schema && 
           typeof schema === 'object' && 
           schema.type && 
           this.VALID_TYPES.includes(schema.type);
  },
};