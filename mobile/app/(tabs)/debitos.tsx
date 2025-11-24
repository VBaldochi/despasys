import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function DebitosScreen() {
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ConsultaResult | null>(null);

  const formatPlaca = (text: string) => {
    // Remove tudo que não é letra ou número
    let cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Formato ABC-1234 ou ABC1D23 (Mercosul)
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    }
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
  };

  const consultarDebitos = async () => {
    if (!placa || placa.length < 7) {
      Alert.alert('Erro', 'Digite uma placa válida');
      return;
    }

    setLoading(true);
    
    // Simular consulta aos órgãos (DETRAN, etc.)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data - depois integrar APIs reais
    const mockResult: ConsultaResult = {
      placa: placa,
      debitos: [
        {
          tipo: 'IPVA',
          descricao: 'IPVA 2025',
          valor: 1250.50,
          vencimento: '2025-03-31',
          orgao: 'DETRAN-SP',
          status: 'PENDENTE'
        },
        {
          tipo: 'MULTA',
          descricao: 'Excesso de velocidade',
          valor: 195.23,
          vencimento: '2024-12-15',
          orgao: 'DETRAN-SP',
          status: 'VENCIDO'
        },
        {
          tipo: 'LICENCIAMENTO',
          descricao: 'Taxa de Licenciamento 2025',
          valor: 138.70,
          vencimento: '2025-01-31',
          orgao: 'DETRAN-SP',
          status: 'PENDENTE'
        }
      ],
      totalPendente: 1584.43,
      ultimaConsulta: new Date().toISOString()
    };

    setResultado(mockResult);
    setLoading(false);
  };

  const getDebitoIcon = (tipo: Debito['tipo']) => {
    switch (tipo) {
      case 'IPVA': return 'account-balance';
      case 'MULTA': return 'warning';
      case 'DPVAT': return 'security';
      case 'LICENCIAMENTO': return 'description';
      default: return 'attach-money';
    }
  };

  const getStatusColor = (status: Debito['status']) => {
    switch (status) {
      case 'PENDENTE': return '#FF9500';
      case 'VENCIDO': return '#FF3B30';
      case 'QUITADO': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const isVencido = (vencimento: string) => {
    return new Date(vencimento) < new Date();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💰 Consulta de Débitos</Text>
      </View>

      {/* Consulta */}
      <View style={styles.consultaContainer}>
        <Text style={styles.consultaLabel}>Digite a placa do veículo:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.placaInput}
            placeholder="ABC-1234"
            value={placa}
            onChangeText={(text) => setPlaca(formatPlaca(text))}
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity 
            style={[styles.consultarButton, loading && styles.consultarButtonDisabled]}
            onPress={consultarDebitos}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons name="search" size={20} color="white" />
                <Text style={styles.consultarText}>Consultar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Resultado */}
      {resultado && (
        <ScrollView style={styles.resultadoContainer} showsVerticalScrollIndicator={false}>
          {/* Resumo */}
          <View style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <Text style={styles.resumoPlaca}>{resultado.placa}</Text>
              <Text style={styles.resumoData}>
                Consultado em {new Date(resultado.ultimaConsulta).toLocaleString('pt-BR')}
              </Text>
            </View>
            
            <View style={styles.resumoValues}>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Total de Débitos</Text>
                <Text style={styles.resumoTotal}>R$ {resultado.totalPendente.toFixed(2)}</Text>
              </View>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Quantidade</Text>
                <Text style={styles.resumoCount}>{resultado.debitos.length} débitos</Text>
              </View>
            </View>
          </View>

          {/* Lista de Débitos */}
          <View style={styles.debitosSection}>
            <Text style={styles.sectionTitle}>Detalhamento dos Débitos</Text>
            
            {resultado.debitos.map((debito, index) => {
              const vencido = debito.status === 'VENCIDO' || isVencido(debito.vencimento);
              
              return (
                <View key={index} style={[
                  styles.debitoCard,
                  vencido && styles.debitoCardVencido
                ]}>
                  <View style={styles.debitoHeader}>
                    <View style={styles.debitoTitleContainer}>
                      <MaterialIcons 
                        name={getDebitoIcon(debito.tipo) as any} 
                        size={20} 
                        color="#007AFF" 
                      />
                      <Text style={styles.debitoTipo}>{debito.tipo}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(debito.status) + '20' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(debito.status) }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(debito.status) }
                      ]}>
                        {vencido ? 'VENCIDO' : debito.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.debitoDescricao}>{debito.descricao}</Text>
                  
                  <View style={styles.debitoFooter}>
                    <View>
                      <Text style={styles.debitoValor}>R$ {debito.valor.toFixed(2)}</Text>
                      <Text style={styles.debitoVencimento}>
                        Vencimento: {new Date(debito.vencimento).toLocaleDateString('pt-BR')}
                      </Text>
                      <Text style={styles.debitoOrgao}>{debito.orgao}</Text>
                    </View>
                    {vencido && (
                      <MaterialIcons name="error" size={24} color="#FF3B30" />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Ações */}
          <View style={styles.acoesSection}>
            <TouchableOpacity style={styles.acaoButton}>
              <MaterialIcons name="print" size={20} color="#007AFF" />
              <Text style={styles.acaoText}>Imprimir Relatório</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.acaoButton}>
              <MaterialIcons name="share" size={20} color="#007AFF" />
              <Text style={styles.acaoText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Estado Vazio */}
      {!resultado && !loading && (
        <View style={styles.emptyState}>
          <MaterialIcons name="search" size={64} color="#C7C7CC" />
          <Text style={styles.emptyText}>Consulte os débitos de um veículo</Text>
          <Text style={styles.emptySubtext}>
            Digite a placa acima para buscar IPVA, multas e taxas pendentes
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  consultaContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  consultaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  placaInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  consultarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  consultarButtonDisabled: {
    opacity: 0.6,
  },
  consultarText: {
    color: 'white',
    fontWeight: '600',
  },
  resultadoContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resumoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resumoHeader: {
    marginBottom: 16,
  },
  resumoPlaca: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  resumoData: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  resumoValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumoItem: {
    alignItems: 'center',
  },
  resumoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  resumoTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  resumoCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  debitosSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  debitoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  debitoCardVencido: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  debitoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  debitoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debitoTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  debitoDescricao: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  debitoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  debitoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  debitoVencimento: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  debitoOrgao: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  acoesSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  acaoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  acaoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
