import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
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
import { useProcessosRealtimeSync } from '@/src/hooks/useProcessosRealtimeSync';

type StatusProcesso = 'ANDAMENTO' | 'FINALIZADO' | 'CANCELADO' | 'AGUARDANDO';

const mapStatus = (status: string): StatusProcesso => {
	switch (status?.toLowerCase()) {
		case 'andamento':
		case 'em_andamento':
		case 'em andamento':
			return 'ANDAMENTO';
		case 'finalizado':
		case 'concluido':
			return 'FINALIZADO';
		case 'cancelado':
			return 'CANCELADO';
		case 'aguardando':
		case 'aguardando_pagamento':
		case 'aguardando pagamento':
		case 'aguardando_documentos':
		case 'aguardando documentos':
			return 'AGUARDANDO';
		default:
			return 'ANDAMENTO';
	}
};

export default function ProcessosScreen() {
	useProcessosRealtimeSync();
	const { processos, loading, fetchProcessos, refreshProcessos } = useProcessosStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<StatusProcesso | 'TODOS'>('TODOS');
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();

	// Ativa integração realtime
	useProcessosRealtimeSync();

	useEffect(() => {
		fetchProcessos();
	}, []);

	const statusConfig = {
		'ANDAMENTO': { color: '#007AFF', bg: '#E3F2FD', icon: 'hourglass-empty', label: 'Em Andamento' },
		'FINALIZADO': { color: '#34C759', bg: '#E8F5E8', icon: 'check-circle', label: 'Finalizado' },
		'CANCELADO': { color: '#FF3B30', bg: '#FFEBEE', icon: 'cancel', label: 'Cancelado' },
		'AGUARDANDO': { color: '#FF9500', bg: '#FFF3E0', icon: 'pause-circle', label: 'Aguardando' }
	};

	useEffect(() => {
		console.log('Processos recebidos:', processos);
	}, [processos]);

	const processosList = useMemo(() => {
		return processos.map(proc => ({
			id: proc.id,
			placa: proc.numero || proc.titulo || 'Sem placa',
			cliente: proc.customer?.name || 'Sem cliente',
			status: mapStatus(proc.status),
			servico: proc.tipoServico || 'Serviço não informado',
			prazo: proc.prazoLegal ? new Date(proc.prazoLegal).toISOString() : '',
			valor: typeof proc.valorTotal === 'number' ? proc.valorTotal : 0,
			telefone: proc.customer?.phone || '',
		}));
	}, [processos]);

	const filteredProcessos = processosList.filter(processo => {
		const matchesSearch = processo.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
												 processo.cliente.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = selectedStatus === 'TODOS' || processo.status === selectedStatus;
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
				<Text style={styles.title}>📄 Processos</Text>
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
							Todos ({processosList.length})
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
							onPress={() => setSelectedStatus(status as StatusProcesso)}
						>
							<MaterialIcons name={config.icon as any} size={16} color={config.color} />
							<Text style={[
								styles.filterText,
								selectedStatus === status && styles.filterTextActive,
								{ color: config.color }
							]}>
								{config.label} ({processosList.filter(p => p.status === status).length})
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Lista de Processos */}
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
				) : filteredProcessos.length > 0 ? (
					filteredProcessos.map(processo => {
						const statusInfo = statusConfig[processo.status];
						return (
							<TouchableOpacity
								key={processo.id}
								style={styles.veiculoCard}
								onPress={() => router.push({ pathname: '/(tabs)/processo-detalhe', params: { id: processo.id } })}
								activeOpacity={0.85}
							>
								<View style={styles.cardHeader}>
									<View style={styles.placaContainer}>
										<MaterialIcons name="directions-car" size={20} color="#4f7cff" />
										<Text style={styles.placa}>{processo.placa}</Text>
									</View>
									<View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}> 
										<MaterialIcons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
										<Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
									</View>
								</View>
								<View style={styles.clienteInfo}>
									<MaterialIcons name="person" size={16} color="#888" />
									<Text style={styles.clienteName}>{processo.cliente}</Text>
									{processo.telefone ? (
										<TouchableOpacity style={styles.phoneButton} onPress={() => handleCall(processo.telefone, processo.cliente)}>
											<MaterialIcons name="phone" size={16} color="#4f7cff" />
										</TouchableOpacity>
									) : null}
								</View>
								<View style={styles.servicoInfo}>
									<MaterialIcons name="build" size={16} color="#888" />
									<Text style={styles.servicoText}>{processo.servico}</Text>
								</View>
								<View style={styles.bottomInfo}>
									<View style={styles.prazoContainer}>
										<MaterialIcons name="event" size={16} color="#888" />
										<Text style={styles.prazoText}>{processo.prazo ? new Date(processo.prazo).toLocaleDateString() : 'Sem prazo'}</Text>
									</View>
									<View style={styles.valorContainer}>
										<Text style={styles.valorText}>R$ {processo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
									</View>
								</View>
							</TouchableOpacity>
						);
					})
				) : (
					<View style={styles.emptyState}>
						<MaterialIcons name="search-off" size={48} color="#ccc" />
						<Text style={styles.emptyText}>Nenhum processo encontrado</Text>
						<Text style={styles.emptySubtext}>
							{searchQuery ? 'Tente ajustar sua busca' : 'Nenhum processo cadastrado ainda'}
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Botão flutuante para novo processo */}
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
					if (typeof router !== 'undefined') router.push('/novo-processo');
				}}
				activeOpacity={0.88}
			>
				<MaterialIcons name="add" size={24} color="#fff" />
				<Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>Novo Processo</Text>
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
	fab: {
		position: 'absolute',
		right: 24,
		bottom: 32,
		backgroundColor: '#2563eb',
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
});
