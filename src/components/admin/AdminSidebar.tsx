'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Calendar,
  BarChart3,
  Settings,
  X,
  LogOut,
  DollarSign,
  ClipboardCheck,
  CreditCard,
  UserCheck,
  FileCheck,
  Key,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  Receipt,
  PiggyBank
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Clientes',
      href: '/clientes',
      icon: Users,
      current: pathname === '/clientes'
    },
    {
      name: 'Processos',
      href: '/processos',
      icon: FileText,
      current: pathname === '/processos'
    },
    {
      name: 'Consultas',
      href: '/consultas',
      icon: Search,
      current: pathname === '/consultas'
    },
    {
      name: 'Agendamentos',
      href: '/appointments',
      icon: Calendar,
      current: pathname === '/appointments'
    },
    // Seção de Serviços
    {
      name: 'Cotações',
      href: '/quotes',
      icon: DollarSign,
      current: pathname === '/quotes'
    },
    {
      name: 'Avaliações',
      href: '/evaluations',
      icon: ClipboardCheck,
      current: pathname === '/evaluations'
    },
    {
      name: 'Registros',
      href: '/registrations',
      icon: FileCheck,
      current: pathname === '/registrations'
    },
    {
      name: 'Licenciamento',
      href: '/licensing',
      icon: Key,
      current: pathname === '/licensing'
    },
    {
      name: 'Transferências',
      href: '/transfers',
      icon: ArrowRightLeft,
      current: pathname === '/transfers'
    },
    {
      name: 'Desbloqueios',
      href: '/unlocks',
      icon: UserCheck,
      current: pathname === '/unlocks'
    },
    // Seção Financeira
    {
      name: 'Financeiro',
      href: '/financeiro',
      icon: Wallet,
      current: pathname === '/financeiro'
    },
    {
      name: 'Receitas',
      href: '/receitas',
      icon: Receipt,
      current: pathname === '/receitas'
    },
    {
      name: 'Despesas',
      href: '/despesas',
      icon: CreditCard,
      current: pathname === '/despesas'
    },
    {
      name: 'Fluxo de Caixa',
      href: '/fluxo-caixa',
      icon: TrendingUp,
      current: pathname === '/fluxo-caixa'
    },
    // Seção de Análise
    {
      name: 'Relatórios',
      href: '/reports',
      icon: BarChart3,
      current: pathname === '/reports'
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      current: pathname === '/configuracoes'
    }
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header do Sidebar - apenas para mobile */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">DespaSys Admin</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer com botão de logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo da navegação para desktop - será renderizado dentro do layout */}
      <div className="hidden lg:block lg:flex-1">
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer com botão de logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </>
  )
}
