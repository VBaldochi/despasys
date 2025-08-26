export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Novo Agendamento
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Calendário de Agendamentos</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Calendário interativo</p>
              <p className="text-sm text-gray-400">Componente em desenvolvimento</p>
            </div>
          </div>
        </div>
        
        {/* Próximos Agendamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-sm">João Silva</p>
              <p className="text-xs text-gray-500">Transferência de Veículo</p>
              <p className="text-xs text-gray-400">Hoje, 14:00</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium text-sm">Maria Santos</p>
              <p className="text-xs text-gray-500">Licenciamento</p>
              <p className="text-xs text-gray-400">Amanhã, 10:30</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium text-sm">Empresa ABC Ltda</p>
              <p className="text-xs text-gray-500">Registro de Frota</p>
              <p className="text-xs text-gray-400">26/08, 09:00</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Todos os Agendamentos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  João Silva
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Transferência de Veículo
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  25/08/2025 14:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Confirmado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Cancelar</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Maria Santos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Licenciamento
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  26/08/2025 10:30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Cancelar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
