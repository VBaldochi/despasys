'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Sparkles } from 'lucide-react';

interface MLRecommendation {
  service: string;
  probability: number;
  confidence: number;
}

interface MLRecommendationsProps {
  customerId: string;
  vehicleId?: string;
  onServiceSelect?: (service: string) => void;
}

const SERVICE_LABELS: Record<string, string> = {
  LICENCIAMENTO: 'Licenciamento',
  TRANSFERENCIA: 'Transferência de Propriedade',
  EMISSAO_APTVE: 'Emissão de ATPVE',
  VISTORIA: 'Vistoria Veicular',
  DESBLOQUEIOS: 'Desbloqueio',
  AUTORIZACAO_DE_ESTAMPAGEM: 'Autorização de Estampagem',
  AUTORIZACAO_PREVIA: 'Autorização Prévia',
  CADASTRO_DE_MOTOR: 'Cadastro de Motor',
  CONSULTA_TOTAL: 'Consulta Total',
  REGISTRO_CONTRATO: 'Registro de Contrato',
};

export function MLRecommendations({ customerId, vehicleId, onServiceSelect }: MLRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do cliente e histórico
        const response = await fetch(`/api/customers/${customerId}/ml-recommendation`);
        
        if (!response.ok) {
          throw new Error('Falha ao buscar recomendações');
        }

        const data = await response.json();
        
        if (data.probabilities) {
          // Converter probabilidades em array ordenado
          const recs = Object.entries(data.probabilities)
            .map(([service, probability]) => ({
              service,
              probability: probability as number,
              confidence: data.confidence || 0,
            }))
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5); // Top 5 recomendações

          setRecommendations(recs);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [customerId, vehicleId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recomendações Inteligentes
          </CardTitle>
          <CardDescription>Analisando histórico do cliente...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recomendações Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível gerar recomendações no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recomendações Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Histórico insuficiente para gerar recomendações.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Recomendações Inteligentes
        </CardTitle>
        <CardDescription>
          Com base no histórico do cliente, sugerimos os seguintes serviços
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={rec.service}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                onServiceSelect 
                  ? 'cursor-pointer hover:bg-accent hover:border-primary' 
                  : ''
              }`}
              onClick={() => onServiceSelect?.(rec.service)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {SERVICE_LABELS[rec.service] || rec.service}
                  </p>
                  <div className="mt-1 w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${rec.probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Badge variant={index === 0 ? 'default' : 'secondary'} className="ml-3">
                {(rec.probability * 100).toFixed(1)}%
              </Badge>
            </div>
          ))}
        </div>

        {recommendations[0] && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100">
                  Próximo serviço sugerido
                </p>
                <p className="text-purple-700 dark:text-purple-300">
                  {SERVICE_LABELS[recommendations[0].service] || recommendations[0].service}{' '}
                  ({(recommendations[0].probability * 100).toFixed(0)}% de probabilidade)
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
