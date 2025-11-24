  <Tabs.Screen name="processo-detalhe" options={{ href: null }} />
import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/utils/constants';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const insets = useSafeAreaInsets();

  // Se ainda está carregando, não mostrar nada
  if (isLoading) {
    return null;
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <StatusBar 
        style="dark"
      />
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[500],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 64 + Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      
      {/* Dashboard - Visão geral do despachante */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />


      {/* Clientes - Lista e contatos dos clientes */}
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />


      {/* Débitos - Consulta de débitos veiculares */}
      <Tabs.Screen
        name="debitos"
        options={{
          title: 'Débitos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />

      {/* Processos - Lista de processos */}
      <Tabs.Screen
        name="processos"
        options={{
          title: 'Processos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" size={size} color={color} />
          ),
        }}
      />

      {/* Sync - Sincronização em tempo real */}
      <Tabs.Screen
        name="sync"
        options={{
          title: 'Sync',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sync" size={size} color={color} />
          ),
        }}
      />

      {/* Esconder telas não utilizadas */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Remove da navegação
        }}
      />
      <Tabs.Screen name="novo-cliente" options={{ href: null }} />
      <Tabs.Screen name="novo-veiculo" options={{ href: null }} />
      <Tabs.Screen name="novo-debito" options={{ href: null }} />
    </Tabs>
    </>
  );
}
