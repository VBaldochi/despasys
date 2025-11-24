import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, ActivityIndicator, Chip, ProgressBar } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

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

  // Simulação de atividades recentes e tarefas pendentes (adapte para dados reais se disponíveis)
  const recentActivities = useMemo(() => [
    { id: 1, type: 'Novo Cliente', description: 'João Silva foi cadastrado', time: '2 min atrás', icon: 'account-plus', color: colors.primary[600] },
    { id: 2, type: 'Processo Concluído', description: 'Transferência de veículo finalizada', time: '15 min atrás', icon: 'check-circle', color: colors.success },
    { id: 3, type: 'Pagamento Recebido', description: 'R$ 850,00 - Maria Santos', time: '1 hora atrás', icon: 'cash', color: colors.success },
    { id: 4, type: 'Agendamento', description: 'Consulta DETRAN às 14:00', time: '2 horas atrás', icon: 'calendar', color: colors.warning },
  ], []);

  const pendingTasks = useMemo(() => [
    { id: 1, task: 'Revisar documentos do processo #1234', priority: 'Alta', due: 'Hoje' },
    { id: 2, task: 'Contatar cliente sobre renovação', priority: 'Média', due: 'Amanhã' },
    { id: 3, task: 'Atualizar sistema DETRAN', priority: 'Baixa', due: '2 dias' },
  ], []);

  // Simulação de dados de gráfico (adapte para dados reais se disponíveis)
  const revenueData = [40, 65, 50, 80, 75, 90];
  const revenueLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const servicesData = [
    { service: 'Transferência', percentage: 45, color: colors.primary[600] },
    { service: 'Licenciamento', percentage: 30, color: colors.success },
    { service: 'Consultas', percentage: 15, color: colors.warning },
    { service: 'Outros', percentage: 10, color: colors.error },
  ];

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
          {/* Cards de Métricas em Grid */}
          <View style={styles.metricsGrid}>
            <Card style={[styles.metricCard, { backgroundColor: colors.primary[50] }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="people" size={24} color={colors.primary[600]} />
                <Text style={styles.metricLabel}>Clientes Ativos</Text>
                <Text style={styles.metricValue}>{data.clientes?.total ?? '-'}</Text>
                <Text style={styles.metricChange}>+12% vs mês anterior</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.metricCard, { backgroundColor: colors.warning + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="assignment" size={24} color={colors.warning} />
                <Text style={styles.metricLabel}>Processos Pendentes</Text>
                <Text style={styles.metricValue}>{data.processos?.pendentes ?? '-'}</Text>
                <Text style={styles.metricChange}>+4% vs mês anterior</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.metricCard, { backgroundColor: colors.success + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="attach-money" size={24} color={colors.success} />
                <Text style={styles.metricLabel}>Receita Mensal</Text>
                <Text style={styles.metricValue}>{formatCurrency(data.financeiro?.receitasMes ?? 0)}</Text>
                <Text style={styles.metricChange}>+18% vs mês anterior</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.metricCard, { backgroundColor: colors.info + '15' }]}>
              <Card.Content style={styles.metricContent}>
                <MaterialIcons name="trending-up" size={24} color={colors.info} />
                <Text style={styles.metricLabel}>Taxa de Conversão</Text>
                <Text style={styles.metricValue}>68%</Text>
                <Text style={styles.metricChange}>+8% vs mês anterior</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Atividades Recentes */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Atividades Recentes</Text>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <MaterialCommunityIcons name={activity.icon} size={20} color={activity.color} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityType}>{activity.type}</Text>
                    <Text style={styles.activityDesc}>{activity.description}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Tarefas Pendentes */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Tarefas Pendentes</Text>
              {pendingTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <Text style={styles.taskText}>{task.task}</Text>
                  <View style={styles.taskMeta}>
                    <Text style={[styles.taskPriority, task.priority === 'Alta' ? { color: colors.error } : task.priority === 'Média' ? { color: colors.warning } : { color: colors.success }]}>{task.priority}</Text>
                    <Text style={styles.taskDue}>{task.due}</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Gráficos (simplificados) */}
          <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 16 }}>
            {/* Receita dos Últimos 6 Meses */}
            <Card style={{ flex: 1, padding: 8 }}>
              <Card.Content>
                <Text style={styles.cardTitle}>Receita 6 meses</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 4 }}>
                  {revenueData.map((height, idx) => (
                    <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                      <View style={{ width: 12, height: height, backgroundColor: colors.primary[600], borderRadius: 4 }} />
                      <Text style={{ fontSize: 10, color: colors.gray[600], marginTop: 2 }}>{revenueLabels[idx]}</Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
            {/* Distribuição de Serviços */}
            <Card style={{ flex: 1, padding: 8 }}>
              <Card.Content>
                <Text style={styles.cardTitle}>Serviços</Text>
                {servicesData.map((item) => (
                  <View key={item.service} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 8 }} />
                    <Text style={{ fontSize: 12, color: colors.gray[700], flex: 1 }}>{item.service}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray[900] }}>{item.percentage}%</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>
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
