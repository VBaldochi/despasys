'use client'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FluxoCaixaChartProps {
  lancamentos: Array<{
    id: string
    tipo: 'ENTRADA' | 'SAIDA'
    valor: number
    data: string
  }>
}

interface ChartDataPoint {
  data: string
  entradas: number
  saidas: number
  saldo: number
  saldoAcumulado: number
}

export default function FluxoCaixaChart({ lancamentos }: FluxoCaixaChartProps) {
  // Group transactions by date and calculate daily flows
  const processChartData = (): ChartDataPoint[] => {
    // Sort lancamentos by date
    const sorted = [...lancamentos].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    )

    // Group by date
    const grouped = sorted.reduce((acc, lancamento) => {
      const data = lancamento.data
      
      if (!acc[data]) {
        acc[data] = { entradas: 0, saidas: 0 }
      }

      if (lancamento.tipo === 'ENTRADA') {
        acc[data].entradas += lancamento.valor
      } else {
        acc[data].saidas += lancamento.valor
      }

      return acc
    }, {} as Record<string, { entradas: number; saidas: number }>)

    // Convert to array and calculate accumulated balance
    let saldoAcumulado = 0
    const chartData: ChartDataPoint[] = Object.entries(grouped).map(([data, values]) => {
      const saldo = values.entradas - values.saidas
      saldoAcumulado += saldo

      return {
        data: formatDateShort(data),
        entradas: values.entradas,
        saidas: values.saidas,
        saldo,
        saldoAcumulado
      }
    })

    return chartData
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.data}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600">
              Entradas: {formatCurrency(payload[0].payload.entradas)}
            </p>
            <p className="text-sm text-red-600">
              Saídas: {formatCurrency(payload[0].payload.saidas)}
            </p>
            <p className="text-sm text-blue-600 font-medium border-t pt-1">
              Saldo: {formatCurrency(payload[0].payload.saldo)}
            </p>
            <p className="text-sm text-purple-600 font-medium">
              Saldo Acumulado: {formatCurrency(payload[0].payload.saldoAcumulado)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const chartData = processChartData()

  if (chartData.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-80 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 font-medium mb-1">Nenhum dado disponível</p>
          <p className="text-sm text-gray-400">Adicione lançamentos para visualizar o gráfico</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Line Chart - Accumulated Balance */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Saldo Acumulado</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="data" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="saldoAcumulado" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorSaldo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Daily Entries and Exits */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Entradas e Saídas Diárias</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="data" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="entradas" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Entradas"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="saidas" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Saídas"
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
