import React from 'react';
import { View } from 'react-native';

export default function SDSpacer({ style, ...props }) {
  return <View style={[{ height: 16 }, style]} {...props} />;
}