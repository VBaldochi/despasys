import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';

import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/utils/constants';
import { LoginCredentials } from '@/src/types';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  tenantDomain: z.string().min(1, 'Domínio é obrigatório'),
});

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantDomain: '',
    },
  });

  const handleLogin = async (data: LoginCredentials) => {
    try {
      await login(data);
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      Alert.alert(
        'Erro de Login',
        error.message || 'Erro de conexão'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              DespaSys
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sistema de Gestão para Despachantes
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.form}>
                <Controller
                  control={control}
                  name="tenantDomain"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Domínio da Empresa"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.tenantDomain}
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="ex: minha-empresa"
                    />
                  )}
                />
                {errors.tenantDomain && (
                  <Text style={styles.errorText}>
                    {errors.tenantDomain.message}
                  </Text>
                )}

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.email}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Senha"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.password}
                      style={styles.input}
                      secureTextEntry={!showPassword}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}

                {error && (
                  <Text style={[styles.errorText, styles.loginError]}>
                    {error}
                  </Text>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit(handleLogin)}
                  disabled={isLoading}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? <ActivityIndicator color="white" /> : 'Entrar'}
                </Button>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Versão 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: colors.primary[700],
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.gray[700],
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 4,
  },
  loginError: {
    marginTop: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: colors.gray[500],
  },
});
