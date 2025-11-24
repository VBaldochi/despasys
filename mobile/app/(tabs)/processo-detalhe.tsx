import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProcessosStore } from '@/src/store/processos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProcessoDetalheScreen() {
  const { id } = useLocalSearchParams();
  const { processos } = useProcessosStore();
  const processo = processos.find(p => p.id === id);

  if (!processo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Processo não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{processo.titulo || processo.numero}</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={20} color="#888" />
          <Text style={styles.infoText}>{processo.cliente || processo.customer?.name || 'Sem cliente'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="directions-car" size={20} color="#888" />
          <Text style={styles.infoText}>{processo.placa || 'Sem placa'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="build" size={20} color="#888" />
          <Text style={styles.infoText}>{processo.servico || processo.tipoServico || 'Serviço não informado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={20} color="#888" />
          <Text style={styles.infoText}>{processo.prazo ? new Date(processo.prazo).toLocaleDateString() : 'Sem prazo'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={20} color="#888" />
          <Text style={styles.infoText}>R$ {typeof processo.valor === 'number' ? processo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="info" size={20} color="#888" />
          <Text style={styles.infoText}>{processo.status}</Text>
        </View>
        {processo.observacoes ? (
          <View style={styles.obsBox}>
            <Text style={styles.obsTitle}>Observações</Text>
            <Text style={styles.obsText}>{processo.observacoes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  obsBox: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  obsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#bfa100',
  },
  obsText: {
    color: '#7a6a00',
  },
  notFound: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});
