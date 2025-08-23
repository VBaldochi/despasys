import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  // Redirecionar para o dashboard administrativo
  redirect('/admin/dashboard?tenant=demo')
}
