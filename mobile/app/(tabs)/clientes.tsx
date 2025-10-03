import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Card,
  Text,
  ActivityIndicator,
  Searchbar,
  Chip,
  FAB,
  Avatar,
} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

import { useClientesStore } from '@/src/store/clientes'
import { colors } from '@/src/utils/constants'
import { Customer } from '@/src/types'

export default function ClientesScreen() {
  const { clientes, loading, error, fetchClientes, refreshClientes } = useClientesStore()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.cpfCnpj?.includes(searchQuery) ||
      cliente.phone?.includes(searchQuery)
  )

  const onRefresh = async () => {
    try {
      await refreshClientes()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os clientes')
    }
  }

  const formatCpfCnpj = (cpfCnpj?: string) => {
    if (!cpfCnpj) return 'N/A'
    
    if (cpfCnpj.length === 11) {
      // CPF
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (cpfCnpj.length === 14) {
      // CNPJ
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return cpfCnpj
  }

  const formatPhone = (phone?: string) => {
    if (!phone) return 'N/A'
    
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const renderCliente = ({ item }: { item: Customer }) => {
    return (
      <TouchableOpacity
        onPress={() => Alert.alert('Cliente', `Detalhes do cliente ${item.name}`)}
        style={styles.clienteCard}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.clienteInfo}>
                <Avatar.Text
                  size={48}
                  label={getInitials(item.name)}
                  style={styles.avatar}
                />
                <View style={styles.clienteDetails}>
                  <Text variant="titleMedium" style={styles.clienteNome}>
                    {item.name}
                  </Text>
                  <View style={styles.clienteMetadata}>
                    <MaterialCommunityIcons
                      name={item.tipoCliente === 'FISICO' ? 'account' : 'domain'}
                      size={16}
                      color={colors.gray[600]}
                    />
                    <Text variant="bodyMedium" style={styles.tipoCliente}>
                      {item.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Text>
                  </View>
                </View>
              </View>
              <Chip
                mode="outlined"
                compact
                style={[
                  styles.statusChip,
                  {
                    borderColor: item.status === 'ATIVO' ? colors.success : colors.gray[400],
                    backgroundColor: item.status === 'ATIVO' ? colors.success + '20' : colors.gray[100]
                  }
                ]}
                textStyle={{
                  color: item.status === 'ATIVO' ? colors.success : colors.gray[600],
                  fontSize: 12
                }}
              >
                {item.status}
              </Chip>
            </View>

            <View style={styles.contactInfo}>
              {item.email && (
                <View style={styles.contactItem}>
                  <MaterialCommunityIcons
                    name="email"
                    size={16}
                    color={colors.gray[600]}
                  />
                  <Text variant="bodyMedium" style={styles.contactText}>
                    {item.email}
                  </Text>
                </View>
              )}

              <View style={styles.contactItem}>
                <MaterialCommunityIcons
                  name="phone"
                  size={16}
                  color={colors.gray[600]}
                />
                <Text variant="bodyMedium" style={styles.contactText}>
                  {formatPhone(item.phone)}
                </Text>
              </View>

              <View style={styles.contactItem}>
                <MaterialCommunityIcons
                  name={item.tipoCliente === 'FISICO' ? 'card-account-details' : 'domain'}
                  size={16}
                  color={colors.gray[600]}
                />
                <Text variant="bodyMedium" style={styles.contactText}>
                  {formatCpfCnpj(item.cpfCnpj)}
                </Text>
              </View>
            </View>

            {(item.cidade || item.estado) && (
              <View style={styles.addressInfo}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color={colors.gray[600]}
                />
                <Text variant="bodyMedium" style={styles.addressText}>
                  {[item.cidade, item.estado].filter(Boolean).join(' - ')}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Clientes
        </Text>
        <Searchbar
          placeholder="Buscar clientes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredClientes}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Novo Cliente', 'Funcionalidade em desenvolvimento')}
        label="Novo Cliente"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.gray[600],
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    color: colors.gray[900],
  },
  searchbar: {
    elevation: 0,
    backgroundColor: colors.gray[100],
  },
  listContent: {
    padding: 16,
  },
  clienteCard: {
    marginBottom: 12,
  },
  card: {
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    backgroundColor: colors.primary[500],
    marginRight: 12,
  },
  clienteDetails: {
    flex: 1,
  },
  clienteNome: {
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  clienteMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoCliente: {
    marginLeft: 4,
    color: colors.gray[600],
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  contactInfo: {
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    marginLeft: 8,
    color: colors.gray[700],
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray[300],
  },
  addressText: {
    marginLeft: 8,
    color: colors.gray[600],
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[500],
  },
})
