// Configuração de CORS para API
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://yourmobileapp.com' // Substitua pelo domínio do seu app em produção
    : '*', // Em desenvolvimento, permite qualquer origem
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
  'Access-Control-Allow-Credentials': 'true',
}

export function corsResponse(response: Response) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export function handlePreflight() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}
