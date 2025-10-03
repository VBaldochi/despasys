'use client'

export default function PainelPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel do Cliente</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Processos em Andamento</h2>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Consultas Realizadas</h2>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pendências</h2>
          <p className="text-3xl font-bold text-yellow-600">2</p>
        </div>
      </div>
    </div>
  )
}
