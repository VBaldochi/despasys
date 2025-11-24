/**
 * Cliente TypeScript para API de Machine Learning
 * Fornece interface tipada para todas as operações de ML
 */

export interface ClientInfo {
  tipo_cliente: string;
  total_servicos_cliente: number;
  valor_total_gasto: number;
  dias_desde_ultimo_servico: number;
  servicos_unicos_utilizados: number;
}

export interface VehicleInfo {
  idade_veiculo: number;
}

export interface HistoryCounts {
  [serviceType: string]: number;
}

export interface PredictRequest {
  client_info: ClientInfo;
  vehicle_info: VehicleInfo;
  history_counts: HistoryCounts;
}

export interface PredictResponse {
  probabilities: Record<string, number>;
  top_service: string;
  confidence: number;
  model_available: boolean;
}

export interface BatchPredictRequest {
  items: PredictRequest[];
}

export interface BatchPredictResponse {
  model_available: boolean;
  results: Array<{
    probabilities: Record<string, number>;
    top_service: string;
    confidence: number;
  }>;
}

export interface ModelInfo {
  model_available: boolean;
  model_id?: number;
  classes?: string[];
  feature_cols?: string[];
  updated_at?: string;
}

export interface TrainExample {
  client_info: ClientInfo;
  vehicle_info: VehicleInfo;
  history_counts: HistoryCounts;
  target_service: string;
}

export interface TrainRequest {
  examples: TrainExample[];
}

export interface TrainResponse {
  ok: boolean;
  tenant_id: number;
  model_id: number;
  classes: string[];
}

/**
 * Cliente para interagir com a API de ML
 */
export class MLClient {
  private baseUrl: string;
  private tenantSlug: string;

  constructor(tenantSlug: string = 'demo', baseUrl: string = '/api/ml') {
    this.baseUrl = baseUrl;
    this.tenantSlug = tenantSlug;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant': this.tenantSlug,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Treina o modelo com exemplos fornecidos
   */
  async train(request: TrainRequest): Promise<TrainResponse> {
    return this.request<TrainResponse>('/train', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Treina o modelo importando um arquivo CSV
   */
  async trainFromCSV(file: File): Promise<TrainResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/train/import?fmt=csv`, {
      method: 'POST',
      headers: {
        'X-Tenant': this.tenantSlug,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Obtém recomendação para um cliente
   */
  async predict(request: PredictRequest): Promise<PredictResponse> {
    return this.request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Obtém recomendações em lote
   */
  async predictBatch(request: BatchPredictRequest): Promise<BatchPredictResponse> {
    return this.request<BatchPredictResponse>('/predict/batch', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Obtém informações sobre o modelo atual
   */
  async getModelInfo(): Promise<ModelInfo> {
    return this.request<ModelInfo>('/model', {
      method: 'GET',
    });
  }
}

/**
 * Hook para usar o cliente ML no Next.js
 */
export function useMLClient(tenantSlug?: string) {
  return new MLClient(tenantSlug);
}

/**
 * Calcula histórico de serviços de um cliente baseado nos processos
 */
export function calculateHistoryCounts(processes: Array<{ tipoServico: string }>): HistoryCounts {
  const counts: HistoryCounts = {};
  
  for (const process of processes) {
    const serviceType = process.tipoServico;
    counts[serviceType] = (counts[serviceType] || 0) + 1;
  }
  
  return counts;
}

/**
 * Calcula idade do veículo em anos
 */
export function calculateVehicleAge(vehicleYear: number | string): number {
  const currentYear = new Date().getFullYear();
  const year = typeof vehicleYear === 'string' ? parseInt(vehicleYear) : vehicleYear;
  return Math.max(0, currentYear - year);
}

/**
 * Calcula dias desde último serviço
 */
export function calculateDaysSinceLastService(lastServiceDate: Date | string | null): number {
  if (!lastServiceDate) return 999; // Valor alto se nunca teve serviço
  
  const date = typeof lastServiceDate === 'string' ? new Date(lastServiceDate) : lastServiceDate;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Prepara dados de cliente para predição
 */
export function prepareClientData(
  customer: {
    tipoCliente: string;
    name?: string;
  },
  processes: Array<{
    tipoServico: string;
    valorTotal?: number;
    dataInicio?: Date | string;
  }>,
  vehicle: {
    ano: number | string;
  }
): PredictRequest {
  // Calcular histórico
  const history_counts = calculateHistoryCounts(processes);
  
  // Calcular valores agregados
  const total_servicos_cliente = processes.length;
  const valor_total_gasto = processes.reduce((sum, p) => sum + (p.valorTotal || 0), 0);
  const servicos_unicos_utilizados = Object.keys(history_counts).length;
  
  // Última data de serviço
  const dates = processes
    .map(p => p.dataInicio)
    .filter(d => d)
    .map(d => typeof d === 'string' ? new Date(d) : d) as Date[];
  
  const lastServiceDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
  const dias_desde_ultimo_servico = calculateDaysSinceLastService(lastServiceDate);
  
  // Idade do veículo
  const idade_veiculo = calculateVehicleAge(vehicle.ano);
  
  return {
    client_info: {
      tipo_cliente: customer.tipoCliente,
      total_servicos_cliente,
      valor_total_gasto,
      dias_desde_ultimo_servico,
      servicos_unicos_utilizados,
    },
    vehicle_info: {
      idade_veiculo,
    },
    history_counts,
  };
}
