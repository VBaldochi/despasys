import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirecionar direto para o login admin
  redirect('/login?tenant=demo')
}
