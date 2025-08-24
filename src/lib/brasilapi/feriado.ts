// Serviço de feriados nacionais brasileiros
// Útil para sistemas de agendamento e calendário

export interface FeriadoNacional {
  date: string;        // YYYY-MM-DD
  name: string;        // Nome do feriado
  type: string;        // Tipo (national, religious, etc.)
}

export interface InfoFeriado {
  data: Date;
  nome: string;
  tipo: string;
  diaSemana: string;
  proximoFeriado?: FeriadoNacional;
  diasAteProximo?: number;
  ehFimDeSemana: boolean;
  ehPonteUtil: boolean;
}

class FeriadoService {
  private readonly feriadosFixos = [
    { date: '01-01', name: 'Confraternização Universal', type: 'national' },
    { date: '04-21', name: 'Tiradentes', type: 'national' },
    { date: '05-01', name: 'Dia do Trabalhador', type: 'national' },
    { date: '09-07', name: 'Independência do Brasil', type: 'national' },
    { date: '10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
    { date: '11-02', name: 'Finados', type: 'religious' },
    { date: '11-15', name: 'Proclamação da República', type: 'national' },
    { date: '12-25', name: 'Natal', type: 'religious' }
  ];

  private readonly diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  /**
   * Busca feriados de um ano específico
   */
  async buscarFeriados(ano: number): Promise<FeriadoNacional[]> {
    try {
      const response = await fetch(`/api/feriados/${ano}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar feriados');
      }

      const data = await response.json();
      return data.feriados || [];
    } catch (error) {
      console.error('Erro ao buscar feriados:', error);
      // Fallback para feriados fixos
      return this.getFeriadosFixos(ano);
    }
  }

  /**
   * Verifica se uma data é feriado
   */
  async ehFeriado(data: Date | string): Promise<boolean> {
    try {
      const dataObj = typeof data === 'string' ? new Date(data) : data;
      const ano = dataObj.getFullYear();
      const feriados = await this.buscarFeriados(ano);
      
      const dataStr = dataObj.toISOString().split('T')[0];
      return feriados.some(feriado => feriado.date === dataStr);
    } catch {
      return false;
    }
  }

  /**
   * Busca próximo feriado
   */
  async buscarProximoFeriado(dataReferencia: Date = new Date()): Promise<FeriadoNacional | null> {
    try {
      const ano = dataReferencia.getFullYear();
      const feriados = await this.buscarFeriados(ano);
      const feriadosProximoAno = await this.buscarFeriados(ano + 1);
      
      const todosFeriados = [...feriados, ...feriadosProximoAno];
      const dataRef = dataReferencia.toISOString().split('T')[0];
      
      const feriadosFuturos = todosFeriados
        .filter(feriado => feriado.date > dataRef)
        .sort((a, b) => a.date.localeCompare(b.date));
      
      return feriadosFuturos[0] || null;
    } catch (error) {
      console.error('Erro ao buscar próximo feriado:', error);
      return null;
    }
  }

  /**
   * Calcula dias úteis entre duas datas
   */
  async calcularDiasUteis(dataInicio: Date, dataFim: Date): Promise<number> {
    try {
      let diasUteis = 0;
      const dataAtual = new Date(dataInicio);
      const ano = dataInicio.getFullYear();
      const feriados = await this.buscarFeriados(ano);
      const feriadosDatas = new Set(feriados.map(f => f.date));
      
      while (dataAtual <= dataFim) {
        const diaSemana = dataAtual.getDay();
        const dataStr = dataAtual.toISOString().split('T')[0];
        
        // Não é fim de semana e não é feriado
        if (diaSemana !== 0 && diaSemana !== 6 && !feriadosDatas.has(dataStr)) {
          diasUteis++;
        }
        
        dataAtual.setDate(dataAtual.getDate() + 1);
      }
      
      return diasUteis;
    } catch (error) {
      console.error('Erro ao calcular dias úteis:', error);
      return 0;
    }
  }

  /**
   * Adiciona dias úteis a uma data
   */
  async adicionarDiasUteis(dataInicio: Date, diasUteis: number): Promise<Date> {
    try {
      const dataResultado = new Date(dataInicio);
      const ano = dataInicio.getFullYear();
      const feriados = await this.buscarFeriados(ano);
      const feriadosDatas = new Set(feriados.map(f => f.date));
      
      let diasAdicionados = 0;
      
      while (diasAdicionados < diasUteis) {
        dataResultado.setDate(dataResultado.getDate() + 1);
        
        const diaSemana = dataResultado.getDay();
        const dataStr = dataResultado.toISOString().split('T')[0];
        
        // É dia útil
        if (diaSemana !== 0 && diaSemana !== 6 && !feriadosDatas.has(dataStr)) {
          diasAdicionados++;
        }
      }
      
      return dataResultado;
    } catch (error) {
      console.error('Erro ao adicionar dias úteis:', error);
      return dataInicio;
    }
  }

  /**
   * Obtém informações detalhadas sobre uma data
   */
  async getInfoData(data: Date): Promise<InfoFeriado> {
    try {
      const ehFeriado = await this.ehFeriado(data);
      const proximoFeriado = await this.buscarProximoFeriado(data);
      const diaSemana = data.getDay();
      const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
      
      let diasAteProximo = undefined;
      if (proximoFeriado) {
        const dataProximo = new Date(proximoFeriado.date);
        const diffTime = dataProximo.getTime() - data.getTime();
        diasAteProximo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      // Verifica se é ponte útil (feriado na segunda ou sexta)
      const ehPonteUtil = ehFeriado && (diaSemana === 1 || diaSemana === 5);
      
      return {
        data,
        nome: ehFeriado ? 'Feriado' : this.diasSemana[diaSemana],
        tipo: ehFeriado ? 'feriado' : 'dia_normal',
        diaSemana: this.diasSemana[diaSemana],
        proximoFeriado: proximoFeriado || undefined,
        diasAteProximo,
        ehFimDeSemana,
        ehPonteUtil
      };
    } catch (error) {
      console.error('Erro ao obter info da data:', error);
      return {
        data,
        nome: this.diasSemana[data.getDay()],
        tipo: 'dia_normal',
        diaSemana: this.diasSemana[data.getDay()],
        ehFimDeSemana: data.getDay() === 0 || data.getDay() === 6,
        ehPonteUtil: false
      };
    }
  }

  /**
   * Feriados fixos como fallback
   */
  private getFeriadosFixos(ano: number): FeriadoNacional[] {
    return this.feriadosFixos.map(feriado => ({
      date: `${ano}-${feriado.date}`,
      name: feriado.name,
      type: feriado.type
    }));
  }

  /**
   * Calcula páscoa para obter feriados móveis
   */
  private calcularPascoa(ano: number): Date {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(ano, mes - 1, dia);
  }

  /**
   * Lista de feriados para planejamento
   */
  getFeriadosParaPlanejamento(ano: number): InfoFeriado[] {
    return this.getFeriadosFixos(ano).map(feriado => ({
      data: new Date(feriado.date),
      nome: feriado.name,
      tipo: feriado.type,
      diaSemana: this.diasSemana[new Date(feriado.date).getDay()],
      ehFimDeSemana: [0, 6].includes(new Date(feriado.date).getDay()),
      ehPonteUtil: [1, 5].includes(new Date(feriado.date).getDay())
    }));
  }
}

// Singleton instance
export const feriadoService = new FeriadoService();

// Hook personalizado para React
export function useFeriado() {
  return {
    buscarFeriados: feriadoService.buscarFeriados.bind(feriadoService),
    ehFeriado: feriadoService.ehFeriado.bind(feriadoService),
    buscarProximoFeriado: feriadoService.buscarProximoFeriado.bind(feriadoService),
    calcularDiasUteis: feriadoService.calcularDiasUteis.bind(feriadoService),
    adicionarDiasUteis: feriadoService.adicionarDiasUteis.bind(feriadoService),
    getInfoData: feriadoService.getInfoData.bind(feriadoService),
    getFeriadosParaPlanejamento: feriadoService.getFeriadosParaPlanejamento.bind(feriadoService),
  };
}
