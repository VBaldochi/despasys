import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/src/utils/constants';

export default function ClienteDetalhe() {
  const { cliente } = useLocalSearchParams();
  const data = typeof cliente === 'string' ? JSON.parse(cliente) : cliente;

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f8fa' }} contentContainerStyle={{ padding: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Avatar.Text
          size={80}
          label={getInitials(data?.name)}
          style={{ backgroundColor: colors.primary[500], marginBottom: 12 }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{data?.name || 'Pessoa Jurídica'}</Text>
        <Text style={{ color: '#666', fontSize: 16 }}>{data?.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica'}</Text>
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={20} color={colors.gray[600]} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>{data?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color={colors.gray[600]} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>{data?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name={data?.tipoCliente === 'FISICO' ? 'card-account-details' : 'domain'} size={20} color={colors.gray[600]} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>{data?.cpfCnpj || 'N/A'}</Text>
          </View>
          {(data?.cidade || data?.estado) && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color={colors.gray[600]} style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>{[data?.cidade, data?.estado].filter(Boolean).join(' - ')}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoText: {
    color: colors.gray[800],
    fontSize: 16,
  },
});
