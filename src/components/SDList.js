import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function SDList({ items, renderItem, style, ...props }) {
  const data = items || [];

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => {
        if (renderItem) {
          return renderItem(item, index);
        }
        return null;
      }}
      keyExtractor={(item, index) => `list-item-${index}-${item.id || ''}`}
      contentContainerStyle={[styles.default, style]}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 8,
  },
});