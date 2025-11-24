import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  RefreshControl,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useProcessosStore } from '@/src/store/processos';

type StatusVeiculo = 'EM_ANDAMENTO' | 'PRONTO' | 'PENDENTE_DOCS' | 'AGUARDANDO_PAGTO';

// Mapeamento de status do backend para status da UI
const mapStatus = (status: string): StatusVeiculo => {
  switch (status) {
    case 'EM_ANDAMENTO':
      return 'EM_ANDAMENTO';
    case 'CONCLUIDO':
      return 'PRONTO';
    case 'AGUARDANDO_DOCUMENTOS':
      return 'PENDENTE_DOCS';
    case 'AGUARDANDO_PAGAMENTO':
      return 'AGUARDANDO_PAGTO';
    default:
      return 'EM_ANDAMENTO';
  }
};

export default function VeiculosScreen() {
  const { processos, loading, fetchProcessos, refreshProcessos } = useProcessosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusVeiculo | 'TODOS'>('TODOS');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProcessos();
  }, []);

  const statusConfig = {
    'EM_ANDAMENTO': { color: '#007AFF', bg: '#E3F2FD', icon: 'hourglass-empty', label: 'Em Andamento' },
    'PRONTO': { color: '#34C759', bg: '#E8F5E8', icon: 'check-circle', label: 'Pronto' },
    'PENDENTE_DOCS': { color: '#FF9500', bg: '#FFF3E0', icon: 'warning', label: 'Pendente' },
    'AGUARDANDO_PAGTO': { color: '#FF3B30', bg: '#FFEBEE', icon: 'payment', label: 'Pagamento' }
  };

  // Transforma processos do backend em "veículos" para a UI
  // Debug: log processos recebidos
  useEffect(() => {
    console.log('Processos recebidos:', processos);
  }, [processos]);

  // Só considera processos com veiculoId válido
  const veiculos = useMemo(() => {
    const veics = processos.filter(proc => proc.veiculoId && typeof proc.veiculoId === 'string' && proc.veiculoId.trim() !== '').map(proc => {
      const placa = proc.placa || proc.titulo || proc.numero || 'Sem placa';
      const cliente = proc.cliente || (proc.customer && proc.customer.name) || 'Sem cliente';
      const status = mapStatus(proc.status);
      return {
        id: proc.id,
        placa,
        cliente,
        servico: proc.servico || proc.tipoServico || 'Serviço não informado',
        status,
        prazo: proc.prazo || proc.prazoLegal ? new Date(proc.prazo || proc.prazoLegal).toISOString() : '',
        valor: typeof proc.valor === 'number' ? proc.valor : (typeof proc.valorTotal === 'number' ? proc.valorTotal : 0),
        documentos: [],
        telefone: proc.telefone || proc.customer?.phone || ''
      };
    });
    console.log('Veículos filtrados:', veics.length, veics);
    return veics;
  }, [processos]);

  const filteredVeiculos = veiculos.filter(veiculo => {
    const matchesSearch = veiculo.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         veiculo.cliente.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'TODOS' || veiculo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProcessos();
    setRefreshing(false);
  };

  const handleCall = (telefone: string, cliente: string) => {
    Alert.alert(
      `Ligar para ${cliente}`,
      telefone,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => console.log('Ligando...') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header com Busca */}
      <View style={styles.header}>
        <Text style={styles.title}>🚗 Veículos</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por placa ou cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros de Status */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[styles.filterChip, selectedStatus === 'TODOS' && styles.filterChipActive]}
            onPress={() => setSelectedStatus('TODOS')}
          >
            <Text style={[styles.filterText, selectedStatus === 'TODOS' && styles.filterTextActive]}>
              Todos ({veiculos.length})
            </Text>
          </TouchableOpacity>
          
          {Object.entries(statusConfig).map(([status, config]) => (
            <TouchableOpacity 
              key={status}
              style={[
                styles.filterChip, 
                selectedStatus === status && styles.filterChipActive,
                { borderColor: config.color }
              ]}
              onPress={() => setSelectedStatus(status as StatusVeiculo)}
            >
              <MaterialIcons name={config.icon as any} size={16} color={config.color} />
              <Text style={[
                styles.filterText, 
                selectedStatus === status && styles.filterTextActive,
                { color: config.color }
              ]}>
                {config.label} ({veiculos.filter(v => v.status === status).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Veículos */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          // Skeletons de loading
          Array.from({ length: 10 }).map((_, idx) => (
            <View key={idx} style={{
              backgroundColor: '#f0f0f0',
              borderRadius: 16,
              height: 32,
              marginBottom: 16,
              opacity: 0.7
            }} />
          ))
        ) : filteredVeiculos.length > 0 ? (
          filteredVeiculos.map(veiculo => {
            const statusInfo = statusConfig[veiculo.status];
            return (
              <View key={veiculo.id} style={styles.veiculoCard}>
                {/* ...existing code... */}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum veículo encontrado</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Comece adicionando alguns veículos'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão flutuante para novo veículo */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          backgroundColor: '#4f7cff',
          borderRadius: 28,
          padding: 16,
          elevation: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          // Navegar para tela de novo veículo
          // Se usar expo-router:
          // router.push('/novo-veiculo')
          // Se não, adapte para sua navegação
          if (typeof router !== 'undefined') router.push('/novo-veiculo');
        }}
        activeOpacity={0.88}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>Novo Veículo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  filterTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  veiculoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  placaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  clienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clienteName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  phoneButton: {
    padding: 8,
  },
  servicoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prazoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prazoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  valorContainer: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  valorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  documentosContainer: {
    marginTop: 8,
  },
  documentosLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  documentosChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  docChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  docText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
