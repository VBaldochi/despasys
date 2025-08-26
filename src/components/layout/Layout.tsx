'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import ScrollToTop from '../common/ScrollToTop'
import FloatingActionButton from '../common/FloatingActionButton'
import { ToastProvider } from '../ui/Toast'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  showBreadcrumb?: boolean
  showFAB?: boolean
  showScrollToTop?: boolean
}

export default function Layout({ 
  children, 
  showBreadcrumb = true, 
  showFAB = true,
  showScrollToTop = true 
}: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        {showBreadcrumb && <Breadcrumb />}
        
        <main className="pt-20">
          {children}
        </main>
        
        <Footer />
        
        {showScrollToTop && <ScrollToTop />}
        {showFAB && <FloatingActionButton />}
      </div>
    </ToastProvider>
  )
}

// Layout específico para páginas administrativas
export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Breadcrumb />
        
        <main className="pt-20">
          {children}
        </main>
        
        <ScrollToTop />
      </div>
    </ToastProvider>
  )
}

// Layout limpo para páginas de login/auth
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    </ToastProvider>
  )
}
