export default function SelectTenant() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Lazuli ERP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestão para Despachantes
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ambiente de Demonstração
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Acesse o tenant de demonstração para testar o sistema
              </p>
              <a
                href="/?tenant=demo"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Acessar Demo
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Para produção, acesse via subdomínio: seutenant.lazuli-erp.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
