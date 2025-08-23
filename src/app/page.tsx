import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirecionar para login com tenant demo
  redirect('/auth/login?tenant=demo')
}
