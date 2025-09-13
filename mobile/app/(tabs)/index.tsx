import { Redirect } from 'expo-router';

export default function TabIndex() {
  // Redireciona para o dashboard como página inicial das tabs
  return <Redirect href="/dashboard" />;
}
