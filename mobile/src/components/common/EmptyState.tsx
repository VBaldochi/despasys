import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/utils/constants';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  subtitle 
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons 
        name={icon} 
        size={64} 
        color={colors.gray[300]} 
        style={styles.icon}
      />
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    color: colors.gray[400],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray[500],
    textAlign: 'center',
  },
});
