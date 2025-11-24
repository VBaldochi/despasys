import api from '@/src/services/api';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useClientesStore } from '@/src/store/clientes';
let Picker: any = null;
if (Platform.OS !== 'web') {
  Picker = require('@react-native-picker/picker').Picker;
}

interface NovoProcessoFormProps {
  onProcessCreated?: () => void;
}

export default function NovoProcessoForm({ onProcessCreated }: NovoProcessoFormProps) {
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [veiculoId, setVeiculoId] = useState('');
  const [numero, setNumero] = useState('');
  const [prazo, setPrazo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);
  const router = useRouter();
  // Buscar veículos do cliente selecionado
  useEffect(() => {
    if (!clienteId) {
      setVeiculos([]);
      setVeiculoId('');
      return;
    }
    setLoadingVeiculos(true);
    fetch(`/api/mobile/veiculos?clienteId=${clienteId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setVeiculos(Array.isArray(data) ? data : []);
        setLoadingVeiculos(false);
      })
      .catch(() => {
        setVeiculos([]);
        setLoadingVeiculos(false);
      });
  }, [clienteId]);

  const { clientes, loading: loadingClientes, fetchClientes } = useClientesStore();

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async () => {
    if (!tipo) {
      alert('Informe o tipo do processo');
      return;
    }
    if (!clienteId || clienteId === '') {
      alert('Selecione o cliente');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/mobile/processos', {
        tipoServico: tipo,
        descricao,
        valorTotal: parseFloat(valor) || 0,
        customerId: clienteId && clienteId !== '' ? clienteId : undefined,
        veiculoId: veiculoId || null,
        numero: numero || undefined,
        prazo: prazo || undefined,
        observacoes: observacoes || undefined
      });
      alert('Processo criado com sucesso!');
      onProcessCreated?.();
      router.back();
    } catch (e: any) {
      let errMsg = 'Erro desconhecido';
      if (e.response && e.response.data) {
        errMsg = JSON.stringify(e.response.data);
      } else if (e.message) {
        errMsg = e.message;
      }
      alert('Erro ao criar processo: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Cliente *</Text>
      {loadingClientes ? (
        <ActivityIndicator color="#2563eb" />
      ) : Platform.OS === 'web' ? (
        <select
          style={{ ...styles.input, height: 40 }}
          value={clienteId}
          onChange={e => setClienteId(e.target.value)}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.name || c.nome}</option>
          ))}
        </select>
      ) : (
        <View style={styles.input}>
          <Picker
            selectedValue={clienteId}
            onValueChange={setClienteId}
            style={{ height: 40 }}
          >
            <Picker.Item label="Selecione o cliente" value="" />
            {clientes.map((c) => (
              <Picker.Item key={c.id} label={c.name || c.nome} value={c.id} />
            ))}
          </Picker>
        </View>
      )}
      <Text style={styles.label}>Tipo de Processo *</Text>
      <TextInput
        style={styles.input}
        value={tipo}
        onChangeText={setTipo}
        placeholder="Ex: Transferência, Licenciamento..."
      />

      <Text style={styles.label}>Veículo (opcional)</Text>
      {loadingVeiculos ? (
        <ActivityIndicator color="#2563eb" />
      ) : Platform.OS === 'web' ? (
        <select
          style={{ ...styles.input, height: 40 }}
          value={veiculoId}
          onChange={e => setVeiculoId(e.target.value)}
        >
          <option value="">Selecione o veículo</option>
          {veiculos.map((v: any) => (
            <option key={v.id} value={v.id}>{v.placa}</option>
          ))}
        </select>
      ) : (
        <View style={styles.input}>
          <Picker
            selectedValue={veiculoId}
            onValueChange={setVeiculoId}
            style={{ height: 40 }}
          >
            <Picker.Item label="Selecione o veículo" value="" />
            {veiculos.map((v: any) => (
              <Picker.Item key={v.id} label={v.placa} value={v.id} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Número do Processo (opcional)</Text>
      <TextInput
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        placeholder="Deixe em branco para gerar automaticamente"
      />

      <Text style={styles.label}>Prazo (opcional)</Text>
      <TextInput
        style={styles.input}
        value={prazo}
        onChangeText={setPrazo}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Observações (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Observações adicionais..."
        multiline
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descreva o processo"
        multiline
      />
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="0.00"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar Processo</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
