import React, { useState } from 'react';
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

type StatusVeiculo = 'EM_ANDAMENTO' | 'PRONTO' | 'PENDENTE_DOCS' | 'AGUARDANDO_PAGTO';

interface Veiculo {
  id: string;
  placa: string;
  cliente: string;
  servico: string;
  status: StatusVeiculo;
  prazo: string;
  valor: number;
  documentos: string[];
  telefone: string;
}

// Mock data
const mockVeiculos: Veiculo[] = [
  {
    id: '1',
    placa: 'ABC-1234',
    cliente: 'João Silva',
    servico: 'Licenciamento 2025',
    status: 'EM_ANDAMENTO',
    prazo: '2025-01-15',
    valor: 450,
    documentos: ['CRLV', 'CPF', 'Comprovante'],
    telefone: '(11) 99999-9999'
  },
  {
    id: '2', 
    placa: 'XYZ-5678',
    cliente: 'Maria Santos',
    servico: 'Transferência',
    status: 'PRONTO',
    prazo: '2025-01-10',
    valor: 280,
    documentos: ['CRLV', 'ATPV', 'CPF', 'RG'],
    telefone: '(11) 88888-8888'
  },
  {
    id: '3',
    placa: 'DEF-9012', 
    cliente: 'Carlos Lima',
    servico: '2ª Via CRLV',
    status: 'PENDENTE_DOCS',
    prazo: '2025-01-20',
    valor: 95,
    documentos: ['CPF', 'RG'],
    telefone: '(11) 77777-7777'
  }
];

export default function VeiculosScreen() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(mockVeiculos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusVeiculo | 'TODOS'>('TODOS');
  const [refreshing, setRefreshing] = useState(false);

  const statusConfig = {
    'EM_ANDAMENTO': { color: '#007AFF', bg: '#E3F2FD', icon: 'hourglass-empty', label: 'Em Andamento' },
    'PRONTO': { color: '#34C759', bg: '#E8F5E8', icon: 'check-circle', label: 'Pronto' },
    'PENDENTE_DOCS': { color: '#FF9500', bg: '#FFF3E0', icon: 'warning', label: 'Pendente' },
    'AGUARDANDO_PAGTO': { color: '#FF3B30', bg: '#FFEBEE', icon: 'payment', label: 'Pagamento' }
  };

  const filteredVeiculos = veiculos.filter(veiculo => {
    const matchesSearch = veiculo.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         veiculo.cliente.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'TODOS' || veiculo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
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
        {filteredVeiculos.map(veiculo => {
          const statusInfo = statusConfig[veiculo.status];
          
          return (
            <View key={veiculo.id} style={styles.veiculoCard}>
              {/* Header do Card */}
              <View style={styles.cardHeader}>
                <View style={styles.placaContainer}>
                  <MaterialIcons name="directions-car" size={20} color="#007AFF" />
                  <Text style={styles.placa}>{veiculo.placa}</Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                  <MaterialIcons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>

              {/* Informações do Cliente */}
              <View style={styles.clienteInfo}>
                <MaterialIcons name="person" size={16} color="#666" />
                <Text style={styles.clienteName}>{veiculo.cliente}</Text>
                <TouchableOpacity 
                  style={styles.phoneButton}
                  onPress={() => handleCall(veiculo.telefone, veiculo.cliente)}
                >
                  <MaterialIcons name="phone" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {/* Serviço */}
              <View style={styles.servicoInfo}>
                <MaterialIcons name="build" size={16} color="#666" />
                <Text style={styles.servicoText}>{veiculo.servico}</Text>
              </View>

              {/* Prazo e Valor */}
              <View style={styles.bottomInfo}>
                <View style={styles.prazoContainer}>
                  <MaterialIcons name="schedule" size={16} color="#666" />
                  <Text style={styles.prazoText}>Prazo: {new Date(veiculo.prazo).toLocaleDateString('pt-BR')}</Text>
                </View>
                
                <View style={styles.valorContainer}>
                  <Text style={styles.valorText}>
                    R$ {veiculo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              {/* Documentos */}
              <View style={styles.documentosContainer}>
                <Text style={styles.documentosLabel}>Documentos:</Text>
                <View style={styles.documentosChips}>
                  {veiculo.documentos.map(doc => (
                    <View key={doc} style={styles.docChip}>
                      <Text style={styles.docText}>{doc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}

        {filteredVeiculos.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum veículo encontrado</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Comece adicionando alguns veículos'}
            </Text>
          </View>
        )}
      </ScrollView>
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
