import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { TenantProvider } from '@/contexts/TenantContext'
import { AuthProvider } from '@/components/common/AuthProvider'

export const metadata: Metadata = {
  title: "Lazuli ERP - Sistema de Gestão para Despachantes",
  description: "Sistema ERP completo para despachantes. Gestão de clientes, processos, veículos e financeiro. Integração com DETRAN, Receita Federal e muito mais.",
  keywords: ["erp despachante", "sistema despachante", "gestão despachante", "detran", "licenciamento", "transferencia", "crv", "crlv"],
  authors: [{ name: "Lazuli ERP" }],
  creator: "Lazuli ERP",
  openGraph: {
    title: "Lazuli ERP - Sistema de Gestão para Despachantes",
    description: "Sistema ERP completo para despachantes. Gestão de clientes, processos, veículos e financeiro.",
    url: "https://lazuli-erp.com.br",
    siteName: "Lazuli ERP",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazuli ERP - Sistema de Gestão para Despachantes",
    description: "Sistema ERP completo para despachantes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className="font-sans antialiased"
      >
        <AuthProvider>
          <TenantProvider>
            <ToastProvider>
              {children}
              {/* Componente de debug de sessão - só em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div id="session-debug">
                  {/* O componente será carregado dinamicamente para evitar SSR issues */}
                </div>
              )}
            </ToastProvider>
          </TenantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
