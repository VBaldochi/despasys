import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { useDashboardStore } from '@/src/store/dashboard';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/utils/constants';
import { formatCurrency, formatDate } from '@/src/utils/formatters';

export default function DashboardScreen() {
  const { data, loading, error, fetchDashboard, refreshDashboard } = useDashboardStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    try {
      await refreshDashboard();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.greeting}>
            Olá, {user?.name?.split(' ')[0]}!
          </Text>
          <Text variant="bodyMedium" style={styles.date}>
            {formatDate(new Date())}
          </Text>
        </View>
        <Button
          mode="text"
          onPress={handleLogout}
          icon="logout"
          textColor={colors.gray[600]}
        >
          Sair
        </Button>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              mode="outlined"
              onPress={fetchDashboard}
              style={styles.retryButton}
            >
              Tentar novamente
            </Button>
          </Card.Content>
        </Card>
      )}

      {data && (
        <>
          {/* Cards de Métricas */}
          <View style={styles.metricsGrid}>
            <Card style={[styles.metricCard, { backgroundColor: colors.primary[50] }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="assignment" size={24} color={colors.primary[600]} />
                <Text variant="bodySmall" style={styles.metricLabel}>
                  Processos Ativos
                </Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {data.processos.total}
                </Text>
              </Card.Content>
            </Card>

            <Card style={[styles.metricCard, { backgroundColor: colors.success + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="trending-up" size={24} color={colors.success} />
                <Text variant="bodySmall" style={styles.metricLabel}>
                  Receitas do Mês
                </Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {formatCurrency(data.financeiro.receitasMes)}
                </Text>
              </Card.Content>
            </Card>

            <Card style={[styles.metricCard, { backgroundColor: colors.warning + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="pending" size={24} color={colors.warning} />
                <Text variant="bodySmall" style={styles.metricLabel}>
                  Pendentes
                </Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {data.processos.pendentes}
                </Text>
              </Card.Content>
            </Card>

            <Card style={[styles.metricCard, { backgroundColor: colors.error + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="people" size={24} color={colors.primary[600]} />
                <Text variant="bodySmall" style={styles.metricLabel}>
                  Clientes
                </Text>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {data.clientes.total}
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Status dos Processos */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Status dos Processos
              </Text>
              <View style={styles.statusGrid}>
                <View style={styles.statusItem}>
                  <Text variant="bodyMedium">Em Andamento</Text>
                  <Chip icon="play" style={{ backgroundColor: colors.primary[100] }}>
                    {data.processos.emAndamento}
                  </Chip>
                </View>
                <View style={styles.statusItem}>
                  <Text variant="bodyMedium">Concluídos</Text>
                  <Chip icon="check" style={{ backgroundColor: colors.success + '20' }}>
                    {data.processos.concluidos}
                  </Chip>
                </View>
                <View style={styles.statusItem}>
                  <Text variant="bodyMedium">Vencidos</Text>
                  <Chip icon="alert" style={{ backgroundColor: colors.error + '20' }}>
                    {data.processos.vencidos}
                  </Chip>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Próximos Vencimentos */}
          {data.proximosVencimentos.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Próximos Vencimentos
                </Text>
                {data.proximosVencimentos.slice(0, 5).map((processo) => (
                  <View key={processo.id} style={styles.processItem}>
                    <View style={styles.processInfo}>
                      <Text variant="bodyMedium" style={styles.processTitle}>
                        {processo.titulo}
                      </Text>
                      <Text variant="bodySmall" style={styles.processClient}>
                        {processo.customer.name}
                      </Text>
                    </View>
                    <View style={styles.processDate}>
                      <Text variant="bodySmall" style={styles.dueDateText}>
                        {processo.prazoLegal ? formatDate(processo.prazoLegal) : 'Sem prazo'}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Resumo Financeiro */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Resumo Financeiro
              </Text>
              <View style={styles.financialSummary}>
                <View style={styles.financialItem}>
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Saldo Atual
                  </Text>
                  <Text 
                    variant="titleMedium" 
                    style={[
                      styles.financialValue,
                      { color: data.financeiro.saldoAtual >= 0 ? colors.success : colors.error }
                    ]}
                  >
                    {formatCurrency(data.financeiro.saldoAtual)}
                  </Text>
                </View>
                <View style={styles.financialItem}>
                  <Text variant="bodySmall" style={styles.financialLabel}>
                    Contas Pendentes
                  </Text>
                  <Text variant="titleMedium" style={styles.financialValue}>
                    {data.financeiro.contasPendentes}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  loadingText: {
    marginTop: 16,
    color: colors.gray[600],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  greeting: {
    color: colors.gray[900],
    fontWeight: 'bold',
  },
  date: {
    color: colors.gray[600],
    marginTop: 4,
  },
  errorCard: {
    margin: 20,
    backgroundColor: colors.error + '10',
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
  },
  retryButton: {
    borderColor: colors.error,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    elevation: 2,
  },
  metricContent: {
    alignItems: 'center',
    padding: 16,
  },
  metricLabel: {
    color: colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  metricValue: {
    color: colors.gray[900],
    fontWeight: 'bold',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    color: colors.gray[900],
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusGrid: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  processInfo: {
    flex: 1,
  },
  processTitle: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  processClient: {
    color: colors.gray[600],
    marginTop: 2,
  },
  processDate: {
    alignItems: 'flex-end',
  },
  dueDateText: {
    color: colors.warning,
    fontWeight: '500',
  },
  financialSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialLabel: {
    color: colors.gray[600],
    marginBottom: 4,
  },
  financialValue: {
    color: colors.gray[900],
    fontWeight: 'bold',
  },
});
