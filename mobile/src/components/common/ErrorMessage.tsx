import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/utils/constants';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  retryText = 'Tentar novamente' 
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <MaterialIcons 
          name="error-outline" 
          size={48} 
          color={colors.error} 
          style={styles.icon}
        />
        <Text variant="titleMedium" style={styles.title}>
          Oops! Algo deu errado
        </Text>
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
        {onRetry && (
          <Button
            mode="outlined"
            onPress={onRetry}
            style={styles.button}
            buttonColor={colors.error + '10'}
            textColor={colors.error}
          >
            {retryText}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    color: colors.gray[900],
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
